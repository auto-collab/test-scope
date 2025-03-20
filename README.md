# Test Scope - Next.js Project

This is a **Next.js** project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). The project integrates **TypeScript**, **ESLint**, **Prettier**, **Jest**, and **TailwindCSS**, making it a structured and efficient development environment.

## 📌 Features

- **Next.js 15** with **React 19**
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Jest** for unit testing
- **ESLint & Prettier** for code linting and formatting
- **Azure DevOps API Integration** for fetching test results and code coverage

## 🚀 Getting Started

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3️⃣ Run Tests

```bash
npm run test
```

To watch tests continuously:

```bash
npm run test:watch
```

For coverage reports:

```bash
npm run test:coverage
```

## ⚙️ Configuration

- **Environment Variables:** Use `.env.local` for local development.
- **Linting & Formatting:** ESLint and Prettier are pre-configured.
- **TailwindCSS:** Custom theme settings can be modified in `tailwind.config.ts`.

## 📂 Project Structure

```plaintext
/app                # Main Next.js application
/components        # Reusable UI components
/styles           # Global styles and Tailwind configurations
/tests           # Unit tests
/utils           # Helper functions
```

## 🏗 Deployment

The easiest way to deploy this project is via **[Vercel](https://vercel.com/)**:

```bash
vercel
```

For manual deployment:

```bash
npm run build
npm run start
```

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Jest Testing Guide](https://jestjs.io/docs/getting-started)

---
