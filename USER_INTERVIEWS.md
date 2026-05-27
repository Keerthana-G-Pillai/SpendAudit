# User Interviews

### Interview 1
**Name:** David H.
**Role:** Co-founder & CTO
**Company Stage:** Seed (12 employees)

**Direct Quotes:**
- *"I honestly just put 'OpenAI' on the corporate Amex and stopped looking at it. I know it's high, but I don't have time to audit it."*
- *"Wait, Claude Team is $30 per user? I thought it was just the $20 pro plan but grouped together."*
- *"I would never, ever put my email into a form before seeing the actual numbers. If it asks for an email upfront, I close the tab immediately."*

**Most Surprising Thing:**
David was completely unaware of the markup on "Team" and "Enterprise" tiers for consumer AI products. He assumed it was bulk-discounted, when in reality, vendors charge a premium for SSO and central billing.

**What it Changed:**
His visceral reaction to email-gating forced a massive architectural change. I completely removed the initial email capture and designed the tool to show 100% of the value (the full audit results) *first*, only asking for an email if they want a PDF copy or to book a consultation for large savings.

---

### Interview 2
**Name:** S.K.
**Role:** VP of Engineering
**Company Stage:** Series B (85 employees)

**Direct Quotes:**
- *"We bought GitHub Copilot Enterprise because Microsoft pushed it hard, but half our team just uses the free Cursor tier on their own."*
- *"The real bleed isn't the subscriptions, it's the uncapped API usage from our testing environments."*
- *"If a tool told me to just 'cancel Copilot,' I'd ignore it. I need numbers to take to my CFO."*

**Most Surprising Thing:**
The sheer amount of internal shadow-IT. S.K. noted that individual developers were expensing their own preferred tools (like Windsurf) while the company was simultaneously paying for bulk Copilot licenses. 

**What it Changed:**
I added a specific "overlap detection" rule in the audit engine. If a user inputs both Copilot and Cursor/Windsurf, the tool specifically flags this as a redundant overlap and calculates the exact savings of consolidating into a single IDE platform, providing the exact numerical ammunition S.K. needs for the CFO.

---

### Interview 3
**Name:** Alex M.
**Role:** Founder
**Company Stage:** Bootstrapped (4 employees)

**Direct Quotes:**
- *"Every dollar matters right now. If we can save $100 a month, that's another SaaS tool we can afford."*
- *"I tried tracking this in a Notion spreadsheet but the API pricing changes so fast I gave up."*
- *"Is there a way to just get a notification when prices drop?"*

**Most Surprising Thing:**
Even with a tiny team, the mental overhead of tracking AI pricing was too high. Alex didn't have high savings (only ~$40/mo), but he still wanted a way to stay informed without doing the manual research.

**What it Changed:**
I realized that for low-savings audits, pushing a "book a consultation" CTA is annoying and tone-deaf. I changed the logic so that if savings are <$100, the tool honestly says "You're spending well" and changes the lead-capture CTA to a passive "Notify me when new optimizations apply to your stack" alert signup.
