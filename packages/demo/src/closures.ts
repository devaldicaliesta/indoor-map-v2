import type { Closure, Snapshot } from '@indoor/domain';
import { stableUuid } from './stable-uuid';

const HOUR_MS = 3_600_000;

interface Plan {
  key: string;
  featureId?: string;
  connectorId?: string;
  reason: string;
  fromHours: number;
  toHours: number;
}

export function demoClosures(snapshot: Snapshot, now: Date): Closure[] {
  const elevators = snapshot.graph.connectors.filter((c) => c.kind === 'elevator');
  const units = snapshot.features.features.filter((f) => f.properties.kind === 'unit');
  const renovated = units[5];
  const serviced = elevators[1];
  const plans: Plan[] = [];
  if (renovated) {
    plans.push({
      key: 'renovation',
      featureId: renovated.properties.id,
      reason: 'Renovasi interior dan pengecatan ulang',
      fromHours: -30,
      toHours: 24 * 12,
    });
  }
  if (serviced) {
    plans.push({
      key: 'elevator-service',
      connectorId: serviced.id,
      reason: `Perawatan berkala ${serviced.name}`,
      fromHours: -2,
      toHours: 5,
    });
  }
  const at = (hours: number) => new Date(now.getTime() + hours * HOUR_MS).toISOString();
  return plans.map((plan) => ({
    id: stableUuid(`${snapshot.venue.id}:closure:${plan.key}`),
    featureId: plan.featureId ?? null,
    edgeId: null,
    connectorId: plan.connectorId ?? null,
    reason: plan.reason,
    startsAt: at(plan.fromHours),
    endsAt: at(plan.toHours),
  }));
}
