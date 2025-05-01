# TaskMaster

A modern task and project management application built with Next.js, TypeScript, and Prisma.

## Features

- Multi-project management
- Task tracking with status updates
- Progress analytics
- User authentication
- Responsive design

## Prerequisites

- Node.js 18 or later
- PostgreSQL database
- npm (Node Package Manager)

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskmaster"
JWT_SECRET="your-jwt-secret"
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma Client:

```bash
npx prisma generate
```

3. Run database migrations:

```bash
npx prisma migrate dev --name init
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 15
- TypeScript
- Prisma (PostgreSQL)
- Tailwind CSS
- Shadcn/ui Components
- JWT Authentication
