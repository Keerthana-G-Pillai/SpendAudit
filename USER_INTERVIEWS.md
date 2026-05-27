## Interview 1
**Name/initials:** Alex
**Role:** CEO
**Company stage:** Early stage startup
**Date:** 2026-05-25

**Notes:**
Interview with Alex was honestly one of the most eye-opening conversations I had while building this. He runs a small startup and is the one paying the bills but has almost no visibility into what
his team is actually subscribing to. Tools get picked up because someone on the team saw something on Twitter or a teammate recommended it , not because anyone sat down and evaluated whether they needed it. What suprised me the most was that he only finds out the total damage when the card bill arrives at the end of the month.

**Direct quotes:**
- "when my card bill comes up at the end of every month which ofc gets me instant death activated"
- "we might end up subscribing to it even though we have already subscribed to a similar tool doing similar job"
- "as a CEO I am not very technically sound and my team doesn't care since they want to complete their job easier and fast, they don't care about money"
- "I would trust if the calculations are transparent and they are genuinely backed by data and could also be shown"
- "I would be skeptical if it was aggressive, inaccurate or just keeps on hallucinating like usually AI do"

**Most surprising thing they said:**
I went into this assuming the main user of this tool would bea developer who knows their stack and just wants to find cheaper alternatives. Alex completely flipped that. He is the one paying but has no idea what is being used or why.His developers subscribe to whatever makes their job easierand faster . Nobody is sitting down and auditing the overlap. 
**What it changed about my design:**
I made two specific changes. First, I rewrote all recommendation reasoning strings to use plain business language instead of technical justifications. Instead of "SSO and admin controls are unnecessary for teams under 5" I changed it to "your team is too small to need the management features this plan charges for."  Second, Alex's answer about trust "transparent calculations backed by data" this directly led me to adding the expandable "Why?" toggle on each recommendation card so users can see the exact numbers behind every suggestion rather than just accepting a black-box output.

## Interview 2
**Name/initials:** Jordan
**Role:** Software Engineer
**Company stage:** Mid-size company
**Date:** 2026-05-26

**Notes:**
Talked to this person expecting another "I have no idea what  I spend" answer but got the complete opposite. They actually  track AI spending seriously and treat it like any other  operational cost. Their team gets a standard tool stack .No one just subscribes to random stuff. They do regular internal  audits but said most of the time goes into meetings about it  which was something I didn't expect at all.

**Direct quotes:**
- "I dont mind spending money if its for useful stuff or if the tool creates measurable value for me and my team"
- "if a tool isnt integrating into the workflow or improving output consistently we downgrade that or remove them"
- "No harsh feelings if it had stayed with me for 1 year or 1 month after all it is an ai tool not my wife 😅"
- "what matters more is accuracy and data privacy rather than saving small amount monthly"

**Most surprising thing they said:**
Honestly I went in assuming this tool would mainly help  disorganised teams who have no clue what they're spending.  But he audits regularly and still said it takes up significant meeting time every month. So the value isn't just finding hidden overspend — it's replacing a one-hour meeting with a two-minute audit. I hadn't thought about time cost at all before this conversation.

**What it changed about my design:**
Made me realise there are two completely different users coming to this tool. The chaotic founder like Alex who  has zero visibility, and the  disciplined operator who knows  roughly what they spend but wastes time doing it manually.  For the second type the shareable audit URL became way more important — they don't need the tool to tell them they're overspending, they need something they can send to their team instead of scheduling a meeting about it. I made the share button more prominent on the results page because of this.


## Interview 3
**Name/initials:** Taylor
**Role:** Co-founder
**Company stage:** Bootstrapped early stage startup
**Date:** 2026-05-27

**Notes:**
This was the funniest and most honest conversation I had.She has zero visibility into AI spending described it as subscriptions growing faster than headcount. Tools get added because employees forward LinkedIn posts with rocket emojis or claim a tool saved their life and free trials get forgotten and convert to paid without anyone noticing. When they finally opened the finance dashboard it looked like an addiction multiple tools doing the same thing and nobody could agree on which ones to cut because everyone was emotionally attached to their favourite.

**Direct quotes:**
- "Every month somebody comes up saying this AI tool could save us 200 hours and suddenly there is another subscription on the company card"
- "I just pray my finance team tells me these things before it becomes GDP of a small country"
- "one guy forwards me LinkedIn posts with rocket emojis and the header this tool could save you millions but he didn't say it costs me billions for that"
- "many of the AI tools sounded identical to me, I asked the team which do we use and they were so confused and everybody said their personal favourites since they were emotionally attached to them"
- "I love profit more than my husband but if the tool started throwing technical terms I would assume it steals my data"

**Most surprising thing they said:**
The emotional attachment comment completely caught me off guard. I assumed people cancel tools based on ROI or usage data. She revealed that cancellation decisions get blocked because team members are personally attached to specific tools — "like they are emotionally attached to their partners." That means audit results need to make cancellation feel safe and neutral not like taking something away from someone.

**What it changed about my design:**
The way she described distrust — "if it throws technical terms or asks to connect to my data I assume it steals my data" — made me rethink the trust signals on the landing page. I added "no account needed, no data stored beyond your audit" explicitly in the trust strip below the hero. I also made sure every recommendation uses plain money language only — no technical justifications, no jargon, just the dollar amount and a one line plain English reason.