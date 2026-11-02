import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useVisitorTour } from '../../app/tour';
import { useExploreStore } from '../search/explore-context';
import { type ShowSheet, venueTour } from './tour';

const SHEET_ANIMATION_MS = 350;

/** Tur peta venue: mulai sendiri sekali per perangkat, atau lewat tombol tur. */
export function useExplorerTour(venueName: string) {
  const { t } = useTranslation();
  const setSheetSnap = useExploreStore((s) => s.setSheetSnap);
  const tour = useMemo(() => {
    // Transisi tinggi sheet (300 ms) tetap berjalan saat reduced motion; posisi sasaran baru
    // benar setelah transisi selesai.
    const showSheet: ShowSheet = (snap) => async () => {
      setSheetSnap(snap);
      await new Promise((resolve) => setTimeout(resolve, SHEET_ANIMATION_MS));
    };
    return venueTour(t, venueName, showSheet);
  }, [t, venueName, setSheetSnap]);
  const { start } = useVisitorTour(tour, { autoStart: true });
  return { start: () => void start() };
}
