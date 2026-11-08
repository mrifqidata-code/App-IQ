import { prisma } from "@/lib/prisma";
import type { AnyResult, ResultByType } from "@/tests";
import { discProfiles } from "@/tests/disc";
import { eqLevelLabels } from "@/tests/eq";
import { typeProfiles } from "@/tests/personality";
import { isTestType, type Locale, type TestType } from "@/tests/types";

export type StoredResult<T extends TestType = TestType> = {
  id: string;
  testType: T;
  result: ResultByType[T];
  createdAt: Date;
  durationMs: number | null;
};

function parse(row: { id: string; testType: string; result: string; createdAt: Date; durationMs: number | null }) {
  if (!isTestType(row.testType)) return null;
  return {
    id: row.id,
    testType: row.testType,
    result: JSON.parse(row.result) as AnyResult,
    createdAt: row.createdAt,
    durationMs: row.durationMs,
  } as StoredResult;
}

export async function getUserResults(userId: string, opts: { type?: TestType; take?: number } = {}) {
  const rows = await prisma.testResult.findMany({
    where: { userId, ...(opts.type ? { testType: opts.type } : {}) },
    orderBy: { createdAt: "desc" },
    take: opts.take,
    select: { id: true, testType: true, result: true, createdAt: true, durationMs: true },
  });
  return rows.map(parse).filter((r): r is StoredResult => r !== null);
}

export async function getUserResult(userId: string, id: string) {
  const row = await prisma.testResult.findFirst({
    where: { id, userId },
    select: { id: true, testType: true, result: true, createdAt: true, durationMs: true },
  });
  return row ? parse(row) : null;
}

/** Ringkasan satu baris untuk dashboard & riwayat. */
export function summarize(r: StoredResult, locale: Locale): string {
  switch (r.testType) {
    case "iq": {
      const x = r.result as ResultByType["iq"];
      return `IQ ${x.iq}`;
    }
    case "personality": {
      const x = r.result as ResultByType["personality"];
      return `${x.type} · ${typeProfiles[x.type]?.nickname[locale] ?? ""}`;
    }
    case "eq": {
      const x = r.result as ResultByType["eq"];
      return `EQ ${x.overall}/100 · ${eqLevelLabels[x.level][locale]}`;
    }
    case "disc": {
      const x = r.result as ResultByType["disc"];
      return `${x.primary}${x.secondary} · ${discProfiles[x.primary].name[locale].split(" (")[0]}`;
    }
  }
}

export function formatDate(d: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}
