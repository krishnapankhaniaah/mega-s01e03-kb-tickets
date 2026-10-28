<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitTicket } from '#lib/kb/split';

  let { ticket }: { ticket: number } = $props();

  const split = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const fmt = (o: Record<string, number>) =>
    Object.entries(o)
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `${k} ×${n}`)
      .join(' · ');
</script>

<p class="sum">
  <strong>{split.total}</strong> reports merged into #{ticket} ·
  <strong>{split.rows.length}</strong> problems ·
  {split.rows.map((r) => r.count).join(' + ')} = {split.rows.reduce((n, r) => n + r.count, 0)}
  {#if split.unplaced}· <strong>{split.unplaced}</strong> unplaced{/if}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>channels</th><th>intake tagged</th><th>tenants</th><th>seen</th></tr>
  </thead>
  <tbody>
    {#each split.rows as r (r.problem)}
      <tr>
        <td><code>{r.problem}</code></td>
        <td>{r.count}</td>
        <td>{fmt(r.channels)}</td>
        <td class="tags">{fmt(r.intakeTags)}</td>
        <td>{r.tenants}</td>
        <td>{r.firstSeen} → {r.lastSeen}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .tags { color: var(--muted); font-size: 0.85em; }
</style>
