"use client"

import { useState, useEffect } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  photo: string
  quantity: number
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem("yayah-cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  const saveToLocalStorage = (items: CartItem[]) => {
    localStorage.setItem("yayah-cart", JSON.stringify(items))
    setCartItems(items)
  }

  const addToCart = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      const updatedItems = cartItems.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) } : cartItem,
      )
      saveToLocalStorage(updatedItems)
    } else {
      const newItem: CartItem = {
        ...item,
        quantity: item.quantity || 1,
      }
      saveToLocalStorage([...cartItems, newItem])
    }
  }

  const removeFromCart = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id)
    saveToLocalStorage(updatedItems)
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    const updatedItems = cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    saveToLocalStorage(updatedItems)
  }

  const clearCart = () => {
    localStorage.removeItem("yayah-cart")
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  }
}
