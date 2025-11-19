#!/usr/bin/env node

/**
 * 测试脚本 - 验证Get笔记API客户端
 */

import { getConfig } from './config.js';
import { GetBijiClient } from './client.js';
import { logger } from './logger.js';

async function testClient() {
  try {
    logger.info('=== Get笔记 API客户端测试 ===');
    
    // 初始化客户端
    const config = getConfig();
    const client = new GetBijiClient(config);
    
    logger.info('客户端初始化成功');
    
    // 测试速率限制统计
    const stats = client.getRateLimitStats();
    logger.info('速率限制统计:', stats);
    
    // 注意: 以下测试需要有效的API密钥和知识库ID
    // 如果要运行完整测试,请取消注释并填入实际的知识库ID
    
    /*
    // 测试知识库召回
    logger.info('测试知识库召回...');
    const recallResult = await client.knowledgeRecall({
      question: '测试问题',
      topic_ids: ['YOUR_TOPIC_ID'],
      top_k: 3,
    });
    logger.info('召回结果:', JSON.stringify(recallResult, null, 2));
    
    // 测试知识库搜索
    logger.info('测试知识库搜索...');
    const searchResult = await client.knowledgeSearch({
      question: '测试问题',
      topic_ids: ['YOUR_TOPIC_ID'],
      deep_seek: true,
      refs: false,
    });
    logger.info('搜索结果:', JSON.stringify(searchResult, null, 2));
    */
    
    logger.info('=== 测试完成 ===');
  } catch (error) {
    logger.error('测试失败:', error);
    process.exit(1);
  }
}

testClient();
