# 🔗 TinyLink - Modern URL Shortener

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square&logo=postgresql)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel)

A lightning-fast, modern URL shortener built with **Next.js 16**, **Tailwind CSS**, and **PostgreSQL**.
Deployed on **Vercel**.

## 🚀 Live Demo
👉 **[https://tinylink-app-two.vercel.app](https://tinylink-app-two.vercel.app)**

## ✨ Features
- **Shorten URLs:** Convert long URLs into short, shareable links.
- **Custom Alias:** Users can choose their own custom short codes (e.g., `/my-link`).
- **Analytics:** Track total clicks and "Last Clicked" timestamps.
- **Copy to Clipboard:** One-click copy button with visual feedback.
- **Modern UI:** Built with Framer Motion for smooth animations and Glassmorphism design.
- **Responsive:** Works perfectly on Mobile and Desktop.

## 🛠️ Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + Framer Motion + Lucide Icons
- **Database:** PostgreSQL (via Neon/Vercel)
- **ORM:** Prisma
- **Deployment:** Vercel

## ⚙️ Installation & Setup

Follow these steps to run the project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/OmpalYadav/tinylink-app.git
   cd tinylink-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**  
   Create a `.env` file in the root directory and add your database connection:  
   *(Replace values with your actual Neon/Postgres credentials)*

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Push Database Schema**
   ```bash
   npx prisma db push
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 📡 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/healthz` | Health check (Returns 200 OK) |
| `GET` | `/api/links` | List all created links |
| `POST` | `/api/links` | Create a new short link |
| `GET` | `/api/links/:code` | Get stats for a specific link |
| `DELETE` | `/api/links/:code` | Delete a link |

## 🧪 Automated Testing

This project follows the strict URL conventions required for automated testing.

- Healthcheck: `/healthz`
- Redirect: `/:code`
- Stats: `/code/:code`

## 📝 License

This project is open-source and available under the MIT License.
