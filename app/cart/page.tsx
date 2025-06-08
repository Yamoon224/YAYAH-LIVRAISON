"use client"

import { useState } from "react"
import { Minus, Plus, Trash2, ArrowLeft, Phone, MessageCircle, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useCurrency } from "@/contexts/currency-context"
import { useLanguage } from "@/contexts/language-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { CurrencySelector } from "@/components/currency-selector"
import { LanguageSelector } from "@/components/language-selector"
import { MobileMenu } from "@/components/mobile-menu"
import axios from "axios"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [showCheckout, setShowCheckout] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderStatus, setOrderStatus] = useState<"idle" | "success" | "error">("idle")
  const [orderMessage, setOrderMessage] = useState("")
  const [customerInfo, setCustomerInfo] = useState({
    customer: "",
    phone: "",
    email: "",
    address: "",
  })

  const showSuccessToast = () => {
    toast({
      title: "✅ Commande reçue",
      description: "Commande bien reçue, nous vous contacterons bientôt pour la confirmation",
      className: "bg-green-50 border-green-200 text-green-800",
    })
  }

  const submitOrderToAPI = async () => {
    setIsSubmitting(true)
    setOrderStatus("idle")

    try {
      const orderData = {
        order: {
          customer: customerInfo.customer,
          phone: customerInfo.phone,
          email: customerInfo.email,
          address: customerInfo.address,
        },
        details: cartItems.map((item) => ({
          product_id: item.id,
          qty: item.quantity,
        })),
      }

      // En environnement de prévisualisation, simuler une réponse réussie
      if (window.location.hostname.includes("vercel.app") || window.location.hostname === "localhost") {
        console.log("Mode prévisualisation: simulation d'une commande réussie", orderData)

        // Simuler un délai de réseau
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Simuler une réponse réussie
        handleOrderSuccess(orderData)
        return
      }

      const response = await axios.post("https://api.groupmafamo.com/v1/orders", orderData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000, // 15 seconds timeout
      })

      if (response.status === 200 || response.status === 201) {
        handleOrderSuccess(orderData)
      }
    } catch (error) {
      console.error("Erreur lors de la soumission de la commande:", error)
      setOrderStatus("error")

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          setOrderMessage("Timeout de la requête. Veuillez réessayer.")
        } else if (error.response) {
          setOrderMessage(`Erreur serveur: ${error.response.status}. Veuillez réessayer.`)
        } else if (error.request) {
          console.log(error);
          setOrderMessage(`Erreur Request: ${error.request.status}. Veuillez réessayer.`)

          // setOrderMessage(
          //   "L'API est inaccessible depuis cet environnement. Utilisez l'option WhatsApp pour finaliser votre commande.",
          // )
        } else {
          setOrderMessage("Erreur lors de la soumission. Veuillez réessayer.")
        }
      } else {
        setOrderMessage("Erreur inattendue. Veuillez réessayer ou utiliser l'option WhatsApp.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOrderSuccess = (orderData: any) => {
    setOrderStatus("success")
    setOrderMessage("Commande validée avec succès ! Vous recevrez une confirmation.")

    // Afficher le toast de succès
    showSuccessToast()

    // Sauvegarder la commande dans localStorage
    const orders = JSON.parse(localStorage.getItem("yayah-orders") || "[]")
    orders.push({
      ...orderData,
      id: Date.now(),
      total: getCartTotal(),
      date: new Date().toISOString(),
      status: "confirmed",
    })
    localStorage.setItem("yayah-orders", JSON.stringify(orders))

    // Vider le panier après succès
    setTimeout(() => {
      clearCart()
    }, 2000)
  }

  const handleSubmitOrder = async () => {
    // Validation des champs obligatoires (email n'est plus obligatoire)
    if (!customerInfo.customer || !customerInfo.phone || !customerInfo.address) {
      alert(t("fillRequired"))
      return
    }

    // Valider le format email seulement si l'email est fourni
    if (customerInfo.email && customerInfo.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(customerInfo.email)) {
        alert("Veuillez entrer une adresse email valide")
        return
      }
    }

    // Valider le format du téléphone (doit commencer par + suivi de chiffres)
    const phoneRegex = /^\+[0-9]{1,4}[0-9]{6,14}$/
    if (!phoneRegex.test(customerInfo.phone)) {
      alert("Le numéro de téléphone doit commencer par l'indicatif du pays (ex: +224, +33, +1)")
      return
    }

    await submitOrderToAPI()
  }

  // Modifier la fonction handleWhatsAppOrder pour soumettre d'abord la commande à l'API
  const handleWhatsAppOrder = async () => {
    // Validation des champs obligatoires (email n'est plus obligatoire)
    if (!customerInfo.customer || !customerInfo.phone || !customerInfo.address) {
      alert(t("fillRequired"))
      return
    }

    // Valider le format email seulement si l'email est fourni
    if (customerInfo.email && customerInfo.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(customerInfo.email)) {
        alert("Veuillez entrer une adresse email valide")
        return
      }
    }

    // Valider le format du téléphone (doit commencer par + suivi de chiffres)
    const phoneRegex = /^\+[0-9]{1,4}[0-9]{6,14}$/
    if (!phoneRegex.test(customerInfo.phone)) {
      alert("Le numéro de téléphone doit commencer par l'indicatif du pays (ex: +224, +33, +1)")
      return
    }

    // Soumettre d'abord la commande à l'API
    setIsSubmitting(true)
    setOrderStatus("idle")

    try {
      const orderData = {
        order: {
          customer: customerInfo.customer,
          phone: customerInfo.phone,
          email: customerInfo.email,
          address: customerInfo.address,
        },
        details: cartItems.map((item) => ({
          product_id: item.id,
          qty: item.quantity,
        })),
      }

      // En environnement de prévisualisation, simuler une réponse réussie
      if (window.location.hostname.includes("vercel.app") || window.location.hostname === "localhost") {
        console.log("Mode prévisualisation: simulation d'une commande réussie", orderData)

        // Simuler un délai de réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simuler une réponse réussie
        handleOrderSuccess(orderData)
      } else {
        const response = await axios.post("https://api.groupmafamo.com/v1/orders", orderData, {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000, // 15 seconds timeout
        })

        if (response.status === 200 || response.status === 201) {
          handleOrderSuccess(orderData)
        }
      }

      // Après avoir enregistré la commande avec succès, ouvrir WhatsApp
      const message = `🛍️ *NOUVELLE COMMANDE YAYAH LIVRAISON*

👤 *Client:* ${customerInfo.customer}
📞 *Téléphone:* ${customerInfo.phone}
${customerInfo.email ? `📧 *Email:* ${customerInfo.email}` : ""}
📍 *Adresse:* ${customerInfo.address}

🛒 *Produits commandés:*
${cartItems.map((item) => `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`).join("\n")}

💰 *Total:* ${formatPrice(getCartTotal())}

Merci pour votre commande ! 🚀`

      const whatsappUrl = `https://wa.me/224666885555?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    } catch (error) {
      console.error("Erreur lors de la soumission de la commande:", error)
      setOrderStatus("error")

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          setOrderMessage("Timeout de la requête. Veuillez réessayer.")
        } else if (error.response) {
          setOrderMessage(`Erreur serveur: ${error.response.status}. Veuillez réessayer.`)
        } else if (error.request) {
          setOrderMessage(
            "L'API est inaccessible depuis cet environnement. Utilisez l'option WhatsApp pour finaliser votre commande.",
          )
        } else {
          setOrderMessage("Erreur lors de la soumission. Veuillez réessayer.")
        }
      } else {
        setOrderMessage("Erreur inattendue. Veuillez réessayer ou utiliser l'option WhatsApp.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to get the full image URL
  const getImageUrl = (photo: string) => {
    if (photo.startsWith("http")) {
      return photo
    }
    return `https://api.groupmafamo.com/${photo}`
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/logo.webp" alt="YAYAH LIVRAISON" width={200} height={80} className="h-12 w-auto" />
              </Link>
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-2">
                  <LanguageSelector />
                  <CurrencySelector />
                  <ThemeToggle />
                </div>
                <MobileMenu />
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold mb-4 dark:text-white">{t("emptyCart")}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{t("emptyCartDesc")}</p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("continueShopping")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.webp" alt="YAYAH LIVRAISON" width={200} height={80} className="h-12 w-auto" />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="hidden md:flex items-center space-x-2">
                <LanguageSelector />
                <CurrencySelector />
                <ThemeToggle />
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
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back")}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold dark:text-white">
            {t("myCart")} ({cartItems.length} {t("articles")})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={getImageUrl(item.photo) || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `/placeholder.svg?height=80&width=80&text=${encodeURIComponent(item.name)}`
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg dark:text-white">{item.name}</h3>
                      <p className="text-orange-600 font-bold">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold dark:text-white">{item.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">{t("orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-lg font-bold border-t pt-4">
                  <span className="dark:text-white">{t("total")}:</span>
                  <span className="text-orange-600">{formatPrice(getCartTotal())}</span>
                </div>

                {/* Order Status Messages */}
                {orderStatus === "success" && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">{orderMessage}</AlertDescription>
                  </Alert>
                )}

                {orderStatus === "error" && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">{orderMessage}</AlertDescription>
                  </Alert>
                )}

                {/* Mode prévisualisation notice */}
                {(window.location.hostname.includes("vercel.app") || window.location.hostname === "localhost") && (
                  <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                      Mode prévisualisation: Les commandes seront simulées sans appel API réel.
                    </AlertDescription>
                  </Alert>
                )}

                {!showCheckout ? (
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => setShowCheckout(true)}
                    disabled={orderStatus === "success"}
                  >
                    {t("placeOrder")}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customer" className="dark:text-white">
                        {t("customerName")} *
                      </Label>
                      <Input
                        id="customer"
                        value={customerInfo.customer}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, customer: e.target.value })}
                        placeholder="Moussa TOURE"
                        className="dark:bg-gray-700 dark:border-gray-600"
                        disabled={isSubmitting || orderStatus === "success"}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="dark:text-white">
                        {t("phone")} *
                      </Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="+224620879890 / +33612345678 / +1234567890"
                        className="dark:bg-gray-700 dark:border-gray-600"
                        disabled={isSubmitting || orderStatus === "success"}
                      />
                      <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                        Format: +[indicatif pays][numéro] (ex: +224, +33, +1)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="email" className="dark:text-white">
                        Email (optionnel)
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        placeholder="customer@email.com"
                        className="dark:bg-gray-700 dark:border-gray-600"
                        disabled={isSubmitting || orderStatus === "success"}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="dark:text-white">
                        {t("deliveryAddress")} *
                      </Label>
                      <Textarea
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        placeholder="Aéroport International AST, Conakry"
                        rows={3}
                        className="dark:bg-gray-700 dark:border-gray-600"
                        disabled={isSubmitting || orderStatus === "success"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting || orderStatus === "success"}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Validation en cours...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Valider la commande
                          </>
                        )}
                      </Button>

                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={handleWhatsAppOrder}
                        disabled={isSubmitting || orderStatus === "success"}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {t("confirmWhatsApp")}
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowCheckout(false)}
                        disabled={isSubmitting || orderStatus === "success"}
                      >
                        {t("back")}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
