// Splits the reports merged into one ticket by what is really wrong. Pages explain it; this file is what runs.
import { causeOf, uniqueById, type Report, type Tenant } from '#lib/kb/causes';

// `shift` is not a flipped date. The day moves by one and the month stays: a time-zone problem.
// causes.ts files these under `parser` by tenant; the desk read them by what they say (desk-notes.json).
export type Problem = 'parser' | 'hint' | 'shift';

export const PROBLEMS: readonly Problem[] = ['parser', 'hint', 'shift'];

export function problemOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Problem | null {
  if (oneDayMove.includes(r.id)) return 'shift';
  return causeOf(r, t);
}

export type ProblemRow = {
  problem: Problem;
  count: number;
  tenants: number;
  channels: Record<string, number>;
  intakeTags: Record<string, number>;
  firstSeen: string;
  lastSeen: string;
};

export function splitTicket(
  reports: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { total: number; rows: ProblemRow[]; unplaced: number } {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === ticket);
  const by = new Map<Problem, Report[]>();
  let unplaced = 0;
  for (const r of merged) {
    const p = problemOf(r, tenantOf(r), oneDayMove);
    if (!p) {
      unplaced++;
      continue;
    }
    by.set(p, [...(by.get(p) ?? []), r]);
  }
  const tally = (xs: string[]) => xs.reduce<Record<string, number>>((n, x) => ({ ...n, [x]: (n[x] ?? 0) + 1 }), {});
  const rows = PROBLEMS.filter((p) => by.has(p)).map((problem) => {
    const rs = by.get(problem)!;
    const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
    return {
      problem,
      count: rs.length,
      tenants: new Set(rs.map((r) => r.tenant)).size,
      channels: tally(rs.map((r) => r.channel)),
      intakeTags: tally(rs.map((r) => r.meta.intakeTag)),
      firstSeen: days[0],
      lastSeen: days[days.length - 1],
    };
  });
  return { total: merged.length, rows, unplaced };
}
