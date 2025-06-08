"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingCart, Phone, MessageCircle, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { MobileMenu } from "@/components/mobile-menu"
import { Pagination } from "@/components/pagination"
import axios from "axios"

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

const PRODUCTS_PER_PAGE = 12

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const { addToCart, getCartItemsCount } = useCart()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://api.groupmafamo.com/v1/products", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 seconds timeout
      })

      if (response.status === 200 && response.data) {
        setProducts(response.data)
        setFilteredProducts(response.data)
        setLoading(false)
        return
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.warn("Erreur API Axios:", error.message)
        if (error.code === "ECONNABORTED") {
          console.warn("Timeout de l'API")
        } else if (error.response) {
          console.warn("Erreur de réponse:", error.response.status, error.response.statusText)
        } else if (error.request) {
          console.warn("Erreur de requête:", error.request)
        }
      } else {
        console.warn("Erreur inconnue:", error)
      }
      console.warn("Utilisation des données de démonstration")
    }

    // Fallback data with more products for pagination demo
    const fallbackProducts = [
      {
        "id": 1,
        "category": "Cosmétique",
        "name": "Huile",
        "price": 45000,
        "description": null,
        "photo": "https://groupmafamo.com/images/products/huile.webp",
        "status": "STOCK",
        "created_at": "2025-06-03T22:18:41.000000Z",
        "updated_at": "2025-06-08T03:59:06.000000Z",
        "deleted_at": null
      },
      {
        "id": 2,
        "category": "Cosmétique",
        "name": "Crême",
        "price": 45000,
        "description": null,
        "photo": "https://groupmafamo.com/images/products/creme.webp",
        "status": "STOCK",
        "created_at": "2025-06-03T22:18:41.000000Z",
        "updated_at": "2025-06-08T03:59:12.000000Z",
        "deleted_at": null
      },
      {
        "id": 3,
        "category": "Cosmétique",
        "name": "Crême mains",
        "price": 29000,
        "description": null,
        "photo": "https://groupmafamo.com/images/products/creme_mains.webp",
        "status": "STOCK",
        "created_at": "2025-06-03T22:18:41.000000Z",
        "updated_at": "2025-06-08T04:00:55.000000Z",
        "deleted_at": null
      },
      {
        "id": 4,
        "category": "Cosmétique",
        "name": "Crême Visage",
        "price": 43000,
        "description": null,
        "photo": "https://groupmafamo.com/images/products/creme_visage.webp",
        "status": "STOCK",
        "created_at": "2025-06-03T22:18:41.000000Z",
        "updated_at": "2025-06-08T04:00:49.000000Z",
        "deleted_at": null
      },
      {
        "id": 5,
        "category": "Cosmétique",
        "name": "Gel Intime",
        "price": 30000,
        "description": null,
        "photo": "https://groupmafamo.com/images/products/gel_intime.webp",
        "status": "STOCK",
        "created_at": "2025-06-03T22:18:41.000000Z",
        "updated_at": "2025-06-08T04:00:35.000000Z",
        "deleted_at": null
      },
      {
        "id": 6,
        "category": "Cosmétique",
        "name": "Gel 1250",
        "price": 35000,
        "description": null,
        "photo": "https://groupmafamo.com/images/products/gel_1250.webp",
        "status": "STOCK",
        "created_at": "2025-06-03T22:18:41.000000Z",
        "updated_at": "2025-06-08T04:00:26.000000Z",
        "deleted_at": null
      },
      {
        "id": 7,
        "category": "Cosmétique",
        "name": "Produits Bébé",
        "price": 55000,
        "description": null,
        "photo": "https://groupmafamo.com/images/products/produit_bebe.webp",
        "status": "STOCK",
        "created_at": "2025-06-03T22:18:41.000000Z",
        "updated_at": "2025-06-08T04:00:22.000000Z",
        "deleted_at": null
      },
      {
        "id": 8,
        "category": "Cosmétique",
        "name": "Gel Mains",
        "price": 30000,
        "description": null,
        "photo": "https://groupmafamo.com/images/products/gel_main.webp",
        "status": "STOCK",
        "created_at": "2025-06-03T22:18:41.000000Z",
        "updated_at": "2025-06-08T04:00:13.000000Z",
        "deleted_at": null
      },
      {
        "id": 9,
        "category": "Cosmétique",
        "name": "Gel de douche",
        "price": 35000,
        "description": null,
        "photo": "https://groupmafamo.com/images/products/gel_douche.webp",
        "status": "STOCK",
        "created_at": "2025-06-03T22:18:41.000000Z",
        "updated_at": "2025-06-08T04:00:08.000000Z",
        "deleted_at": null
      },
      {
        "id": 10,
        "category": "Cosmétique",
        "name": "Parfum Déo",
        "price": 28000,
        "description": null,
        "photo": "https://groupmafamo.com/images/products/parfum_deo.webp",
        "status": "STOCK",
        "created_at": "2025-06-03T22:18:41.000000Z",
        "updated_at": "2025-06-08T04:00:00.000000Z",
        "deleted_at": null
      },
      {
        "id": 11,
        "category": "Cosmétique",
        "name": "Rool On",
        "price": 21000,
        "description": null,
        "photo": "https://groupmafamo.com/images/products/rool_on.webp",
        "status": "STOCK",
        "created_at": "2025-06-03T22:18:41.000000Z",
        "updated_at": "2025-06-08T03:59:50.000000Z",
        "deleted_at": null
      }
    ]

    setProducts(fallbackProducts)
    setFilteredProducts(fallbackProducts)
    setLoading(false)
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.price.toString().includes(searchTerm),
      )
    }

    if (selectedCategory !== "Tous" && selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const categories = [t("all"), ...Array.from(new Set(products.map((p) => p.category)))]

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      photo: product.photo,
      quantity: 1,
    })
  }

  // Function to get the full image URL
  const getImageUrl = (photo: string) => {
    // If photo starts with 'http', it's already a full URL
    // if (photo.startsWith("http")) {
      return photo
    // }
    // Otherwise, prepend the API base URL
    // return `https://api.groupmafamo.com/${photo}`
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.webp" alt="YAYAH LIVRAISON" width={200} height={80} className="h-12 w-auto" />
            </Link>

            <div className="flex items-center space-x-4">
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-2">
                <LanguageSelector />
                <CurrencySelector />
                <ThemeToggle />
              </div>

              {/* Cart Button - Always visible */}
              <Link href="/cart" className="relative">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t("cart")}
                  {getCartItemsCount() > 0 && <Badge className="ml-2 bg-orange-500">{getCartItemsCount()}</Badge>}
                </Button>
              </Link>

              {/* Desktop Contact Buttons */}
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

              {/* Mobile Menu */}
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-blue-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-blue-600"></div>
        <div
          className="absolute inset-0 bg-cover bg-right md:bg-center"
          style={{
            backgroundImage: "url('/hero-delivery.png')",
          }}
        ></div>
        <div className="container mx-auto px-4 text-center md:text-left relative z-10">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{t("heroTitle")}</h1>
            <p className="text-xl md:text-2xl mb-4">{t("heroSubtitle")}</p>
            <p className="text-lg mb-8 opacity-90">{t("heroDescription")}</p>
            <div className="flex items-center md:justify-start justify-center space-x-4 text-lg">
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <a href="tel:+224666885555" className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +224 666 88 55 55
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="container mx-auto px-4 py-8">
        {/* Search Bar Row */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Categories Row */}
        <div className="mb-8">
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden dark:bg-gray-800 dark:border-gray-700"
            >
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={getImageUrl(product.photo) || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(product.name)}`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {product.status === "STOCK" && (
                    <Badge className="absolute top-3 right-3 bg-green-500 text-white">{t("inStock")}</Badge>
                  )}
                  <div className="absolute bottom-3 left-3 right-3">
                    <Badge variant="secondary" className="text-xs mb-2 bg-white/90 text-gray-800">
                      {product.category}
                    </Badge>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg dark:text-white line-clamp-1">{product.name}</h3>

                  <div className="flex items-center justify-between">
                    <span className="text-md font-bold text-orange-600">{formatPrice(product.price)}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.status !== "STOCK"}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {t("addToCart")}
                    </Button>
                    <Button variant="outline" asChild className="px-3">
                      <Link href={`/product/${product.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">{t("noProductsFound")}</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-12 transition-colors">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Image src="/logo.webp" alt="YAYAH LIVRAISON" width={200} height={80} className="h-12 w-auto mb-4" />
              <p className="text-gray-300">{t("trustedPartner")}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t("contact")}</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href="tel:+224666885555" className="hover:text-orange-400">
                    +224 666 88 55 55
                  </a>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <a
                    href="https://wa.me/224666885555"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-400"
                  >
                    {t("whatsapp")}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t("information")}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>{t("fastDelivery")}</li>
                <li>{t("authenticProducts")}</li>
                <li>{t("customerService")}</li>
                <li>{t("securePayment")}</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 YAYAH LIVRAISON. {t("rightsReserved")}.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
