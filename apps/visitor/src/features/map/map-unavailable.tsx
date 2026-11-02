import { cn } from '@indoor/ui';
import { MapIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '../../app/use-media-query';
import { DESKTOP_QUERY, MOBILE_HEADER_PX } from '../../app/visitor-shell';

/**
 * Pengganti peta di perangkat tanpa WebGL: pengunjung tahu peta tidak bisa tampil dan bahwa
 * pencarian serta langkah rute di panel tetap bisa dipakai.
 */
export function MapUnavailable() {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  // Di HP pesan diletakkan tepat di bawah kolom cari agar tetap terlihat saat sheet setengah.
  const mobile = !isDesktop;
  return (
    <div
      className={cn(
        'flex h-full w-full justify-center bg-canvas p-6',
        mobile ? 'items-start' : 'items-center',
      )}
      style={mobile ? { paddingTop: MOBILE_HEADER_PX + 24 } : undefined}
      data-testid="map-unavailable"
    >
      <section role="status" className="grid max-w-md justify-items-center gap-2 text-center">
        <MapIcon aria-hidden="true" strokeWidth={1.75} className="size-8 text-ink-muted" />
        <h2 className="font-bold text-lg">{t('map.unsupportedTitle')}</h2>
        <p className="text-ink-muted">{t('map.unsupportedDescription')}</p>
      </section>
    </div>
  );
}
