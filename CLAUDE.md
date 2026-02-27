# Traction — From Built to Traction in 30 Days

## 产品定位

给技术型 solo founder 的 GTM 教练：输入产品描述 → 生成个性化 30 天 GTM Playbook。

不是又一个营销工具，是告诉你每天做什么、怎么做、用什么模板的执行系统。

## 目标用户

- 技术型 solo founder / indie hacker
- 能写代码但不会营销获客
- 预算 $0-50/月
- 目前用 ChatGPT + Notion 拼凑 GTM 策略

## 核心功能（MVP）

1. **Playbook 生成**：输入产品描述 → AI 生成 30 天 GTM Playbook
   - Week 1-4 每日行动清单
   - 每步附可用模板（Show HN、Reddit、冷邮件、Twitter）
   - 渠道推荐（根据产品类型匹配）
   - 竞品快照（搜 3-5 个竞品 + 定价 + 差距）
2. **导出**：PDF / Markdown / Notion
3. **模板库**：预置高转化模板

**MVP 不做**：执行追踪、自动发布、协作、CRM

## 技术栈

- **Frontend**: Astro 5 (SSR) + React islands + Tailwind CSS 4
- **Backend**: Astro API routes (Node.js) + @astrojs/node
- **LLM**: @yuyuqueen/resilient-llm + @yuyuqueen/prompt-assembler
- **DB + Auth**: Supabase (PostgreSQL + Auth)
- **Payment**: Stripe (Checkout Sessions)
- **Deploy**: Vercel

## 收费模式

| 层级 | 价格 | 内容 |
|------|------|------|
| Free | $0 | 1 个 playbook（预览版，不含模板） |
| Pro | $19/月 | 无限 playbook + 全部模板 + 导出 |
| Lifetime | $49 | 同 Pro，终身 |

## 项目结构

```
src/
├── pages/           # Astro 页面
│   ├── index.astro  # Landing page
│   ├── app.astro    # 应用主页（需登录）
│   └── api/         # API routes
├── layouts/         # 布局组件
├── components/      # React 组件（交互式）
├── styles/          # 全局样式
└── lib/             # 工具函数、LLM pipeline、Supabase client
```

## 验证标准（2 周）

- >100 独立访客
- >10 个 playbook 被生成
- >1 个付费用户
- 无信号 → DECISIONS.md 记录 → 切 #3 Side Project Emergency Kit

## 设计

设计方向见 `DESIGN.md`。遵循 `toolkit/design-system/CLAUDE.md` 方法论。
