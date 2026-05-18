# Artery Platform — UX Audit Prompt for Antigravity
> Paste everything below the horizontal rule into Antigravity as your agent prompt.
> Make sure the Chrome tab with Artery is already open before running.
> Start on the landing page: https://artery-ppwv8wdt4-mailboxswayam-3742s-projects.vercel.app

---

## AGENT PROMPT — COPY FROM HERE

You are conducting a full UX audit of Artery — an Indian art commission platform that connects patrons with traditional artisans. The platform has two user roles: **Patron** and **Artist**. A Chrome tab with the platform is already open. Take control of that tab and begin the audit immediately.

---

### YOUR OBJECTIVE

Systematically navigate through every screen, panel, button, form, link, and interactive element across both user roles. Document exactly what you observe. Do not skip empty states, broken flows, or unclear labels. At the end, produce a single structured audit report saved as `ARTERY_UX_Audit_Report.md`.

You are also assessing the platform for **launch readiness** — flag anything that would cause a real user to drop off, confuse a first-time visitor, or break under real traffic. Treat this as a pre-launch stress test, not just a cosmetic review.

---

### THE TWO USER ROLES

#### Role 1 — Patron
A patron is someone who wants to commission Indian art. They:
- Arrive on the landing page with no account
- Generate an AI reference image to communicate their vision
- Browse artists via the Lens directory
- Pay to unlock an artist's contact details
- Commission the artist and track the order
- Leave a review when the piece is delivered

**Entry point:** `/` (landing page) → sign up via phone OTP → patron dashboard

#### Role 2 — Artist
An artist is a verified Indian artisan who receives and fulfils commissions. They:
- Log in to their artist dashboard
- Browse open commission requests on the marketplace
- Manage their portfolio/catalogue
- Update their profile and pricing
- Track their sales and earnings

**Entry point:** `/artist-dashboard`

Audit each role fully before switching. Complete Patron first, then Artist.

---

### WHAT TO AUDIT AND DOCUMENT

For every screen and interactive element you encounter, record the following:

#### A. Interaction Status
Classify every button, link, form field, and interactive element as:
- ✅ **WORKS** — Produces the expected result
- ❌ **BROKEN** — Produces an error, blank screen, or nothing
- ⚠️ **PARTIAL** — Works but output is incomplete or unexpected
- 🔲 **MISSING** — UI element exists but feature behind it is not built
- 👁️ **UI ONLY** — Renders but has no backend connection (mock/placeholder data)

#### B. Ease of Access — First-Time User Test
Imagine you are a first-time visitor who knows nothing about the platform. For every screen, note:
- Is the purpose of this page immediately obvious within 3 seconds?
- Is the primary action (what you should do next) visually clear and prominent?
- Is there any jargon, unexplained term, or assumed knowledge that would confuse a new user?
- Are there any dead ends — screens where the user has no obvious next step?
- Does the onboarding flow (landing → sign up → first action) feel natural and low-friction, or does it require effort to figure out?

#### C. Maneuverability — Navigation and Flow
After every multi-step interaction, assess how easy it is to move through the platform:
- Can a user always get back to where they came from without using the browser back button?
- Are breadcrumbs, back buttons, or contextual navigation present where needed?
- Flag every place where completing one action leaves the user stranded without a logical next step
- Flag every place where reaching the next logical step requires navigating to a completely different part of the layout (sidebar, header, separate page) rather than progressing naturally forward
- Note any flow where a user must repeat steps they already completed (re-entering data, re-selecting options)
- Flag excessive click depth: any feature that requires more than 3 clicks from the homepage to reach

#### D. UI/UX Element Quality
For every component on screen, assess:
- **Visual hierarchy** — Is it immediately clear what is the primary action vs secondary? Do buttons, headings, and CTAs have appropriate visual weight?
- **Consistency** — Do similar elements look and behave the same across different pages? (button styles, card layouts, spacing, typography)
- **Feedback** — Does every interactive element give the user feedback? (loading states, success messages, error states, disabled states)
- **Empty states** — When a section has no data (no orders, no saved images, no commissions), does it show a helpful message and a CTA to fill it, or just a blank space?
- **Mobile** — Resize the browser to 375px width. Note every element that breaks, overflows, is too small to tap, or disappears entirely
- **Forms** — For every form: are labels clear, is validation helpful (not just "required field"), is the submit button always visible, does submission give clear feedback?

#### E. Scalability Assessment — Launch Readiness
This is a pre-launch platform. Flag anything that would become a problem under real traffic or with real users. Specifically:

**Data and content:**
- Every section showing placeholder/mock data that real users would see (fake artist names, hardcoded prices, test content)
- Features that only work with mock data and have no real database connection
- Any page that would look broken or empty when a new real user first signs up (no orders yet, no connected artists, no saved images)

**Performance and reliability:**
- Images that are missing, broken, or loading from external URLs that may not be reliable
- Pages with no loading state — where a user would see nothing while data fetches
- Any API call that could visibly fail and leave the user with no error message

**Trust and credibility:**
- Missing legal pages (Terms of Service, Privacy Policy, Refund Policy) — note if these are linked in footer but pages don't exist
- Any place where the platform asks for payment or personal data without showing trust signals (security badges, payment provider logos, clear refund terms)
- Artist verification — is it clear to a patron that artists are verified? Is the verification badge prominent enough to build trust?
- Certificate of Authenticity — can a patron find and understand this feature without being told about it?

**Growth and retention:**
- Is there any mechanism for a user to come back? (saved items, order tracking, notifications, email confirmation)
- Is there any social proof on the platform? (review counts, order counts, featured work)
- Is there a clear upgrade/subscription path that a patron would naturally discover during normal use?
- Can an artist see what they need to do to get more commissions? Is there any growth mechanic for artists?

---

### SPECIFIC FLOWS TO TEST IN FULL

Run these end-to-end and document every step, friction point, and drop-off risk:

#### Patron Flows
1. **Full onboarding** — Land on homepage → understand what Artery does → decide to sign up → complete phone OTP → arrive at patron dashboard. Note every point of confusion or friction.
2. **Generate and commission** — Go to /generate → type a prompt → generate an image → navigate to /lens → find a suitable artist → view their profile → attempt to pay and connect. Note where the flow breaks or becomes unclear.
3. **Commission marketplace** — Go to /commissions → browse open commissions → attempt to post a new commission request. Does the form work? Is it clear who can post?
4. **Order tracking** — Go to /orders → check if an order's status is clear → find the Certificate of Authenticity for a completed order.
5. **Explore gallery** — Go to /explore → can a patron get inspired and take a clear next action from here?

#### Artist Flows
1. **Dashboard orientation** — Land on /artist-dashboard → within 30 seconds, can an artist understand what they should do first?
2. **Marketplace** — View open commission requests → attempt to click "View Details" on one → what happens?
3. **Catalogue management** — Go to Catalogue tab → attempt to add a new work. Does the upload flow work?
4. **Profile setup** — Go to Profile tab → fill in all fields → save. Does it persist?
5. **Sales overview** — Go to Sales tab → is the data clearly a placeholder or does it look real to an artist?

---

### KNOWN GAPS — CONFIRM EACH ONE

| Known Gap | Role | What to Confirm |
|---|---|---|
| No real OTP/auth flow connected | Both | Confirm whether login with a real phone number works or errors |
| Mock artist data shown to real users | Patron | Confirm hardcoded artists (Aarav Patel, Priya Singh, Rohan Gupta) are visible |
| Sales data is placeholder | Artist | Confirm ₹34,200 total earnings and other stats are hardcoded |
| "View Details" on commission requests does nothing | Artist | Confirm button is non-functional |
| Add Work / Upload in catalogue has no backend | Artist | Confirm upload placeholder does not actually store anything |
| Explore page safety filter | Patron | Confirm personal prompts are blocked. Test with "my family" as a prompt |
| No Terms of Service or Privacy Policy pages | Both | Confirm footer links go nowhere or pages don't exist |
| Razorpay payment not connected with real keys | Patron | Confirm what happens when a patron attempts to unlock an artist |
| Global search (Cmd+K) returns only mock results | Both | Confirm search only surfaces hardcoded data |
| Artist dashboard profile save does nothing | Artist | Confirm whether profile form submission persists across refresh |
| No email or notification after sign-up | Patron | Confirm no confirmation email or welcome message is sent |
| Subscription page plan selection | Patron | Confirm whether clicking a plan actually initiates payment |

---

### REPORT FORMAT

Save your output as `ARTERY_UX_Audit_Report.md` with the following structure:

```markdown
# Artery UX Audit Report
**Date:** [date]
**Audited By:** Antigravity Agent
**Roles Audited:** Patron / Artist
**Platform URL:** https://artery-ppwv8wdt4-mailboxswayam-3742s-projects.vercel.app

---

## Executive Summary
3–5 sentences. Most critical issues. Top 3 things to fix before launch.

---

## Launch Readiness Score
Rate the platform on each dimension from 1–10:
- Ease of Access: x/10
- Maneuverability: x/10
- UI Consistency: x/10
- Empty State Handling: x/10
- Mobile Experience: x/10
- Trust & Credibility: x/10
- Data Readiness (no mock data visible): x/10
- Overall Launch Readiness: x/10

---

## Audit by Role

### Role: Patron

#### Screen-by-Screen Findings
[For each page visited: URL, purpose clarity, elements tested, status of each]

#### Ease of Access Issues
[Every point where a new user would be confused, lost, or unsure what to do]

#### Maneuverability Issues
[Every dead end, navigation gap, or excessive click depth. Include suggested fix]

#### UI/UX Element Issues
[Consistency problems, missing feedback, broken empty states, mobile issues]

#### Scalability Flags
[Mock data, missing backend connections, trust issues, retention gaps]

---

### Role: Artist

[Same structure as Patron]

---

## Full Issue Register

| # | Page | Role | Issue | Category | Launch Blocker? | Priority |
|---|------|------|-------|----------|-----------------|----------|
[Every issue, one row per issue. Mark Y/N for launch blocker]

---

## Known Gap Confirmation

| Gap | Status | Observation |
|-----|--------|-------------|
[CONFIRMED / NOT FOUND / PARTIAL for each item in the Known Gaps table]

---

## Scalability Report
### Mock Data Inventory
[Every instance of hardcoded/placeholder data visible to real users]

### Missing Backend Connections
[Every feature that renders but has no real data source]

### Trust & Legal Gaps
[Missing pages, missing trust signals, payment concerns]

### Retention Mechanics Assessment
[What exists to bring users back. What is missing.]

---

## Recommendations — Ordered by Launch Impact
### Must Fix Before Launch
1. [Issue] — [Why it blocks launch] — Estimated effort: Low/Medium/High

### Should Fix Soon After Launch
1. ...

### Nice to Have
1. ...
```

---

### RULES FOR THE AGENT

- Do not summarise or skip screens. Every nav item, every tab, every button gets tested.
- If a button does nothing, click it a second time and note if second click behaves differently.
- If a form exists, fill it with realistic test data and attempt submission. Note the result.
- If a modal or dropdown opens, interact with every option inside it before closing.
- Resize to mobile (375px) at least once per role and document what breaks.
- Do not stop early. Complete both roles fully before writing the report.
- When in doubt about whether something is a bug or intentional, flag it as ⚠️ PARTIAL and describe exactly what happened.
- Pay special attention to anything a real paying customer would encounter — payment screens, artist contact unlock, order confirmation. These are the highest-stakes flows.

Begin with the Patron role. Start on the landing page now.
```
