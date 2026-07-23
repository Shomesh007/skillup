type ChatRole = 'user' | 'assistant' | 'system';

interface Message {
  role: ChatRole;
  content: string;
}

interface AzureChatCompletionChoice {
  message?: {
    content?: string;
  };
  delta?: {
    content?: string;
  };
}

interface AzureChatCompletionResponse {
  choices?: AzureChatCompletionChoice[];
  error?: {
    message?: string;
  };
}

// Error classes
export class AzureOpenAIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public requestId?: string
  ) {
    super(message);
    this.name = 'AzureOpenAIError';
  }
}

export class RateLimitError extends AzureOpenAIError {
  constructor(public retryAfter: number, requestId?: string) {
    super(`Rate limit exceeded. Retry after ${retryAfter}s`, 429, requestId);
    this.name = 'RateLimitError';
  }
}

export class AuthenticationError extends AzureOpenAIError {
  constructor(requestId?: string) {
    super('Azure OpenAI authentication failed', 401, requestId);
    this.name = 'AuthenticationError';
  }
}

const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const apiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT || 'gpt-5.2-chat';
const apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION || '2024-12-01-preview';
const temperature = 1;
const maxCompletionTokens = 1000;

// Configuration constants
const REQUEST_TIMEOUT_MS = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RATE_LIMIT_RETRY_DELAY_MS = 5000; // 5 seconds

// Validate configuration on module load
function validateConfiguration(): void {
  if (!apiKey) {
    throw new AzureOpenAIError('Azure OpenAI API key not found');
  }
  if (!endpoint) {
    throw new AzureOpenAIError('Azure OpenAI endpoint not configured');
  }
}

// Call validation on module initialization
try {
  validateConfiguration();
} catch (error) {
  console.error('Azure OpenAI configuration error:', error);
}

// Utility to generate request IDs
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Sleep utility for retries
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Calculate exponential backoff delay
function calculateBackoffDelay(retryCount: number): number {
  return Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
}

const SYSTEM_PROMPT = `You are s4skillup Assistant, an AI career mentor helping professionals advance their careers.
Your expertise covers:
- Resume optimization and tailoring
- Interview preparation (STAR method, technical & behavioral)
- Salary negotiation strategies
- Career path planning and role selection
- Skill development roadmaps
- Company research and job search strategies

Guidelines:
1. Stay focused on career development topics aligned with s4skillup's mission
2. Provide actionable, practical advice
3. Consider the Indian job market context (mention companies like TCS, Infosys, Microsoft, Amazon, Google when relevant)
4. Be encouraging and professional
5. If a question is outside your scope, politely redirect to career topics
6. Keep responses concise but informative`;

function buildMessages(userMessage: string, conversationHistory: Message[] = []): Message[] {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];
}

function getChatCompletionsUrl(stream = false) {
  const baseUrl = endpoint.replace(/\/+$/, '');
  const suffix = stream ? '&stream=true' : '';
  return `${baseUrl}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}${suffix}`;
}

async function postChatCompletion(messages: Message[], stream = false, retryCount = 0): Promise<Response> {
  const requestId = generateRequestId();
  
  if (!endpoint || !apiKey) {
    throw new AzureOpenAIError('Azure OpenAI credentials not configured in environment variables');
  }

  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(getChatCompletionsUrl(stream), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        messages,
        max_completion_tokens: maxCompletionTokens,
        temperature,
        stream,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle error responses with retry logic
    if (!response.ok) {
      const status = response.status;
      let errorMessage = `Azure OpenAI request failed with status ${status}`;
      
      try {
        const errorBody = (await response.json()) as AzureChatCompletionResponse;
        errorMessage = errorBody.error?.message || errorMessage;
      } catch {
        // Ignore JSON parsing issues and fall back to the status-based message.
      }

      // Handle authentication errors (401/403) - no retry
      if (status === 401 || status === 403) {
        console.error(`Authentication error: ${errorMessage}`, { requestId, endpoint, timestamp: new Date().toISOString() });
        throw new AuthenticationError(requestId);
      }

      // Handle rate limit errors (429) - retry after delay
      if (status === 429 && retryCount < MAX_RETRIES) {
        console.warn(`Rate limit hit, retrying (attempt ${retryCount + 1}/${MAX_RETRIES})`, { requestId });
        await sleep(RATE_LIMIT_RETRY_DELAY_MS);
        return postChatCompletion(messages, stream, retryCount + 1);
      }

      // Handle server errors (500-599) - exponential backoff
      if (status >= 500 && status < 600 && retryCount < MAX_RETRIES) {
        const backoffDelay = calculateBackoffDelay(retryCount);
        console.warn(`Server error ${status}, retrying after ${backoffDelay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`, { requestId, status });
        await sleep(backoffDelay);
        return postChatCompletion(messages, stream, retryCount + 1);
      }

      // If we've exhausted retries or it's a non-retryable error
      throw new AzureOpenAIError(errorMessage, status, requestId);
    }

    return response;

  } catch (error) {
    // Handle timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timeout after 30 seconds', { requestId, endpoint, timestamp: new Date().toISOString() });
      throw new AzureOpenAIError('Request timeout after 30 seconds', undefined, requestId);
    }

    // Handle network errors with retry
    if (retryCount < MAX_RETRIES && !(error instanceof AzureOpenAIError)) {
      const backoffDelay = calculateBackoffDelay(retryCount);
      console.warn(`Network error, retrying after ${backoffDelay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`, { 
        requestId, 
        endpoint, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      await sleep(backoffDelay);
      return postChatCompletion(messages, stream, retryCount + 1);
    }

    // Re-throw AzureOpenAIError instances or wrap other errors
    if (error instanceof AzureOpenAIError) {
      throw error;
    }

    console.error('Network error details', { 
      requestId, 
      endpoint, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    throw new AzureOpenAIError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      requestId
    );
  }
}

export async function getChatResponse(
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<string> {
  try {
    const response = await postChatCompletion(buildMessages(userMessage, conversationHistory));
    const data = (await response.json()) as AzureChatCompletionResponse;

    return (
      data.choices?.[0]?.message?.content?.trim() ||
      "I apologize, I couldn't generate a response. Please try again."
    );
  } catch (error) {
    console.error('Azure OpenAI API Error:', error);
    
    // Re-throw our custom error types
    if (error instanceof AzureOpenAIError) {
      throw error;
    }
    
    throw new AzureOpenAIError(
      `Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function* streamChatResponse(
  userMessage: string,
  conversationHistory: Message[] = []
): AsyncGenerator<string> {
  try {
    const response = await postChatCompletion(buildMessages(userMessage, conversationHistory), true);

    if (!response.body) {
      const fullResponse = await getChatResponse(userMessage, conversationHistory);
      yield fullResponse;
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;

        const payload = trimmed.slice(5).trim();
        if (payload === '[DONE]') {
          return;
        }

        try {
          const parsed = JSON.parse(payload) as AzureChatCompletionResponse;
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            yield delta;
          }
        } catch {
          // Ignore malformed chunks and keep streaming.
        }
      }
    }
  } catch (error) {
    console.error('Azure OpenAI Streaming Error:', error);
    
    // Re-throw our custom error types
    if (error instanceof AzureOpenAIError) {
      throw error;
    }
    
    throw new AzureOpenAIError(
      `Failed to stream AI response: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
