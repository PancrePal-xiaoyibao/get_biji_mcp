# Get笔记 MCP Server 快速设置指南

## 项目概述
这是一个Model Context Protocol (MCP)服务器,用于集成Get笔记API,实现知识库的搜索和召回功能。

## 已完成的功能
✅ 项目初始化和依赖安装
✅ MCP服务器基础框架
✅ 配置文件管理
✅ 日志系统实现
✅ Get笔记API客户端封装
✅ Bearer Token认证机制
✅ 速率限制器 (2 QPS, 5000次/天)
✅ 错误处理机制
✅ 两个核心MCP工具:
  - knowledge_search: AI增强搜索
  - knowledge_recall: 原始内容召回
  - get_rate_limit_stats: 速率限制统计

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制 `.env.example` 为 `.env` 并填入您的API密钥:
```bash
cp .env.example .env
```

编辑 `.env` 文件:
```env
GET_BIJI_API_KEY=your_actual_api_key_here
GET_BIJI_API_BASE_URL=https://open-api.biji.com/getnote/openapi
LOG_LEVEL=info
REQUEST_TIMEOUT=30000
RATE_LIMIT_QPS=2
RATE_LIMIT_DAILY=5000
```

### 3. 编译项目
```bash
npm run build
```

### 4. 运行测试
```bash
npm test
```

### 5. 在Claude Desktop中配置

编辑Claude Desktop配置文件 (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "get-biji": {
      "command": "node",
      "args": ["/Users/qinxiaoqiang/Downloads/get_biji_qcoder/build/index.js"],
      "env": {
        "GET_BIJI_API_KEY": "your_actual_api_key_here"
      }
    }
  }
}
```

重启Claude Desktop后即可使用。

## MCP工具说明

### 1. knowledge_search
在知识库中进行AI增强搜索,返回经过深度处理的答案。

参数:
- `question` (必填): 要搜索的问题
- `topic_ids` (必填): 知识库ID列表
- `deep_seek` (必填): 是否启用深度思考
- `refs` (可选): 是否返回引用来源
- `history` (可选): 对话历史,用于追问

### 2. knowledge_recall
召回知识库相关内容,返回未经AI处理的原始结果。

参数:
- `question` (必填): 要搜索的问题
- `topic_ids` (必填): 知识库ID列表
- `top_k` (可选): 返回相似度最高的N个结果 (默认10)
- `intent_rewrite` (可选): 是否进行问题意图重写
- `select_matrix` (可选): 是否对结果进行重选
- `history` (可选): 对话历史

### 3. get_rate_limit_stats
获取当前API速率限制使用情况统计。

## 项目结构
```
.
├── src/                  # 源代码目录
│   ├── index.ts         # MCP服务器主入口
│   ├── client.ts        # Get笔记API客户端
│   ├── config.ts        # 配置管理
│   ├── logger.ts        # 日志系统
│   ├── rate-limiter.ts  # 速率限制器
│   ├── types.ts         # TypeScript类型定义
│   └── test.ts          # 测试脚本
├── build/               # 编译输出目录
├── .env.example         # 环境变量示例
├── package.json         # 项目配置
└── tsconfig.json        # TypeScript配置
```

## API限制
- QPS限制: 2次/秒
- 日限制: 5000次/天

服务器内置速率限制器会自动处理这些限制。

## 开发命令
```bash
npm run build        # 编译TypeScript代码
npm run watch        # 监听模式编译
npm run dev          # 编译并运行
npm test             # 运行测试
npm start            # 直接运行(需先编译)
```

## 日志级别
可通过环境变量 `LOG_LEVEL` 设置:
- `debug`: 详细调试信息
- `info`: 一般信息 (默认)
- `warn`: 警告信息
- `error`: 仅错误信息

## 故障排查

### 问题: API密钥错误
确保 `.env` 文件中的 `GET_BIJI_API_KEY` 已正确设置。

### 问题: 速率限制超出
检查日志输出,服务器会自动等待直到允许下一次请求。
每天限制5000次调用,超出后需要等到第二天重置。

### 问题: 编译错误
确保已安装所有依赖: `npm install`

## 技术栈
- Node.js (ES Modules)
- TypeScript
- @modelcontextprotocol/sdk
- Axios (HTTP客户端)
- dotenv (环境变量管理)

## 下一步开发建议
参考 `plan.md` 中的开发阶段计划:
- 第四阶段: 完善单元测试和集成测试
- 第五阶段: 性能优化和部署配置
