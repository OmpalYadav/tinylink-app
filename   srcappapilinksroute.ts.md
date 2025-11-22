#  // src/app/api/links/route.ts

# import { NextRequest, NextResponse } from 'next/server';

# import { PrismaClient } from '@prisma/client';

# 

# const prisma = new PrismaClient();

# 

# // POST /api/links - Create a new short link

# export async function POST(request: NextRequest) {

#   try {

#     const { url, code } = await request.json();

# 

#     // Validate URL

#     if (!url || typeof url !== 'string') {

#       return NextResponse.json(

#         { error: 'URL is required' },

#         { status: 400 }

#       );

#     }

# 

#     // Check if URL is valid format

#     try {

#       const urlObj = new URL(url);

#       if (!\['http:', 'https:'].includes(urlObj.protocol)) {

#         throw new Error('Invalid protocol');

#       }

#     } catch {

#       return NextResponse.json(

#         { error: 'Invalid URL format. Must start with http:// or https://' },

#         { status: 400 }

#       );

#     }

# 

#     // Validate custom code if provided

#     if (code) {

#       if (typeof code !== 'string' || !/^\[A-Za-z0-9]{6,8}$/.test(code)) {

#         return NextResponse.json(

#           { error: 'Custom code must be 6-8 alphanumeric characters' },

#           { status: 400 }

#         );

#       }

#     }

# 

#     // Generate random code if not provided

#     const shortCode = code || generateRandomCode();

# 

#     // Check if code already exists

#     const existingLink = await prisma.link.findUnique({

#       where: { code: shortCode },

#     });

# 

#     if (existingLink) {

#       return NextResponse.json(

#         { error: 'Short code already exists' },

#         { status: 409 }

#       );

#     }

# 

#     // Create the link

#     const link = await prisma.link.create({

#       data: {

#         code: shortCode,

#         url,

#       },

#     });

# 

#     return NextResponse.json(

#       {

#         id: link.id,

#         code: link.code,

#         url: link.url,

#         clicks: link.clicks,

#         createdAt: link.createdAt,

#       },

#       { status: 201 }

#     );

#   } catch (error) {

#     console.error('Error creating link:', error);

#     return NextResponse.json(

#       { error: 'Internal server error' },

#       { status: 500 }

#     );

#   }

# }

# 

# // GET /api/links - List all links

# export async function GET() {

#   try {

#     const links = await prisma.link.findMany({

#       orderBy: {

#         createdAt: 'desc',

#       },

#       select: {

#         id: true,

#         code: true,

#         url: true,

#         clicks: true,

#         lastClicked: true,

#         createdAt: true,

#       },

#     });

# 

#     return NextResponse.json(links);

#   } catch (error) {

#     console.error('Error fetching links:', error);

#     return NextResponse.json(

#       { error: 'Internal server error' },

#       { status: 500 }

#     );

#   }

# }

# 

# // Helper function to generate random 6-character codes

# function generateRandomCode(): string {

#   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

#   let result = '';

#   for (let i = 0; i < 6; i++) {

#     result += chars.charAt(Math.floor(Math.random() \* chars.length));

#   }

#   return result;

# }

