# 🎯 ShuaShuaShua - 在线刷题平台

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://mit-license.org/)
[![React](https://img.shields.io/badge/react-19.2.1-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.2-blue.svg)](https://www.typescriptlang.org/)

一个在线刷题平台，支持动态题目管理、多种答题模式和实时成绩统计。采用 **React + TypeScript + Supabase** 架构，所有题目数据存储在云数据库。

## AI 声明
本项目部分代码/文档由 AI 工具 Google Ai Studio 辅助生成，所有内容已通过人工审核，核心逻辑由人工开发，遵循 MIT 许可证。

## ✨ 核心功能

### 📚 题目管理
- ✅ **后台题目创建**：支持单选题和多选题
- ✅ **动态类别管理**：创建、编辑、删除题目类别
- ✅ **云端数据存储**：所有数据持久化到 Supabase 数据库
- ✅ **题目批量操作**：支持批量删除和查看

### 🎯 答题模式
- ✅ **顺序/随机模式**：按顺序或随机抽取题目
- ✅ **单选/多选支持**：完全支持单选题和多选题
- ✅ **题型筛选**：可只刷单选题、只刷多选题或混合模式
- ✅ **实时反馈**：答题后即时显示正确答案和解析

### 📊 成绩统计
- ✅ **实时评分**：即时计算答题成绩和正确率
- ✅ **详细反馈**：显示每题的正确答案和用户选择
- ✅ **完整统计**：答题完成后显示综合成绩

## 🚀 快速开始

### 前置要求
- Node.js 18+
- npm 或 yarn
- Supabase 账户

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/C1ouDreamW/ShuaShuaShua.git
cd ShuaShuaShua
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**

创建 `.env.local` 文件，填入你的 Supabase 凭证：
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
另外加入管理员密码用于删除题库：
```
VITE_ADMIN_PASSWORD=admin123
```

4. **初始化数据库**

在 Supabase SQL Editor 中执行 `SUPABASE_SETUP.sql` 文件中的所有 SQL 语句。

5. **启动开发服务器**
```bash
npm run dev
```

访问 `http://localhost:{给你分配的端口}` 开始使用

## 📖 使用指南

### 创建题目类别

1. 打开后台管理界面（`/admin`）
2. 点击"新增类别"标签页
3. 填写类别名称、选择图标和颜色
4. 点击"保存类别"

### 创建题目

#### 单选题
1. 点击"增加新题目"标签页
2. 选择题目类型：○ 单选
3. 填写题目文本和选项
4. 用单选按钮选择唯一正确答案
5. 点击"保存题目"

#### 多选题
1. 点击"增加新题目"标签页
2. 选择题目类型：○ 多选
3. 填写题目文本和选项
4. 用复选框选择所有正确答案（可多个）
5. 点击"保存题目"

### 开始练习

1. 首页选择要练习的类别
2. 配置练习参数：
   - 刷题模式（顺序/随机）
   - 题目数量
   - 题目类型（全部/仅单选/仅多选）
3. 点击"开始练习"
4. 答题完成后查看成绩

## 🏗️ 项目结构

```
ShuaShuaShua/
├── pages/
│   ├── Home.tsx           # 首页
│   ├── Setup.tsx          # 题目配置界面
│   ├── Quiz.tsx           # 答题界面
│   └── Admin.tsx          # 后台
├── services/
│   ├── supabaseClient.ts  # Supabase 客户端
│   ├── questionService.ts # 题目 API 操作
│   └── categoryService.ts # 类别 API 操作
├── App.tsx                # 应用入口和全局状态
├── types.ts               # TypeScript 类型定义
├── utils.ts               # 工具函数
└── index.tsx              # React 渲染入口
```

## 💻 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Node | 24.11.1 | 运行环境 |
| React | 19.2.1 | UI 框架 |
| TypeScript | 5.8.2 | 类型检查 |
| Vite | 6.2.0 | 构建工具 |
| React Router | 7.10.1 | 路由管理 |
| Supabase | 2.39.3 | 后端数据库 |
| Tailwind CSS | - | 样式框架 |
| Lucide React | 0.559.0 | 图标库 |

## 🔧 配置详情

### QuestionType（题目类型）
```typescript
enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',      // 单选题
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',  // 多选题
}
```

### QuizMode（刷题模式）
```typescript
enum QuizMode {
  SEQUENTIAL = 'SEQUENTIAL',  // 顺序模式
  RANDOM = 'RANDOM'          // 随机模式
}
```

### 类别图标选项
- Cpu（芯片）、Code（代码）、Earth（地球）、Beaker（烧杯）
- BookOpen（书籍）、Lightbulb（灯泡）、Rocket（火箭）、NotepadText（笔记）

### 颜色方案（8种）
- 紫色、蓝色、琥珀色、绿色、红色、粉色、青色、靛蓝色

## 📊 数据库架构

### categories 表
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### questions 表
```sql
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_ids TEXT[] NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🔐 安全特性

- ✅ 环境变量管理敏感信息
- ✅ 管理员密码保护（删除有题目的类别需要密码）
- ✅ Supabase RLS 策略控制数据访问
- ✅ TypeScript 类型安全

## 📝 环境变量配置

| 变量 | 说明 | 示例 |
|------|------|------|
| `VITE_SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `eyJ...` |
| `VITE_ADMIN_PASSWORD` | 管理员密码 | `admin123` |

## 🎯 开发计划

- [ ] 题目搜索和筛选功能
- [ ] 题目收藏和错题本
- [ ] 用户账户系统
- [ ] 学习数据分析统计
- [ ] 移动端优化
- [ ] 题目导入导出

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 😊~

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 👨‍💻 作者

- **开发者**：C1ouDreamW
- **框架设计**： Google AI Studio 呈现

## 🙏 致谢

感谢以下开源项目的支持：
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com)
- [Lucide Icons](https://lucide.dev)

## 📞 联系方式

- GitHub Issues - 提交 bug 报告和功能建议
- Email - 联系项目维护者

