<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, readAs, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket }: { ticket: number } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByCause(merged, tenantOf));
  const fmt = (o: Record<string, number>) =>
    Object.entries(o)
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `${k} ×${n}`)
      .join(' · ');
  const channels = (rs: Report[]) =>
    fmt(rs.reduce<Record<string, number>>((n, r) => ({ ...n, [r.channel]: (n[r.channel] ?? 0) + 1 }), {}));
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong> problems ·
  {groups.map((g) => g.reports.length).join(' + ')} = {groups.reduce((n, g) => n + g.reports.length, 0)}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>channels</th><th>intake tagged</th><th>tenants</th><th>seen</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.cause)}
      <tr>
        <td><code>{g.cause}</code></td>
        <td>{g.reports.length}</td>
        <td>{channels(g.reports)}</td>
        <td class="tags">{fmt(g.taggedAs)}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#each groups as g (g.cause)}
  {@const moved = readAs(g, notes.oneDayMove)}
  {#if moved}
    <p class="note">{moved} of the {g.cause} reports read as a one-day move; counted here, where they are filed.</p>
  {/if}
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .tags, .note { color: var(--muted); font-size: 0.85em; }
</style>
