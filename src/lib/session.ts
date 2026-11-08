import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Ambil user yang sedang login, atau redirect ke /login. */
export async function requireUser() {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) redirect("/login");
  return { id: user.id, name: user.name ?? "", email: user.email ?? "", image: user.image ?? null };
}
