import { LockKeyhole } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { OwnerLoginForm } from "@/components/owner-login-form";
import { getOwnerAuthProvider } from "@/lib/auth/owner-auth-provider";

export default async function OwnerLoginPage() {
  const t = await getTranslations("ownerLogin");

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-5 py-12">
      <div className="w-full max-w-md rounded-md border border-line bg-background p-6 shadow-2xl md:p-8">
        <div className="mb-8">
          <div className="mb-5 grid size-12 place-items-center rounded-full bg-accent text-accent-foreground">
            <LockKeyhole size={22} />
          </div>
          <p className="section-kicker">{t("eyebrow")}</p>
          <h1 className="font-serif text-4xl font-bold">{t("title")}</h1>
          <p className="mt-4 text-sm leading-6 text-muted">{t("copy")}</p>
        </div>
        <OwnerLoginForm
          showPasswordReset={getOwnerAuthProvider() === "supabase"}
        />
      </div>
    </main>
  );
}
