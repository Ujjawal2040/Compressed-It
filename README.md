# ⚡ CompressIt - Enterprise-Grade File Optimization

**CompressIt** is a next-generation SaaS platform designed for high-performance file compression and format conversion. Powered by WebAssembly and local-first processing, it allows users to shrink heavy PDFs and images directly in the browser with military-grade privacy.

### 🌐 Live Demo
**[https://compressed-it.vercel.app/](https://compressed-it.vercel.app/)**

---

## 🚀 Key Features

- **Extreme Compression**: Shrink PDFs and images by up to 90% while maintaining visual integrity.
- **Local-First Privacy**: Files are processed 100% inside your browser's private sandbox. No data ever hits our middleman servers.
- **Smart Format AI**: Automatically identifies the best target format (WebP, JPG, or PNG) to maximize storage savings.
- **Bulk Processing**: Integrated queue orchestrator handles hundreds of concurrent files using multi-threaded Web Workers.
- **Cloud Vault**: Securely save your optimized results to a private remote cloud powered by Supabase.

## 🛠️ Built With

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Database / Auth**: [Supabase](https://supabase.com/)
- **Core Engine**: [WebAssembly (WASM)](https://webassembly.org/)
- **Libraries**: `pdf-lib`, `browser-image-compression`, `jszip`, `lucide-react`
- **Styling**: Tailwind CSS & Glassmorphism UI

## 📦 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ujjawal2040/Compressed-It.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

---

*Made with ❤️ by Adarsh and Ujjwal*
