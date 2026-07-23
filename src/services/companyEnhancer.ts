/**
 * Company Description Enhancer
 * 
 * Processes company "about" sections through Azure OpenAI to remove generic
 * marketing language and improve specificity. Falls back to original content on any failure.
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
 * About sections shorter than this are returned unchanged
 */
const MIN_ABOUT_LENGTH = 30;

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
 * Build the enhancement prompt for company descriptions
 * 
 * Instructs AI to remove generic phrases and emphasize specific
 * products, services, and business focus
 */
function buildEnhancementPrompt(aboutText: string, companyName?: string, industry?: string): string {
  const contextInfo = companyName || industry 
    ? `\n\nContext: ${companyName ? `Company: ${companyName}` : ''}${companyName && industry ? ', ' : ''}${industry ? `Industry: ${industry}` : ''}`
    : '';

  return `You are an expert company profile editor. Rewrite this company description to be specific and meaningful.

Rules:
1. Remove generic phrases: "leading provider", "innovative solutions", "industry leader", "best-in-class"
2. Emphasize specific products, services, and business focus
3. Maintain factual information about company size, locations, founding date
4. Keep technical domain information
5. Remove superlatives and marketing fluff
6. Maximum 200 words
7. Maintain professional tone${contextInfo}

Company About:
${aboutText}

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
 * @param original - Original about text
 * @param enhanced - AI-enhanced about text
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
  companyName: string | undefined,
  success: boolean,
  error?: string,
  validationReason?: string
): void {
  const timestamp = new Date().toISOString();
  const companyIdentifier = companyName || 'Unknown';
  
  if (success) {
    console.info('[CompanyEnhancer] Enhancement successful', {
      timestamp,
      companyIdentifier,
      success: true,
    });
  } else {
    console.warn('[CompanyEnhancer] Enhancement failed', {
      timestamp,
      companyIdentifier,
      success: false,
      error,
      validationReason,
    });
  }
}

/**
 * Enhance company description using Azure OpenAI
 * 
 * Processes company "about" sections to remove generic phrases and improve specificity.
 * Skips enhancement for very short descriptions (< 30 chars).
 * Enforces 200-word maximum in the prompt.
 * Returns original content on any error or validation failure.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8
 * 
 * @param aboutText - Original company about text
 * @param companyName - Optional company name for context
 * @param industry - Optional industry for context
 * @returns EnhancementResult with enhanced or original content
 */
export async function enhanceCompanyDescription(
  aboutText: string,
  companyName?: string,
  industry?: string
): Promise<EnhancementResult> {
  const timestamp = new Date().toISOString();
  const original = aboutText;

  // Skip enhancement for short about text (Requirement 3.8)
  if (aboutText.length < MIN_ABOUT_LENGTH) {
    console.info('[CompanyEnhancer] Skipping enhancement for short about text', {
      timestamp,
      length: aboutText.length,
      minLength: MIN_ABOUT_LENGTH,
    });

    return {
      enhanced: original,
      original,
      success: true,
      timestamp,
    };
  }

  try {
    // Build prompt with enhancement instructions (Requirements 3.2, 3.3, 3.4, 3.5)
    const prompt = buildEnhancementPrompt(aboutText, companyName, industry);

    // Call Azure OpenAI service (Requirement 3.1)
    const enhancedText = await getChatResponse(prompt);

    // Validate enhanced content (Requirements 3.6, 7.1, 7.2, 7.3, 7.5, 7.8)
    const validation = validateEnhancedContent(original, enhancedText);

    if (!validation.valid) {
      // Validation failed - log and return original (Requirement 3.7, 7.7)
      logEnhancement(companyName, false, 'Validation failed', validation.reason);

      return {
        enhanced: original,
        original,
        success: false,
        error: `Validation failed: ${validation.reason}`,
        timestamp,
      };
    }

    // Success - log and return enhanced content (Requirement 3.7)
    logEnhancement(companyName, true);

    return {
      enhanced: enhancedText.trim(),
      original,
      success: true,
      timestamp,
    };

  } catch (error) {
    // Handle any errors - return original content (Requirement 3.6)
    const errorMessage = error instanceof AzureOpenAIError 
      ? error.message 
      : error instanceof Error 
      ? error.message 
      : 'Unknown error';

    // Log failure (Requirement 3.7)
    logEnhancement(companyName, false, errorMessage);

    return {
      enhanced: original,
      original,
      success: false,
      error: errorMessage,
      timestamp,
    };
  }
}
