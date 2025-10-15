# 🚀 Deployment Guide for BibleThink

## ⚠️ SECURITY FIRST

**NEVER commit your `.env` file to GitHub!**

Your OpenAI API key is private and should ONLY exist:
1. Locally in your `.env` file (already gitignored)
2. In your hosting platform's environment variables

---

## 🎯 Recommended: Deploy to Vercel (FREE & EASY)

### Why Vercel?
- ✅ Free tier perfect for this app
- ✅ Automatic SSL certificate
- ✅ CDN for fast loading worldwide
- ✅ Easy environment variable management
- ✅ Deploy from GitHub in 2 clicks

### Steps:

#### 1. Push code to GitHub (Done! ✅)
Your code is already in: `https://github.com/cwp-devtest/think-bible-flow`

#### 2. Sign up for Vercel
- Go to: https://vercel.com/signup
- Click "Continue with GitHub"
- Authorize Vercel to access your repos

#### 3. Import Project
- Click "New Project"
- Select `think-bible-flow` repository
- Framework Preset: **Vite** (auto-detected)
- Root Directory: `./`

#### 4. Add Environment Variables
**CRITICAL STEP:**
- Click "Environment Variables"
- Add:
  ```
  Name: VITE_OPENAI_API_KEY
  Value: [paste your OpenAI key here]
  ```
- Keep it checked for: Production, Preview, Development

#### 5. Deploy!
- Click "Deploy"
- Wait 2-3 minutes
- Done! Your app is live! 🎉

### Your Live URL:
```
https://think-bible-flow.vercel.app
or
https://think-bible-flow-[your-username].vercel.app
```

---

## 🔧 Alternative: Deploy to Netlify

### Steps:

#### 1. Sign up for Netlify
- Go to: https://app.netlify.com/signup
- Connect with GitHub

#### 2. New site from Git
- Click "Add new site" → "Import an existing project"
- Choose GitHub → Select `think-bible-flow`

#### 3. Build settings
- Build command: `npm run build`
- Publish directory: `dist`

#### 4. Environment variables
- Go to: Site settings → Environment variables
- Add: `VITE_OPENAI_API_KEY` with your key

#### 5. Deploy!
- Trigger deploy
- Your site: `https://think-bible-flow.netlify.app`

---

## 🔐 Security Best Practices

### ✅ DO:
- Use environment variables for API keys
- Keep `.env` in `.gitignore`
- Use `.env.example` for documentation
- Rotate API keys regularly

### ❌ DON'T:
- Commit `.env` to GitHub
- Share API keys in chat/email
- Use same key for dev and production
- Hardcode secrets in code

---

## 📊 Cost Breakdown

### OpenAI API:
- GPT-4o-mini: ~$0.0001 per message
- Estimated: $1-2/month for personal use
- Free tier: First $5 credit

### Firebase (Database):
- Firestore: 50,000 reads/day FREE
- Authentication: Unlimited FREE
- Storage: 1GB FREE
- Estimated: $0/month for your usage

### Vercel/Netlify:
- Hosting: FREE forever
- SSL: FREE
- CDN: FREE
- Custom domain: $12/year (optional)

**Total: $1-2/month** 🎉

---

## 🌐 Custom Domain (Optional)

### Buy a domain:
- Namecheap: ~$12/year
- Google Domains: ~$12/year
- Cloudflare: ~$10/year

### Connect to Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records (Vercel shows instructions)
4. Wait 10 minutes for propagation

**Example:** `https://biblethink.app`

---

## 🔄 Continuous Deployment

Once set up, every push to GitHub = automatic deployment!

```bash
# Make changes locally
git add .
git commit -m "New feature"
git push origin main

# Vercel/Netlify automatically deploys
# Live in 2-3 minutes! 🚀
```

---

## 📱 Progressive Web App (PWA)

To make BibleThink installable on phones:

1. Add to `index.html`:
```html
<link rel="manifest" href="/manifest.json">
```

2. Create `public/manifest.json`:
```json
{
  "name": "BibleThink",
  "short_name": "BibleThink",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1f2e",
  "theme_color": "#e97b6f",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

3. Redeploy

Users can now "Add to Home Screen"! 📱

---

## 🆘 Troubleshooting

### "API key not found"
- Check environment variables in Vercel/Netlify dashboard
- Must start with `VITE_` for Vite apps
- Redeploy after adding

### "Firebase connection failed"
- Firebase config is in code (fine - it's public)
- Check Firebase console for API restrictions

### Build fails
- Check Node version (should be 18+)
- Clear cache in Vercel: Settings → Clear cache
- Check `package.json` dependencies

---

## 📝 Next Steps After Deployment

1. ✅ Test the live site thoroughly
2. ✅ Set up analytics (optional)
3. ✅ Add custom domain (optional)
4. ✅ Share with friends!
5. ✅ Monitor API usage in OpenAI dashboard

---

**Your app is ready to share with the world!** 🌍✨
