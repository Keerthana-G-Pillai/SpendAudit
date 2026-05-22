# Metrics

## North Star Metric

**Audits completed per week**

This is the right North Star because a completed audit is the minimum unit of value delivered — the user saw their savings number. Every downstream event (email capture, share, consultation booking, Credex purchase) requires a completed audit first. DAU is wrong for a tool people use once a quarter. Revenue is too lagging at this stage when the funnel is not yet validated.

## 3 Input Metrics That Drive the North Star

1. **Landing page → form start rate**
   Are visitors understanding the value proposition and actually beginning the form? If this is below 25%, the hero copy or CTA is not working. Target: 30%+.

2. **Form start → audit completion rate**
   Are users finishing the form or dropping off mid-way? A drop below 60% suggests the form is too long, confusing, or asking for information people do not have handy. Target: 70%+.

3. **Organic shares per audit (viral coefficient)**
   Are completed audits driving new visitors via the shareable URL? This is the growth lever — each shared audit is a free acquisition. Even a coefficient of 0.15 (15 shares per 100 audits, each bringing 2 new visitors) meaningfully compounds visitor growth. Target: 0.1+ in month 1.

## What to Instrument First

In order of priority:

1. Audit completion funnel — which step of the form do users abandon? (Use field-level tracking)
2. Time on results page — are users reading the recommendations or bouncing immediately?
3. Email capture conversion rate by savings tier — does showing >$500 savings meaningfully lift capture rate vs <$100?
4. Share button clicks vs unique visits to shared URLs — is the share button being used, and are those URLs actually being visited?
5. Consultation booking click-through rate on the Credex CTA (only shown for high-savings audits)

## Pivot Trigger

If after **500 completed audits**, the email capture rate is below **15%**, the value shown in the results page is not compelling enough to motivate action. At that point, either:
- The savings numbers are too low (pricing data or audit logic issue)
- The results UI is not surfacing the hero savings number clearly enough
- The email ask feels too early or too invasive

That triggers a results page redesign sprint before investing further in distribution.

Secondary trigger: if the share-to-visit ratio stays below 0.05 after 200 shares, the Open Graph previews or the shareable URL copy is not compelling enough to drive clicks — revisit OG title and image.
