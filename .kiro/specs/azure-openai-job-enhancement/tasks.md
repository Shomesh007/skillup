# Implementation Plan: Azure OpenAI Job Enhancement

## Overview

This implementation plan adds Azure OpenAI integration to enhance job listings, company descriptions, and generate personalized job preparation guidance. The system uses Azure's GPT-5.2-chat deployment with graceful fallbacks, rate limiting, and comprehensive validation.

**Implementation approach:**
- Build core Azure OpenAI service with error handling and rate limiting
- Create enhancement services for jobs, companies, and AI preparation
- Implement enhancement pipeline with caching and validation
- Integrate with existing GuideView component
- Add comprehensive testing coverage

## Tasks

- [ ] 1. Set up Azure OpenAI service foundation
  - [x] 1.1 Enhance existing azureOpenAI.ts with error handling classes
    - Add `AzureOpenAIError`, `RateLimitError`, and `AuthenticationError` error classes
    - Add retry logic with exponential backoff for 429 and 500-599 errors
    - Add 30-second timeout handling
    - Add configuration validation with descriptive error messages
    - _Requirements: 1.4, 1.5, 5.4, 5.5, 5.7_

  - [ ]* 1.2 Write property tests for Azure OpenAI service error handling
    - **Property 1: Error handling graceful degradation**
    - **Validates: Requirements 2.6, 3.6, 4.7, 7.4**

  - [ ]* 1.3 Write unit tests for Azure OpenAI service
    - Test configuration error when API key missing
    - Test 429 rate limit retry logic
    - Test authentication error on 401/403
    - Test server error retry with exponential backoff
    - Test 30-second timeout
    - _Requirements: 1.5, 5.4, 5.5, 5.7_

- [ ] 2. Implement rate limiting component
  - [x] 2.1 Create src/services/rateLimiter.ts
    - Implement RateLimiter class with request queue
    - Track timestamps for last 60 seconds of requests
    - Enforce 50 requests/minute limit with 1.2s minimum interval
    - Add queue processing with proper delays
    - Expose getRequestRate() for monitoring
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 2.2 Write property tests for rate limiter
    - **Property 15: Rate limiter request tracking**
    - **Property 16: Rate limiter queue threshold**
    - **Validates: Requirements 5.1, 5.2**

  - [ ]* 2.3 Write unit tests for rate limiter
    - Test requests under limit proceed immediately
    - Test requests exceeding limit are queued
    - Test queue processing with minimum interval
    - Test timestamp cleanup
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 3. Create job description enhancer
  - [x] 3.1 Create src/services/jobEnhancer.ts
    - Implement `enhanceJobDescription()` function
    - Build prompt template with vague term removal instructions
    - Add content validation (length, placeholder detection)
    - Add enhancement logging with success/failure tracking
    - Skip enhancement for descriptions < 50 characters
    - Return original content on any error
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8_

  - [ ]* 3.2 Write property tests for job enhancer
    - **Property 2: Job enhancement processing trigger**
    - **Property 3: Job enhancement prompt completeness**
    - **Property 4: Job enhancement logging**
    - **Property 5: Job enhancement short content bypass**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.7, 2.8**

  - [ ]* 3.3 Write unit tests for job enhancer
    - Test vague term removal from sample descriptions
    - Test preservation of technical skills
    - Test fallback to original on API failure
    - Test validation rejection of placeholder text
    - Test skip enhancement for short content
    - _Requirements: 2.2, 2.3, 2.4, 2.6, 2.8_

- [ ] 4. Create company description enhancer
  - [ ] 4.1 Create src/services/companyEnhancer.ts
    - Implement `enhanceCompanyDescription()` function
    - Build prompt template with generic phrase removal instructions
    - Enforce 200-word maximum in prompt
    - Add content validation (length, placeholder detection)
    - Add enhancement logging
    - Skip enhancement for about text < 30 characters
    - Return original content on any error
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ]* 4.2 Write property tests for company enhancer
    - **Property 6: Company enhancement processing trigger**
    - **Property 7: Company enhancement prompt completeness**
    - **Property 8: Company enhancement word limit**
    - **Property 9: Company enhancement logging**
    - **Property 10: Company enhancement short content bypass**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.7, 3.8**

  - [ ]* 4.3 Write unit tests for company enhancer
    - Test generic phrase removal
    - Test preservation of factual information
    - Test 200-word limit enforcement
    - Test fallback on validation failure
    - Test skip enhancement for short content
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.8_

- [~] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Create AI preparation assistant
  - [~] 6.1 Create src/services/aiPrepAssistant.ts
    - Implement `generatePrepGuidance()` function with JobContext interface
    - Build prompt template with 4-paragraph structure
    - Implement fallback guidance generator using job fields
    - Add proper error handling with fallback on API failure
    - Format output with line breaks between paragraphs
    - _Requirements: 4.2, 4.3, 4.4, 4.6, 4.7, 4.8_

  - [ ]* 6.2 Write property tests for AI prep assistant
    - **Property 11: AI guidance generation trigger**
    - **Property 12: AI guidance prompt context inclusion**
    - **Property 13: AI guidance fallback generation**
    - **Property 14: AI guidance formatting**
    - **Validates: Requirements 4.2, 4.3, 4.7, 4.8**

  - [ ]* 6.3 Write unit tests for AI prep assistant
    - Test guidance generation with complete job context
    - Test fallback guidance on API failure
    - Test paragraph formatting with line breaks
    - Test guidance generation within 15 seconds
    - _Requirements: 4.3, 4.6, 4.7, 4.8_

- [ ] 7. Implement content validation module
  - [~] 7.1 Create src/services/contentValidation.ts
    - Implement validation functions for enhanced content
    - Check for empty content or whitespace-only
    - Validate length between 50%-200% of original
    - Detect placeholder text ([COMPANY], [ROLE], TODO)
    - Validate URL formatting
    - Return validation result with reason codes
    - _Requirements: 7.1, 7.2, 7.3, 7.5, 7.7, 7.8_

  - [ ]* 7.2 Write property tests for content validation
    - **Property 23: Empty content validation rejection**
    - **Property 24: Minimum length validation**
    - **Property 25: Maximum length validation**
    - **Property 26: Placeholder text validation rejection**
    - **Property 28: URL validation in enhanced content**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.5, 7.8**

  - [ ]* 7.3 Write unit tests for content validation
    - Test acceptance of valid content within bounds
    - Test rejection of empty or whitespace content
    - Test rejection of too-short content
    - Test rejection of too-long content
    - Test placeholder text detection
    - Test URL format validation
    - _Requirements: 7.1, 7.2, 7.3, 7.5, 7.8_

- [ ] 8. Create enhancement pipeline orchestrator
  - [~] 8.1 Create src/services/enhancementPipeline.ts
    - Implement PipelineConfig with mode selection (scraping/on-demand)
    - Implement cache management with 24-hour TTL
    - Create `enhanceJobOnDemand()` with cache checking
    - Create `enhanceCompanyOnDemand()` with cache checking
    - Add validation layer before storing enhancements
    - Add timestamp recording for enhanced records
    - Implement batch processing with 1s delay and error resilience
    - Add batch statistics logging
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 5.9_

  - [ ]* 8.2 Write property tests for enhancement pipeline
    - **Property 17: Retry limit enforcement**
    - **Property 19: Batch processing resilience**
    - **Property 20: On-demand caching behavior**
    - **Property 21: Enhancement timestamp recording**
    - **Property 22: Batch statistics logging**
    - **Property 27: Validation failure logging**
    - **Validates: Requirements 5.5, 5.9, 6.5, 6.6, 6.8, 7.7**

  - [ ]* 8.3 Write unit tests for enhancement pipeline
    - Test batch processing with individual failures
    - Test cache hit returns cached content
    - Test cache miss triggers API call
    - Test validation layer rejects invalid content
    - Test timestamp added to enhanced records
    - Test batch statistics calculation
    - _Requirements: 5.9, 6.5, 6.6, 6.7, 6.8_

- [~] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Add performance monitoring and logging
  - [~] 10.1 Create src/services/metricsLogger.ts
    - Implement hourly request count tracking
    - Track average response time per request
    - Track token usage from Azure OpenAI responses
    - Calculate and log error rate percentage
    - Track separate success rates for job/company enhancements
    - Calculate cache hit rate for on-demand mode
    - Add critical warning when error rate > 20%
    - Add request ID to all log entries
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

  - [ ]* 10.2 Write property tests for metrics logging
    - **Property 18: Network error logging**
    - **Property 29: Hourly request count logging**
    - **Property 30: Response time metrics logging**
    - **Property 31: Token usage logging per request**
    - **Property 32: Error rate calculation**
    - **Property 33: Enhancement type success rate tracking**
    - **Property 34: Cache hit rate logging**
    - **Property 35: High error rate alerting**
    - **Property 36: Request ID traceability**
    - **Validates: Requirements 5.8, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8**

  - [ ]* 10.3 Write unit tests for metrics logger
    - Test hourly aggregation of request counts
    - Test average response time calculation
    - Test token usage tracking
    - Test error rate percentage calculation
    - Test cache hit rate calculation
    - Test critical warning trigger at 20% error rate
    - Test request ID inclusion in logs
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [ ] 11. Update data type definitions
  - [~] 11.1 Update types.ts with enhancement metadata fields
    - Add `descriptionEnhanced?: string` to JobOpportunity
    - Add `lastEnhanced?: string` to JobOpportunity
    - Add `enhancementStatus?: 'success' | 'failed' | 'pending'` to JobOpportunity
    - Add `aboutEnhanced?: string` to Company
    - Add `lastEnhanced?: string` to Company
    - Add `enhancementStatus?: 'success' | 'failed' | 'pending'` to Company
    - Add `careersPage?: string` to Company
    - Add `linkedInUrl?: string` to Company
    - Add `openRoles?: number` to Company
    - _Requirements: 6.4, 6.6_

- [ ] 12. Integrate AI prep assistant into GuideView
  - [~] 12.1 Update components/GuideView.tsx to use new AI prep assistant
    - Import `generatePrepGuidance()` from aiPrepAssistant service
    - Replace existing AI generation logic with new service call
    - Pass complete JobContext (title, company, description, skills, experience, location, mode, salary)
    - Display "Generating role-specific guidance..." during generation
    - Use fallback guidance on error
    - Handle case where no job context exists (don't generate)
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.9_

  - [ ]* 12.2 Write integration tests for GuideView AI guidance
    - Test guidance generation triggered on job load
    - Test loading state displayed during generation
    - Test fallback guidance on API error
    - Test no guidance when job context is null
    - _Requirements: 4.1, 4.2, 4.5, 4.9_

- [ ] 13. Add enhancement display in UI components
  - [~] 13.1 Update GuideView to display enhanced job descriptions
    - Check for `descriptionEnhanced` field
    - Display enhanced description if available, otherwise original
    - Add subtle indicator showing enhanced content
    - _Requirements: 2.1, 6.4_

  - [~] 13.2 Update CompanyProfileView to display enhanced company descriptions
    - Check for `aboutEnhanced` field
    - Display enhanced about text if available, otherwise original
    - Add subtle indicator showing enhanced content
    - _Requirements: 3.1, 6.4_

- [ ] 14. Add environment variable configuration
  - [~] 14.1 Update .env.local.example with Azure OpenAI variables
    - Add VITE_AZURE_OPENAI_ENDPOINT with example value
    - Add VITE_AZURE_OPENAI_API_KEY with placeholder
    - Add VITE_AZURE_OPENAI_DEPLOYMENT with default "gpt-5.2-chat"
    - Add VITE_AZURE_OPENAI_API_VERSION with default "2024-12-01-preview"
    - Add comments explaining each variable
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 15. Create documentation
  - [~] 15.1 Create docs/azure-openai-integration.md
    - Document Azure OpenAI setup and configuration
    - Explain enhancement modes (scraping vs on-demand)
    - Document error handling and fallback behavior
    - Provide examples of using each enhancement service
    - Document rate limiting and caching behavior
    - Add troubleshooting guide for common errors
    - _Requirements: All_

- [~] 16. Final checkpoint - End-to-end validation
  - Ensure all tests pass, ask the user if questions arise.
  - Verify Azure OpenAI service connects successfully
  - Test job enhancement end-to-end
  - Test company enhancement end-to-end
  - Test AI preparation guidance generation
  - Verify graceful fallbacks on errors
  - Check rate limiting behavior
  - Validate caching mechanism

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at reasonable breaks
- Property tests validate universal correctness properties from design document
- Unit tests validate specific examples, edge cases, and error conditions
- All enhancement operations must fail gracefully without breaking user workflows
- The existing azureOpenAI.ts service is enhanced rather than replaced
- Implementation builds incrementally: service foundation → enhancers → pipeline → UI integration
