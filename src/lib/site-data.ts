import {
  Aperture,
  Building2,
  Camera,
  Gem,
  Heart,
  Home,
  Landmark,
  Tags,
  PartyPopper,
  Sparkles,
  Users,
} from "lucide-react";

export const serviceIcons = {
  heart: Heart,
  camera: Camera,
  party: PartyPopper,
  gem: Gem,
  building: Building2,
  home: Home,
  users: Users,
  sparkles: Sparkles,
};

export const portfolio = [
  {
    id: "sofia-wedding-light",
    title: "Sofia Wedding Light",
    category: "weddings",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "editorial-portrait",
    title: "Editorial Portrait",
    category: "portraits",
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "product-detail",
    title: "Product Detail",
    category: "commercial",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "city-event",
    title: "City Event",
    category: "events",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "family-afternoon",
    title: "Family Afternoon",
    category: "family",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "interior-mood",
    title: "Interior Mood",
    category: "realEstate",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "business-portrait",
    title: "Business Portrait",
    category: "business",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mountain-couple",
    title: "Mountain Couple",
    category: "weddings",
    image:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80",
  },
];

export const galleryCategories = [
  "all",
  "weddings",
  "portraits",
  "events",
  "commercial",
  "business",
  "realEstate",
  "family",
];

export const stats = [
  { value: "12+", key: "years" },
  { value: "480+", key: "projects" },
  { value: "4.9", key: "rating" },
  { value: "24h", key: "reply" },
];

export const testimonials = ["maria", "nikolay", "elena"];

export const faqs = ["travel", "delivery", "deposit", "raw", "languages"];

export const requestMethods = [
  { key: "phone", href: "tel:+359888000000" },
  { key: "viber", href: "viber://chat?number=%2B359888000000" },
  { key: "whatsapp", href: "https://wa.me/359888000000" },
  { key: "email", href: "mailto:hello@parkov.photo" },
];

export const socials = [
  { key: "instagram", href: "https://instagram.com/parkov.photo" },
  { key: "facebook", href: "https://facebook.com/parkov.photo" },
  { key: "tiktok", href: "https://tiktok.com/@parkov.photo" },
];

export const adminCards = [
  { key: "photos", icon: Aperture },
  { key: "categories", icon: Tags },
  { key: "services", icon: Landmark },
  { key: "requests", icon: Users },
  { key: "settings", icon: Sparkles },
];
