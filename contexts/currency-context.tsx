"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

type Currency = "GNF" | "USD" | "EUR"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  convertPrice: (priceInGNF: number) => number
  formatPrice: (priceInGNF: number) => string
  loading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Fallback rates if API fails
const FALLBACK_RATES = {
  GNF: 1,
  USD: 8333.33, // 600,000 GNF / 72 USD
  EUR: 9230.77, // Approximation
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("GNF")
  const [exchangeRates, setExchangeRates] = useState(FALLBACK_RATES)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedCurrency = localStorage.getItem("yayah-currency") as Currency
    if (savedCurrency && ["GNF", "USD", "EUR"].includes(savedCurrency)) {
      setCurrencyState(savedCurrency)
    }
    fetchExchangeRates()
  }, [])

  const fetchExchangeRates = async () => {
    setLoading(true)
    try {
      const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD", {
        timeout: 5000,
      })

      if (response.status === 200 && response.data) {
        // Calculate GNF rate based on our base rate (72 USD = 600,000 GNF)
        const baseGNFRate = 600000 / 72 // 8333.33 GNF per USD

        setExchangeRates({
          GNF: 1,
          USD: baseGNFRate,
          EUR: baseGNFRate / response.data.rates.EUR, // Convert USD rate to EUR
        })
      } else {
        console.warn("Exchange rate API failed, using fallback rates")
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.warn("Erreur API Exchange Rate Axios:", error.message)
        if (error.code === "ECONNABORTED") {
          console.warn("Timeout de l'API Exchange Rate")
        }
      } else {
        console.warn("Erreur inconnue Exchange Rate:", error)
      }
      console.warn("Utilisation des taux de change de fallback")
    } finally {
      setLoading(false)
    }
  }

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem("yayah-currency", newCurrency)
  }

  const convertPrice = (priceInGNF: number): number => {
    const convertedPrice = priceInGNF / exchangeRates[currency]
    // Add 10% markup
    return convertedPrice * 1.1
  }

  const formatPrice = (priceInGNF: number): string => {
    const convertedPrice = convertPrice(priceInGNF)

    switch (currency) {
      case "USD":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        }).format(convertedPrice)
      case "EUR":
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 2,
        }).format(convertedPrice)
      default:
        return (
          new Intl.NumberFormat("fr-GN", {
            minimumFractionDigits: 0,
          }).format(convertedPrice) + " GNF"
        )
    }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice, loading }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
