# Design Document: Azure OpenAI Job Enhancement

## Overview

This design implements Azure OpenAI integration into the SkillUp job search application to enhance job listings, company descriptions, and provide AI-powered job preparation guidance. The system uses Azure's GPT-5.2-chat deployment to filter vague marketing language, improve content clarity, and generate personalized preparation recommendations.

**Core objectives:**
- Remove vague terms from job and company descriptions (e.g., "dynamic environment", "rockstar", "leading provider")
- Make requirements explicit and measurable
- Generate personalized job preparation guidance when users click "Get Ready"
- Handle rate limits and failures gracefully with fallback mechanisms
- Support both scraping-time and on-demand enhancement modes

**Key design decisions:**
- **Service isolation**: Azure OpenAI communication encapsulated in a dedicated service module for maintainability and testability
- **Dual processing modes**: Enhancement can occur during scraping (batch) or on-demand (user-triggered) based on configuration
- **Graceful degradation**: All enhancement failures fall back to original content, ensuring users always see valid data
- **Rate limit compliance**: Request queueing and exponential backoff prevent API throttling
- **Validation layer**: Enhanced content validated before storage to ensure quality

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────────┐ │
│  │  GuideView   │  │ JobListView    │  │ CompanyProfile  │ │
│  │  Component   │  │ Component      │  │ Component       │ │
│  └──────┬───────┘  └────────┬───────┘  └────────┬────────┘ │
└─────────┼──────────────────┼──────────────────────┼─────────┘
          │                  │                      │
          ▼                  ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Enhancement Layer                         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │         Enhancement Pipeline Orchestrator              ││
│  │  (Mode Selection, Validation, Caching, Logging)        ││
│  └──────────────────────┬──────────────────────────────────┘│
│                         │                                    │
│   ┌─────────────────────┼─────────────────────┐             │
│   │                     │                     │             │
│   ▼                     ▼                     ▼             │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │ Job Desc     │  │ Company Desc│  │ AI Preparation   │   │
│  │ Enhancer     │  │ Enhancer    │  │ Assistant        │   │
│  └──────┬───────┘  └──────┬──────┘  └────────┬─────────┘   │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Azure OpenAI Service                       │
│  ┌──────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │ Rate Limiter │  │ Request Queue  │  │ Retry Logic    │  │
│  └──────┬───────┘  └────────┬───────┘  └────────┬───────┘  │
│         │                   │                    │          │
│         └───────────────────┴────────────────────┘          │
│                             │                               │
│                   ┌─────────▼────────┐                      │
│                   │  HTTP Client     │                      │
│                   │  (fetch wrapper) │                      │
│                   └─────────┬────────┘                      │
└─────────────────────────────┼───────────────────────────────┘
                              │
                              ▼
                   Azure OpenAI API Endpoint
                   (gpt-5.2-chat deployment)
```

### Data Flow

**Scraping-time enhancement:**
```
LinkedIn Scraper → Job Records → Enhancement Pipeline → Validation → 
App Data Files (linkedinJobs.ts, linkedinCompanies.ts) → UI Components
```

**On-demand enhancement:**
```
User clicks "Get Ready" → GuideView loads → AI Preparation Assistant →
Azure OpenAI Service → Generated guidance → Display in UI
```

**Caching flow (on-demand mode):**
```
Enhancement Request → Check Cache (24h TTL) → 
  If Hit: Return cached content
  If Miss: Call Azure OpenAI → Validate → Store in cache → Return
```

## Components and Interfaces

### 1. Azure OpenAI Service Module

**Location:** `src/services/azureOpenAI.ts`

**Purpose:** Encapsulates all communication with Azure OpenAI API, handles authentication, rate limiting, retries, and error handling.

**Interface:**

```typescript
// Configuration
interface AzureOpenAIConfig {
  endpoint: string;
  apiKey: string;
  deployment: string;
  apiVersion: string;
}

// Request/Response types
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Service Error Types
class AzureOpenAIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public requestId?: string
  ) {
    super(message);
    this.name = 'AzureOpenAIError';
  }
}

class RateLimitError extends AzureOpenAIError {
  constructor(retryAfter: number, requestId?: string) {
    super(`Rate limit exceeded. Retry after ${retryAfter}s`, 429, requestId);
    this.name = 'RateLimitError';
  }
}

class AuthenticationError extends AzureOpenAIError {
  constructor(requestId?: string) {
    super('Azure OpenAI authentication failed', 401, requestId);
    this.name = 'AuthenticationError';
  }
}

// Main service interface
export async function getChatResponse(
  prompt: string,
  systemPrompt?: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string>;

export async function validateConnection(): Promise<boolean>;

// Internal functions (not exported)
function buildRequestPayload(
  messages: ChatMessage[],
  options?: Partial<ChatCompletionRequest>
): ChatCompletionRequest;

function makeRequest(
  payload: ChatCompletionRequest,
  retryCount?: number
): Promise<ChatCompletionResponse>;
```

**Configuration:**
- Reads `VITE_AZURE_OPENAI_API_KEY` from environment
- Endpoint: `https://gurug-m7m5keep-eastus2.cognitiveservices.azure.com`
- API Version: `2024-12-01-preview`
- Deployment: `gpt-5.2-chat`
- Throws error on initialization if API key missing

**Rate Limiting Strategy:**
- Track requests per minute in memory
- Maximum 50 requests/minute
- Queue requests exceeding limit
- Process queue with 1.2s minimum interval

**Retry Logic:**
- HTTP 429 (Rate Limit): Wait 5s, retry up to 3 times
- HTTP 500-599 (Server Error): Exponential backoff (2s, 4s, 8s)
- HTTP 401/403 (Auth): No retry, throw AuthenticationError
- Network errors: Retry with exponential backoff
- Total timeout: 30 seconds

### 2. Job Description Enhancer

**Location:** `src/services/jobEnhancer.ts`

**Purpose:** Process job descriptions through Azure OpenAI to remove vague language and improve clarity.

**Interface:**

```typescript
export interface EnhancementResult {
  enhanced: string;
  original: string;
  success: boolean;
  error?: string;
  timestamp: string;
  tokensUsed?: number;
}

export async function enhanceJobDescription(
  description: string,
  jobTitle?: string,
  company?: string
): Promise<EnhancementResult>;

// Internal validation
function validateEnhancedContent(
  original: string,
  enhanced: string
): { valid: boolean; reason?: string };
```

**Enhancement Prompt Template:**

```
You are an expert job description editor. Rewrite this job description to be clear and actionable.

Rules:
1. Remove vague marketing terms: "dynamic environment", "fast-paced", "rockstar", "ninja", "guru"
2. Make requirements explicit and measurable (e.g., "3+ years" not "experience required")
3. Preserve all specific technical skills, tools, qualifications, and tech stack
4. Keep factual information about role, location, team structure
5. Remove generic motivational language
6. Maintain professional tone
7. Keep length similar to original (±20%)

Job Description:
{description}

Return only the enhanced description, no preamble or explanation.
```

**Processing Logic:**
- Skip enhancement if description < 50 characters
- Validate enhanced text length (50%-200% of original)
- Check for placeholder text like "[COMPANY]", "[ROLE]", "TODO"
- On any failure, return original description unchanged
- Log all enhancement attempts with success/failure status

### 3. Company Description Enhancer

**Location:** `src/services/companyEnhancer.ts`

**Purpose:** Process company "about" sections to remove generic marketing language.

**Interface:**

```typescript
export async function enhanceCompanyDescription(
  aboutText: string,
  companyName?: string,
  industry?: string
): Promise<EnhancementResult>;
```

**Enhancement Prompt Template:**

```
You are an expert company profile editor. Rewrite this company description to be specific and meaningful.

Rules:
1. Remove generic phrases: "leading provider", "innovative solutions", "industry leader", "best-in-class"
2. Emphasize specific products, services, and business focus
3. Maintain factual information about company size, locations, founding date
4. Keep technical domain information
5. Remove superlatives and marketing fluff
6. Maximum 200 words
7. Maintain professional tone

Company About:
{aboutText}

Return only the enhanced description, no preamble or explanation.
```

**Processing Logic:**
- Skip enhancement if about text < 30 characters
- Enforce 200-word maximum in response
- Same validation rules as job enhancer
- Fallback to original on any error

### 4. AI Preparation Assistant

**Location:** `src/services/aiPrepAssistant.ts`

**Purpose:** Generate personalized job preparation guidance when user clicks "Get Ready" on a job listing.

**Interface:**

```typescript
export interface JobContext {
  title: string;
  company: string;
  description?: string;
  skills?: string[];
  experience?: string;
  location?: string;
  mode?: string;
  salary?: string;
}

export interface PrepGuidance {
  content: string;
  generatedAt: string;
  jobId: string;
  success: boolean;
  error?: string;
}

export async function generatePrepGuidance(
  job: JobContext
): Promise<PrepGuidance>;

// Fallback guidance generator
function buildFallbackGuidance(job: JobContext): string;
```

**Guidance Prompt Template:**

```
Create a concise job preparation guide for this application:

Role: {title}
Company: {company}
Location: {location}
Experience: {experience}
Salary: {salary}
Work mode: {mode}
Description: {description}
Skills: {skills}

Provide exactly 4 paragraphs covering:
1. Role fit assessment (2-3 sentences on whether this matches entry/mid/senior level and key skill alignment)
2. Resume keywords (3-4 sentences on what to emphasize, metrics to include)
3. Interview preparation tips (3-4 sentences on likely question themes and what to prepare)
4. 7-day action plan (4-5 sentences with concrete daily actions)

Keep each paragraph focused and actionable. Avoid generic advice.
```

**Fallback Logic:**

When Azure OpenAI fails, generate fallback guidance using:
- Job title and company name
- Top 3 skills from job listing
- Experience level requirements
- Work mode (remote/hybrid/on-site)

Fallback template structure:
```
"{title} at {company} is best prepared as a role-specific application, not a generic resume send.

Focus your resume around {skill1}, {skill2}, {skill3} and show one project or work example that proves each skill.

For {experience}, keep the story practical: what you built, what changed, and how you measured the result.

Before applying, prepare a short pitch that connects your background to {company}'s role, location, and {mode} work setup."
```

### 5. Enhancement Pipeline Orchestrator

**Location:** `src/services/enhancementPipeline.ts`

**Purpose:** Coordinate enhancement processing, manage modes, caching, and validation.

**Interface:**

```typescript
export type EnhancementMode = 'scraping' | 'on-demand';

export interface PipelineConfig {
  mode: EnhancementMode;
  batchSize?: number; // For scraping mode
  batchDelayMs?: number; // Delay between batch items
  cacheEnabled?: boolean;
  cacheTTLHours?: number;
}

export interface EnhancementStats {
  total: number;
  successful: number;
  failed: number;
  cached?: number;
  avgResponseTimeMs: number;
  totalTokens: number;
}

// Process job records during scraping
export async function enhanceJobBatch(
  jobs: JobRecord[],
  config: PipelineConfig
): Promise<{
  enhanced: JobRecord[];
  stats: EnhancementStats;
}>;

// Process company records during scraping
export async function enhanceCompanyBatch(
  companies: Company[],
  config: PipelineConfig
): Promise<{
  enhanced: Company[];
  stats: EnhancementStats;
}>;

// On-demand enhancement (with caching)
export async function enhanceJobOnDemand(
  job: JobRecord
): Promise<JobRecord>;

export async function enhanceCompanyOnDemand(
  company: Company
): Promise<Company>;

// Cache management
function getCachedEnhancement(
  key: string
): EnhancementResult | null;

function setCachedEnhancement(
  key: string,
  result: EnhancementResult,
  ttlHours: number
): void;

function generateCacheKey(
  type: 'job' | 'company',
  id: string,
  content: string
): string;
```

**Mode-Specific Behavior:**

**Scraping Mode:**
- Process enhancements during data import batch jobs
- Maximum 100 items per batch
- 1-second delay between items to respect rate limits
- Store enhanced content directly in job/company data structures
- Add `lastEnhanced` timestamp field to records
- Continue processing remaining items on individual failures
- Log batch statistics: total processed, success rate, avg response time

**On-Demand Mode:**
- Process enhancements when user views job or company details
- Check cache first (24-hour TTL)
- Return cached content immediately if available
- Generate and cache on cache miss
- Display loading state during generation
- Fallback to original content on failure

**Cache Implementation:**
- In-memory cache using Map with TTL tracking
- Cache key: `${type}_${id}_${hash(content)}`
- Automatic expiration after 24 hours
- Cache hit/miss logging for monitoring

**Validation Layer:**

All enhanced content validated before storage:
1. Not empty
2. Length >= 50% of original
3. Length <= 200% of original
4. No placeholder text (`[COMPANY]`, `[ROLE]`, `TODO`)
5. Proper URL formatting if URLs present
6. Same language as original (English)

Failed validation → use original unmodified content

### 6. Rate Limiter

**Location:** `src/services/rateLimiter.ts`

**Purpose:** Manage API request throttling to prevent exceeding Azure OpenAI limits.

**Interface:**

```typescript
export interface RateLimitConfig {
  requestsPerMinute: number;
  minIntervalMs: number;
}

export class RateLimiter {
  private requestTimestamps: number[] = [];
  private queue: Array<() => Promise<any>> = [];
  private processing: boolean = false;

  constructor(private config: RateLimitConfig) {}

  // Execute function with rate limiting
  async execute<T>(fn: () => Promise<T>): Promise<T>;

  // Check if request can proceed immediately
  private canProceed(): boolean;

  // Process queued requests
  private async processQueue(): Promise<void>;

  // Clean old timestamps
  private cleanTimestamps(): void;

  // Get current request rate
  getRequestRate(): { current: number; limit: number };
}

export const azureOpenAIRateLimiter = new RateLimiter({
  requestsPerMinute: 50,
  minIntervalMs: 1200, // 1.2 seconds
});
```

**Algorithm:**
1. Track timestamps of last 60 seconds of requests
2. Before each request:
   - Clean timestamps older than 60 seconds
   - If current count < limit: proceed immediately
   - If at limit: add to queue
3. Queue processing:
   - Wait minimum interval (1.2s) between requests
   - Process next queued request
   - Continue until queue empty

## Data Models

### Enhanced Job Record

```typescript
export interface JobOpportunity {
  id: number | string;
  title: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  mode: string;
  description?: string;
  linkedinUrl?: string;
  division?: string;
  skills?: string[];
  postedAt?: string;
  applicants?: string;
  employmentType?: string;
  seniorityLevel?: string;
  jobFunction?: string;
  industries?: string;
  
  // Enhancement metadata (new fields)
  descriptionEnhanced?: string;        // AI-enhanced description
  lastEnhanced?: string;                // ISO timestamp
  enhancementStatus?: 'success' | 'failed' | 'pending';
}
```

### Enhanced Company Record

```typescript
export interface Company {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  rating: number;
  location: string;
  salary: string;
  experience: string;
  category: 'FAANG' | 'STARTUP' | 'PRODUCT' | 'SERVICE' | 'REMOTE';
  isHiring: boolean;
  stack: TechStack;
  about: string;
  timeline: { step: string; duration: string }[];
  website?: string;
  careersPage?: string;
  linkedInUrl?: string;
  openRoles?: number;
  
  // Enhancement metadata (new fields)
  aboutEnhanced?: string;               // AI-enhanced about section
  lastEnhanced?: string;                // ISO timestamp
  enhancementStatus?: 'success' | 'failed' | 'pending';
}
```

### Enhancement Cache Entry

```typescript
interface CacheEntry {
  key: string;
  result: EnhancementResult;
  expiresAt: number; // Unix timestamp
  createdAt: number;
}

// In-memory cache structure
const enhancementCache = new Map<string, CacheEntry>();
```

### Performance Metrics

```typescript
interface PerformanceMetrics {
  hour: string; // ISO hour timestamp
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTimeMs: number;
  totalTokens: number;
  errorRate: number; // Percentage
  cacheHitRate?: number; // For on-demand mode
  requestIds: string[]; // For traceability
}

// Logged per hour for monitoring
const metricsLog: PerformanceMetrics[] = [];
```



## Error Handling

### Error Categories and Responses

**1. Configuration Errors**
- **Trigger:** Missing `VITE_AZURE_OPENAI_API_KEY`
- **Response:** Throw error on service initialization: `"Azure OpenAI API key not found"`
- **Impact:** Feature disabled, application continues with fallback content
- **Logging:** Critical error logged with timestamp

**2. Authentication Errors (401/403)**
- **Trigger:** Invalid API key or insufficient permissions
- **Response:** Log authentication error, throw `AuthenticationError`
- **Impact:** No retry, feature disabled for current session
- **Logging:** Error with request ID, endpoint, timestamp
- **User Experience:** Fallback to original content, no error message displayed to user

**3. Rate Limit Errors (429)**
- **Trigger:** Exceeding 50 requests/minute or Azure service limits
- **Response:** 
  - Queue request if local rate limiter triggered
  - Wait 5 seconds if Azure returns 429
  - Retry up to 3 times with exponential backoff
- **Impact:** Delayed response, eventual timeout after 3 retries
- **Logging:** Rate limit hit logged with retry count
- **User Experience:** Loading state displayed, fallback after timeout

**4. Server Errors (500-599)**
- **Trigger:** Azure service temporary failures
- **Response:** Exponential backoff retry (2s, 4s, 8s) up to 3 attempts
- **Impact:** Delayed response, fallback after retries exhausted
- **Logging:** Error with status code, request ID, retry attempts
- **User Experience:** Loading state, fallback content if all retries fail

**5. Network Errors**
- **Trigger:** Connection timeout, DNS failure, network interruption
- **Response:** Retry with exponential backoff, 30-second total timeout
- **Impact:** Delayed or failed enhancement
- **Logging:** Network error details with endpoint and timestamp
- **User Experience:** Loading state, fallback after timeout

**6. Validation Errors**
- **Trigger:** Enhanced content fails quality checks
- **Response:** Reject enhanced content, use original content
- **Impact:** User sees original unmodified content
- **Logging:** Validation failure with reason code
- **Reason Codes:**
  - `EMPTY_RESPONSE` - Enhanced text is empty
  - `TOO_SHORT` - Enhanced text < 50% of original length
  - `TOO_LONG` - Enhanced text > 200% of original length
  - `PLACEHOLDER_DETECTED` - Contains [COMPANY], [ROLE], or TODO
  - `INVALID_URL` - Malformed URL in enhanced text
  - `LANGUAGE_MISMATCH` - Non-English content returned

**7. Timeout Errors**
- **Trigger:** Request exceeds 30-second timeout
- **Response:** Cancel request, log timeout, return original content
- **Impact:** No enhancement applied
- **Logging:** Timeout error with request duration
- **User Experience:** Original content displayed without notice

### Error Recovery Strategies

**Graceful Degradation:**
- All enhancement operations designed to fail safely
- Original content always preserved
- Failed enhancements never block user workflows
- UI displays loading states during processing
- Fallback content generated for AI Preparation Assistant

**Circuit Breaker Pattern:**
```typescript
class CircuitBreaker {
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > 60000) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker open');
      }
    }
    
    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failureCount = 0;
      }
      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      
      if (this.failureCount >= 5) {
        this.state = 'OPEN';
      }
      
      throw error;
    }
  }
}
```

**Batch Processing Error Handling:**
- Individual item failures don't stop batch processing
- Track success/failure counts per batch
- Log each failure with item identifier
- Continue with remaining items
- Return partial results with statistics

**Cache Resilience:**
- Cache failures don't block requests
- Fall through to live API call on cache read error
- Log cache errors separately
- Continue operation without cache on persistent failures

### Logging Strategy

**Log Levels:**
- `ERROR`: Authentication failures, repeated rate limits, validation failures
- `WARN`: Single rate limit hit, network retry, timeout
- `INFO`: Successful enhancements, batch statistics, cache hits/misses
- `DEBUG`: Request/response details, timing metrics

**Log Entry Structure:**
```typescript
interface LogEntry {
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  component: string; // e.g., 'AzureOpenAIService', 'JobEnhancer'
  message: string;
  requestId?: string;
  statusCode?: number;
  duration?: number;
  metadata?: Record<string, any>;
}
```

**Critical Warning Triggers:**
- Error rate > 20% over 1-hour period
- More than 10 consecutive failures
- Circuit breaker opens
- Authentication error detected

**Monitoring Metrics:**
- Request count per hour
- Average response time
- Token usage per request
- Error rate percentage
- Cache hit rate (on-demand mode)
- Success rate by enhancement type (job/company/guidance)

## Testing Strategy

### Unit Testing

**Target Coverage:** Core business logic, validation, error handling

**Test Framework:** Vitest (already in project)

**Key Test Suites:**

**1. Azure OpenAI Service Tests:**
```typescript
describe('AzureOpenAIService', () => {
  test('throws error when API key missing');
  test('validates connection successfully');
  test('handles 429 rate limit with retry');
  test('throws AuthenticationError on 401');
  test('retries server errors with exponential backoff');
  test('times out after 30 seconds');
  test('formats chat completion request correctly');
  test('parses response and extracts message content');
});
```

**2. Job Enhancer Tests:**
```typescript
describe('JobEnhancer', () => {
  test('skips enhancement for description < 50 chars');
  test('removes vague marketing terms');
  test('preserves technical skills and requirements');
  test('returns original on API failure');
  test('validates enhanced length within bounds');
  test('rejects content with placeholder text');
  test('logs enhancement attempts');
});
```

**3. Company Enhancer Tests:**
```typescript
describe('CompanyEnhancer', () => {
  test('skips enhancement for about < 30 chars');
  test('removes generic phrases');
  test('enforces 200-word maximum');
  test('preserves factual company information');
  test('falls back to original on validation failure');
});
```

**4. AI Prep Assistant Tests:**
```typescript
describe('AIPrepAssistant', () => {
  test('generates guidance only when job context provided');
  test('includes all job context in prompt');
  test('returns fallback guidance on API failure');
  test('formats guidance as readable paragraphs');
  test('generates guidance within 15 seconds');
});
```

**5. Enhancement Pipeline Tests:**
```typescript
describe('EnhancementPipeline', () => {
  test('processes batch with 1s delay between items');
  test('continues batch processing on individual failures');
  test('tracks batch statistics correctly');
  test('uses cache in on-demand mode');
  test('caches results with 24h TTL');
  test('generates correct cache keys');
  test('validates all enhanced content');
});
```

**6. Rate Limiter Tests:**
```typescript
describe('RateLimiter', () => {
  test('allows requests under limit immediately');
  test('queues requests exceeding limit');
  test('processes queue with minimum interval');
  test('cleans old timestamps correctly');
  test('reports current request rate');
});
```

**7. Validation Tests:**
```typescript
describe('ContentValidation', () => {
  test('accepts content within 50-200% length range');
  test('rejects empty enhanced content');
  test('rejects content too short');
  test('rejects content too long');
  test('detects placeholder text');
  test('validates URL formatting');
  test('validates language is English');
});
```

**Test Data:**
- Mock job descriptions with vague terms
- Mock company descriptions with marketing fluff
- Sample API responses (success and error cases)
- Edge cases: empty strings, very long content, special characters

**Mocking Strategy:**
- Mock Azure OpenAI API calls to avoid live API usage in tests
- Mock environment variables for configuration tests
- Mock Date.now() for timestamp-dependent tests
- Mock fetch for network error simulation

### Property-Based Testing

**Target:** Universal properties that should hold across all inputs

**Framework:** fast-check (JavaScript/TypeScript property-based testing library)

**Minimum Iterations:** 100 runs per property test

**Test Configuration:**
```typescript
import fc from 'fast-check';

// Configure property tests
const propertyTestConfig = {
  numRuns: 100,
  verbose: true,
  seed: 42, // For reproducibility
};
```

**Property Test Tags:**
Each test references its design document property using a comment:
```typescript
// Feature: azure-openai-job-enhancement, Property 1: [property text]
test('property description', () => {
  fc.assert(fc.property(...), propertyTestConfig);
});
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Error handling graceful degradation

*For any* enhancement operation (job description, company description, or AI guidance) that encounters an Azure OpenAI error, the system should return the original unmodified content and mark the operation as failed without throwing exceptions to the user interface.

**Validates: Requirements 2.6, 3.6, 4.7, 7.4**

### Property 2: Job enhancement processing trigger

*For any* job listing with a description field that contains at least 50 characters, the Job Description Enhancer should invoke the Azure OpenAI service with the description text.

**Validates: Requirements 2.1**

### Property 3: Job enhancement prompt completeness

*For any* job description sent to Azure OpenAI, the prompt should contain instructions to remove vague terms (dynamic, fast-paced, rockstar, ninja), make requirements explicit and measurable, and preserve technical skills and qualifications.

**Validates: Requirements 2.2, 2.3, 2.4**

### Property 4: Job enhancement logging

*For any* job description enhancement attempt, the system should log an entry containing the job identifier, success or failure status, and timestamp.

**Validates: Requirements 2.7**

### Property 5: Job enhancement short content bypass

*For any* job description with length less than 50 characters, the Job Description Enhancer should return the original text unchanged without calling Azure OpenAI.

**Validates: Requirements 2.8**

### Property 6: Company enhancement processing trigger

*For any* company profile with an about section that contains at least 30 characters, the Company Description Enhancer should invoke the Azure OpenAI service with the about text.

**Validates: Requirements 3.1**

### Property 7: Company enhancement prompt completeness

*For any* company about text sent to Azure OpenAI, the prompt should contain instructions to remove generic phrases (leading provider, innovative solutions, industry leader), emphasize specific products and services, and maintain factual information.

**Validates: Requirements 3.2, 3.3, 3.4**

### Property 8: Company enhancement word limit

*For any* company description successfully enhanced by Azure OpenAI, the resulting text should contain 200 words or fewer.

**Validates: Requirements 3.5**

### Property 9: Company enhancement logging

*For any* company description enhancement attempt, the system should log an entry containing the company identifier, success or failure status, and timestamp.

**Validates: Requirements 3.7**

### Property 10: Company enhancement short content bypass

*For any* company about text with length less than 30 characters, the Company Description Enhancer should return the original text unchanged without calling Azure OpenAI.

**Validates: Requirements 3.8**

### Property 11: AI guidance generation trigger

*For any* GuideView load event with a non-null job context, the AI Preparation Assistant should invoke Azure OpenAI to generate preparation guidance.

**Validates: Requirements 4.2**

### Property 12: AI guidance prompt context inclusion

*For any* AI preparation guidance request, the prompt sent to Azure OpenAI should include the job title, required skills, company information, job description, experience level, location, and work mode fields from the job context.

**Validates: Requirements 4.3**

### Property 13: AI guidance fallback generation

*For any* AI preparation guidance request that fails due to Azure OpenAI error, the system should generate fallback guidance using the job's title, company, top 3 skills, experience level, and work mode.

**Validates: Requirements 4.7**

### Property 14: AI guidance formatting

*For any* AI preparation guidance generated (either from Azure OpenAI or fallback), the output text should contain at least one line break character to separate paragraphs.

**Validates: Requirements 4.8**

### Property 15: Rate limiter request tracking

*For any* Azure OpenAI request made through the rate limiter, the request timestamp should be recorded and included in the per-minute count calculation.

**Validates: Requirements 5.1**

### Property 16: Rate limiter queue threshold

*For any* time window where 50 or more Azure OpenAI requests have occurred in the last 60 seconds, the 51st request should be added to the queue rather than executed immediately.

**Validates: Requirements 5.2**

### Property 17: Retry limit enforcement

*For any* retryable Azure OpenAI error (network error, 500-599 status, or 429 status), the service should attempt the request a maximum of 3 times before returning an error to the caller.

**Validates: Requirements 5.5**

### Property 18: Network error logging

*For any* network error encountered when calling Azure OpenAI, a log entry should be written containing the endpoint URL, timestamp, and error message.

**Validates: Requirements 5.8**

### Property 19: Batch processing resilience

*For any* enhancement batch containing N items, if item at position i fails enhancement, all items at positions i+1 through N should still be processed and attempted.

**Validates: Requirements 5.9**

### Property 20: On-demand caching behavior

*For any* enhancement request in on-demand mode, if a cache entry exists for the content with expiration time in the future, the cached result should be returned without calling Azure OpenAI.

**Validates: Requirements 6.5**

### Property 21: Enhancement timestamp recording

*For any* successfully enhanced job or company record, the record should contain a "lastEnhanced" field with an ISO 8601 timestamp value.

**Validates: Requirements 6.6**

### Property 22: Batch statistics logging

*For any* enhancement batch processed, a log entry should be written containing the enhancement mode (scraping or on-demand), total items processed, success count, and failure count.

**Validates: Requirements 6.8**

### Property 23: Empty content validation rejection

*For any* enhanced content returned from Azure OpenAI, if the content is an empty string or contains only whitespace, the validation should fail and the original unmodified content should be used.

**Validates: Requirements 7.1**

### Property 24: Minimum length validation

*For any* enhanced content returned from Azure OpenAI, if the content length is less than 50% of the original content length, the validation should fail and the original unmodified content should be used.

**Validates: Requirements 7.2**

### Property 25: Maximum length validation

*For any* enhanced content returned from Azure OpenAI, if the content length exceeds 200% of the original content length, the validation should fail and the original unmodified content should be used.

**Validates: Requirements 7.3**

### Property 26: Placeholder text validation rejection

*For any* enhanced content returned from Azure OpenAI, if the content contains the text "[COMPANY]", "[ROLE]", or "TODO", the validation should fail and the original unmodified content should be used.

**Validates: Requirements 7.5**

### Property 27: Validation failure logging

*For any* enhanced content that fails validation, a log entry should be written containing the validation failure reason code (EMPTY_RESPONSE, TOO_SHORT, TOO_LONG, PLACEHOLDER_DETECTED, or INVALID_URL).

**Validates: Requirements 7.7**

### Property 28: URL validation in enhanced content

*For any* enhanced content that contains one or more URLs, each URL should match a valid URL pattern (protocol://domain.tld/path format), otherwise validation should fail and original content should be used.

**Validates: Requirements 7.8**

### Property 29: Hourly request count logging

*For any* one-hour time window, the Azure OpenAI service should log the total number of requests made during that hour.

**Validates: Requirements 8.1**

### Property 30: Response time metrics logging

*For any* Azure OpenAI request that completes (successfully or with error), the service should log the response time in milliseconds.

**Validates: Requirements 8.2**

### Property 31: Token usage logging per request

*For any* successful Azure OpenAI request that returns a completion, the service should log the total token count from the response usage field.

**Validates: Requirements 8.3**

### Property 32: Error rate calculation

*For any* one-hour time window with at least one request, the service should calculate and log the error rate as the percentage of failed requests out of total requests.

**Validates: Requirements 8.4**

### Property 33: Enhancement type success rate tracking

*For any* enhancement batch, the pipeline should log separate success rates for job enhancements and company enhancements (as percentages of successful enhancements per type).

**Validates: Requirements 8.5**

### Property 34: Cache hit rate logging

*For any* one-hour time window in on-demand mode with at least one enhancement request, the pipeline should calculate and log the cache hit rate as the percentage of requests served from cache.

**Validates: Requirements 8.6**

### Property 35: High error rate alerting

*For any* one-hour time window where the error rate exceeds 20%, the service should log a critical-level warning message.

**Validates: Requirements 8.7**

### Property 36: Request ID traceability

*For any* log entry written by the Azure OpenAI service or enhancement pipeline, the log entry should contain a request ID field for tracing the operation across multiple log entries.

**Validates: Requirements 8.8**

