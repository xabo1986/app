'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, Clock, Target, TrendingUp, Zap, Globe, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [activePricing, setActivePricing] = useState('pro');

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">SvenskPå3</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/demo">
              <Button variant="ghost">Se demo</Button>
            </Link>
            <Link href="/auth">
              <Button>Start gratis prøve</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Praktisk svensk på 3 minutter om dagen.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Lær svensk som passer din hverdag. Korte, praktiske leksjoner basert på situasjoner du faktisk møter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Start gratis prøve
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Se demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">5 000+</p>
              <p className="text-muted-foreground">Aktive brukere</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">50 000+</p>
              <p className="text-muted-foreground">Leksjoner fullført</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">4.8/5</p>
              <p className="text-muted-foreground">Gjennomsnittlig vurdering</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Hvordan det fungerer</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Personlig onboarding</h3>
              <p className="text-muted-foreground">
                Fortell oss om din hverdag, og vi tilpasser innholdet til situasjoner du faktisk møter.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Daglig mikroleksjon</h3>
              <p className="text-muted-foreground">
                Bare 1-3 minutter hver dag med lyd, tekst og interaktive oppgaver som du kan gjøre hvor som helst.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Følg fremdriften</h3>
              <p className="text-muted-foreground">
                Se streak-statistikk og lær konsekvent uten press. Enkelt å holde motivasjonen oppe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Hva du får</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <MessageCircle className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Praktiske situasjoner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lær fraser og ordforråd du trenger i butikken, på jobb, på lege, og i telefonen.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Lyd og uttale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Høring og repetisjon med norsk-svensk lyd, så du lærer riktig uttale fra dag én.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CheckCircle2 className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Streak-motivasjon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Hold deg motivert med enkle streak-mål. Ingen barnslig gamification, bare ren fremdrift.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Target className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Tilpasset innhold</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Velg hvilke scenarioer som er viktigst for deg, og øv på det du trenger mest.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Bare 3 minutter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Korte leksjoner som passer inn i enhver hverdag. Ingen stress, bare læring.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Følg fremgang</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Se hvor langt du har kommet med XP, daglige mål og ukentlig statistikk.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Velg din plan</h2>
          <p className="text-center text-muted-foreground mb-12">Start gratis, oppgrader når du vil</p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className={activePricing === 'basic' ? 'border-primary' : ''}>
              <CardHeader>
                <CardTitle className="text-2xl">Basic</CardTitle>
                <CardDescription>Perfekt for å komme i gang</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Gratis</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>3 minutter daglig leksjon</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>2 scenarioer (Butikk, Jobb)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Streak tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Grunnleggende statistikk</span>
                  </li>
                </ul>
                <Link href="/auth">
                  <Button variant="outline" className="w-full">
                    Start gratis
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className={activePricing === 'pro' ? 'border-primary shadow-lg' : ''}>
              <CardHeader>
                <div className="inline-block bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full mb-2">
                  Mest populær
                </div>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>For seriøs læring</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">99 kr</span>
                  <span className="text-muted-foreground">/måned</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Alt i Basic</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Alle 4 scenarioer (Butikk, Jobb, Telefon, Lege)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Ubegrenset scenario-tilpasning</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Avansert fremgangsstatistikk</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Offline tilgang</span>
                  </li>
                </ul>
                <Link href="/auth">
                  <Button className="w-full">
                    Prøv gratis i 7 dager
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Ofte stilte spørsmål</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Hvor lang tid tar hver leksjon?</AccordionTrigger>
              <AccordionContent>
                Hver leksjon tar mellom 1-3 minutter. Vi vet at du har en travel hverdag, så leksjonene er korte nok til å passe inn når som helst på dagen.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Kan jeg prøve gratis?</AccordionTrigger>
              <AccordionContent>
                Ja! Basic-planen er helt gratis og gir deg tilgang til de grunnleggende funksjonene. Du kan oppgradere til Pro når du vil for å få tilgang til alle scenarioer og funksjoner.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Hva skjer hvis jeg glemmer en dag?</AccordionTrigger>
              <AccordionContent>
                Streak-en din resettes, men det er ikke noe stress! Du kan starte på nytt neste dag. Målet vårt er å hjelpe deg lære, ikke å legge press på deg.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Hvordan tilpasses innholdet til meg?</AccordionTrigger>
              <AccordionContent>
                Under onboarding velger du hvilke situasjoner som er viktigst for deg (butikk, jobb, telefon, lege). Leksjonene tilpasses basert på disse valgene, så du lærer det som er mest relevant.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Kan jeg kansellere når som helst?</AccordionTrigger>
              <AccordionContent>
                Ja, du kan kansellere abonnementet ditt når som helst uten binding. Du beholder tilgangen til Pro-funksjoner ut den perioden du har betalt for.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Klar til å lære svensk?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start i dag og ta det første steget mot bedre svensk.
          </p>
          <Link href="/auth">
            <Button size="lg">
              Start gratis prøve
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="h-6 w-6 text-primary" />
                <span className="font-semibold">SvenskPå3</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Praktisk svensk på 3 minutter om dagen.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/demo" className="hover:text-foreground">Demo</Link></li>
                <li><Link href="/#pricing" className="hover:text-foreground">Priser</Link></li>
                <li><Link href="/auth" className="hover:text-foreground">Logg inn</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/contact" className="hover:text-foreground">Kontakt oss</Link></li>
                <li><Link href="/#faq" className="hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Juridisk</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Personvern</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Vilkår</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2025 SvenskPå3. Alle rettigheter reservert.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}