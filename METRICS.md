# Metrics

### The North Star Metric
**Weekly Completed Audits**
This is the single most important metric because it measures the actual value delivered to the user. A "page view" is vanity; an "email captured" is a trailing indicator of the tool's effectiveness. But a "Completed Audit" means a user successfully input their stack, allowed our engine to process it, and viewed the results. Every completed audit represents a highly qualified lead entering the Credex universe. If this number grows, Credex's revenue will inevitably follow.

### Three Input Metrics
To drive the North Star, we must track the inputs that directly influence it:
1. **Landing Page Completion Rate:** (Completed Audits / Unique Visitors). This measures the friction of the `VisualBuilder` UI. If this drops below 30%, the form is too complex or we are driving low-intent traffic.
2. **Share Button Click Rate:** (Shares / Completed Audits). This is our viral coefficient. If this is high, the tool will grow organically with a $0 CAC. If it is low, the visual output of the audit needs to be more compelling or the "Scorecard" UI needs a redesign.
3. **High-Savings Ratio:** (Audits >$500 savings / Total Audits). This measures target-market fit. If 90% of audits show <$100 in savings, we are attracting solo-founders and hobbyists, not our target Series A/B Engineering Managers.

### What to Instrument First
Before launching, I would instrument the **funnel drop-off events** inside the `VisualBuilder`. Specifically, I would fire an event when a user adds their *first* tool, and another when they click *Run Audit*. This allows us to see exactly where users abandon the configuration process.

### The Pivot Trigger
**Trigger:** If the *Lead Capture Rate* (Emails Captured / High-Savings Audits) drops below **5%** for two consecutive weeks.
If we are successfully finding users who are bleeding >$500/mo on AI subscriptions, and fewer than 5% of them are willing to give us their email to discuss a fix, the fundamental premise of the tool is flawed. It means the perceived trust in Credex is too low, or the friction of switching vendors outweighs the $500/mo savings. If this trigger is hit, we pivot from a lead-gen tool into a pure open-source FinOps repository, or we redesign the results page to offer a more frictionless "1-click optimization" rather than a sales consultation.
