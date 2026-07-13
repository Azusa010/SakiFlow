# SakiFlow

SakiFlow 是一个基于 Vue 3 与 TypeScript 构建的 AI 智能工作流前端平台，集成工作流管理、AI 对话、文件处理、在线代码编辑、数据统计与个性化设置等功能。

> 当前版本为前端演示项目。AI 回复、文件分析、代码解释与代码优化通过本地 Mock 模拟；真实模型调用、SSE 流式响应和服务端文件解析需要接入后端服务。

## 功能特性

### 工作台

- 核心数据、最近工作流与快捷入口
- 使用趋势可视化

### 工作流管理

- 工作流创建、编辑和删除
- 分类、收藏与关键字防抖搜索
- 本地状态持久化

### AI 对话

- 多会话创建、切换和删除
- 模拟流式回复与历史记录持久化
- Markdown 渲染、代码高亮与内容安全过滤
- 消息复制与重新生成

### 文件中心

- 拖拽或点击上传文件
- 支持 PDF、Markdown、TXT、DOC 和 DOCX
- 文件状态、预览与模拟 AI 分析

### AI 编辑器

- 基于 Monaco Editor，支持 TypeScript、JavaScript 和 Vue
- 代码格式化、模拟 AI 解释与优化
- 编辑器主题跟随应用主题

### 数据统计与系统设置

- AI 调用量、Token 使用量和使用趋势展示
- 明亮、暗黑与跟随系统主题
- 模型、API Key、用户偏好和本地数据导出

## 技术栈

| 技术 | 用途 |
| --- | --- |
| Vue 3、TypeScript、Vite | 应用开发与构建 |
| Vue Router、Pinia、VueUse | 路由、状态与组合式工具 |
| Naive UI | UI 组件库 |
| Axios | HTTP 请求封装 |
| Monaco Editor | 在线代码编辑器 |
| ECharts | 数据可视化 |
| Markdown It、Highlight.js、DOMPurify | Markdown、代码高亮与安全过滤 |
| Vitest、Playwright | 单元测试与端到端测试 |

## 项目结构

```text
SakiFlow/
├── e2e/                    # Playwright 端到端测试
├── public/                 # 公共静态资源
├── src/
│   ├── api/                # HTTP 请求基础设施
│   ├── assets/             # 全局样式与静态资源
│   ├── components/         # 可复用业务组件
│   ├── composables/        # 组合式逻辑
│   ├── layouts/            # 应用布局
│   ├── route/              # 路由配置与访问守卫
│   ├── stores/             # Pinia 状态模块
│   ├── views/              # 页面组件
│   ├── App.vue             # 根组件
│   └── main.ts             # 应用入口
├── package.json
└── vite.config.ts
```

## 环境要求

- Node.js `^22.18.0` 或 `>=24.12.0`
- npm

## 快速开始

```sh
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

生产构建产物位于 `dist/` 目录。

## 测试与代码质量

```sh
# 单元测试
npm run test:unit

# 首次运行端到端测试前安装浏览器
npx playwright install

# Chromium、Firefox 和 WebKit 端到端测试
npm run test:e2e

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 后端接入

项目在 `src/api/http.ts` 中提供 Axios 请求实例。后端地址可通过环境变量配置：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

接入后端时，建议按照业务模块在 `src/api/` 中拆分接口，并由对应的 Pinia Store 管理请求状态和业务数据。

当前需要后端支持的能力包括：

- 用户身份认证与账户数据存储
- 真实大语言模型调用及 SSE 流式响应
- 服务端文件上传、解析与持久化
- 统计数据聚合与持久化

## 构建说明

Monaco Editor 会生成独立的编辑器与语言 Worker 分包。生产构建可能出现部分分包超过默认 500 kB 阈值的提示，该提示不会导致构建失败；编辑器页面已通过路由懒加载按需加载。

## 当前状态

- TypeScript 类型检查、Vitest 单元测试和 Vite 生产构建通过
- Playwright Chromium、Firefox 和 WebKit 测试通过
- 前端核心功能和主要交互流程已完成
- 真实 AI、认证和文件服务等待后端接口接入
