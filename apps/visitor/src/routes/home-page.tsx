import { DEMO_VENUES, type DemoKind, type DemoVenue } from '@indoor/demo';
import { BrandLogo, Button, cn } from '@indoor/ui';
import {
  AccessibilityIcon,
  ArrowRightIcon,
  BluetoothOffIcon,
  CodeIcon,
  LanguagesIcon,
  type LucideIcon,
  MailIcon,
  NavigationIcon,
  QrCodeIcon,
  SearchIcon,
  Share2Icon,
  SmartphoneIcon,
  WifiOffIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigation } from 'react-router';
import { LanguagePicker } from '../components/language-picker';
import { assetUrl } from '../data/client';

const REPO_URL = 'https://github.com/devaldicaliesta/indoor-map-v2';
const SITE_URL = 'https://panduarah.my.id';
const CONTACT_EMAIL = 'panduarahid@gmail.com';

function useDemoText(): Record<DemoKind, { kind: string; mission: string }> {
  const { t } = useTranslation();
  return {
    hospital: { kind: t('landing.kinds.hospital'), mission: t('landing.missions.hospital') },
    mall: { kind: t('landing.kinds.mall'), mission: t('landing.missions.mall') },
    campus: { kind: t('landing.kinds.campus'), mission: t('landing.missions.campus') },
    office: { kind: t('landing.kinds.office'), mission: t('landing.missions.office') },
    airport: { kind: t('landing.kinds.airport'), mission: t('landing.missions.airport') },
    factory: { kind: t('landing.kinds.factory'), mission: t('landing.missions.factory') },
    concert: { kind: t('landing.kinds.concert'), mission: t('landing.missions.concert') },
  };
}

function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-5', className)}>{children}</div>;
}

function SignPlate({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-sm bg-ink py-1 pr-3 pl-1 font-bold text-sm text-surface uppercase tracking-wider">
      <span className="inline-flex size-6 items-center justify-center rounded-sm bg-signal text-on-signal">
        <ArrowRightIcon aria-hidden="true" className="size-4" strokeWidth={2.5} />
      </span>
      {children}
    </p>
  );
}

function NavigationPending() {
  const { t } = useTranslation();
  const pending = useNavigation().state !== 'idle';
  return (
    <div role="status" className="pointer-events-none fixed inset-x-0 top-0 z-20">
      {pending ? (
        <>
          <div className="h-1 w-full bg-signal motion-safe:animate-pulse" />
          <span className="sr-only">{t('landing.opening')}</span>
        </>
      ) : null}
    </div>
  );
}

function Header() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-10 border-line border-b bg-surface/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label={t('landing.homeLabel')}>
          <BrandLogo label="" className="h-8" />
        </Link>
        <nav aria-label={t('landing.navLabel')} className="flex items-center gap-1 sm:gap-3">
          <a href="#cara-kerja" className="hidden px-2 font-bold hover:underline sm:inline">
            {t('landing.nav.how')}
          </a>
          <a href="#demo" className="hidden px-2 font-bold hover:underline sm:inline">
            {t('landing.nav.demo')}
          </a>
          <LanguagePicker />
        </nav>
      </Container>
    </header>
  );
}

function Hero() {
  const { t } = useTranslation();
  const facts = [t('landing.hero.fact1'), t('landing.hero.fact2'), t('landing.hero.fact3')];
  return (
    <section aria-labelledby="hero-title" className="py-12 md:py-20">
      <Container className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr]">
        <div className="grid justify-items-start gap-5">
          <SignPlate>{t('landing.hero.eyebrow')}</SignPlate>
          <h1 id="hero-title" className="font-bold text-2xl text-balance">
            {t('landing.hero.title')}
          </h1>
          <p className="max-w-prose text-ink-muted text-lg">{t('landing.hero.description')}</p>
          <ul className="flex flex-wrap gap-2">
            {facts.map((fact) => (
              <li
                key={fact}
                className="rounded-sm border border-line bg-surface px-3 py-1 font-bold text-sm"
              >
                {fact}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild variant="primary">
              <Link to="/v/demo">
                {t('landing.hero.primary')}
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild>
              <a href="#demo">{t('landing.hero.secondary')}</a>
            </Button>
          </div>
        </div>
        <figure className="overflow-hidden rounded-lg border border-line bg-surface shadow-float">
          <img
            src={assetUrl('hero-rute.svg')}
            alt={t('landing.hero.imageAlt')}
            width={900}
            height={320}
            className="h-auto w-full"
          />
        </figure>
      </Container>
    </section>
  );
}

function Steps() {
  const { t } = useTranslation();
  const steps: { icon: LucideIcon; title: string; text: string }[] = [
    { icon: QrCodeIcon, title: t('landing.steps.scanTitle'), text: t('landing.steps.scanText') },
    {
      icon: SearchIcon,
      title: t('landing.steps.searchTitle'),
      text: t('landing.steps.searchText'),
    },
    {
      icon: NavigationIcon,
      title: t('landing.steps.followTitle'),
      text: t('landing.steps.followText'),
    },
  ];
  return (
    <section id="cara-kerja" aria-labelledby="steps-title" className="bg-ink py-14 text-surface">
      <Container className="grid gap-8">
        <h2 id="steps-title" className="font-bold text-xl">
          {t('landing.steps.title')}
        </h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="grid content-start gap-3 border-signal border-t-4 pt-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-sm bg-signal font-bold text-lg text-on-signal">
                  {i + 1}
                </span>
                <step.icon aria-hidden="true" className="size-6" strokeWidth={1.75} />
              </div>
              <h3 className="font-bold text-lg">{step.title}</h3>
              <p className="text-surface/80">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function DemoCard({ venue, kind, mission }: { venue: DemoVenue; kind: string; mission: string }) {
  const { t } = useTranslation();
  return (
    <li>
      <Link
        to={`/v/${venue.slug}`}
        className="group grid h-full content-start gap-4 rounded-lg border border-line border-t-4 bg-surface p-5 shadow-float transition-colors hover:bg-canvas"
        style={{ borderTopColor: venue.color }}
      >
        <div className="flex items-center gap-3">
          <img
            src={assetUrl(venue.logoPath)}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 object-contain"
          />
          <div className="min-w-0">
            <p className="font-bold text-ink-muted text-xs uppercase tracking-wider">{kind}</p>
            <h3 className="truncate font-bold">{venue.name}</h3>
          </div>
        </div>
        <p className="text-ink-muted text-sm">{venue.address}</p>
        <p>{mission}</p>
        <span className="inline-flex items-center gap-2 font-bold">
          {t('landing.demos.open')}
          <ArrowRightIcon
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-1"
          />
        </span>
      </Link>
    </li>
  );
}

function Demos() {
  const { t } = useTranslation();
  const text = useDemoText();
  return (
    <section id="demo" aria-labelledby="demo-title" className="py-14">
      <Container className="grid gap-8">
        <div className="grid gap-2">
          <h2 id="demo-title" className="font-bold text-xl">
            {t('landing.demos.title')}
          </h2>
          <p className="max-w-prose text-ink-muted">{t('landing.demos.description')}</p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_VENUES.map((venue) => (
            <DemoCard key={venue.slug} venue={venue} {...text[venue.kind]} />
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Features() {
  const { t } = useTranslation();
  const features: { icon: LucideIcon; title: string; text: string }[] = [
    {
      icon: BluetoothOffIcon,
      title: t('landing.features.hardwareTitle'),
      text: t('landing.features.hardwareText'),
    },
    {
      icon: SmartphoneIcon,
      title: t('landing.features.appTitle'),
      text: t('landing.features.appText'),
    },
    {
      icon: WifiOffIcon,
      title: t('landing.features.offlineTitle'),
      text: t('landing.features.offlineText'),
    },
    {
      icon: AccessibilityIcon,
      title: t('landing.features.accessibleTitle'),
      text: t('landing.features.accessibleText'),
    },
    {
      icon: LanguagesIcon,
      title: t('landing.features.languageTitle'),
      text: t('landing.features.languageText'),
    },
    {
      icon: Share2Icon,
      title: t('landing.features.shareTitle'),
      text: t('landing.features.shareText'),
    },
  ];
  return (
    <section aria-labelledby="features-title" className="border-line border-t bg-surface py-14">
      <Container className="grid gap-8">
        <h2 id="features-title" className="font-bold text-xl">
          {t('landing.features.title')}
        </h2>
        <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.title} className="flex gap-3">
              <feature.icon
                aria-hidden="true"
                className="mt-0.5 size-6 shrink-0 text-route"
                strokeWidth={1.75}
              />
              <div className="grid gap-1">
                <h3 className="font-bold">{feature.title}</h3>
                <p className="text-ink-muted">{feature.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Edition() {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="edition-title" className="py-14">
      <Container>
        <div className="grid gap-4 rounded-lg border-signal border-l-8 bg-surface p-6 shadow-float md:grid-cols-[1fr_auto] md:items-center">
          <div className="grid gap-2">
            <h2 id="edition-title" className="font-bold text-lg">
              {t('landing.edition.title')}
            </h2>
            <p className="max-w-prose text-ink-muted">{t('landing.edition.description')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="primary">
              <a href={`mailto:${CONTACT_EMAIL}`}>
                <MailIcon aria-hidden="true" />
                {t('landing.edition.contact')}
              </a>
            </Button>
            <Button asChild>
              <a href={SITE_URL} target="_blank" rel="noreferrer">
                {t('landing.edition.site')}
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-line border-t bg-surface py-8">
      <Container className="flex flex-wrap items-center justify-between gap-4 text-ink-muted text-sm">
        <p>{t('landing.footer.copyright', { year: 2026 })}</p>
        <nav aria-label={t('landing.footer.label')} className="flex flex-wrap gap-4">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-ink"
          >
            <CodeIcon aria-hidden="true" className="size-4" />
            {t('landing.footer.source')}
          </a>
          <a href={assetUrl('third-party-notices.txt')} className="hover:text-ink">
            {t('info.openSource')}
          </a>
        </nav>
      </Container>
    </footer>
  );
}

export function HomePage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <NavigationPending />
      <Header />
      <main>
        <Hero />
        <Steps />
        <Demos />
        <Features />
        <Edition />
      </main>
      <Footer />
    </div>
  );
}
