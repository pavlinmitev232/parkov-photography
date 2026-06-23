import { connection } from "next/server";
import { prisma } from "@/lib/db/prisma";

const defaultTestimonials = [
  {
    nameBg: "Мария Д.",
    nameEn: "Maria D.",
    roleBg: "Портретна сесия",
    roleEn: "Portrait client",
    quoteBg:
      "Сесията беше спокойна, а снимките изглеждат естествено. Комуникацията преди и след това беше много ясна.",
    quoteEn:
      "The session felt easy and the photos looked natural. Communication before and after was very clear.",
  },
  {
    nameBg: "Николай П.",
    nameEn: "Nikolay P.",
    roleBg: "Корпоративно събитие",
    roleEn: "Corporate event",
    quoteBg:
      "Бърз отговор, добра насока по време на събитието и галерия, готова за споделяне с екипа.",
    quoteEn:
      "Fast response, good direction during the event, and a gallery that was ready to share with the team.",
  },
  {
    nameBg: "Елена В.",
    nameEn: "Elena V.",
    roleBg: "Сватбено заснемане",
    roleEn: "Wedding client",
    quoteBg:
      "Детайлите, атмосферата и хората бяха уловени прекрасно. Точно усещането, което искахме.",
    quoteEn:
      "The details, atmosphere, and people were captured beautifully. Exactly the feeling we wanted.",
  },
];

const defaultFaqs = [
  {
    questionBg: "Пътувате ли извън един град?",
    questionEn: "Do you travel outside one city?",
    answerBg:
      "Да. Работата може да бъде в цяла България, а пътните разходи се уточняват според локацията.",
    answerEn:
      "Yes. Coverage is available across Bulgaria, with travel costs confirmed for the location.",
  },
  {
    questionBg: "Колко бързо се предават снимките?",
    questionEn: "How fast are photos delivered?",
    answerBg:
      "Срокът зависи от вида заснемане и се потвърждава с офертата.",
    answerEn:
      "Delivery depends on the shoot type and is confirmed with the quote.",
  },
  {
    questionBg: "Изисква ли се капаро?",
    questionEn: "Is a deposit required?",
    answerBg:
      "За по-големи събития капарото запазва датата. Точните условия се уточняват предварително.",
    answerEn:
      "For larger events, a deposit reserves the date. Exact terms are confirmed in advance.",
  },
  {
    questionBg: "Включени ли са RAW файлове?",
    questionEn: "Are RAW files included?",
    answerBg:
      "Клиентите получават селектирани и обработени финални изображения. RAW файловете не са част от стандартната доставка.",
    answerEn:
      "Clients receive selected and edited final images. RAW files are not part of the standard delivery.",
  },
  {
    questionBg: "Може ли комуникация на български и английски?",
    questionEn: "Can clients use Bulgarian or English?",
    answerBg: "Да. Комуникацията и сайтът поддържат и двата езика.",
    answerEn: "Yes. Communication and the website support both languages.",
  },
];

export async function ensureDefaultReviewsAndFaqs() {
  const [testimonialCount, faqCount] = await Promise.all([
    prisma.testimonial.count(),
    prisma.faqItem.count(),
  ]);

  await Promise.all([
    testimonialCount === 0
      ? prisma.testimonial.createMany({
          data: defaultTestimonials.map((item, index) => ({
            ...item,
            visible: true,
            sortOrder: index + 1,
          })),
        })
      : Promise.resolve(),
    faqCount === 0
      ? prisma.faqItem.createMany({
          data: defaultFaqs.map((item, index) => ({
            ...item,
            visible: true,
            sortOrder: index + 1,
          })),
        })
      : Promise.resolve(),
  ]);
}

export async function getPublicTestimonials(locale: string) {
  await connection();
  try {
    const items = await prisma.testimonial.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    const source = items.length > 0 ? items : defaultTestimonials;
    return source.map((item, index) => ({
      id: "id" in item ? String(item.id) : `testimonial-${index}`,
      name: locale === "bg" ? item.nameBg : item.nameEn,
      role: locale === "bg" ? item.roleBg : item.roleEn,
      quote: locale === "bg" ? item.quoteBg : item.quoteEn,
    }));
  } catch {
    return defaultTestimonials.map((item, index) => ({
      id: `testimonial-${index}`,
      name: locale === "bg" ? item.nameBg : item.nameEn,
      role: locale === "bg" ? item.roleBg : item.roleEn,
      quote: locale === "bg" ? item.quoteBg : item.quoteEn,
    }));
  }
}

export async function getPublicFaqs(locale: string) {
  await connection();
  try {
    const items = await prisma.faqItem.findMany({
      where: { visible: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    const source = items.length > 0 ? items : defaultFaqs;
    return source.map((item, index) => ({
      id: "id" in item ? String(item.id) : `faq-${index}`,
      question: locale === "bg" ? item.questionBg : item.questionEn,
      answer: locale === "bg" ? item.answerBg : item.answerEn,
    }));
  } catch {
    return defaultFaqs.map((item, index) => ({
      id: `faq-${index}`,
      question: locale === "bg" ? item.questionBg : item.questionEn,
      answer: locale === "bg" ? item.answerBg : item.answerEn,
    }));
  }
}

export async function getOwnerReviewsAndFaqs() {
  const [testimonials, faqs] = await Promise.all([
    prisma.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.faqItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);
  return { testimonials, faqs };
}
