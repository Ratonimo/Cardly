"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "es"

type Translations = {
  [key: string]: {
    [key in Language]: string
  }
}

// Define all translations here
const translations: Translations = {
  // Navigation
  "nav.home": {
    en: "Home",
    es: "Inicio",
  },
  "nav.features": {
    en: "Features",
    es: "Características",
  },
  "nav.pricing": {
    en: "Pricing",
    es: "Precios",
  },
  "nav.about": {
    en: "About",
    es: "Acerca de",
  },
  "nav.contact": {
    en: "Contact",
    es: "Contacto",
  },
  "nav.login": {
    en: "Login",
    es: "Iniciar Sesión",
  },
  "nav.signup": {
    en: "Sign Up",
    es: "Registrarse",
  },
  "nav.dashboard": {
    en: "Dashboard",
    es: "Panel",
  },

  // Hero section
  "hero.title": {
    en: "Create Interactive Cards in Minutes",
    es: "Crea Tarjetas Interactivas en Minutos",
  },
  "hero.subtitle": {
    en: "Design beautiful, interactive presentation cards with our easy-to-use builder",
    es: "Diseña hermosas tarjetas de presentación interactivas con nuestro constructor fácil de usar",
  },
  "hero.cta": {
    en: "Get Started",
    es: "Comenzar",
  },
  "hero.secondary": {
    en: "See Examples",
    es: "Ver Ejemplos",
  },

  // Features section
  "features.title": {
    en: "Powerful Features",
    es: "Características Potentes",
  },
  "features.subtitle": {
    en: "Everything you need to create stunning interactive cards",
    es: "Todo lo que necesitas para crear impresionantes tarjetas interactivas",
  },
  "features.easy.title": {
    en: "Easy to Use",
    es: "Fácil de Usar",
  },
  "features.easy.description": {
    en: "Intuitive drag-and-drop interface makes card creation simple for everyone",
    es: "Interfaz intuitiva de arrastrar y soltar hace que la creación de tarjetas sea simple para todos",
  },
  "features.components.title": {
    en: "Rich Components",
    es: "Componentes Ricos",
  },
  "features.components.description": {
    en: "Choose from dozens of pre-built components to enhance your cards",
    es: "Elige entre docenas de componentes prediseñados para mejorar tus tarjetas",
  },
  "features.templates.title": {
    en: "Ready-made Templates",
    es: "Plantillas Listas",
  },
  "features.templates.description": {
    en: "Start with professional templates or create your own from scratch",
    es: "Comienza con plantillas profesionales o crea las tuyas desde cero",
  },
  "features.share.title": {
    en: "Easy Sharing",
    es: "Compartir Fácilmente",
  },
  "features.share.description": {
    en: "Share your cards via link, embed them on websites, or export as images",
    es: "Comparte tus tarjetas mediante enlaces, incrustalas en sitios web o exportalas como imágenes",
  },

  // Pricing section
  "pricing.title": {
    en: "Simple Pricing",
    es: "Precios Simples",
  },
  "pricing.subtitle": {
    en: "Choose the plan that works for you",
    es: "Elige el plan que funcione para ti",
  },
  "pricing.free.title": {
    en: "Free",
    es: "Gratis",
  },
  "pricing.free.price": {
    en: "$0",
    es: "$0",
  },
  "pricing.free.period": {
    en: "forever",
    es: "para siempre",
  },
  "pricing.free.feature1": {
    en: "Up to 5 cards",
    es: "Hasta 5 tarjetas",
  },
  "pricing.free.feature2": {
    en: "Basic components",
    es: "Componentes básicos",
  },
  "pricing.free.feature3": {
    en: "Community support",
    es: "Soporte comunitario",
  },
  "pricing.free.cta": {
    en: "Get Started",
    es: "Comenzar",
  },
  "pricing.pro.title": {
    en: "Pro",
    es: "Pro",
  },
  "pricing.pro.price": {
    en: "$9",
    es: "$9",
  },
  "pricing.pro.period": {
    en: "per month",
    es: "por mes",
  },
  "pricing.pro.feature1": {
    en: "Unlimited cards",
    es: "Tarjetas ilimitadas",
  },
  "pricing.pro.feature2": {
    en: "All components",
    es: "Todos los componentes",
  },
  "pricing.pro.feature3": {
    en: "Priority support",
    es: "Soporte prioritario",
  },
  "pricing.pro.feature4": {
    en: "Custom branding",
    es: "Marca personalizada",
  },
  "pricing.pro.cta": {
    en: "Upgrade to Pro",
    es: "Actualizar a Pro",
  },
  "pricing.team.title": {
    en: "Team",
    es: "Equipo",
  },
  "pricing.team.price": {
    en: "$29",
    es: "$29",
  },
  "pricing.team.period": {
    en: "per month",
    es: "por mes",
  },
  "pricing.team.feature1": {
    en: "Everything in Pro",
    es: "Todo en Pro",
  },
  "pricing.team.feature2": {
    en: "Team collaboration",
    es: "Colaboración en equipo",
  },
  "pricing.team.feature3": {
    en: "Advanced analytics",
    es: "Análisis avanzados",
  },
  "pricing.team.feature4": {
    en: "Dedicated support",
    es: "Soporte dedicado",
  },
  "pricing.team.cta": {
    en: "Contact Sales",
    es: "Contactar Ventas",
  },

  // Testimonials
  "testimonials.title": {
    en: "What Our Users Say",
    es: "Lo Que Dicen Nuestros Usuarios",
  },
  "testimonials.1.quote": {
    en: "Cardly has transformed how we present our business cards. So easy to use!",
    es: "Cardly ha transformado cómo presentamos nuestras tarjetas de negocio. ¡Muy fácil de usar!",
  },
  "testimonials.1.author": {
    en: "Sarah Johnson",
    es: "Sarah Johnson",
  },
  "testimonials.1.role": {
    en: "Marketing Director",
    es: "Directora de Marketing",
  },
  "testimonials.2.quote": {
    en: "The templates are professional and saved me hours of design work.",
    es: "Las plantillas son profesionales y me ahorraron horas de trabajo de diseño.",
  },
  "testimonials.2.author": {
    en: "Michael Chen",
    es: "Michael Chen",
  },
  "testimonials.2.role": {
    en: "Freelance Designer",
    es: "Diseñador Freelance",
  },

  // CTA section
  "cta.title": {
    en: "Ready to Create Amazing Cards?",
    es: "¿Listo para Crear Tarjetas Increíbles?",
  },
  "cta.subtitle": {
    en: "Join thousands of users creating interactive cards with Cardly",
    es: "Únete a miles de usuarios creando tarjetas interactivas con Cardly",
  },
  "cta.button": {
    en: "Start Building Now",
    es: "Empieza a Construir Ahora",
  },

  // Footer
  "footer.product": {
    en: "Product",
    es: "Producto",
  },
  "footer.features": {
    en: "Features",
    es: "Características",
  },
  "footer.pricing": {
    en: "Pricing",
    es: "Precios",
  },
  "footer.templates": {
    en: "Templates",
    es: "Plantillas",
  },
  "footer.company": {
    en: "Company",
    es: "Empresa",
  },
  "footer.about": {
    en: "About Us",
    es: "Sobre Nosotros",
  },
  "footer.careers": {
    en: "Careers",
    es: "Carreras",
  },
  "footer.blog": {
    en: "Blog",
    es: "Blog",
  },
  "footer.legal": {
    en: "Legal",
    es: "Legal",
  },
  "footer.privacy": {
    en: "Privacy Policy",
    es: "Política de Privacidad",
  },
  "footer.terms": {
    en: "Terms of Service",
    es: "Términos de Servicio",
  },
  "footer.copyright": {
    en: "© 2023 Cardly. All rights reserved.",
    es: "© 2023 Cardly. Todos los derechos reservados.",
  },

  // Language selector
  "language.select": {
    en: "Language",
    es: "Idioma",
  },
  "language.english": {
    en: "English",
    es: "Inglés",
  },
  "language.spanish": {
    en: "Spanish",
    es: "Español",
  },

  // Theme toggle
  "theme.light": {
    en: "Light Mode",
    es: "Modo Claro",
  },
  "theme.dark": {
    en: "Dark Mode",
    es: "Modo Oscuro",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
    return translations[key][language]
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
