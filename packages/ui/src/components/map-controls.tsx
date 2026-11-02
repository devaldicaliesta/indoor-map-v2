import { LocateFixedIcon, MinusIcon, NavigationIcon, PlusIcon, UsersRoundIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../lib/utils';

export interface MapControlLabels {
  zoomIn: string;
  zoomOut: string;
  resetNorth: string;
  /** Wajib bila `onResetView` diisi. */
  resetView?: string;
  /** Wajib bila `onPeopleChange` diisi. */
  people?: string;
}

interface MapControlsProps extends Omit<ComponentProps<'div'>, 'children'> {
  labels: MapControlLabels;
  onZoomIn: () => void;
  onZoomOut: () => void;
  /** Rotasi peta dalam derajat; ikon kompas diputar berlawanan agar tetap menunjuk utara. */
  bearing: number;
  onResetNorth: () => void;
  /** Kembali ke gedung, lantai, dan kamera awal (Visitor); tombol tidak tampil tanpa ini. */
  onResetView?: () => void;
  /** Ilustrasi orang di peta tampil (Visitor). */
  people?: boolean;
  /** Tombol tampil/sembunyikan orang mini; tombol tidak tampil tanpa ini. */
  onPeopleChange?: (visible: boolean) => void;
}

const button =
  'flex size-(--control-height) cursor-pointer items-center justify-center text-ink hover:bg-canvas [&_svg]:size-5';

/** Kontrol peta tipis: hanya memanggil callback; logika peta ada di @indoor/map-core. */
function MapControls({
  labels,
  onZoomIn,
  onZoomOut,
  bearing,
  onResetNorth,
  onResetView,
  people = false,
  onPeopleChange,
  className,
  ...props
}: MapControlsProps) {
  return (
    <div
      data-slot="map-controls"
      className={cn('flex flex-col items-end gap-2', className)}
      {...props}
    >
      {onPeopleChange ? (
        <button
          type="button"
          aria-label={labels.people}
          title={labels.people}
          aria-pressed={people}
          onClick={() => onPeopleChange(!people)}
          className={cn(
            button,
            'rounded-sm border border-line shadow-float',
            people ? 'bg-ink text-surface hover:bg-ink' : 'bg-surface text-ink-muted',
          )}
        >
          <UsersRoundIcon strokeWidth={1.75} />
        </button>
      ) : null}
      <div className="flex flex-col divide-y divide-line overflow-hidden rounded-sm border border-line bg-surface shadow-float">
        <button type="button" aria-label={labels.zoomIn} onClick={onZoomIn} className={button}>
          <PlusIcon strokeWidth={1.75} />
        </button>
        <button type="button" aria-label={labels.zoomOut} onClick={onZoomOut} className={button}>
          <MinusIcon strokeWidth={1.75} />
        </button>
        {onResetView ? (
          <button
            type="button"
            aria-label={labels.resetView}
            onClick={onResetView}
            className={button}
          >
            <LocateFixedIcon strokeWidth={1.75} />
          </button>
        ) : null}
        <button
          type="button"
          aria-label={labels.resetNorth}
          onClick={onResetNorth}
          className={button}
        >
          <NavigationIcon strokeWidth={1.75} style={{ transform: `rotate(${-bearing}deg)` }} />
        </button>
      </div>
    </div>
  );
}

export { MapControls };
