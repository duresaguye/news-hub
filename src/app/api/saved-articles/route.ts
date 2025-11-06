import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.savedArticle.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { url, title, source, imageUrl, description, publishedAt, category } = body ?? {};
  if (!url || !title) {
    return NextResponse.json({ error: "Missing url or title" }, { status: 400 });
  }

  const saved = await prisma.savedArticle.upsert({
    where: { userId_url: { userId: session.user.id, url } },
    update: { title, source, imageUrl, description, publishedAt: publishedAt ? new Date(publishedAt) : undefined, category },
    create: {
      userId: session.user.id,
      url,
      title,
      source,
      imageUrl,
      description,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      category,
    },
  });

  return NextResponse.json(saved, { status: 201 });
}


