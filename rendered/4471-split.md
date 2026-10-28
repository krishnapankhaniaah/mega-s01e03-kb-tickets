# #4471 · what the 412 reports hold

support desk · kb · owner **krishnapankhaniaah** · status **living** · reviewed 2026-10-29

#4471 says one bug: the parser reads dates month first. That is true for most of the reports, not all of them. Read by what each report says and by where the tenant is, #4471 holds **three problems**, not one.

> Not one issue. #4471 is three problems, and the queued parser fix does not close all of them.

## The split

**412** reports merged into #4471 · **3** problems · 374 + 5 + 33 = 412

| problem | reports | channels | intake tagged | tenants | seen |
|---|---|---|---|---|---|
| `parser` | 374 | app ×202 · email ×147 · form ×25 | parser ×351 · hint ×23 | 11 | 2026-04-01 → 2026-10-04 |
| `hint` | 33 | form ×33 | hint ×18 · parser ×15 | 3 | 2026-04-17 → 2026-09-22 |
| `shift` | 5 | email ×3 · app ×2 | parser ×5 | 5 | 2026-04-02 → 2026-10-04 |

1. **`parser`**: the shared parser reads every date month first. Tenants whose locale writes the day first get day and month flipped. This is the bug #4471 describes.
2. **`hint`**: the `booking-v3` form prints `MM/DD/YYYY` under its date field. alder.physio (de-DE), copper.studio (es-ES) and pale.harbour (pt-PT) write the day first, but their people type what the hint says, month first. The form reads it the tenant's way and the date flips. Only the `form` channel is affected. The fix is the hint or the way the form reads it, so the queued parser fix does not close it.
3. **`shift`**: the day moves by one and the month stays. These are not flips. The reports mention one month off, an invite sent before the booking, and one meeting showing a different day in Lisbon and Toronto. That points to a time-zone problem. It is a small group, five reports from five tenants, and it needs its own ticket.

## How the count was made

- The export has 427 rows and 412 distinct report ids. The 15 extra rows are page overlap. One id is one report.
- A report is `shift` when the desk noted it as a one-day move (`desk-notes.json`) and its text agrees.
- Otherwise the cause comes from the tenant, not from intake. Intake guessed from the reporter's browser. Its tag disagrees with the real cause for 23 `parser` reports and 15 `hint` reports, so do not count by tag.
- Each report is counted once. The three counts add up to 412.

## Lessons

- Merging by subject line (decision 0001) hid three problems under one ticket. Check the body and the tenant before you merge.
- A count on a ticket is only as good as the cause behind it.

desk ref **DR-AT8R-YSVB**

---
Pages are written by people. Tables and charts are built from data at render time.
