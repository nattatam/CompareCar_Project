import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Disclaimer — CompareCar",
  description:
    "Scope of liability and information accuracy displayed on the CompareCar website.",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default async function DisclaimerPage() {
  const t = await getTranslations("Disclaimer");
  const tCommon = await getTranslations("Common");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <BackButton variant="ghost">
        ← {tCommon("back")}
      </BackButton>

      <article className="mt-4 space-y-4 text-[15px] leading-relaxed text-foreground/90">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          {t("title")}
        </h1>

        <p>{t("content1")}</p>

        <p dangerouslySetInnerHTML={{ __html: t("content2") }} />

        <p dangerouslySetInnerHTML={{ __html: t("content3") }} />

        <p dangerouslySetInnerHTML={{ __html: t("content4") }} />

        <p>{t("content5")}</p>

        <p dangerouslySetInnerHTML={{ __html: t("content6") }} />
      </article>

      <div className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
        {t("moreInfo")}{" "}
        <Link href="/credits" className="font-medium text-primary hover:underline">
          Image credits
        </Link>
      </div>
    </div>
  );
}
