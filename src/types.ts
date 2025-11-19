/**
 * Get笔记 API 类型定义
 */

// 知识库搜索请求参数
export interface KnowledgeSearchRequest {
  question: string;
  topic_ids?: string[];  // 可选,如果配置了defaultTopicId
  deep_seek: boolean;
  refs?: boolean;
  history?: ChatMessage[];
}

// 聊天消息
export interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
}

// 知识库搜索响应 (Stream模式)
export interface KnowledgeSearchStreamResponse {
  code: number;
  data: {
    msg: string;
    ref_list?: ReferenceItem[];
  };
  msg_type: number;
  retry: number;
}

// 引用项
export interface ReferenceItem {
  note_id: string;
  rag_type: 'blogger' | 'note' | 'file';
  title: string;
  detail: ReferenceDetail[];
}

// 引用详情
export interface ReferenceDetail {
  note_id: string;
  title: string;
  content: string;
  chunk_id?: string;
}

// 知识库召回请求参数
// 注意: topic_id 和 topic_ids 必须有一个不为空，优先使用 topic_id
export interface KnowledgeRecallRequest {
  question: string;
  topic_id?: string;        // 单个知识库ID，优先使用
  topic_ids?: string[];     // 知识库ID列表（当前只支持1个）
  top_k?: number;
  intent_rewrite?: boolean;
  select_matrix?: boolean;
  history?: ChatMessage[];
}

// 知识库召回响应
export interface KnowledgeRecallResponse {
  h: {
    c: number;
    e: string;
    s: number;
    t: number;
    apm: string;
  };
  c: {
    data: RecallItem[];
  };
}

// 召回项
export interface RecallItem {
  id: string;
  title: string;
  content: string;
  score: number;
  type: 'FILE' | 'NOTE' | 'BLOGGER';
  recall_source: 'embedding' | 'keyword';
}

// API 配置
export interface GetBijiConfig {
  apiKey: string;
  baseURL: string;
  timeout: number;
  rateLimitQPS: number;
  rateLimitDaily: number;
  defaultTopicId?: string;  // 默认知识库ID
}

// 错误响应
export interface ErrorResponse {
  h: {
    c: number;
    e: string;
  };
}
