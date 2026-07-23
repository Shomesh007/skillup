/**
 * Job Description Enhancer
 * 
 * Processes job descriptions through Azure OpenAI to remove vague language
 * and improve clarity. Falls back to original content on any failure.
 */

import { getChatResponse, AzureOpenAIError } from './azureOpenAI';

/**
 * Result of an enhancement operation
 */
export interface EnhancementResult {
  enhanced: string;
  original: string;
  success: boolean;
  error?: string;
  timestamp: string;
  tokensUsed?: number;
}

/**
 * Validation result for enhanced content
 */
interface ValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validation reason codes
 */
export const ValidationReasonCode = {
  EMPTY_RESPONSE: 'EMPTY_RESPONSE',
  TOO_SHORT: 'TOO_SHORT',
  TOO_LONG: 'TOO_LONG',
  PLACEHOLDER_DETECTED: 'PLACEHOLDER_DETECTED',
  INVALID_URL: 'INVALID_URL',
} as const;

/**
 * Minimum character length for enhancement
 * Descriptions shorter than this are returned unchanged
 */
const MIN_DESCRIPTION_LENGTH = 50;

/**
 * Valid length range for enhanced content
 * Enhanced text must be 50%-200% of original length
 */
const MIN_LENGTH_RATIO = 0.5;
const MAX_LENGTH_RATIO = 2.0;

/**
 * Placeholder patterns that indicate low-quality AI output
 */
const PLACEHOLDER_PATTERNS = [
  /\[COMPANY\]/i,
  /\[ROLE\]/i,
  /\bTODO\b/,
];

/**
 * URL validation pattern
 * Checks for protocol://domain.tld/path format
 */
const URL_PATTERN = /https?:\/\/[^\s]+/g;

/**
 * Build the enhancement prompt for job descriptions
 * 
 * Instructs AI to remove vague terms and make requirements explicit
 * while preserving technical details
 */
function buildEnhancementPrompt(description: string, jobTitle?: string, company?: string): string {
  const contextInfo = jobTitle || company 
    ? `\n\nContext: ${jobTitle ? `Job Title: ${jobTitle}` : ''}${jobTitle && company ? ', ' : ''}${company ? `Company: ${company}` : ''}`
    : '';

  return `You are an expert job description editor. Rewrite this job description to be clear and actionable.

Rules:
1. Remove vague marketing terms: "dynamic environment", "fast-paced", "rockstar", "ninja", "guru"
2. Make requirements explicit and measurable (e.g., "3+ years" not "experience required")
3. Preserve all specific technical skills, tools, qualifications, and tech stack
4. Keep factual information about role, location, team structure
5. Remove generic motivational language
6. Maintain professional tone
7. Keep length similar to original (±20%)${contextInfo}

Job Description:
${description}

Return only the enhanced description, no preamble or explanation.`;
}

/**
 * Validate enhanced content quality
 * 
 * Checks for:
 * - Non-empty content
 * - Length within 50%-200% of original
 * - No placeholder text like [COMPANY], [ROLE], TODO
 * - Valid URL formatting
 * 
 * @param original - Original description text
 * @param enhanced - AI-enhanced description text
 * @returns Validation result with reason code if invalid
 */
function validateEnhancedContent(original: string, enhanced: string): ValidationResult {
  // Check for empty or whitespace-only content
  if (!enhanced || enhanced.trim().length === 0) {
    return { 
      valid: false, 
      reason: ValidationReasonCode.EMPTY_RESPONSE 
    };
  }

  const enhancedLength = enhanced.trim().length;
  const originalLength = original.trim().length;

  // Check minimum length (must be at least 50% of original)
  if (enhancedLength < originalLength * MIN_LENGTH_RATIO) {
    return { 
      valid: false, 
      reason: ValidationReasonCode.TOO_SHORT 
    };
  }

  // Check maximum length (must not exceed 200% of original)
  if (enhancedLength > originalLength * MAX_LENGTH_RATIO) {
    return { 
      valid: false, 
      reason: ValidationReasonCode.TOO_LONG 
    };
  }

  // Check for placeholder text
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(enhanced)) {
      return { 
        valid: false, 
        reason: ValidationReasonCode.PLACEHOLDER_DETECTED 
      };
    }
  }

  // Check URL formatting if URLs are present
  const urls = enhanced.match(URL_PATTERN);
  if (urls) {
    for (const url of urls) {
      try {
        // Validate URL format by attempting to construct URL object
        new URL(url);
      } catch {
        return { 
          valid: false, 
          reason: ValidationReasonCode.INVALID_URL 
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Log enhancement attempt with success/failure status
 * 
 * Logs include timestamp, success status, and error details
 */
function logEnhancement(
  jobTitle: string | undefined,
  company: string | undefined,
  success: boolean,
  error?: string,
  validationReason?: string
): void {
  const timestamp = new Date().toISOString();
  const jobIdentifier = `${company || 'Unknown'} - ${jobTitle || 'Unknown'}`;
  
  if (success) {
    console.info('[JobEnhancer] Enhancement successful', {
      timestamp,
      jobIdentifier,
      success: true,
    });
  } else {
    console.warn('[JobEnhancer] Enhancement failed', {
      timestamp,
      jobIdentifier,
      success: false,
      error,
      validationReason,
    });
  }
}

/**
 * Enhance job description using Azure OpenAI
 * 
 * Processes job descriptions to remove vague terms and improve clarity.
 * Skips enhancement for very short descriptions (< 50 chars).
 * Returns original content on any error or validation failure.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8
 * 
 * @param description - Original job description text
 * @param jobTitle - Optional job title for context
 * @param company - Optional company name for context
 * @returns EnhancementResult with enhanced or original content
 */
export async function enhanceJobDescription(
  description: string,
  jobTitle?: string,
  company?: string
): Promise<EnhancementResult> {
  const timestamp = new Date().toISOString();
  const original = description;

  // Skip enhancement for short descriptions (Requirement 2.8)
  if (description.length < MIN_DESCRIPTION_LENGTH) {
    console.info('[JobEnhancer] Skipping enhancement for short description', {
      timestamp,
      length: description.length,
      minLength: MIN_DESCRIPTION_LENGTH,
    });

    return {
      enhanced: original,
      original,
      success: true,
      timestamp,
    };
  }

  try {
    // Build prompt with enhancement instructions (Requirements 2.2, 2.3, 2.4)
    const prompt = buildEnhancementPrompt(description, jobTitle, company);

    // Call Azure OpenAI service (Requirement 2.1)
    const enhancedText = await getChatResponse(prompt);

    // Validate enhanced content (Requirements 2.6, 7.1, 7.2, 7.3, 7.5, 7.8)
    const validation = validateEnhancedContent(original, enhancedText);

    if (!validation.valid) {
      // Validation failed - log and return original (Requirement 2.7, 7.7)
      logEnhancement(jobTitle, company, false, 'Validation failed', validation.reason);

      return {
        enhanced: original,
        original,
        success: false,
        error: `Validation failed: ${validation.reason}`,
        timestamp,
      };
    }

    // Success - log and return enhanced content (Requirement 2.7)
    logEnhancement(jobTitle, company, true);

    return {
      enhanced: enhancedText.trim(),
      original,
      success: true,
      timestamp,
    };

  } catch (error) {
    // Handle any errors - return original content (Requirement 2.6)
    const errorMessage = error instanceof AzureOpenAIError 
      ? error.message 
      : error instanceof Error 
      ? error.message 
      : 'Unknown error';

    // Log failure (Requirement 2.7)
    logEnhancement(jobTitle, company, false, errorMessage);

    return {
      enhanced: original,
      original,
      success: false,
      error: errorMessage,
      timestamp,
    };
  }
}
