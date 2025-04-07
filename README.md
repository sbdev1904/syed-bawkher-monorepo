# Textile Management System

This is a comprehensive textile and fabric management system built with [Next.js](https://nextjs.org), designed to help textile businesses manage their operations efficiently.

## Features

- 👕 **Textile & Fabric Management**: Track and manage different types of textiles and fabrics
- 📦 **Inventory Management**: Keep track of stock levels and materials
- 🏭 **Production Tracking**: Monitor production processes and workflows
- 👥 **Customer Management**: Manage customer information and orders
- 📊 **Admin Dashboard**: Comprehensive admin interface for business oversight
- 🛍️ **Order Management**: Handle customer orders and processing
- 👥 **Supplier Management**: Manage supplier relationships and materials sourcing
- 🔐 **Secure Authentication**: Built-in authentication system using NextAuth.js

## Tech Stack

- **Frontend**: Next.js 15.2, React 19, Ant Design
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM
- **Styling**: TailwindCSS
- **UI/UX**: Framer Motion for animations
- **API Integration**: Axios for HTTP requests
- **Cloud Storage**: AWS S3 for file storage
- **Type Safety**: TypeScript

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

Make sure to set up the following environment variables in your `.env` file:

- Database connection string
- AWS credentials (for S3 storage)
- NextAuth configuration
- API keys and secrets

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
