import type { SnapshotSource, VenueId, VenueSlug } from '@indoor/domain';
import { stableUuid } from './stable-uuid';

export type DemoKind =
  | 'hospital'
  | 'mall'
  | 'campus'
  | 'office'
  | 'airport'
  | 'factory'
  | 'concert';

export interface DemoVenue {
  slug: VenueSlug;
  kind: DemoKind;
  id: VenueId;
  name: string;
  address: string;
  color: string;
  logoPath: string;
  load: () => Promise<() => SnapshotSource>;
}

const venue = (
  seed: string,
  entry: Omit<DemoVenue, 'id' | 'slug' | 'logoPath'> & { slug: string },
): DemoVenue => ({
  ...entry,
  slug: entry.slug as VenueSlug,
  id: stableUuid(`${seed}:venue`) as VenueId,
  logoPath: `demo/logos/${entry.kind}.png`,
});

export const DEMO_VENUES: readonly DemoVenue[] = [
  venue('demo-hospital', {
    slug: 'demo',
    kind: 'hospital',
    name: 'RS Demo Harapan',
    address: 'Jl. Harapan Sehat No. 12, Jakarta Selatan',
    color: '#c8321e',
    load: () => import('./venues/hospital').then((m) => m.hospitalVenue),
  }),
  venue('demo-mall', {
    slug: 'demo-mal',
    kind: 'mall',
    name: 'Mal Demo Sentosa',
    address: 'Jl. Sentosa Raya No. 1, Jakarta Pusat',
    color: '#7b61c9',
    load: () => import('./venues/mall').then((m) => m.mallVenue),
  }),
  venue('demo-campus', {
    slug: 'demo-kampus',
    kind: 'campus',
    name: 'Kampus Demo Cendekia',
    address: 'Jl. Cendekia Raya No. 5, Depok',
    color: '#0f4a91',
    load: () => import('./venues/campus').then((m) => m.campusVenue),
  }),
  venue('demo-office', {
    slug: 'demo-kantor',
    kind: 'office',
    name: 'Menara Demo Sinergi',
    address: 'Jl. Sinergi Raya Kav. 21, Jakarta Selatan',
    color: '#1f6f8b',
    load: () => import('./venues/office').then((m) => m.officeVenue),
  }),
  venue('demo-airport', {
    slug: 'demo-bandara',
    kind: 'airport',
    name: 'Bandara Demo Nusantara',
    address: 'Jl. Bandara Nusantara, Tangerang',
    color: '#0b7a75',
    load: () => import('./venues/airport').then((m) => m.airportVenue),
  }),
  venue('demo-factory', {
    slug: 'demo-pabrik',
    kind: 'factory',
    name: 'Kawasan Demo Industri Prima',
    address: 'Kawasan Industri Prima Blok C-7, Bekasi',
    color: '#b45f06',
    load: () => import('./venues/factory').then((m) => m.factoryVenue),
  }),
  venue('demo-concert', {
    slug: 'demo-konser',
    kind: 'concert',
    name: 'Konser Demo Gemilang',
    address: 'Stadion Demo Gemilang, Jl. Pintu Satu, Jakarta Pusat',
    color: '#e11d48',
    load: () => import('./venues/concert').then((m) => m.concertVenue),
  }),
];

export const demoBySlug = (slug: string): DemoVenue | undefined =>
  DEMO_VENUES.find((v) => v.slug === slug);

export const demoById = (id: string): DemoVenue | undefined => DEMO_VENUES.find((v) => v.id === id);
