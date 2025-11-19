# Get笔记 MCP Server

[English](#english) | [中文](#chinese)

---

<a name="english"></a>
## English

### Overview
A Model Context Protocol (MCP) server for integrating with Get笔记 (GetBiji) API, enabling AI-powered knowledge base search and retrieval capabilities.

### Features
- ✅ MCP server framework with stdio transport
- ✅ Get笔记 API client with Bearer token authentication
- ✅ Rate limiting (2 QPS, 5000 requests/day)
- ✅ Comprehensive error handling and logging
- ✅ TypeScript with full type safety
- ✅ Three MCP tools:
  - `knowledge_search`: AI-enhanced knowledge base search
  - `knowledge_recall`: Raw content retrieval
  - `get_rate_limit_stats`: Rate limit statistics

### Installation

**Option 1: Install globally (recommended for frequent use)**
```bash
npm install -g mcp-get-biji-server
```

**Option 2: Use with npx (no installation required)**
```bash
npx mcp-get-biji-server
```

**Option 3: Install as project dependency**
```bash
npm install mcp-get-biji-server
```

### Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` and add your API key:
```env
GET_BIJI_API_KEY=your_api_key_here
GET_BIJI_API_BASE_URL=https://open-api.biji.com/getnote/openapi
LOG_LEVEL=info
REQUEST_TIMEOUT=30000
RATE_LIMIT_QPS=2
RATE_LIMIT_DAILY=5000
```

### Usage with Claude Desktop

Edit your Claude Desktop config file (`~/Library/Application Support/Claude/claude_desktop_config.json`):

**Using global installation:**
```json
{
  "mcpServers": {
    "get-biji": {
      "command": "mcp-get-biji-server",
      "env": {
        "GET_BIJI_API_KEY": "your_api_key_here",
        "GET_BIJI_DEFAULT_TOPIC_ID": "your_default_topic_id"
      }
    }
  }
}
```

**Using npx:**
```json
{
  "mcpServers": {
    "get-biji": {
      "command": "npx",
      "args": ["-y", "mcp-get-biji-server"],
      "env": {
        "GET_BIJI_API_KEY": "your_api_key_here",
        "GET_BIJI_DEFAULT_TOPIC_ID": "your_default_topic_id"
      }
    }
  }
}
```

**Using local installation:**
```json
{
  "mcpServers": {
    "get-biji": {
      "command": "node",
      "args": ["/path/to/node_modules/mcp-get-biji-server/build/index.js"],
      "env": {
        "GET_BIJI_API_KEY": "your_api_key_here",
        "GET_BIJI_DEFAULT_TOPIC_ID": "your_default_topic_id"
      }
    }
  }
}
```

Restart Claude Desktop to activate the server.

### MCP Tools

#### 1. knowledge_search
AI-enhanced search with deep processing.

**Parameters:**
- `question` (required): Search query
- `topic_ids` (required): Knowledge base ID list (currently supports 1)
- `deep_seek` (required): Enable deep thinking
- `refs` (optional): Include references
- `history` (optional): Conversation history for follow-up

#### 2. knowledge_recall
Fast retrieval of raw content without AI processing.

**Parameters:**
- `question` (required): Search query
- `topic_id` (optional): Single knowledge base ID (preferred)
- `topic_ids` (optional): Knowledge base ID list
- `top_k` (optional): Number of top results (default: 10)
- `intent_rewrite` (optional): Enable intent rewriting
- `select_matrix` (optional): Enable result re-selection
- `history` (optional): Conversation history

**Note:** Either `topic_id` or `topic_ids` must be provided. `topic_id` takes priority.

#### 3. get_rate_limit_stats
Get current API rate limit usage statistics.

### Development

```bash
npm run build        # Compile TypeScript
npm run watch        # Watch mode compilation
npm run dev          # Build and run
npm test             # Run tests
npm start            # Run (must build first)
```

### API Rate Limits
- QPS: 2 requests/second
- Daily: 5000 requests/day

The server automatically handles rate limiting with intelligent queuing.

### Project Structure
```
.
├── src/                  # Source code
│   ├── index.ts         # MCP server entry
│   ├── client.ts        # API client
│   ├── config.ts        # Configuration
│   ├── logger.ts        # Logging system
│   ├── rate-limiter.ts  # Rate limiter
│   ├── types.ts         # Type definitions
│   └── test.ts          # Test script
├── build/               # Compiled output
├── .env                 # Environment variables
└── package.json         # Project config
```

### Tech Stack
- Node.js (ES Modules)
- TypeScript
- @modelcontextprotocol/sdk
- Axios
- dotenv

### License
MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

Speical thanks to the contribution & development of [Xiaoyibao-Pancrepal](www.xiaoyibao.com.cn) & [xiao-x-bao community](https://info.xiao-x-bao.com.cn) to support cancer/rare disease patients and their families with ❤️ & AI！

---

<a name="chinese"></a>
## 中文

### 项目概述
一个用于集成Get笔记API的Model Context Protocol (MCP)服务器,实现AI增强的知识库搜索和召回功能。

### 功能特性
- ✅ 基于stdio传输的MCP服务器框架
- ✅ 支持Bearer Token认证的Get笔记API客户端
- ✅ 速率限制 (2 QPS, 5000次/天)
- ✅ 完善的错误处理和日志记录
- ✅ TypeScript完整类型安全
- ✅ 三个MCP工具:
  - `knowledge_search`: AI增强知识库搜索
  - `knowledge_recall`: 原始内容召回
  - `get_rate_limit_stats`: 速率限制统计

### 安装

**方式1: 全局安装 (推荐常用场景)**
```bash
npm install -g mcp-get-biji-server
```

**方式2: 使用 npx (无需安装)**
```bash
npx mcp-get-biji-server
```

**方式3: 作为项目依赖安装**
```bash
npm install mcp-get-biji-server
```

### 配置

1. 复制环境变量模板:
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件,添加您的API密钥:
```env
GET_BIJI_API_KEY=your_api_key_here
GET_BIJI_API_BASE_URL=https://open-api.biji.com/getnote/openapi
LOG_LEVEL=info
REQUEST_TIMEOUT=30000
RATE_LIMIT_QPS=2
RATE_LIMIT_DAILY=5000
```

### 在Claude Desktop中使用

编辑Claude Desktop配置文件 (`~/Library/Application Support/Claude/claude_desktop_config.json`):

**使用全局安装:**
```json
{
  "mcpServers": {
    "get-biji": {
      "command": "mcp-get-biji-server",
      "env": {
        "GET_BIJI_API_KEY": "your_api_key_here",
        "GET_BIJI_DEFAULT_TOPIC_ID": "your_default_topic_id"
      }
    }
  }
}
```

**使用 npx:**
```json
{
  "mcpServers": {
    "get-biji": {
      "command": "npx",
      "args": ["-y", "mcp-get-biji-server"],
      "env": {
        "GET_BIJI_API_KEY": "your_api_key_here",
        "GET_BIJI_DEFAULT_TOPIC_ID": "your_default_topic_id"
      }
    }
  }
}
```

**使用本地安装:**
```json
{
  "mcpServers": {
    "get-biji": {
      "command": "node",
      "args": ["/path/to/node_modules/mcp-get-biji-server/build/index.js"],
      "env": {
        "GET_BIJI_API_KEY": "your_api_key_here",
        "GET_BIJI_DEFAULT_TOPIC_ID": "your_default_topic_id"
      }
    }
  }
}
```

重启Claude Desktop以激活服务器。

### MCP工具说明

#### 1. knowledge_search
AI增强搜索,返回经过深度处理的答案。

**参数:**
- `question` (必填): 搜索问题
- `topic_ids` (必填): 知识库ID列表(当前只支持1个)
- `deep_seek` (必填): 启用深度思考
- `refs` (可选): 返回引用来源
- `history` (可选): 对话历史,用于追问

#### 2. knowledge_recall
快速召回原始内容,不经过AI处理。

**参数:**
- `question` (必填): 搜索问题
- `topic_id` (可选): 单个知识库ID(优先使用)
- `topic_ids` (可选): 知识库ID列表
- `top_k` (可选): 返回前N个结果(默认:10)
- `intent_rewrite` (可选): 启用意图重写
- `select_matrix` (可选): 启用结果重选
- `history` (可选): 对话历史

**注意:** `topic_id` 和 `topic_ids` 必须提供一个,优先使用 `topic_id`。

#### 3. get_rate_limit_stats
获取当前API速率限制使用统计。

### 开发命令

```bash
npm run build        # 编译TypeScript代码
npm run watch        # 监听模式编译
npm run dev          # 编译并运行
npm test             # 运行测试
npm start            # 直接运行(需先编译)
```

### API限制
- QPS限制: 2次/秒
- 日限制: 5000次/天

服务器内置智能排队的速率限制器,自动处理这些限制。

### 项目结构
```
.
├── src/                  # 源代码目录
│   ├── index.ts         # MCP服务器入口
│   ├── client.ts        # API客户端
│   ├── config.ts        # 配置管理
│   ├── logger.ts        # 日志系统
│   ├── rate-limiter.ts  # 速率限制器
│   ├── types.ts         # TypeScript类型定义
│   └── test.ts          # 测试脚本
├── build/               # 编译输出目录
├── .env                 # 环境变量配置
└── package.json         # 项目配置文件
```

### 技术栈
- Node.js (ES模块)
- TypeScript
- @modelcontextprotocol/sdk
- Axios
- dotenv

### 许可证
MIT

## 贡献

欢迎贡献！请提交 issue 或 pull request。

特别感谢[小胰宝](www.xiaoyibao.com.cn)和 [小x宝社区](https://info.xiao-x-bao.com.cn)的贡献与付出，用爱心与人工智能为癌症/罕见病患者及其家庭提供支持！