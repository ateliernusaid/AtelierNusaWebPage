---
description: How to deploy updates to the Atelier Nusa website on Vercel
---

# Deploy Atelier Nusa Website

The website is deployed on **Vercel** and connected to the domain **ateliernusa.id**.
GitHub repo: https://github.com/ateliernusaid/AtelierNusaWebPage

## Steps to Deploy Updates

// turbo-all

1. Make your code changes in `d:\SCRIPT\YapAutoBot-NTE-main\AtelierNusaWeb`

2. Stage all changes:
```
git add -A
```

3. Commit the changes:
```
git commit -m "description of changes"
```

4. Push to GitHub (Vercel auto-deploys):
```
git push origin main
```

5. Vercel will automatically build and deploy. Check status at:
   - https://vercel.com/ateliernusaarchitects/atelier-nusa-web-page
   - Live site: https://ateliernusa.id

## Build Details
- **Framework:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **All HTML pages** are configured in `vite.config.js`
