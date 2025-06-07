"use client"

import { useState } from "react"
import { Menu, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { CurrencySelector } from "@/components/currency-selector"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Menu</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Langue</span>
              <LanguageSelector />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Devise</span>
              <CurrencySelector />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Thème</span>
              <ThemeToggle />
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild onClick={() => setOpen(false)}>
              <a href="tel:+224666885555">
                <Phone className="h-4 w-4 mr-2" />
                {t("call")} +224 666 88 55 55
              </a>
            </Button>

            <Button variant="outline" className="w-full justify-start" asChild onClick={() => setOpen(false)}>
              <a href="https://wa.me/224666885555" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" />
                {t("whatsapp")}
              </a>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
