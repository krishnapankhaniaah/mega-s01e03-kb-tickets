# #4471 · what the 412 reports hold

support desk · kb · owner **krishnapankhaniaah** · status **living** · reviewed 2026-10-29

#4471 says one bug: the parser reads dates month first. That is true for most of the reports, not all of them. Read by where each tenant is and which booking form it runs, #4471 holds **two problems**, not one.

> Not one issue. #4471 is two problems, and the queued parser fix does not close both.

## The split

**412** reports merged into #4471 · **2** problems · 379 + 33 = 412

| problem | reports | channels | intake tagged | tenants | seen |
|---|---|---|---|---|---|
| `parser` | 379 | app ×204 · email ×150 · form ×25 | parser ×356 · hint ×23 | 11 | 2026-04-01 → 2026-10-04 |
| `hint` | 33 | form ×33 | hint ×18 · parser ×15 | 3 | 2026-04-17 → 2026-09-22 |

5 of the parser reports read as a one-day move; counted here, where they are filed.

1. **`parser`**: the shared parser reads every date month first. Tenants whose locale writes the day first get day and month flipped. This is the bug #4471 describes.
2. **`hint`**: the `booking-v3` form prints `MM/DD/YYYY` under its date field. alder.physio (de-DE), copper.studio (es-ES) and pale.harbour (pt-PT) write the day first, but their people type what the hint says, month first. The form reads it the tenant's way and the date flips. Only the `form` channel is affected. The fix is the hint or the way the form reads it, so the queued parser fix does not close it.

Five of the `parser` reports describe a one-day move, not a flip (R-41202, R-41209, R-41236, R-41344, R-41620). The desk files them by tenant, so they are counted under `parser`. They may point to a time-zone problem.

## How the count was made

- The export has 427 rows and 412 distinct report ids. The 15 extra rows are page overlap. One id is one report.
- The cause comes from the tenant and its booking form, not from intake. Intake guessed from the reporter's browser. Its tag disagrees with the real cause for 23 `parser` reports and 15 `hint` reports, so do not count by tag.
- Each report is counted once. The two counts add up to 412.

## Lessons

- Merging by subject line (decision 0001) hid two problems under one ticket. Check the tenant before you merge.
- A count on a ticket is only as good as the cause behind it.

desk ref **DR-AT8R-YSVB**

---
Pages are written by people. Tables and charts are built from data at render time.
