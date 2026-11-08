import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

/** Login "Dev mode": aktif otomatis saat development, mati di production. */
export const devLoginEnabled =
  process.env.NODE_ENV !== "production" || process.env.AUTH_DEV_LOGIN === "true";

export const googleLoginEnabled = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);

const providers: NextAuthConfig["providers"] = [];

if (googleLoginEnabled) providers.push(Google);

if (devLoginEnabled) {
  providers.push(
    Credentials({
      id: "dev",
      name: "Dev mode",
      credentials: { name: { label: "Nama", type: "text" } },
      async authorize(credentials) {
        const name = String(credentials?.name ?? "").trim().slice(0, 50);
        if (!name) return null;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "") || "user";
        const email = `${slug}@dev.local`;
        const user = await prisma.user.upsert({
          where: { email },
          update: { name },
          create: { name, email },
        });
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // JWT diperlukan agar provider Credentials (dev mode) bisa dipakai bersama Google.
  session: { strategy: "jwt" },
  providers,
  pages: { signIn: "/login" },
  trustHost: true,
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.sub && session.user) session.user.id = token.sub;
      return session;
    },
  },
});
