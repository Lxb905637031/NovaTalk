# NovaTalk

AI 对话助手，基于 Electron + React + TypeScript 构建。

## 功能特性

- 💬 **多模型支持** - 支持 OpenAI API 兼容的多种 AI 模型
- 🎨 **多主题切换** - 浅色、深色、紫色主题
- 🌐 **国际化** - 支持中文和英文
- 💾 **对话管理** - 支持多会话切换，自动保存对话历史
- ⚡ **流式响应** - 支持 AI 回答的流式输出

## 技术栈

- **框架**: Electron + React 19 + TypeScript
- **构建工具**: Vite + electron-forge
- **状态管理**: Zustand
- **UI 组件**: Radix UI + TailwindCSS
- **国际化**: i18next + react-i18next
- **样式**: Tailwind CSS v4
- **AI SDK**: OpenAI JavaScript SDK

## 项目结构

```
src/
├── main/                    # Electron 主进程
│   ├── main.ts             # 主进程入口
│   └── preload.ts          # 预加载脚本
├── renderer/               # 渲染进程
│   ├── api/                # API 调用
│   │   └── openai.ts       # OpenAI API 封装
│   ├── components/         # UI 组件
│   │   └── ui/             # 基础 UI 组件
│   ├── hooks/              # 自定义 Hooks
│   │   └── useChatInput.ts # 聊天输入状态管理
│   ├── lib/                # 工具函数
│   │   ├── theme.ts        # 主题切换
│   │   └── utils.ts         # 通用工具
│   ├── locales/            # 国际化资源
│   │   ├── zh.ts           # 中文
│   │   └── en.ts           # 英文
│   ├── main/               # 主窗口
│   │   ├── components/
│   │   │   ├── ChatArea.tsx   # 聊天区域
│   │   │   └── Sidebar.tsx    # 侧边栏
│   │   └── App.tsx
│   ├── settings/           # 设置窗口
│   │   └── App.tsx
│   ├── store/              # 状态管理
│   │   └── useSettingsStore.ts
│   └── types/              # 类型定义
├── shared/                 # 共享配置
└── assets/                 # 静态资源
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm start
```

### 构建应用

```bash
npm run make
```

## 使用说明

### 添加 AI 模型

1. 点击侧边栏底部的设置图标
2. 在设置页面添加 API Key 和 API 地址
3. 选择并启用需要的模型

### 切换主题

1. 打开设置
2. 选择喜欢的主题：浅色 / 深色 / 紫色

### 切换语言

1. 打开设置
2. 选择语言：中文 / English

## 配置说明

### API 配置

在设置中添加 OpenAI API 兼容的服务：

```typescript
{
  apiKey: 'your-api-key',
  apiBaseUrl: 'https://api.openai.com/v1',  // 或其他兼容 API 地址
  models: ['gpt-4', 'gpt-3.5-turbo']
}
```

### 支持的 API

- OpenAI API
- 任何 OpenAI API 兼容的第三方服务（如 Groq、Cloudflare 等）

## 开发指南

### 添加新的 Hook

1. 在 `src/renderer/hooks/` 目录下创建新的 Hook 文件
2. 在 `src/renderer/hooks/index.ts` 中导出

```typescript
// src/renderer/hooks/useNewHook.ts
export function useNewHook() {
  // ...
}
```

```typescript
// src/renderer/hooks/index.ts
export { useNewHook } from './useNewHook'
```

### 添加新的 UI 组件

1. 在 `src/renderer/components/ui/` 目录下创建组件
2. 使用 Radix UI 作为基础组件
3. 使用 TailwindCSS 进行样式设计

## License

MIT
