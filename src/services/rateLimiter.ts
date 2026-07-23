/**
 * Rate Limiter for Azure OpenAI API requests
 * 
 * Manages API request throttling to prevent exceeding Azure OpenAI limits.
 * Tracks requests per minute and queues excess requests for delayed processing.
 */

export interface RateLimitConfig {
  requestsPerMinute: number;
  minIntervalMs: number;
}

export class RateLimiter {
  private requestTimestamps: number[] = [];
  private queue: Array<{
    fn: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private processing: boolean = false;

  constructor(private config: RateLimitConfig) {}

  /**
   * Execute a function with rate limiting
   * 
   * If the request can proceed immediately (under rate limit), it executes right away.
   * If at the rate limit, the request is queued and processed after the minimum interval.
   * 
   * @param fn - The async function to execute with rate limiting
   * @returns Promise resolving to the function's result
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if we can proceed immediately
    if (this.canProceed()) {
      // Record timestamp and execute immediately
      this.requestTimestamps.push(Date.now());
      try {
        return await fn();
      } finally {
        // Start queue processing if needed
        if (!this.processing && this.queue.length > 0) {
          this.processQueue();
        }
      }
    }

    // Rate limit exceeded - add to queue
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        fn: fn as () => Promise<any>,
        resolve,
        reject,
      });

      // Start processing queue if not already processing
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  /**
   * Check if a request can proceed immediately
   * 
   * Cleans old timestamps (older than 60 seconds) and checks if current
   * request count is below the limit.
   * 
   * @returns true if request can proceed immediately, false if should be queued
   */
  private canProceed(): boolean {
    this.cleanTimestamps();
    return this.requestTimestamps.length < this.config.requestsPerMinute;
  }

  /**
   * Process queued requests with minimum interval delays
   * 
   * Continuously processes queued requests while respecting rate limits
   * and minimum intervals between requests.
   */
  private async processQueue(): Promise<void> {
    if (this.processing) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      // Wait for minimum interval from last request
      const lastRequestTime = this.requestTimestamps[this.requestTimestamps.length - 1] || 0;
      const timeSinceLastRequest = Date.now() - lastRequestTime;
      
      if (timeSinceLastRequest < this.config.minIntervalMs) {
        await this.sleep(this.config.minIntervalMs - timeSinceLastRequest);
      }

      // Check if we can proceed (respecting per-minute limit)
      if (!this.canProceed()) {
        // Wait until oldest request is outside the 60s window
        const oldestTimestamp = this.requestTimestamps[0];
        const timeUntilExpiry = 60000 - (Date.now() - oldestTimestamp);
        
        if (timeUntilExpiry > 0) {
          await this.sleep(timeUntilExpiry + 100); // Add 100ms buffer
        }
        
        // Clean timestamps again
        this.cleanTimestamps();
      }

      // Get next item from queue
      const item = this.queue.shift();
      if (!item) break;

      // Record timestamp
      this.requestTimestamps.push(Date.now());

      // Execute the queued function
      try {
        const result = await item.fn();
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      }
    }

    this.processing = false;
  }

  /**
   * Remove timestamps older than 60 seconds
   * 
   * Keeps the timestamp array clean and ensures accurate rate limit calculations.
   */
  private cleanTimestamps(): void {
    const now = Date.now();
    const sixtySecondsAgo = now - 60000;
    
    // Filter out timestamps older than 60 seconds
    this.requestTimestamps = this.requestTimestamps.filter(
      timestamp => timestamp > sixtySecondsAgo
    );
  }

  /**
   * Sleep utility for introducing delays
   * 
   * @param ms - Milliseconds to sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current request rate information
   * 
   * Returns the current number of requests in the last 60 seconds
   * and the configured limit.
   * 
   * @returns Object with current request count and limit
   */
  getRequestRate(): { current: number; limit: number } {
    this.cleanTimestamps();
    return {
      current: this.requestTimestamps.length,
      limit: this.config.requestsPerMinute,
    };
  }
}

/**
 * Singleton rate limiter instance configured for Azure OpenAI
 * 
 * Configured with:
 * - 50 requests per minute (Azure OpenAI default limit)
 * - 1.2 second minimum interval between requests (1200ms)
 */
export const azureOpenAIRateLimiter = new RateLimiter({
  requestsPerMinute: 50,
  minIntervalMs: 1200,
});
