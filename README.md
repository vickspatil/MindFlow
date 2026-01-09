## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory and add your Perplexity API key:
   ```
   PERPLEXITY_API_KEY=your-api-key-here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

   For local testing with API routes, use Vercel CLI:
   ```bash
   npm i -g vercel
   vercel dev
   ```

## Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))

### Steps

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure the project:**
   - Framework Preset: **Vite** (should auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)

4. **Add Environment Variable:**
   - In project settings, go to "Environment Variables"
   - Add: `PERPLEXITY_API_KEY` = `your-actual-perplexity-api-key`
   - Make sure it's available for **Production**, **Preview**, and **Development**

5. **Deploy:**
   - Click "Deploy"
   - Your app will be live at `https://your-project.vercel.app`

### Security Notes
- ✅ API key is stored securely in Vercel environment variables (server-side only)
- ✅ API calls are proxied through Vercel serverless functions
- ✅ No API key is exposed in the browser bundle
- ✅ Automatic deployments on every push to your main branch
