/**
 * Get笔记 API 客户端
 */

import axios, { AxiosInstance } from 'axios';
import type {
  GetBijiConfig,
  KnowledgeSearchRequest,
  KnowledgeRecallRequest,
  KnowledgeRecallResponse,
} from './types.js';
import { logger } from './logger.js';
import { RateLimiter } from './rate-limiter.js';

export class GetBijiClient {
  private client: AxiosInstance;
  private rateLimiter: RateLimiter;
  private config: GetBijiConfig;

  constructor(config: GetBijiConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'keep-alive',
        'Authorization': `Bearer ${config.apiKey}`,
        'X-OAuth-Version': '1',
      },
    });

    this.rateLimiter = new RateLimiter(config.rateLimitQPS, config.rateLimitDaily);

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Request interceptor error', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`API Response: ${response.status}`, {
          url: response.config.url,
          status: response.status,
        });
        return response;
      },
      (error) => {
        logger.error('API Error', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * 知识库搜索 (非流式)
   */
  async knowledgeSearch(params: KnowledgeSearchRequest): Promise<any> {
    await this.rateLimiter.waitForSlot();

    // 如果没有提供topic_ids且配置了默认topic_id,则使用默认值
    if (!params.topic_ids || params.topic_ids.length === 0) {
      if (this.config.defaultTopicId) {
        params.topic_ids = [this.config.defaultTopicId];
        logger.debug('Using default topic_id', { topic_id: this.config.defaultTopicId });
      } else {
        throw new Error('topic_ids is required or set GET_BIJI_DEFAULT_TOPIC_ID in environment');
      }
    }

    try {
      const response = await this.client.post('/knowledge/search', params);
      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.h?.e || error.message;
      const statusCode = error.response?.status;
      
      logger.error('Knowledge search failed', { 
        error: errorMsg, 
        statusCode,
        params: { ...params, topic_ids: params.topic_ids },
        responseData: error.response?.data 
      });
      
      if (statusCode === 403) {
        throw new Error(`Knowledge search failed: Authentication error (403). Please check your GET_BIJI_API_KEY is valid.`);
      }
      
      throw new Error(`Knowledge search failed: ${errorMsg}`);
    }
  }

  /**
   * 知识库召回
   * 注意: topic_id 和 topic_ids 必须有一个不为空，优先使用 topic_id
   */
  async knowledgeRecall(params: KnowledgeRecallRequest): Promise<KnowledgeRecallResponse> {
    await this.rateLimiter.waitForSlot();

    // 如果没有提供topic_id和topic_ids,但配置了默认topic_id,则使用默认值
    if (!params.topic_id && (!params.topic_ids || params.topic_ids.length === 0)) {
      if (this.config.defaultTopicId) {
        params.topic_id = this.config.defaultTopicId;
      } else {
        throw new Error('topic_id or topic_ids is required, or set GET_BIJI_DEFAULT_TOPIC_ID in environment');
      }
    }

    try {
      const response = await this.client.post<KnowledgeRecallResponse>(
        '/knowledge/search/recall',
        params
      );
      
      if (response.data.h.c !== 0) {
        throw new Error(response.data.h.e || 'Unknown error');
      }

      return response.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.h?.e || error.message;
      logger.error('Knowledge recall failed', { error: errorMsg, params });
      throw new Error(`Knowledge recall failed: ${errorMsg}`);
    }
  }

  /**
   * 获取速率限制统计
   */
  getRateLimitStats() {
    return this.rateLimiter.getStats();
  }
}
