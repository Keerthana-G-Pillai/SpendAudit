# Tests

## How to run

```bash
npm run test
```

## Test file: lib/audit.test.ts

All tests cover the core audit engine (`lib/audit.ts`) in isolation — no API calls, no database, no React. The engine is pure TypeScript functions so every test is deterministic.

### Core math (4 tests)

| Test | What it covers |
|------|----------------|
| totalAnnualSavings is exactly 12x totalMonthlySavings | Verifies the annual calculation never drifts from monthly × 12 |
| totalCurrentSpend sums all tool entries | Verifies cost aggregation across multiple tools |
| handles empty tool list without crashing | Edge case — user submits form with no tools added |
| accumulates savings correctly across multiple tools | Verifies multi-tool saving totals add up correctly |

### Savings tier thresholds (4 tests)

| Test | What it covers |
|------|----------------|
| is optimal when no savings found | Zero savings → 'optimal' tier |
| is low when savings are $1–$100 | Correct tier bucket for small savings |
| is medium when savings are $101–$500 | Correct tier bucket for medium savings |
| is high when savings exceed $500 | Triggers Credex CTA threshold |

### ChatGPT analysis (3 tests)

| Test | What it covers |
|------|----------------|
| flags Team plan for 2 users and recommends Plus | Core plan-size mismatch rule, verifies exact $20 saving |
| does NOT flag Team plan for 5+ users | Boundary condition — 5 users justifies Team plan |
| flags API direct when spend exceeds Plus price for writing | API vs subscription rule for non-coding use case |

### Cursor analysis (3 tests)

| Test | What it covers |
|------|----------------|
| recommends downgrade from Business to Pro for 3 seats | Verifies $60 saving ($20/seat × 3 seats) |
| does NOT flag Business plan for 4+ seats | Boundary condition at the justified threshold |
| does not flag Pro plan as already right-sized | No false positives for optimal plans |

### Claude analysis (3 tests)

| Test | What it covers |
|------|----------------|
| recommends downgrade from Max to Pro for 1 user, saving $80/mo | Verifies exact $80 saving (100 - 20) |
| recommends switching Claude Team to individual Pro for 2 users | Verifies $20 saving for 2-user team scenario |
| does NOT flag Claude Team at 3 seats (outside the rule boundary) | No false positive beyond the threshold |

### GitHub Copilot analysis (2 tests)

| Test | What it covers |
|------|----------------|
| recommends Enterprise → Business downgrade for teams under 10 | Verifies $100 saving (5 seats × $20 diff) |
| recommends cancellation for non-coding use case | Detects tool-use-case mismatch |

### Windsurf analysis (2 tests)

| Test | What it covers |
|------|----------------|
| recommends Teams → Pro downgrade for 3 seats | Verifies $60 saving ($20/seat × 3 seats) |
| does NOT flag Teams plan for 4+ seats | Boundary condition at justified threshold |

### Overlap detection (3 tests)

| Test | What it covers |
|------|----------------|
| flags Cursor + Windsurf as overlapping code editors | Detects duplicate-purpose tools |
| flags Anthropic API + Claude subscription as potential double-payment | Detects API + subscription redundancy |
| returns empty array when no overlaps exist | No false positives for non-overlapping stacks |

**Total: 24 tests across 8 test groups**
