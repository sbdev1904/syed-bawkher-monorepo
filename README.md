# Syed Bawkher Monorepo

A modern web application built with Next.js 15, React 19, and TypeScript, featuring a comprehensive UI component system and robust backend integration.

## Tech Stack

- **Frontend Framework:** Next.js 15.2.5 with React 19
- **Styling:** TailwindCSS with shadcn/ui components
- **Database:** Prisma ORM
- **Authentication:** NextAuth.js
- **Form Handling:** React Hook Form with Zod validation
- **UI Components:**
  - Radix UI primitives
  - Framer Motion for animations
  - Sonner for toast notifications
  - React Day Picker for date selection
- **Storage:** AWS S3 integration
- **Development Tools:**
  - TypeScript
  - ESLint
  - Turbopack for faster development

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- A PostgreSQL database (for Prisma)
- AWS S3 credentials (for file storage)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd syed-bawkher-refactor
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up your environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="your-database-url"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_REGION="your-aws-region"
   ```

4. Run Prisma migrations:
```bash
npx prisma generate
npx prisma db push
```

### Development

Start the development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm run start
```

## Features

- Modern UI components with shadcn/ui and Radix UI
- Responsive design with TailwindCSS
- Secure authentication with NextAuth.js
- Form validation using React Hook Form and Zod
- File uploads with AWS S3 integration
- Database management with Prisma ORM
- Dark mode support with next-themes
- Toast notifications with Sonner
- Date handling with date-fns and moment
- Barcode generation capabilities
- Print functionality with react-to-print

## Project Structure

- `/src` - Application source code
- `/prisma` - Database schema and migrations
- `/public` - Static assets
- `/components` - Reusable UI components
- `/app` - Next.js app router pages and layouts

 

## License

By Crevn.xyz
