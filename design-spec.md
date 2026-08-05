# Design Specification

## Agent
Eoin Walsh, Designer

## Review of the Researcher's brief
Niamh's brief identifies a clear and defensible customer-engagement problem. The strongest parts are the focus on live availability, the distinction between social media as a promotional channel versus an operational channel, and the framing of coach visibility as a trust issue rather than a cosmetic feature. The brief is specific enough to design against and correctly separates evidence-backed claims from assumptions.

I accept the brief with three design cautions:
- the experience should not imply direct booking unless booking functionality exists
- coach recommendations should stay descriptive rather than overly personalized if the live data is limited
- class suitability should be framed carefully if no explicit difficulty field exists

## Design overview
The StudioFlow AI experience should act as the studio's reliable source of current information. The design should reduce uncertainty at the moment a customer wants to move from browsing to deciding. It should do this by making two journeys especially easy:
- find a class with confirmed availability
- find the right coach with enough context to build trust

The chatbot is not just a front-end input box. It is an LLM-powered assistant that interprets the user's question, decides which live data source to query, and returns a grounded response based on the runtime data it receives. The interface therefore has two layers:
- a customer-facing chat interface on the page
- an LLM orchestration layer behind it that handles intent detection, live data lookup, response generation, and fallback behavior

The prototype should be a simple single-page interface with:
- a clear heading and short value proposition
- visible AI disclosure
- a chat panel as the main interaction surface
- optional quick-action prompts for common questions
- a secondary information area for announcements or example queries

The interaction model should be concise, plain-language, and operationally useful. The customer should never need to interpret internal field names or vague status messages.

## Core user intents and flows
### Intent 1: Find a class by day or date
User goal: see what is on today, tomorrow, or on a named day.

Flow:
1. User asks for classes on a date or day.
2. System retrieves matching classes from live `Classes` data.
3. System returns class name, time, coach name, and availability status.
4. System offers a sensible next step such as asking about coach details or pricing.

### Intent 2: Check whether a class is full
User goal: know if a specific class still has spaces.

Flow:
1. User names a class, date, or time.
2. System finds the specific class entry.
3. System returns one of three plain-language states:
   - spaces available
   - currently full
   - waitlist open
4. If data is unclear, system says so and avoids false certainty.

### Intent 3: Discover a coach
User goal: understand who teaches what and who may be a good fit.

Flow:
1. User asks about a named coach or a type of class.
2. System retrieves relevant `Coaches` data and related class links where possible.
3. System returns coach name, specialty, short bio, style, and beginner suitability if available.
4. System offers related next steps such as viewing that coach's upcoming classes.

### Intent 4: Match coach to customer need
User goal: identify a likely coach for a beginner or specific training preference.

Flow:
1. User asks a suitability question such as beginner-friendly or strength-focused.
2. System checks available coach fields.
3. System responds with careful, data-grounded suggestions only.
4. If the data is too weak, system states the limit and suggests asking about classes instead.

### Intent 5: Compare memberships
User goal: understand options and prices quickly.

Flow:
1. User asks about memberships or price.
2. System retrieves `Memberships` data.
3. System summarizes options in a scannable format.
4. System offers a follow-up such as beginner classes or FAQs.

### Intent 6: Get FAQs or announcements
User goal: resolve common friction without leaving the experience.

Flow:
1. User asks a practical question or requests updates.
2. System checks `FAQs` or `Announcements`.
3. System returns a direct answer with no unnecessary wording.

## Chatbot response structure
All responses should follow this structure where relevant:
1. Direct answer first
2. Supporting details second
3. Honest limit or caveat if needed
4. Optional next-step prompt

## LLM interface and orchestration design
### Role of the LLM
The LLM acts as the reasoning and language layer of the chatbot. It should:
- interpret natural-language customer queries
- classify the likely intent
- decide which live dataset to consult
- transform raw data into customer-friendly responses
- avoid answering beyond the returned data
- trigger fallback messaging when the data is missing or unclear

### Expected intent routing
- timetable queries -> `Classes`
- availability/fullness queries -> `Classes`
- coach queries -> `Coaches`
- class plus coach queries -> `Classes` joined with `Coaches`
- pricing queries -> `Memberships`
- FAQ queries -> `FAQs`
- update queries -> `Announcements`

### LLM-to-data interaction pattern
1. User submits a question in the chat UI.
2. Front end sends the message to the chatbot backend or serverless handler.
3. The LLM interprets the request and selects the relevant tool call or data fetch.
4. Live data is fetched at runtime from the approved source.
5. Returned data is normalized into a clean structure.
6. The LLM generates a response grounded only in that result.
7. The front end displays the final answer with any needed caveat or next step.

### Grounding rules
- The LLM must not invent availability.
- The LLM must not invent coach attributes that are not in the source data.
- The LLM must not imply booking, payment, or guaranteed placement unless that functionality exists.
- The LLM should prefer "I do not have reliable live data for that right now" over guessing.

### Suspicious-data handling
The LLM should not assume that every live value is trustworthy just because it exists in the source. If a returned value is operationally unusual or materially inconsistent with the rest of the dataset, the assistant should answer with caution.

Examples include:
- a class scheduled at an obviously unusual time such as 4am
- a membership priced dramatically above the rest of the pricing structure
- any entry that appears to be a test record, placeholder, or likely data-entry mistake

When this happens, the assistant should:
1. report what it can see in the live data
2. state that the value appears unusual
3. advise confirmation with the studio before the customer relies on it
4. avoid presenting the value as routine or fully trustworthy

### Minimum interface behavior
- opening disclosure that the user is interacting with an AI assistant
- visible loading state while the live query is running
- clear error state if the live data fetch fails
- response formatting that distinguishes direct answer from supporting context
- optional suggested follow-up prompts generated from supported intents

### Example response pattern for availability
"The 6pm HIIT class on Thursday currently has spaces available. Coach: Sarah Byrne. If you want, I can also show you other evening classes or tell you more about Sarah."

### Example response pattern for low-confidence data
"I can see the class time, but I do not have reliable live availability for that session right now. You can still ask about the coach, pricing, or other classes."

### Example response pattern for suspicious live data
"I can see a 4am class listed in the live schedule, but that looks unusual for this studio, so I would recommend confirming it directly with the studio before relying on it."

## Front-end layout and interaction notes
### Page structure
- hero heading: `Find classes, check availability, and discover the right coach`
- subheading explaining the value in one sentence
- visible AI disclosure near the chat entry point
- primary chat area centered on the page
- quick prompts beneath the opening message
- small side or lower panel for announcements or featured coach prompts

### Suggested quick prompts
- `What classes are on today?`
- `Which classes still have spaces left?`
- `Who teaches Pilates?`
- `Which coach is best for beginners?`
- `What memberships do you offer?`

### Tone and language
- calm
- clear
- operational
- non-hyped
- reassuring without overpromising

## Accessibility and trust considerations
- clearly disclose that the user is interacting with an AI assistant
- avoid implying that social media is the current source of truth for availability
- use plain-language status labels instead of ambiguous internal values
- support readable response formatting with short paragraphs or bullets
- avoid fabricated recommendations when the data is weak
- flag suspicious outlier values with cautious wording rather than presenting them as normal
- include fallback guidance when a question cannot be answered reliably
- do not imply that a coach is medically suitable or professionally endorsed beyond the stored data

## Review of service-risk areas
### Availability risk
If `slots_left`, `status`, or `waitlist_open` are missing or inconsistent, the experience must not guess. It should downgrade gracefully.

### Coach suitability risk
If there is no clear `experience_level_focus` or equivalent field, the assistant should not claim that a coach is "best" for a user. It may instead say what the coach specializes in.

### Booking risk
If no booking link or booking action exists, the design should avoid false call-to-action language such as "book now".

## Handoff instructions for the Maker
- Build a single-page GitHub Pages prototype.
- Make the chat interface the main interaction surface.
- Treat availability and coach discovery as first-class capabilities.
- Join class and coach data so a user can ask mixed questions.
- Use live runtime data only.
- Keep the interface clean and defensible over feature-heavy.
- Implement an LLM-powered chatbot flow where the model interprets user questions and responds only after a live data fetch or verified fallback.

## maker_handoff
### Review outcome
The research brief is accepted. It is specific, aligned to the assignment, and suitable for implementation.

### Buildable features by priority intent
1. Day/date class lookup with time, coach, and availability
2. Specific class availability check with plain-language status
3. Coach lookup by name or class type
4. Coach suitability lookup using available coach fields only
5. Membership summary and pricing lookup
6. FAQ and announcement retrieval

### Feature-to-data mapping
- Class lookup: `class_name`, `date`, `day`, `start_time`, `coach_id`, `slots_left`, `status`, `waitlist_open`
- Coach display: `coach_id`, `coach_name`, `specialty`, `bio`, `experience_level_focus`, `style`
- Membership summary: `membership_name`, `price_eur`, `description`, `billing_period`
- FAQs: `question`, `answer`
- Announcements: `message`, `effective_date`

### Required fallback behavior
- If availability data is missing, say availability cannot be confirmed
- If coach suitability data is weak, describe specialty only
- If a class is found but coach linking fails, return class details and state the coach data is unavailable
- If no matching class exists, say so clearly and suggest another supported query
- If a value is present but appears suspicious or inconsistent, surface it cautiously and recommend confirmation with the studio

### Design assumptions the Maker must not silently invent around
- direct booking support
- customer account handling
- payment or checkout
- medical or performance advice
- personalized recommendations beyond the available data

### What must be verifiable in the final prototype
- live runtime data retrieval
- LLM-mediated chatbot interaction between user input and live data response
- visible AI disclosure
- accurate availability wording
- coach discovery support
- cautious handling of suspicious outlier data
- honest fallback behavior
- evidence that the prototype reduces reliance on static social posts for operational questions
