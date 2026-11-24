import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SearchX, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  const tNav = await getTranslations("Nav");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-20 text-center sm:py-28">
      <div
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-muted-foreground"
      >
        <SearchX className="h-6 w-6" />
      </div>

      <p className="mt-6 font-mono text-5xl font-bold tabular-nums text-foreground sm:text-6xl">
        404
      </p>

      <h1 className="mt-4 text-xl font-semibold text-foreground sm:text-2xl">
        {t("title")}
      </h1>

      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
        {t("description")}
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default", size: "default" }), "cursor-pointer")}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {tNav("catalog")}
        </Link>
        <Link
          href="/compare"
          className={cn(buttonVariants({ variant: "outline", size: "default" }), "cursor-pointer")}
        >
          {tNav("compare")}
        </Link>
      </div>
    </div>
  );
}
