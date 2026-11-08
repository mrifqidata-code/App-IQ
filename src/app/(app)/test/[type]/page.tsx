import { notFound } from "next/navigation";
import { TestRunner } from "@/components/TestRunner";
import { getClientQuestions, testMeta } from "@/tests";
import { isTestType } from "@/tests/types";
import { getLocale } from "@/lib/locale";
import { testTheme } from "@/lib/theme";

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isTestType(type)) return {};
  const locale = await getLocale();
  return { title: testMeta[type].title[locale] };
}

export default async function TestPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isTestType(type)) notFound();
  const locale = await getLocale();
  const meta = testMeta[type];
  return (
    <TestRunner
      key={type}
      type={type}
      title={meta.title[locale]}
      icon={meta.icon}
      questions={getClientQuestions(type, locale)}
      timeLimit={meta.timeLimit}
      theme={testTheme[type]}
    />
  );
}
