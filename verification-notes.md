# Verification Notes

## Agent
Aoife Byrne, Maker

## Review of the Designer's spec
The design is implementable and suitably constrained for the assignment. It defines a clear LLM-assisted chatbot interface, live data grounding, and safe fallback behavior. No redesign is needed at this stage.

## Verification checklist
### Runtime data
- verify that `Classes`, `Memberships`, `Coaches`, `FAQs`, and `Announcements` are fetched dynamically at query time
- verify no class or coach operational data is hardcoded into the front end or prompt text

### Backend and secret handling
- verify the LLM API key is stored only in Cloudflare Worker secrets or backend environment variables
- verify no secret is present in client-side files or committed configuration
- verify the browser sends chat requests to the Cloudflare Worker endpoint rather than directly to the LLM provider
- verify the Cloudflare Worker performs the live data fetch and response grounding

### Chatbot behavior
- verify the LLM receives the user query and responds only after live data retrieval or verified fallback
- verify availability responses are grounded in `slots_left`, `status`, and `waitlist_open`
- verify coach answers are grounded in stored coach fields only
- verify suspicious outlier values are flagged with cautious wording and confirmation advice

### Customer-facing flows
- verify a user can ask for classes by day or date
- verify a user can ask whether a named class is full
- verify a user can ask who teaches a class
- verify a user can discover coaches by specialty or beginner suitability where supported
- verify membership, FAQ, and announcement queries return concise answers

### Trust and disclosure
- verify the page discloses AI use near the interaction entry point
- verify missing data produces an honest limitation rather than an invented answer
- verify the interface does not imply direct booking if that feature is not present

## Cold test scenarios
1. Ask: `What classes are on tomorrow?`
Expected: list of matching classes with time, coach, and availability.

2. Ask: `Is the 6pm HIIT class full?`
Expected: one of three grounded states: spaces available, full, or waitlist open.

3. Ask: `Who teaches Pilates?`
Expected: coach identity and relevant coach details from live data.

4. Ask: `Which coach is best for beginners?`
Expected: careful response using available coach data only, or a limitation if unsupported.

5. Ask: `What memberships do you offer?`
Expected: concise summary of names, prices, and descriptions.

6. Ask: `Tell me about the Moonlight Metabolic Blast class.`
Expected: the assistant reports the class but notes that a 4am slot appears unusual and should be confirmed.

7. Ask: `How much is the Elite Platinum Founder Circle membership?`
Expected: the assistant reports the 5000 euro price but signals that it appears unusually high and should be confirmed.

8. Remove or blank an availability field in the live source.
Expected: the assistant states it cannot confirm live availability rather than guessing.

## Outcome summary
The prototype is considered defensible only if it can prove secure backend key handling, live data access, accurate availability wording, coach visibility support, and honest fallback behavior. Those are the minimum quality gates before downstream marketing or final synthesis.
