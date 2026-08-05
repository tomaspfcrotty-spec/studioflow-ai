# Manager Log

## Agent
Ciaran Doyle, Manager

## Current status
- Research complete
- Design complete
- Maker stage complete
- Communicator stage complete
- Cloudflare Worker deployed
- Front-end static site prepared for GitHub Pages publication

## Completed artifacts
- `research-brief.md`
- `design-spec.md`
- `README.md`
- `verification-notes.md`
- `marketing-plan.md`
- `data-sources.md`
- `worker-data-fetch-design.md`
- `worker.js`
- `index.html`
- `styles.css`
- `app.js`
- `github-pages-setup.md`

## Review of handoffs
### Researcher -> Designer
Approved. The problem statement was explicit: social-media timetable confusion, unclear class fullness, and weak coach visibility. Data dependencies were defined clearly enough for downstream design.

### Designer -> Maker
Approved. The design translated research into implementable user flows, explicit LLM orchestration, fallback behavior, and trust constraints. The design was correctly bounded to avoid pretending the prototype is a booking system.

### Maker -> Communicator
Approved. The implementation notes documented the Cloudflare Worker boundary, secret handling, live Google Sheet runtime access, and verification checks. The build remained aligned to the service problem instead of drifting into generic AI marketing.

### Communicator -> Manager
Approved. The messaging stayed truthful and focused on reduced uncertainty, clearer availability, and better coach visibility. Unsupported claims were identified and avoided.

## Decisions made
1. Use Google Sheets as the live operational data source.
2. Use Cloudflare Workers as the private backend for OpenAI and live data access.
3. Use GitHub Pages as the public static front end.
4. Keep the chatbot customer-facing but bounded: no false booking claims, no invented data, no hidden anomalies.
5. Include deliberate suspicious records in the live data so the assistant can demonstrate calibrated trust rather than blind trust.

## Governance view
### What the service may do
- answer class timetable questions from live sheet data
- report class availability and waitlist state when data supports it
- explain coach identity and specialty
- summarize memberships, FAQs, and announcements
- warn users when values appear suspicious or test-like

### What the service must disclose
- the user is interacting with AI
- answers rely on live studio information
- some information may require confirmation if unusual or unclear

### What the service must not do
- claim direct booking unless implemented
- invent availability
- invent coach qualities beyond the source data
- present suspicious values as normal without caution

## Evidence against rubric
### Agent architecture
Five distinct agents were used with separate roles, tone, review behavior, and outputs.

### Handoff and orchestration
Each stage reviewed the previous artifact and produced a downstream handoff. The artifacts are cumulative rather than isolated.

### Working prototype
The deployed Worker is live at:

- `https://studioflow-ai-worker.tomaspfcrotty.workers.dev`

It fetches the shared Google Sheet at runtime and returns grounded chatbot answers.

### Strategic rationale
The prototype addresses customer engagement friction directly by replacing operational dependence on social media with a clearer live assistant and by making coaches more visible as trust-building assets.

### Reflection readiness
The pipeline contains enough evidence of iteration, especially around:
- explicit LLM orchestration
- secret handling and backend architecture
- suspicious-data caution behavior
- deployment troubleshooting

## Open issues
- GitHub Pages still needs to be published from a GitHub repository.
- Once the final Pages URL exists, `ALLOWED_ORIGIN` should be narrowed from `*` to the published domain.
- The Worker should be redeployed after that CORS restriction is applied.

## Final executive synthesis
StudioFlow AI is now a defensible multi-agent customer engagement prototype. The system uses a live Google Sheet to answer questions about classes, availability, coaches, memberships, FAQs, and announcements through a Cloudflare Worker-backed chatbot. The strongest strategic contribution is that it addresses a real customer problem: the studio currently relies too heavily on social media for timetable communication, while customers still lack clear visibility into class fullness and coach identity. The prototype reduces that uncertainty while preserving trust through AI disclosure, bounded claims, and caution around suspicious live data.

## Rubric check
- live runtime data access: yes
- GitHub Pages-ready front end: yes
- five-agent pipeline documented: yes
- review and handoff evidence: yes
- trust and anomaly handling: yes
- secret handling kept off the client: yes

## Next handoff
Publish the static front end to GitHub Pages, update `ALLOWED_ORIGIN` to the final Pages domain, redeploy the Worker, and capture screenshots and transcripts for submission evidence.
