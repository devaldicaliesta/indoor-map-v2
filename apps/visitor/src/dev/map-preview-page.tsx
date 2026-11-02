import { useTranslation } from 'react-i18next';
import { MapPreview } from './map-preview';

export function MapPreviewPage() {
  const { t } = useTranslation();
  return (
    <MapPreview
      labels={{
        zoomIn: t('map.zoomIn'),
        zoomOut: t('map.zoomOut'),
        resetNorth: t('map.resetNorth'),
        floor: 'floor switch',
        synthetic: '1000',
        floorSwitcher: t('map.floors'),
      }}
    />
  );
}
