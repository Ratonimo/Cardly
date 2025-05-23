"use client"

import { useLanguage } from "@/lib/language-context"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  MousePointer,
  Layers,
  LayoutTemplateIcon as Template,
  Share2,
  Star,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  {t("hero.title")}
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">{t("hero.subtitle")}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="h-12">
                    {t("hero.cta")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#examples">
                  <Button variant="outline" size="lg" className="h-12">
                    {t("hero.secondary")}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-16 flex justify-center">
              <div className="relative w-full max-w-4xl overflow-hidden rounded-lg border bg-background shadow-xl">
                <img src="/interactive-card-builder-dashboard.png" alt="Cardly Dashboard" className="w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("features.title")}</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">{t("features.subtitle")}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit mb-4">
                    <MousePointer className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{t("features.easy.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t("features.easy.description")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit mb-4">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{t("features.components.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t("features.components.description")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit mb-4">
                    <Template className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{t("features.templates.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t("features.templates.description")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="p-2 rounded-full bg-primary/10 w-fit mb-4">
                    <Share2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{t("features.share.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t("features.share.description")}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("pricing.title")}</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">{t("pricing.subtitle")}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("pricing.free.title")}</CardTitle>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold">{t("pricing.free.price")}</span>
                    <span className="ml-2 text-muted-foreground">{t("pricing.free.period")}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                      {t("pricing.free.feature1")}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                      {t("pricing.free.feature2")}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                      {t("pricing.free.feature3")}
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {t("pricing.free.cta")}
                  </Button>
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card className="border-primary">
                <CardHeader className="bg-primary text-primary-foreground">
                  <CardTitle>{t("pricing.pro.title")}</CardTitle>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold">{t("pricing.pro.price")}</span>
                    <span className="ml-2 text-primary-foreground/80">{t("pricing.pro.period")}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                      {t("pricing.pro.feature1")}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                      {t("pricing.pro.feature2")}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                      {t("pricing.pro.feature3")}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                      {t("pricing.pro.feature4")}
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">{t("pricing.pro.cta")}</Button>
                </CardFooter>
              </Card>

              {/* Team Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("pricing.team.title")}</CardTitle>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold">{t("pricing.team.price")}</span>
                    <span className="ml-2 text-muted-foreground">{t("pricing.team.period")}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                      {t("pricing.team.feature1")}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                      {t("pricing.team.feature2")}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                      {t("pricing.team.feature3")}
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                      {t("pricing.team.feature4")}
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {t("pricing.team.cta")}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{t("testimonials.title")}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-center">
                    <p className="text-lg mb-4">"{t("testimonials.1.quote")}"</p>
                    <footer>
                      <div className="font-semibold">{t("testimonials.1.author")}</div>
                      <div className="text-sm text-muted-foreground">{t("testimonials.1.role")}</div>
                    </footer>
                  </blockquote>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-center">
                    <p className="text-lg mb-4">"{t("testimonials.2.quote")}"</p>
                    <footer>
                      <div className="font-semibold">{t("testimonials.2.author")}</div>
                      <div className="text-sm text-muted-foreground">{t("testimonials.2.role")}</div>
                    </footer>
                  </blockquote>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("cta.title")}</h2>
                <p className="mx-auto max-w-[700px] md:text-xl text-primary-foreground/80">{t("cta.subtitle")}</p>
              </div>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="h-12">
                  {t("cta.button")}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
