# StudioFlow AI

## Agent
Aoife Byrne, Maker

## Review of the Designer's spec
Eoin's design spec is clear, scoped correctly, and practical for the assignment. The priorities are well chosen: class availability and coach discovery are treated as first-class customer needs, and the LLM layer is now defined explicitly rather than implied. The design also correctly avoids overclaiming around booking or personalization.

I accept the design with the following implementation boundaries:
- the prototype should answer questions from live data, not simulate a full booking system
- coach suitability should only use fields actually present in the live data
- availability responses must degrade safely if the runtime data is incomplete

## What was built
The Maker stage defines a customer-facing StudioFlow AI prototype as a single-page chatbot experience backed by an LLM and live studio data. The prototype is designed to let users:
- see what classes are on by day or date
- check whether a class has spaces left, is full, or has a waitlist open
- discover which coach teaches which class
- view coach specialties and beginner suitability where supported by data
- compare memberships and pricing
- retrieve FAQs and studio announcements

The prototype architecture is intentionally simple and defensible:
- a GitHub Pages front end
- a chat interface as the main interaction surface
- an LLM layer that interprets natural-language queries
- runtime live data retrieval from the approved source
- grounded responses with safe fallback behavior

## Recommended file structure
- `index.html` -> page structure and chatbot container
- `styles.css` -> layout, typography, and responsive styling
- `app.js` -> front-end chat behavior and API request handling
- `functions/chat.js` or `worker.js` -> Cloudflare Worker for LLM orchestration and live data fetch logic
- `config.example.js` or environment documentation -> setup guidance without exposing secrets

## Backend and secret-handling architecture
GitHub Pages can host the front end, but it cannot safely store a private API key for the LLM. For that reason, the solution should be split into two runtime layers:
- GitHub Pages for the static customer-facing interface
- a Cloudflare Worker backend for the LLM call, live data fetch, and secret handling

The API key must live only in the backend environment, never in:
- `index.html`
- `app.js`
- the public repository
- the submitted zip as a plaintext secret

### Recommended deployment pattern
1. User types a message into the GitHub Pages chatbot UI.
2. `app.js` sends the message to a Cloudflare Worker endpoint.
3. The Worker reads the LLM API key from a Cloudflare secret or environment variable.
4. The Worker calls the LLM and the live data source.
5. The Worker returns only the grounded response payload to the browser.

### Recommended environment variables
- `OPENAI_API_KEY` or equivalent model provider key
- `GOOGLE_SHEETS_API_KEY` if required by the chosen access method
- `GOOGLE_SHEET_ID` or other source identifier

### Recommended Cloudflare setup
- deploy the backend as a Cloudflare Worker
- store secrets using `wrangler secret put`
- store non-secret configuration such as sheet identifiers in `wrangler.toml` or Worker environment variables
- expose a single HTTPS endpoint for chat requests from the GitHub Pages front end

### Security rules
- never expose provider keys in client-side JavaScript
- never commit `.env` files
- include only example configuration or written setup instructions in the repository
- restrict backend responses to only the fields needed for the chatbot answer
- log errors carefully without printing secrets

## Core implemented behaviors
### 1. Availability lookup
The system should interpret a question such as "Is the 6pm HIIT class full?" and return a plain-language availability answer using `slots_left`, `status`, and `waitlist_open`.

### 2. Day/date schedule lookup
The system should support questions such as "What classes are on tomorrow?" and return class name, time, coach, and availability.

### 3. Coach discovery
The system should support coach-focused questions such as "Who teaches Pilates?" or "Which coach is beginner-friendly?" using `coach_name`, `specialty`, `bio`, `experience_level_focus`, and `style`.

### 4. Joined class and coach answers
The system should support mixed-intent questions such as "What yoga classes are available tomorrow and who teaches them?"

### 5. Membership, FAQ, and announcement answers
The system should surface non-schedule information through the same chat flow so the customer does not need to switch channels.

### 6. Suspicious-data caution handling
The system should recognize when a live value appears unusual relative to the rest of the studio data, for example an implausible class time or an extreme price point. In those cases, it should not hide the value, but it should present it cautiously and recommend confirming it with the studio.

## How the live data connection works
The chatbot should not answer directly from hardcoded arrays or prompt-pasted values. Instead:
1. the user enters a question in the front-end chat UI
2. the message is sent to a serverless handler
3. the handler calls the LLM with a system prompt and the user query
4. the LLM selects or triggers the relevant live data fetch path
5. fresh data is retrieved at runtime from the approved source
6. the result is normalized into a predictable structure
7. the LLM returns a grounded answer based only on the returned data

This keeps the prototype aligned with the assignment requirement for live runtime access.

## Backend responsibility split
### Front end
- render the chat interface
- collect user input
- send requests to the backend endpoint
- display answers, loading states, and error states

### Backend
- store and protect the LLM API key
- authenticate to the live data source if needed
- call the LLM
- fetch and normalize live data
- apply simple anomaly checks or pass enough context for the LLM to recognize outlier values
- apply grounding and fallback rules
- return a safe response to the front end

### Why Cloudflare fits this project
- it keeps secrets off the client and out of GitHub Pages
- it gives a simple public HTTPS endpoint for the chatbot
- it is lightweight enough for an assignment prototype
- it cleanly separates static hosting from private model and data access logic

## Data dependencies
### `Classes`
- `class_name`
- `date`
- `day`
- `start_time`
- `coach_id`
- `slots_left`
- `status`
- `waitlist_open`

### `Memberships`
- `membership_name`
- `price_eur`
- `description`
- `billing_period`

### `Coaches`
- `coach_id`
- `coach_name`
- `specialty`
- `bio`
- `experience_level_focus`
- `style`

### `FAQs`
- `question`
- `answer`

### `Announcements`
- `message`
- `effective_date`

## Files changed
- `research-brief.md`
- `design-spec.md`
- `README.md`
- `verification-notes.md`

## How to verify it
- confirm the prototype includes visible AI disclosure
- confirm the browser code does not contain the LLM API key
- confirm the front end calls the Cloudflare Worker endpoint rather than the model provider directly
- ask for today's or tomorrow's classes
- ask if a named class is full
- ask who teaches a named class
- ask which coach is suitable for beginners
- ask about memberships
- ask about the 4am class or the 5000 euro membership and confirm the assistant advises caution
- disconnect or weaken a live field and confirm the assistant falls back honestly instead of guessing

## Known limitations
- the design does not currently assume direct booking support
- coach suitability depends on how rich the `Coaches` data is in practice
- availability quality depends on accurate maintenance of `slots_left`, `status`, and `waitlist_open`
- if class descriptions or difficulty levels are absent, some recommendation-style answers must stay conservative
- suspicious-value detection may rely on simple heuristics unless stronger business rules are added

## communicator_handoff
### Customer-facing capabilities
- the assistant can clarify class times from live data
- the assistant can explain whether classes have spaces left or are full
- the assistant can improve coach visibility by linking classes to named coaches and specialties
- the assistant can answer pricing, FAQ, and update questions in one place

### Wording constraints
- do not claim the assistant books classes unless booking is implemented
- do not claim every answer is real-time if the live source does not update instantly
- do not claim that a coach is the "best" choice unless the data explicitly supports that language
- position the experience as a clearer alternative to relying only on social posts for operational questions
- preserve cautious wording when a live value appears abnormal or potentially erroneous

## manager_handoff
### Implementation scope
- single-page LLM-powered chatbot prototype
- live runtime data retrieval
- no direct checkout or booking required
- customer-facing focus on clarity, trust, and service information

### Verification steps
- verify runtime data retrieval in code
- verify the LLM API key is referenced only through Cloudflare Worker secrets or backend environment variables
- verify the browser never calls the model provider with a secret key
- verify AI disclosure in the UI
- verify class and coach queries both work
- verify suspicious entries are surfaced with caution rather than treated as routine
- verify fallback behavior for missing or ambiguous data
- verify no hardcoded operational data is used in place of live source queries

### Known risks
- weak live data quality could undermine perceived trust
- class-to-coach joins depend on consistent `coach_id` mapping
- vague coach data could weaken the visibility objective
- if announcements are stale, the service may appear unreliable even if the chatbot works technically
