/**
 * 速率限制器
 */

import { logger } from './logger.js';

export class RateLimiter {
  private qps: number;
  private dailyLimit: number;
  private requestQueue: number[] = [];
  private dailyCount: number = 0;
  private lastResetDate: string;

  constructor(qps: number, dailyLimit: number) {
    this.qps = qps;
    this.dailyLimit = dailyLimit;
    this.lastResetDate = this.getCurrentDate();
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private resetDailyCountIfNeeded(): void {
    const currentDate = this.getCurrentDate();
    if (currentDate !== this.lastResetDate) {
      logger.info(`Resetting daily count. Previous: ${this.dailyCount}`);
      this.dailyCount = 0;
      this.lastResetDate = currentDate;
    }
  }

  private cleanOldRequests(): void {
    const now = Date.now();
    const oneSecondAgo = now - 1000;
    this.requestQueue = this.requestQueue.filter(time => time > oneSecondAgo);
  }

  async waitForSlot(): Promise<void> {
    this.resetDailyCountIfNeeded();

    // 检查日限制
    if (this.dailyCount >= this.dailyLimit) {
      const error = `Daily rate limit exceeded (${this.dailyLimit} requests/day)`;
      logger.error(error);
      throw new Error(error);
    }

    // 检查秒级限制
    this.cleanOldRequests();
    
    while (this.requestQueue.length >= this.qps) {
      const waitTime = 1000 - (Date.now() - this.requestQueue[0]);
      if (waitTime > 0) {
        logger.debug(`Rate limit: waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      this.cleanOldRequests();
    }

    this.requestQueue.push(Date.now());
    this.dailyCount++;
    
    logger.debug(`Request allowed. Daily: ${this.dailyCount}/${this.dailyLimit}, QPS: ${this.requestQueue.length}/${this.qps}`);
  }

  getStats() {
    this.resetDailyCountIfNeeded();
    return {
      dailyCount: this.dailyCount,
      dailyLimit: this.dailyLimit,
      currentQPS: this.requestQueue.length,
      maxQPS: this.qps,
    };
  }
}
