# GTM Copilot 设计规范

## 定位
- 目标用户：技术型 solo founder / indie hacker
- 产品性格：专业可靠 + 微温暖（像一个靠谱的 mentor）

## Tokens

### 配色
- **Background**: #FAFAF9 (stone-50, warm gray)
- **Surface**: #FFFFFF (cards, modals)
- **Accent**: #D97706 (amber-600, trust & warmth)
- **Accent hover**: #B45309 (amber-700)
- **Accent light**: #FEF3C7 (amber-100, backgrounds)
- **Text primary**: #1C1917 (stone-900)
- **Text secondary**: #57534E (stone-600)
- **Text muted**: #78716C (stone-500)
- **Border**: #E7E5E4 (stone-200)
- **Border hover**: #D6D3D1 (stone-300)

### 字体
- Sans: IBM Plex Sans (继承品牌 DNA)
- Mono: JetBrains Mono
- 字重: 400 (body), 500 (medium), 600 (semibold), 700 (bold)

### 间距
- 基于 4px 的 Tailwind 默认
- Card padding: p-6 (24px)
- Section gap: gap-8 (32px)
- Page padding: px-6 (24px), max-w-5xl center

### 圆角
- Buttons: rounded-lg (8px)
- Cards: rounded-xl (12px)
- Tags/badges: rounded-full
- Inputs: rounded-lg (8px)

### 阴影
- Cards: shadow-sm on hover only
- Modals: shadow-lg
- 默认用 border 建立深度

## 特殊规则
- Amber 只用于 CTA 和高亮，不做大面积铺色
- Playbook 展示区用 stone 灰度 + amber 标记当前步骤
- 模板代码块用 JetBrains Mono + 深色背景 (#1C1917)
