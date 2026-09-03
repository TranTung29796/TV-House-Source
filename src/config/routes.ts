export const appRoutes = {
  marketing: {
    product: "/",
    howItWorks: "/how-it-works",
    overview: "/",
    pricing: "/pricing",
  },
  auth: {
    login: "/login",
    signup: "/signup",
  },
  product: {
    account: "/account",
  },
  legal: {
    faq: "/faq",
    privacy: "/privacy",
    terms: "/terms",
  },
} as const;
