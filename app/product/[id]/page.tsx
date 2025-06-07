import axios from "axios"
import ProductDetails from "./details"

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

async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const response = await axios.get("https://api.groupmafamo.com/v1/products", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      timeout: 10000,
    })

    if (response.status === 200 && response.data) {
      const foundProduct = response.data.find((p: Product) => p.id === Number(id))
      if (foundProduct) return foundProduct
    }
  } catch (error) {
    console.warn("Erreur API lors de fetchProduct:", error)
  }

  // fallback products
  const fallbackProducts: Product[] = [
    {
      id: 1,
      category: "Cosmétique",
      name: "Huile",
      price: 45000,
      description: "Huile cosmétique de qualité premium...",
      photo: "images/products/huile.webp",
      status: "STOCK",
      created_at: "2025-06-03T22:18:41.000000Z",
      updated_at: "2025-06-03T22:18:41.000000Z",
      deleted_at: null,
    },
    // ... autres produits fallback comme dans ton code
  ]

  return fallbackProducts.find((p) => p.id === Number(id)) || null
}

export async function generateStaticParams() {
  try {
    const response = await axios.get("https://api.groupmafamo.com/v1/products")
    console.log(response)
    const products = response.data
    return products.map((product: { id: string }) => ({ id: String(product.id) }))
  } catch (error) {
    console.error("Erreur dans generateStaticParams :", error)
    return []
  }
}

export default async function ProductPage({ params }: { params: any }) {
  const product = await fetchProduct(params.id)

  if (!product) {
    // next/navigation n'est pas utilisable côté serveur, donc on peut renvoyer un 404 comme ça :
    // Ou créer une page spécifique 404
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1>Produit non trouvé</h1>
      </div>
    )
  }

  return <ProductDetails product={product} />
}
