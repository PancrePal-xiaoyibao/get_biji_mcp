/**
 * 配置管理
 */

import dotenv from 'dotenv';
import { GetBijiConfig } from './types.js';
import { logger } from './logger.js';

// 加载环境变量
dotenv.config();

/**
 * 获取配置
 */
export function getConfig(): GetBijiConfig {
  const apiKey = process.env.GET_BIJI_API_KEY;
  
  if (!apiKey) {
    logger.error('GET_BIJI_API_KEY is required in environment variables');
    throw new Error('GET_BIJI_API_KEY is required. Please set it in .env file');
  }

  const config: GetBijiConfig = {
    apiKey,
    baseURL: process.env.GET_BIJI_API_BASE_URL || 'https://open-api.biji.com/getnote/openapi',
    timeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10),
    rateLimitQPS: parseInt(process.env.RATE_LIMIT_QPS || '2', 10),
    rateLimitDaily: parseInt(process.env.RATE_LIMIT_DAILY || '5000', 10),
    defaultTopicId: process.env.GET_BIJI_DEFAULT_TOPIC_ID,
  };

  logger.debug('Configuration loaded', {
    baseURL: config.baseURL,
    timeout: config.timeout,
    rateLimitQPS: config.rateLimitQPS,
    rateLimitDaily: config.rateLimitDaily,
    hasDefaultTopicId: !!config.defaultTopicId,
  });

  return config;
}
