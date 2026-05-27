# Metrics

### The North Star Metric

Weekly Completed Audits. This is the single most important metric because it measures actual value delivered to the user. A page view is vanity. An email captured is a trailing indicator of the tool's effectiveness. A completed audit means a user successfully input their stack, allowed the engine to process it, and viewed the results. Every completed audit represents a highly qualified lead entering the Credex universe. If this number grows, revenue will inevitably follow.

### Three Input Metrics

The first is Landing Page Completion Rate — completed audits divided by unique visitors. This measures the friction of the VisualBuilder UI. If it drops below 30% the form is too complex or we are driving low-intent traffic.

The second is Share Button Click Rate — shares divided by completed audits. This is the viral coefficient. If it is high the tool grows organically at zero CAC. If it is low the visual output of the audit needs to be more compelling and the scorecard UI needs a redesign.

The third is High Savings Ratio — audits showing more than $500 in savings divided by total audits. This measures target market fit. If 90% of audits show less than $100 in savings we are attracting solo founders and hobbyists rather than our target Series A and B engineering managers.

### What to Instrument First

Before launching I would instrument the funnel drop-off events inside the VisualBuilder. Specifically I would fire an event when a user adds their first tool and another when they click Run Audit. This shows exactly where users abandon the configuration process and whether the problem is form complexity or intent mismatch.

### The Pivot Trigger

If the Lead Capture Rate — emails captured divided by high savings audits — drops below 5% for two consecutive weeks, the fundamental premise of the tool is flawed. It means perceived trust in Credex is too low or the friction of switching vendors outweighs the $500 per month saving. If this trigger is hit we pivot from a lead generation tool into a pure open source FinOps repository, or we redesign the results page to offer a more frictionless one-click optimisation rather than a sales consultation.