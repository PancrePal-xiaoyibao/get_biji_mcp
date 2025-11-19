#!/usr/bin/env node

/**
 * Get笔记 MCP Server
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { getConfig } from './config.js';
import { GetBijiClient } from './client.js';
import { logger } from './logger.js';
import type { ChatMessage } from './types.js';

// 初始化配置和客户端
const config = getConfig();
const client = new GetBijiClient(config);

// 创建 MCP 服务器
const server = new Server(
  {
    name: 'get-biji-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 定义工具
const tools: Tool[] = [
  {
    name: 'knowledge_search',
    description: '在Get笔记知识库中进行AI增强搜索,返回经过深度处理的答案。支持对话历史追问。',
    inputSchema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          description: '要搜索的问题',
        },
        topic_ids: {
          type: 'array',
          items: { type: 'string' },
          description: '知识库ID列表(当前只支持1个)。如果配置了GET_BIJI_DEFAULT_TOPIC_ID环境变量,可省略此参数',
        },
        deep_seek: {
          type: 'boolean',
          description: '是否启用深度思考',
          default: true,
        },
        refs: {
          type: 'boolean',
          description: '是否返回引用来源',
          default: false,
        },
        history: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              content: { type: 'string' },
              role: { type: 'string', enum: ['user', 'assistant'] },
            },
            required: ['content', 'role'],
          },
          description: '对话历史,用于追问场景',
        },
      },
      required: ['question', 'deep_seek'],
    },
  },
  {
    name: 'knowledge_recall',
    description: '在Get笔记知识库中召回相关内容,返回未经AI处理的原始结果。可用于快速查找和预览。',
    inputSchema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          description: '要搜索的问题',
        },
        topic_id: {
          type: 'string',
          description: '知识库ID(单个)',
        },
        topic_ids: {
          type: 'array',
          items: { type: 'string' },
          description: '知识库ID列表(当前只支持1个)。注意:topic_id和topic_ids可都不提供,如果配置了GET_BIJI_DEFAULT_TOPIC_ID环境变量。优先使用topic_id',
        },
        top_k: {
          type: 'number',
          description: '返回相似度最高的N个结果',
          default: 10,
        },
        intent_rewrite: {
          type: 'boolean',
          description: '是否进行问题意图重写',
          default: false,
        },
        select_matrix: {
          type: 'boolean',
          description: '是否对结果进行重选',
          default: false,
        },
        history: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              content: { type: 'string' },
              role: { type: 'string', enum: ['user', 'assistant'] },
            },
            required: ['content', 'role'],
          },
          description: '对话历史,用于追问场景',
        },
      },
      required: ['question'],
    },
  },
  {
    name: 'get_rate_limit_stats',
    description: '获取当前API速率限制使用情况统计',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// 处理工具列表请求
server.setRequestHandler(ListToolsRequestSchema, async () => {
  logger.debug('Listing tools');
  return { tools };
});

// 处理工具调用请求
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  logger.info(`Tool called: ${name}`, args);

  try {
    switch (name) {
      case 'knowledge_search': {
        const { question, topic_ids, deep_seek, refs, history } = args as {
          question: string;
          topic_ids?: string[];
          deep_seek: boolean;
          refs?: boolean;
          history?: ChatMessage[];
        };

        const result = await client.knowledgeSearch({
          question,
          topic_ids,
          deep_seek,
          refs,
          history,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'knowledge_recall': {
        const { question, topic_id, topic_ids, top_k, intent_rewrite, select_matrix, history } = args as {
          question: string;
          topic_id?: string;
          topic_ids?: string[];
          top_k?: number;
          intent_rewrite?: boolean;
          select_matrix?: boolean;
          history?: ChatMessage[];
        };

        const result = await client.knowledgeRecall({
          question,
          topic_id,
          topic_ids,
          top_k,
          intent_rewrite,
          select_matrix,
          history,
        });

        // 格式化输出
        const formattedResults = result.c.data.map((item, index) => ({
          index: index + 1,
          title: item.title || '无标题',
          content: item.content.substring(0, 500) + (item.content.length > 500 ? '...' : ''),
          score: item.score.toFixed(4),
          type: item.type,
          source: item.recall_source,
        }));

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                total: result.c.data.length,
                results: formattedResults,
              }, null, 2),
            },
          ],
        };
      }

      case 'get_rate_limit_stats': {
        const stats = client.getRateLimitStats();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(stats, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    logger.error(`Tool execution failed: ${name}`, error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// 启动服务器
async function main() {
  logger.info('Starting Get笔记 MCP Server...');
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  logger.info('Get笔记 MCP Server is running');
}

main().catch((error) => {
  logger.error('Server failed to start', error);
  process.exit(1);
});
