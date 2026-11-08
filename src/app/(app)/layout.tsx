import { Header } from "@/components/Header";
import { requireUser } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <>
      <Header user={user} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </>
  );
}
