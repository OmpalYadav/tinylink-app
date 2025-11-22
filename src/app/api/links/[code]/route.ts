// src/app/api/links/[code]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// FIX 1: Define params as a Promise
interface RouteParams {
  params: Promise<{ code: string }>;
}

// GET /api/links/:code - Get stats for a single link
export async function GET(
  request: NextRequest,
  { params }: RouteParams // FIX 2: Use the Promise type
) {
  try {
    const { code } = await params; // FIX 3: Await the params

    const link = await prisma.link.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        url: true,
        clicks: true,
        lastClicked: true,
        createdAt: true,
      },
    });

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(link);
  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/links/:code - Delete a link
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams // FIX 4: Use the Promise type here too
) {
  try {
    const { code } = await params; // FIX 5: Await the params

    // Check if link exists
    const existingLink = await prisma.link.findUnique({
      where: { code },
    });

    if (!existingLink) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Delete the link
    await prisma.link.delete({
      where: { code },
    });

    return NextResponse.json(
      { message: 'Link deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}