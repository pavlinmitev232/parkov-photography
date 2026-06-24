import { MailQuestion } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { OwnerForgotPasswordForm } from "@/components/owner-forgot-password-form";

export default async function OwnerForgotPasswordPage() {
  const t = await getTranslations("ownerLogin");

  return (
    <main className="grid min-h-dvh place-items-center bg-surface px-5 py-12">
      <div className="w-full max-w-md rounded-md border border-line bg-background p-6 shadow-2xl md:p-8">
        <div className="mb-8">
          <div className="mb-5 grid size-12 place-items-center rounded-full bg-accent text-accent-foreground">
            <MailQuestion size={22} />
          </div>
          <p className="section-kicker">{t("eyebrow")}</p>
          <h1 className="font-serif text-4xl font-bold">{t("resetTitle")}</h1>
          <p className="mt-4 text-sm leading-6 text-muted">{t("resetCopy")}</p>
        </div>
        <OwnerForgotPasswordForm />
      </div>
    </main>
  );
}
