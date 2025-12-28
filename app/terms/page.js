import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold mb-8">Vilkår for bruk</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">
            Sist oppdatert: Januar 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Aksept av vilkår</h2>
            <p className="text-muted-foreground">
              Ved å få tilgang til og bruke SvenskPå3 ("tjenesten"), aksepterer du å være bundet 
              av disse vilkårene. Hvis du ikke godtar disse vilkårene, vennligst ikke bruk tjenesten.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Tjenestebeskrivelse</h2>
            <p className="text-muted-foreground">
              SvenskPå3 er en digital læringsplattform for å lære svensk gjennom korte, daglige leksjoner. 
              Vi tilbyr to planer: Basic (gratis) og Pro (betalt abonnement).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Brukerkontoer</h2>
            <p className="text-muted-foreground mb-4">
              For å bruke tjenesten må du opprette en konto. Du er ansvarlig for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Opprettholde konfidensialiteten til kontoinformasjonen din</li>
              <li>Alle aktiviteter som skjer under din konto</li>
              <li>Å varsle oss umiddelbart om uautorisert bruk av kontoen din</li>
              <li>Å gi nøyaktig og fullstendig informasjon</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Abonnement og betaling</h2>
            <p className="text-muted-foreground mb-4">
              Pro-abonnementet:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Faktureres månedlig til prisen oppgitt på nettstedet</li>
              <li>Fornyes automatisk med mindre det kanselleres</li>
              <li>Kan kanselleres når som helst uten bindingstid</li>
              <li>Refunderinger gis kun i henhold til gjeldende lov</li>
              <li>Vi forbeholder oss retten til å endre priser med 30 dagers varsel</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Kansellering</h2>
            <p className="text-muted-foreground">
              Du kan kansellere abonnementet ditt når som helst fra innstillinger. Kanselleringen trer 
              i kraft ved slutten av gjeldende faktureringsperiode. Du beholder tilgang til Pro-funksjoner 
              til abonnementet utløper.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Bruksgodkjennelse</h2>
            <p className="text-muted-foreground mb-4">
              Du godtar å:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Bruke tjenesten kun for lovlige formål</li>
              <li>Ikke dele kontoinformasjonen din med andre</li>
              <li>Ikke forsøke å hacke eller forstyrre tjenesten</li>
              <li>Ikke kopiere eller distribuere innholdet vårt uten tillatelse</li>
              <li>Respektere opphavsrett og immaterielle rettigheter</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Immaterielle rettigheter</h2>
            <p className="text-muted-foreground">
              Alt innhold på SvenskPå3, inkludert tekst, grafikk, logoer, og programvare, eies av oss 
              eller våre lisensgivere og er beskyttet av opphavsrettslover. Du får en begrenset lisens 
              til å bruke tjenesten for personlig, ikke-kommersiell bruk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Ansvarsfraskrivelse</h2>
            <p className="text-muted-foreground">
              Tjenesten leveres "som den er" uten garantier av noe slag. Vi garanterer ikke at tjenesten 
              vil være uavbrutt, sikker eller feilfri. Vi er ikke ansvarlige for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
              <li>Tap av data eller fremdrift</li>
              <li>Tekniske problemer eller nedetid</li>
              <li>Indirekte eller følgeskader</li>
              <li>Resultater av læringsprosessen</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Endringer i vilkårene</h2>
            <p className="text-muted-foreground">
              Vi forbeholder oss retten til å endre disse vilkårene når som helst. Vesentlige endringer 
              vil bli varslet via e-post eller i appen. Fortsatt bruk av tjenesten etter endringer 
              innebærer aksept av de nye vilkårene.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Oppsigelse</h2>
            <p className="text-muted-foreground">
              Vi forbeholder oss retten til å suspendere eller avslutte din tilgang til tjenesten hvis 
              du bryter disse vilkårene eller engasjerer deg i ulovlig eller upassende oppførsel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Gjeldende lov</h2>
            <p className="text-muted-foreground">
              Disse vilkårene styres av norske lover. Eventuelle tvister skal løses i norske domstoler.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
            <p className="text-muted-foreground">
              For spørsmål om disse vilkårene, vennligst kontakt oss via{' '}
              <Link href="/contact" className="text-primary hover:underline">kontaktskjemaet</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}