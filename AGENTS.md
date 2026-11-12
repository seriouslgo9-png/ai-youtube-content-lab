# Project architecture

- Deploy the React/Vite app as static Vercel output (`dist`) with SPA route fallback; keep AI, auth, and account data on Lovable Cloud so private provider credentials never enter the browser.
- Keep pricing-tier selection in browser local storage and describe it as a preview only while checkout is not connected.