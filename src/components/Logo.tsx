import Link from "next/link";

export function Logo({ name, href = "/dashboard" }: { name: string; href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-bold tracking-tight">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
        M
      </span>
      <span className="text-lg">{name}</span>
    </Link>
  );
}
