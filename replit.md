# Modweeb Template

قالب React حديث مبني من HTML/CSS/JavaScript التقليدي لموقع Tools Modweeb.

## Run & Operate

- `pnpm --filter @workspace/modweeb-template run dev` — تشغيل الواجهة (يتم تلقائيًا عبر Workflow)
- `pnpm run typecheck` — فحص TypeScript لجميع الحزم
- `pnpm run build` — بناء كامل

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7
- CSS: Plain CSS organized per-concern (no Tailwind for this template)
- No backend / no database — frontend only

## Where things live

- `artifacts/modweeb-template/src/` — كود الواجهة الأمامية
  - `App.tsx` — الجذر: يلف ThemeProvider ويعرض AppShell
  - `context/ThemeContext.tsx` — إدارة الوضع الليلي عالميًا (Context + localStorage)
  - `index.css` — جميع المتغيرات والأنماط مع دعم light/dark
  - `components/`
    - `Preloader.tsx` — شاشة التحميل بـ useEffect وانتقال CSS
    - `Header.tsx` — الهيدر (شعار + اسم + زر الثيم)
    - `Logo.tsx` — SVG الشعار المُلوّن
    - `ThemeToggle.tsx` — زر تبديل الوضع الليلي مع أيقونة شمس/قمر
    - `ContentWrapper.tsx` — منطقة المحتوى القابلة للتوسع
    - `Footer.tsx` — الفوتر مع حقوق النشر
    - `SocialLinks.tsx` — روابط GitHub و Email

## Architecture decisions

- **ThemeContext بدلًا من DOM manipulation**: الوضع الليلي يُدار بـ React state وليس `classList.toggle` مباشرة
- **Preloader بـ useState + useEffect**: لا اعتماد على `document.getElementById`، يختفي بعد 1500ms بانتقال CSS
- **CSS variables للثيم**: `--bodyB`, `--contentB`, `--linkC` إلخ محددة في `:root` لسهولة التوسع
- **RTL كامل** على `standalone-page-container` مع `dir="rtl"` في JSX
- **dark-mode class** تُضاف على الحاوية الرئيسية React-style بناءً على state

## Product

قالب فارغ جاهز للتوسع — هيدر + Preloader + محتوى + فوتر + Dark Mode — لاستخدامه كأساس لأدوات موقع Modweeb.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- أنيميشن Preloader يعتمد على `stroke-dashoffset` + CSS keyframes، لا تعدّل أسماء الكلاسات
- `dark-mode` class على `.standalone-page-container` تتحكم في جميع أنماط الوضع الليلي

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
