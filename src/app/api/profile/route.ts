import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, image: true, bio: true, phone: true, createdAt: true, updatedAt: true },
  });

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { name, bio, phone, image } = body ?? {};

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name ?? undefined,
      bio: bio ?? undefined,
      phone: phone ?? undefined,
      image: image ?? undefined,
    },
    select: { id: true, email: true, name: true, image: true, bio: true, phone: true, createdAt: true, updatedAt: true },
  });

  return NextResponse.json(updated);
}


