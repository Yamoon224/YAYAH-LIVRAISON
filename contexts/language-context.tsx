"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Language = "fr" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  fr: {
    // Header
    cart: "Panier",
    call: "Appeler",
    whatsapp: "WhatsApp",

    // Hero
    heroTitle: "YAYAH LIVRAISON",
    heroSubtitle: "Tous vos produits livrés rapidement et en toute sécurité",
    heroDescription: "Service de livraison professionnel pour tous types de produits",

    // Search & Filters
    searchPlaceholder: "Rechercher un produit...",
    all: "Tous",
    inStock: "En stock",
    addToCart: "Ajouter",
    view: "Voir",

    // Product
    description: "Description",
    characteristics: "Caractéristiques",
    quantity: "Quantité",
    total: "Total",
    addToCartFull: "Ajouter au panier",
    backToProducts: "Retour aux produits",
    productNotFound: "Produit non trouvé",
    backToHome: "Retour à l'accueil",

    // Cart
    myCart: "Mon Panier",
    articles: "articles",
    back: "Retour",
    emptyCart: "Votre panier est vide",
    emptyCartDesc: "Découvrez nos produits de qualité",
    continueShopping: "Continuer les achats",
    orderSummary: "Résumé de la commande",
    placeOrder: "Passer la commande",
    customerName: "Nom du client",
    phone: "Téléphone",
    email: "Email",
    deliveryAddress: "Adresse de livraison",
    notes: "Notes",
    notesPlaceholder: "Instructions spéciales...",
    confirmWhatsApp: "Confirmer via WhatsApp",
    validateOrder: "Valider la commande",
    orderSent: "Commande envoyée ! Vous allez être redirigé vers WhatsApp.",
    fillRequired: "Veuillez remplir tous les champs obligatoires",

    // Footer
    contact: "Contact",
    information: "Informations",
    fastDelivery: "Livraison rapide",
    authenticProducts: "Produits authentiques",
    customerService: "Service client 24/7",
    securePayment: "Paiement sécurisé",
    rightsReserved: "Tous droits réservés",
    trustedPartner: "Votre partenaire de confiance pour la livraison de produits de qualité.",

    // Misc
    noProductsFound: "Aucun produit trouvé",
    loading: "Chargement...",
    error: "Erreur",
    retry: "Réessayer",
    page: "Page",
    of: "sur",
    previous: "Précédent",
    next: "Suivant",
  },
  en: {
    // Header
    cart: "Cart",
    call: "Call",
    whatsapp: "WhatsApp",

    // Hero
    heroTitle: "YAYAH DELIVERY",
    heroSubtitle: "All your products delivered quickly and safely",
    heroDescription: "Professional delivery service for all types of products",

    // Search & Filters
    searchPlaceholder: "Search for a product...",
    all: "All",
    inStock: "In Stock",
    addToCart: "Add",
    view: "View",

    // Product
    description: "Description",
    characteristics: "Characteristics",
    quantity: "Quantity",
    total: "Total",
    addToCartFull: "Add to Cart",
    backToProducts: "Back to Products",
    productNotFound: "Product Not Found",
    backToHome: "Back to Home",

    // Cart
    myCart: "My Cart",
    articles: "items",
    back: "Back",
    emptyCart: "Your cart is empty",
    emptyCartDesc: "Discover our quality products",
    continueShopping: "Continue Shopping",
    orderSummary: "Order Summary",
    placeOrder: "Place Order",
    customerName: "Customer Name",
    phone: "Phone",
    email: "Email",
    deliveryAddress: "Delivery Address",
    notes: "Notes",
    notesPlaceholder: "Special instructions...",
    confirmWhatsApp: "Confirm via WhatsApp",
    validateOrder: "Validate Order",
    orderSent: "Order sent! You will be redirected to WhatsApp.",
    fillRequired: "Please fill in all required fields",

    // Footer
    contact: "Contact",
    information: "Information",
    fastDelivery: "Fast Delivery",
    authenticProducts: "Authentic Products",
    customerService: "24/7 Customer Service",
    securePayment: "Secure Payment",
    rightsReserved: "All rights reserved",
    trustedPartner: "Your trusted partner for quality product delivery.",

    // Misc
    noProductsFound: "No products found",
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    page: "Page",
    of: "of",
    previous: "Previous",
    next: "Next",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("yayah-language") as Language
    if (savedLanguage && ["fr", "en"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("yayah-language", newLanguage)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key
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
