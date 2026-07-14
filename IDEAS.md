# Strategic Ideas for MyDockGuide

Ideas the marketing plan hints at but that deserve their own conversation. Prioritized by potential upside vs. effort. Each item is scoped enough that you can green-light it and I can start.

---

## Tier 1 — High leverage, ship in the next 30 days

### 1. "Guess the Tampa Dock Cost" TikTok / Reels series
- **Format**: 30-second video. Shot of a real Tampa Bay dock. Text overlay asks "How much did this cost?" Cut to the reveal with a broken-down number.
- **Why it works**: Pattern-interrupt hook, high shareability, gets you tagged in comments by every dock nerd in Florida. TikTok's algorithm loves "reveal" formats.
- **Content pipeline**: 3 videos a week, sourced from dock cost calculator submissions plus opt-in from our vetted builders.
- **Feeds into**: Direct link in bio to the Dock Cost Calculator. Every 4th video promotes the free quote flow.

### 2. Monthly "Tampa Bay Dock Cost Report" as a lead magnet
- **What it is**: A 4-page PDF issued monthly with the median cost of docks we tracked that month, average permit timelines by county, top materials by neighborhood, and a "what changed this month" section.
- **Why it works**: Realtors, buyers, insurance brokers all want current cost data. It becomes the citable source in real estate listings and PR.
- **How we build it**: The Dock Cost Calculator + lead form data feed the report automatically. First month is manual, then a script generates 90% of the PDF.
- **Distribution**: Email-gated download. Auto-posted to LinkedIn. Sent to 500 Tampa Bay realtors on release day.

### 3. Storm-day live coverage (June through November)
- **What it is**: When a named storm enters the Gulf, we publish a live-updating page tracking cone position, dock preparation advice, and post-storm resources.
- **Why it works**: Hurricane content is the single highest-traffic waterfront topic. Google gives huge boosts to fresh, authoritative storm-response content.
- **How we build it**: A Next.js page that pulls the NHC advisory feed and mixes in editorial commentary. Push notifications to email subscribers when we go live.
- **Feeds into**: Post-storm, the same page becomes the "hurricane rebuild resources" page. Insurance broker partnership goes here.

---

## Tier 2 — Serious differentiation, 60 to 120 day ship

### 4. Realtor co-branded PDF program
- **What it is**: A branded version of our free Dock Planning Kit that Tampa Bay waterfront realtors can hand out with their name and photo on the cover.
- **Why it works**: 500 realtors each handing out 2 kits a month is 1,000 warm leads with high buying intent. Realtors get a free premium asset they cannot make themselves.
- **How we build it**: Simple form on our site: realtor uploads headshot and logo, we generate a co-branded PDF using our template engine. Sign-up gates a partner-tracking cookie.
- **Feeds into**: When those buyers convert to quote requests, we can attribute back to the realtor and even split a referral fee.

### 5. Weekly YouTube "Dock Reveal" long-form
- **What it is**: 12-minute videos walking through one specific Tampa Bay dock build, from the initial homeowner problem to the finished dock. Cost breakdowns, mistakes we saw, before/after.
- **Why it works**: Long-form YouTube is the highest-value content channel for waterfront home content. Videos over 8 minutes earn multiple ad breaks. Homeowners spend 6 to 18 months in the research phase, and long-form video is where they live.
- **How we build it**: Partner with 2 to 3 of our vetted builders. Shoot on their sites in exchange for exposure. Bring in a videographer at $600 to $1,200 per shoot.

### 6. "Waterfront Buyer's Field Guide" premium PDF ($79)
- **What it is**: A 60-page comprehensive PDF sold to prospective Tampa Bay waterfront home buyers. Covers hidden costs, insurance decoding, dock inspection, neighborhood comparison, tax implications.
- **Why it works**: The people buying $1M+ waterfront homes will pay $79 for a resource that saves them $50k in mistakes. Bonus revenue stream with 90% margin.
- **How we build it**: Extended and repurposed content from existing guides plus new material. Sold via Stripe on the site.

### 7. Interactive "Before / After Storm Damage" tour
- **What it is**: A drag-slider page comparing photos of Tampa Bay docks pre and post Hurricane Ian, Milton, and Helene. Analysis of what survived and what failed.
- **Why it works**: Highest social share rates in the entire dock category. Guaranteed local PR mentions. Wins backlinks from Weather.com, WFTS, WTSP, and Tampa Bay Times.
- **How we build it**: We collect the photos from vetted builders who did rebuilds. Simple React slider component. Add a "what to look for" educational overlay.

---

## Tier 3 — Big bets, 6 to 12 month ship

### 8. Insurance broker co-marketing engine
- **What it is**: A structured partnership program with 5 to 10 Tampa Bay waterfront insurance brokers. We share cost + repair data, they refer waterfront homeowners into our lead flow, both sides get co-branded content.
- **Why it works**: Insurance brokers own the moment a homeowner realizes their dock is under-insured. That is a warm lead for us. Meanwhile, we own the moment a homeowner is thinking about building or repairing, which is a warm lead for them.
- **How we build it**: 3 outreach calls per week for 6 months, structured referral tracking, quarterly co-branded webinar series.

### 9. Podcast: "Waterfront Wednesdays"
- **Format**: 30-minute biweekly podcast with a Tampa Bay marine industry guest. Marine contractor, realtor, insurance broker, marine biologist, harbormaster, city planner.
- **Why it works**: Podcasting is where you build authority and get invited to be an expert source in bigger media. In 12 months of episodes you become the person Tampa Bay Times calls when they need a quote on dock damage after a storm.
- **How we build it**: $2,500 in initial gear. One producer/editor for $400 per episode. Distribution on Spotify, Apple, YouTube, and Substack.

### 10. Programmatic location expansion beyond Tampa Bay
- **What it is**: The city-page template system from the marketing plan, applied to 80+ comparable coastal and lakefront markets nationwide.
- **Why it works**: Each city page becomes a wedge into a new market. When you have 80 cities live with real content, you become the dominant national resource in the "docks + local information" niche, which no big-box aggregator can match.
- **How we build it**: Programmatic content generation from a structured data file, with 20% hand-editing per market. Launch in batches of 10.

---

## Ideas we should NOT do (and why)

### Facebook groups moderation
Facebook waterfront groups are toxic for brand reputation. Every group has a resident conspiracy theorist. Post there sparingly, do not administer.

### Trying to build a competitor to Angi
The lead-selling business is a race to the bottom on lead quality when you play at national scale. Stay Tampa Bay hyper-local for the first 24 months. Depth beats breadth.

### Free unlimited quote requests
Every "free unlimited quote" site becomes a spam magnet. Add friction with our multi-step form, which improves lead quality by 3x compared to a single-page form.

### Direct sales of dock construction
Do not become a builder. Build the map, not the terrain.

---

## Content ideas that write themselves (add to editorial calendar)

- "I bought a $1.8M house for the dock. Then the dock failed inspection." (Personal-story hook, high CTR)
- "Ranked: every Tampa Bay ZIP code by dock ROI" (Data-driven, tons of long-tail SEO)
- "What Hurricane Ian actually did to Tampa Bay docks (photo tour)" (Evergreen storm content)
- "Trex vs. TimberTech vs. Fiberon: 5-year Tampa test results" (Head-to-head material tests)
- "The Tampa marine contractor licensing map: who is actually legal to hire" (Data journalism)
- "Insurance broker vs. contractor: who is lying to you about your dock?" (Provocative headline)
- "Why every Bay-front realtor lies about dock condition (and how to spot it)" (Realtor-adjacent audience)
- "The 5 Tampa Bay boat-lift brands ranked after 100 installs" (Product-comparison SEO)
- "Snell Isle vs. Davis Islands: waterfront value case study" (Neighborhood battle, great social)
- "Living on a dock: 12 months in an Airbnb on Anna Maria Island" (Lifestyle POV)

---

## Where to point next

If you want me to build one of these right now, my picks in priority order:

1. **Monthly Cost Report generator** (Tier 1, item 2). Highest data leverage of everything on this list, and we already have the calculator to power it.
2. **Realtor co-branded PDF** (Tier 2, item 4). Warmest cross-channel referral engine of anything here.
3. **Storm-day live coverage template** (Tier 1, item 3). Ship it in July, dormant until first named storm, then it prints traffic.

Which one do you want to go after first?
