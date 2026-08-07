import { ArrowLeft, Languages } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/routing";
import { getCachedSiteSettings } from "@/lib/public-home-data";
import { localizedSettings } from "@/lib/site-settings";

export const dynamic = "force-static";
export const revalidate = 300;

type PrivacyCopy = {
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  backHome: string;
  contents: string;
  sections: Array<{
    id: string;
    title: string;
    paragraphs: string[];
    items?: string[];
  }>;
};

const privacyCopy: Record<"bg" | "en", PrivacyCopy> = {
  bg: {
    title: "Политика за поверителност | Parkov",
    description:
      "Как Parkov събира, използва, съхранява и защитава личните данни при запитвания за фотографски услуги.",
    eyebrow: "Лични данни",
    intro:
      "Тази политика обяснява как обработваме личните данни, които ни изпращате чрез формата за запитване или когато се свържете с нас директно.",
    backHome: "Към началната страница",
    contents: "В тази политика",
    sections: [
      {
        id: "controller",
        title: "1. Кой обработва данните ви",
        paragraphs: [
          "Администратор на личните данни е собственикът на Parkov — фотографската услуга, представена на този уебсайт. Можете да се свържете с нас чрез посочения по-долу имейл.",
        ],
      },
      {
        id: "data",
        title: "2. Какви данни събираме",
        paragraphs: [
          "Когато изпратите запитване, събираме само информацията, необходима, за да разберем проекта и да ви отговорим.",
        ],
        items: [
          "име",
          "имейл адрес или телефон според избрания начин за контакт",
          "вид фотографска услуга и предпочитан начин за контакт",
          "предпочитана дата и град или локация",
          "съдържанието на съобщението ви",
          "ограничени технически данни, като IP адрес, използвани временно за защита от злоупотреби и в стандартните хостинг дневници",
        ],
      },
      {
        id: "purpose",
        title: "3. Защо и на какво основание ги използваме",
        paragraphs: [
          "Използваме данните, за да отговорим на запитването, да проверим възможна дата, да подготвим оферта и при ваше желание да организираме резервация. Основанието е предприемане на стъпки по ваше искане преди сключване на договор и, когато има резервация, изпълнение на договора — член 6, параграф 1, буква „б“ от GDPR.",
          "Ограничените технически данни се използват за сигурност, предотвратяване на спам и надеждна работа на сайта въз основа на законния ни интерес — член 6, параграф 1, буква „е“. Данни могат да бъдат запазени и когато това е необходимо за законово задължение или за установяване, упражняване или защита на правни претенции.",
        ],
      },
      {
        id: "required",
        title: "4. Задължителни и незадължителни полета",
        paragraphs: [
          "Името, видът услуга, начинът за контакт, локацията и краткото описание на проекта са необходими, за да обработим запитването. Имейлът е необходим само ако изберете контакт по имейл, а телефонът — ако изберете телефон, Viber или WhatsApp. Предпочитаната дата е незадължителна. Без необходимите данни няма да можем да отговорим пълноценно.",
        ],
      },
      {
        id: "recipients",
        title: "5. Доставчици и получатели",
        paragraphs: [
          "Не продаваме личните ви данни. Достъп до тях може да имат само собственикът на Parkov и доставчици, които подпомагат работата на сайта и комуникацията:",
        ],
        items: [
          "доставчик на база данни и съхранение в европейски регион",
          "доставчик на хостинг, доставка и защита на уебсайта",
          "доставчик на служебни имейли — известие до собственика за ново запитване",
          "професионални консултанти или държавни органи, само когато това е необходимо или се изисква по закон",
        ],
      },
      {
        id: "transfers",
        title: "6. Международни трансфери",
        paragraphs: [
          "Някои технологични доставчици са международни компании и при поддръжка или предоставяне на услугата е възможно ограничено обработване извън Европейското икономическо пространство. Когато законът го изисква, трансферите се извършват чрез подходящи гаранции, например решение за адекватно ниво на защита или стандартни договорни клаузи.",
        ],
      },
      {
        id: "retention",
        title: "7. Колко дълго пазим данните",
        paragraphs: [
          "Съхраняваме данните от запитванията само докато са необходими за комуникацията, подготовката и предоставянето на фотографски услуги или защитата на правни претенции. Периодично преглеждаме съхраняваните запитвания и изтриваме или анонимизираме данните, които вече не са необходими.",
          "Данните, свързани с потвърдена резервация или договор, могат да бъдат съхранявани по-дълго, когато това се изисква от приложимото законодателство. Можете да поискате достъп или изтриване чрез посочения имейл.",
        ],
      },
      {
        id: "rights",
        title: "8. Вашите права",
        paragraphs: [
          "Според приложимото законодателство можете да поискате достъп, корекция, изтриване или ограничаване на обработването, да възразите срещу обработване въз основа на законен интерес и, когато е приложимо, да получите данните си в преносим формат. Можете също да подадете жалба до Комисията за защита на личните данни. За да упражните право, пишете на имейла по-долу. Може да поискаме разумна информация за потвърждаване на самоличността ви.",
        ],
      },
      {
        id: "cookies",
        title: "9. Бисквитки и външни услуги",
        paragraphs: [
          "Публичната част на сайта не използва рекламни или аналитични бисквитки. Избраният светъл или тъмен режим може да се запази локално във вашия браузър. Защитената административна зона използва строго необходима сесийна бисквитка и не е предназначена за посетители.",
          "При зареждане на вградена карта или при отваряне на връзка към Google Maps, Instagram, Facebook, TikTok, Viber или WhatsApp съответната външна услуга може да получи технически данни съгласно собствената си политика за поверителност.",
        ],
      },
      {
        id: "decisions",
        title: "10. Автоматизирани решения",
        paragraphs: [
          "Не използваме данните от запитванията за автоматизирано вземане на решения или профилиране, което поражда правни или сходни съществени последици.",
        ],
      },
      {
        id: "changes",
        title: "11. Промени в политиката",
        paragraphs: [
          "Можем да актуализираме тази политика при промяна на сайта, доставчиците или законовите изисквания. Актуалната версия и датата на последната промяна винаги са публикувани на тази страница.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy | Parkov",
    description:
      "How Parkov collects, uses, stores, and protects personal data submitted with photography inquiries.",
    eyebrow: "Personal data",
    intro:
      "This policy explains how we process the personal data you submit through the inquiry form or when you contact us directly.",
    backHome: "Back to homepage",
    contents: "In this policy",
    sections: [
      {
        id: "controller",
        title: "1. Who controls your data",
        paragraphs: [
          "The data controller is the owner of Parkov, the photography service presented on this website. You can contact us using the email address below.",
        ],
      },
      {
        id: "data",
        title: "2. Data we collect",
        paragraphs: [
          "When you submit an inquiry, we collect only the information needed to understand your project and respond.",
        ],
        items: [
          "name",
          "email address or telephone number, depending on your selected contact method",
          "photography service and preferred contact method",
          "preferred date and city or location",
          "the content of your message",
          "limited technical data, such as an IP address, used temporarily for abuse prevention and included in standard hosting logs",
        ],
      },
      {
        id: "purpose",
        title: "3. Why we use it and our legal basis",
        paragraphs: [
          "We use the data to answer your inquiry, check a possible date, prepare a quotation and, if you wish, arrange a booking. The legal basis is taking steps at your request before entering into a contract and, where a booking is made, performing that contract under Article 6(1)(b) GDPR.",
          "Limited technical data is used for security, spam prevention, and reliable operation of the site on the basis of our legitimate interests under Article 6(1)(f). Data may also be retained where necessary to comply with a legal obligation or to establish, exercise, or defend legal claims.",
        ],
      },
      {
        id: "required",
        title: "4. Required and optional fields",
        paragraphs: [
          "Your name, service, contact method, location, and a short project description are needed to process the inquiry. An email address is needed only if you choose email, and a telephone number is needed if you choose telephone, Viber, or WhatsApp. The preferred date is optional. Without the necessary details, we may be unable to respond properly.",
        ],
      },
      {
        id: "recipients",
        title: "5. Service providers and recipients",
        paragraphs: [
          "We do not sell your personal data. It may be accessed only by the Parkov owner and service providers that support the website and communications:",
        ],
        items: [
          "database and storage provider operating in a European region",
          "website hosting, delivery, and security provider",
          "transactional email provider used to notify the owner about a new inquiry",
          "professional advisers or public authorities, only where necessary or legally required",
        ],
      },
      {
        id: "transfers",
        title: "6. International transfers",
        paragraphs: [
          "Some technology providers are international companies, and limited processing outside the European Economic Area may occur when they provide or support their services. Where required by law, transfers use appropriate safeguards, such as an adequacy decision or standard contractual clauses.",
        ],
      },
      {
        id: "retention",
        title: "7. How long we keep data",
        paragraphs: [
          "We retain inquiry data only for as long as necessary for communication, preparing and providing photography services, or establishing, exercising, or defending legal claims. We periodically review stored inquiries and delete or anonymize data that is no longer necessary.",
          "Data connected to a confirmed booking or contract may be retained longer where required by applicable law. You may request access or deletion using the listed email address.",
        ],
      },
      {
        id: "rights",
        title: "8. Your rights",
        paragraphs: [
          "Subject to applicable law, you may request access, correction, deletion, or restriction of processing; object to processing based on legitimate interests; and, where applicable, receive your data in a portable format. You may also lodge a complaint with the Bulgarian Commission for Personal Data Protection. To exercise a right, email us using the address below. We may request reasonable information to verify your identity.",
        ],
      },
      {
        id: "cookies",
        title: "9. Cookies and external services",
        paragraphs: [
          "The public site does not use advertising or analytics cookies. Your light or dark theme preference may be stored locally in your browser. The protected owner area uses a strictly necessary session cookie and is not intended for visitors.",
          "When an embedded map loads, or when you open a link to Google Maps, Instagram, Facebook, TikTok, Viber, or WhatsApp, that external service may receive technical data under its own privacy policy.",
        ],
      },
      {
        id: "decisions",
        title: "10. Automated decisions",
        paragraphs: [
          "We do not use inquiry data for automated decision-making or profiling that produces legal or similarly significant effects.",
        ],
      },
      {
        id: "changes",
        title: "11. Changes to this policy",
        paragraphs: [
          "We may update this policy when the website, providers, or legal requirements change. The current version and its latest update date will always be published on this page.",
        ],
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = privacyCopy[locale === "en" ? "en" : "bg"];

  return {
    title: copy.title,
    description: copy.description,
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale === "en" ? "en" : "bg";
  const alternateLocale = currentLocale === "bg" ? "en" : "bg";
  const copy = privacyCopy[currentLocale];
  const settings = await getCachedSiteSettings();
  const content = localizedSettings(settings, currentLocale);
  const common = currentLocale === "bg"
    ? { language: "Смени езика", theme: "Смени светъл или тъмен режим" }
    : { language: "Change language", theme: "Change light or dark mode" };

  setRequestLocale(currentLocale);

  return (
    <main className="isolate min-h-dvh bg-background">
      <header className="border-b border-line bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <Link
            href="/"
            aria-label="Homepage"
            className="min-w-0 truncate font-serif text-2xl font-bold tracking-wide"
          >
            {content.brandName}
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface/80 py-2 pr-4 pl-3 text-sm font-bold backdrop-blur hover:border-foreground/30"
            >
              <ArrowLeft size={16} className="shrink-0" />
              <span className="hidden sm:inline">{copy.backHome}</span>
            </Link>
            <Link
              href="/privacy"
              locale={alternateLocale}
              aria-label={common.language}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface/80 py-2 pr-4 pl-3 text-sm font-bold backdrop-blur hover:border-foreground/30"
            >
              <Languages size={16} className="shrink-0" />
              {alternateLocale.toUpperCase()}
            </Link>
            <ThemeToggle label={common.theme} />
          </div>
        </div>
      </header>

      <section className="border-b border-line bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="section-kicker">{copy.eyebrow}</p>
          <h1 className="max-w-[18ch] font-serif text-5xl font-bold tracking-tight text-balance md:text-7xl">
            {currentLocale === "bg" ? "Политика за поверителност" : "Privacy Policy"}
          </h1>
          <p className="mt-6 max-w-[64ch] text-base leading-7 text-muted text-pretty md:text-lg md:leading-8">
            {copy.intro}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1fr_3fr]">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <h2 className="font-serif text-2xl font-bold">{copy.contents}</h2>
          <nav className="mt-5 border-l border-line" aria-label={copy.contents}>
            {copy.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex min-h-11 items-center border-l-2 border-transparent px-4 text-base font-normal text-muted hover:border-accent hover:text-foreground sm:text-sm"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <article className="min-w-0">
          {copy.sections.map((section, index) => (
            <section
              id={section.id}
              key={section.id}
              className={`scroll-mt-8 py-9 first:pt-0 ${
                index < copy.sections.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <h2 className="font-serif text-3xl font-bold tracking-tight text-balance md:text-4xl">
                {section.title}
              </h2>
              <div className="mt-5 grid gap-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-[72ch] text-base leading-8 text-muted text-pretty"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.items && (
                  <ul className="grid max-w-[72ch] gap-3 pl-5 text-base leading-8 text-muted" role="list">
                    {section.items.map((item) => (
                      <li key={item} className="list-disc pl-1 marker:text-accent">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}

          <section className="mt-8 rounded-md border border-line bg-surface p-6 md:p-8">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-balance">
              {currentLocale === "bg" ? "Контакт и жалби" : "Contact and complaints"}
            </h2>
            <div className="mt-5 grid gap-3 text-base leading-7 text-muted">
              <p>
                <strong className="text-foreground">{content.brandName}</strong>
              </p>
              <p>
                <a className="underline decoration-accent underline-offset-4" href={`mailto:${settings.email}`}>
                  {settings.email}
                </a>
              </p>
              <p>
                <a
                  className="underline decoration-accent underline-offset-4"
                  href="https://cpdp.bg/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {currentLocale === "bg"
                    ? "Комисия за защита на личните данни"
                    : "Bulgarian Commission for Personal Data Protection"}
                </a>
              </p>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
