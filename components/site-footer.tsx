"use client"

import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.product")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.features")}
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.pricing")}
                </Link>
              </li>
              <li>
                <Link href="#templates" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.templates")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link href="#careers" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.careers")}
                </Link>
              </li>
              <li>
                <Link href="#blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.blog")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.legal")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="#terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold">Cardly</span>
            </Link>
            <p className="text-muted-foreground mb-4">Create beautiful interactive cards in minutes.</p>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">{t("footer.copyright")}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#twitter" className="text-muted-foreground hover:text-foreground">
              Twitter
            </Link>
            <Link href="#facebook" className="text-muted-foreground hover:text-foreground">
              Facebook
            </Link>
            <Link href="#instagram" className="text-muted-foreground hover:text-foreground">
              Instagram
            </Link>
            <Link href="#github" className="text-muted-foreground hover:text-foreground">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
