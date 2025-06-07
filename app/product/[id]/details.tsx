"use client"

import { useState } from "react"
import { ArrowLeft, ShoppingCart, Phone, MessageCircle, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useCurrency } from "@/contexts/currency-context"
import { useLanguage } from "@/contexts/language-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { CurrencySelector } from "@/components/currency-selector"
import { LanguageSelector } from "@/components/language-selector"

interface Product {
  id: number
  category: string
  name: string
  price: number
  description: string | null
  photo: string
  status: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export default function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart, getCartItemsCount } = useCart()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      photo: product.photo,
      quantity,
    })
  }

  const getImageUrl = (photo: string) => {
    return photo
    // return `https://api.groupmafamo.com/${photo}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.webp" alt="YAYAH LIVRAISON" width={200} height={80} className="h-12 w-auto" />
            </Link>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <LanguageSelector />
                <CurrencySelector />
                <ThemeToggle />
              </div>

              <Link href="/cart" className="relative">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t("cart")}
                  {getCartItemsCount() > 0 && <Badge className="ml-2 bg-orange-500">{getCartItemsCount()}</Badge>}
                </Button>
              </Link>

              <div className="hidden md:flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="tel:+224666885555">
                    <Phone className="h-4 w-4 mr-2" />
                    {t("call")}
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://wa.me/224666885555" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t("whatsapp")}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="relative aspect-[4/3]">
              <Image
                src={getImageUrl(product.photo)}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain rounded-md"
                priority
              />
            </CardContent>
          </Card>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{product.name}</h1>
            <p className="mb-4 text-gray-700 dark:text-gray-300">{product.description || t("noDescription")}</p>
            <p className="mb-4 text-xl font-semibold text-orange-600 dark:text-orange-400">
              {formatPrice(product.price)}
            </p>

            {/* Quantity selector */}
            <div className="flex items-center space-x-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                aria-label="Diminuer la quantité"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Augmenter la quantité"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleAddToCart} className="w-full bg-orange-500 hover:bg-orange-600">
              {t("addToCart")}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
