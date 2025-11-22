// src/app/[code]/page.tsx
import { redirect, notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// UPDATE 1: Define params as a Promise
interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function RedirectPage({ params }: PageProps) {
  // UPDATE 2: Await the params object
  const { code } = await params;

  // Find the link
  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    notFound();
  }

  // Update click count and last clicked time
  await prisma.link.update({
    where: { code },
    data: {
      clicks: {
        increment: 1,
      },
      lastClicked: new Date(),
    },
  });

  // Perform 302 redirect
  redirect(link.url);
}

export function generateStaticParams() {
  return [];
}