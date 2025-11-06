import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sub = await prisma.subscription.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id, plan: "free", status: "active" },
  });

  return NextResponse.json(sub);
}

export async function PUT(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { plan } = body ?? {};
  if (!plan || !["free", "pro", "premium"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const periodEnd = plan === "free" ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const sub = await prisma.subscription.upsert({
    where: { userId: session.user.id },
    update: { plan, status: "active", currentPeriodEnd: periodEnd ?? undefined },
    create: { userId: session.user.id, plan, status: "active", currentPeriodEnd: periodEnd ?? undefined },
  });

  return NextResponse.json(sub);
}


