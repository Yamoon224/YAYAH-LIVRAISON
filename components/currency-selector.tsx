"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCurrency } from "@/contexts/currency-context"
import { DollarSign, Euro, Coins } from "lucide-react"

export function CurrencySelector() {
  const { currency, setCurrency, loading } = useCurrency()

  const currencies = [
    { code: "GNF", name: "Franc Guinéen", icon: Coins },
    { code: "USD", name: "US Dollar", icon: DollarSign },
    { code: "EUR", name: "Euro", icon: Euro },
  ]

  const currentCurrency = currencies.find((curr) => curr.code === currency)
  const CurrentIcon = currentCurrency?.icon || Coins

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading}>
          <CurrentIcon className="h-4 w-4 mr-2" />
          {currency}
          {loading && <span className="ml-1 text-xs">...</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {currencies.map((curr) => {
          const Icon = curr.icon
          return (
            <DropdownMenuItem key={curr.code} onClick={() => setCurrency(curr.code as any)}>
              <Icon className="h-4 w-4 mr-2" />
              {curr.code} - {curr.name}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
