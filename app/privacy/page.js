import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tilbake
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Personvernerklæring</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">
            Sist oppdatert: Januar 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduksjon</h2>
            <p className="text-muted-foreground">
              SvenskPå3 ("vi", "vår") respekterer ditt personvern og er forpliktet til å beskytte 
              dine personopplysninger. Denne personvernerklæringen forklarer hvordan vi samler inn, 
              bruker og beskytter informasjonen din.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Informasjon vi samler inn</h2>
            <p className="text-muted-foreground mb-4">
              Vi samler inn følgende typer informasjon:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Kontoinformasjon:</strong> E-postadresse, navn, passord (kryptert)</li>
              <li><strong>Læringsinformasjon:</strong> Fremgang, XP, streak-data, valgte scenarioer</li>
              <li><strong>Bruksinformasjon:</strong> Leksjoner fullført, interaksjoner med appen</li>
              <li><strong>Betalingsinformasjon:</strong> Behandles sikkert via Stripe (vi lagrer ikke kortdetaljer)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Hvordan vi bruker informasjonen</h2>
            <p className="text-muted-foreground mb-4">
              Vi bruker informasjonen din til å:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Tilby og forbedre våre tjenester</li>
              <li>Tilpasse læringsopplevelsen din</li>
              <li>Spore fremgangen din og beregne statistikk</li>
              <li>Behandle betalinger og abonnementer</li>
              <li>Kommunisere med deg om tjenesten</li>
              <li>Analysere og forbedre appens funksjonalitet</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Datadeling</h2>
            <p className="text-muted-foreground">
              Vi selger eller deler aldri dine personopplysninger med tredjeparter for markedsføringsformål. 
              Vi deler kun data med tjenesteleverandører som hjelper oss med å drive tjenesten (f.eks. Stripe for betalinger).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Datasikkerhet</h2>
            <p className="text-muted-foreground">
              Vi bruker industristandarder for sikkerhetstiltak for å beskytte dine data, inkludert 
              kryptering av passord og sikre tilkoblinger (HTTPS). Selv om vi gjør vårt beste for å 
              beskytte dine opplysninger, kan ingen overføringsmetode over internett være 100% sikker.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Dine rettigheter</h2>
            <p className="text-muted-foreground mb-4">
              Du har rett til å:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Tilgang til dine personopplysninger</li>
              <li>Rette unøyaktige opplysninger</li>
              <li>Slette kontoen din og alle tilhørende data</li>
              <li>Eksportere dine data</li>
              <li>Trekke tilbake samtykke for databehandling</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Oppbevaring av data</h2>
            <p className="text-muted-foreground">
              Vi oppbevarer dine personopplysninger så lenge kontoen din er aktiv eller så lenge det 
              er nødvendig for å tilby tjenesten. Du kan be om sletting av kontoen din når som helst.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Endringer i denne erklæringen</h2>
            <p className="text-muted-foreground">
              Vi kan oppdatere denne personvernerklæringen fra tid til annen. Vi vil varsle deg om 
              eventuelle vesentlige endringer via e-post eller ved å poste en merknad i appen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Kontakt oss</h2>
            <p className="text-muted-foreground">
              Hvis du har spørsmål om denne personvernerklæringen eller hvordan vi håndterer dine data, 
              vennligst kontakt oss via <Link href="/contact" className="text-primary hover:underline">kontaktskjemaet</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}