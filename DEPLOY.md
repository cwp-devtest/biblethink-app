# 🚀 Deploy to Vercel (Recommended)

## Steps:

1. **Sign up**: https://vercel.com/signup (Continue with GitHub)

2. **Import Project**: 
   - New Project → Select `think-bible-flow`
   - Framework: Vite (auto-detected)

3. **Add Environment Variable**:
   - Name: `VITE_OPENAI_API_KEY`
   - Value: [Your OpenAI key]
   - Environment: Production, Preview, Development

4. **Deploy**: Click Deploy → Done in 2 mins!

Your URL: `https://think-bible-flow.vercel.app`

---

## 🔐 Security

- ✅ `.env` is gitignored (safe)
- ✅ API keys only in Vercel dashboard
- ❌ Never commit `.env` to GitHub

---

## 💰 Cost

- Vercel: FREE
- Firebase: FREE (free tier)
- OpenAI: ~$1-2/month

**Total: $1-2/month** 🎉

---

## 🔄 Auto-Deploy

Every `git push` = automatic deployment!

```bash
git add .
git commit -m "Update"
git push
# Live in 2 mins! 🚀
```

---

## 🆘 Troubleshooting

**"API key not found"**
- Add `VITE_OPENAI_API_KEY` in Vercel dashboard
- Must start with `VITE_`
- Redeploy after adding

**Build fails**
- Check Node version (18+)
- Clear cache in Vercel settings

---

See full guide for Netlify, PWA setup, and more!
