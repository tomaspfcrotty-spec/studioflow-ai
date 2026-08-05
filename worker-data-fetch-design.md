# Cloudflare Worker Data Fetch Design

## Purpose
The Cloudflare Worker is the private backend layer between the GitHub Pages chatbot UI, the Google Sheet, and the LLM provider. Its job is to keep secrets out of the browser, fetch live sheet data at runtime, normalize that data, and pass only grounded context into the model response flow.

## Responsibilities
- receive chat requests from the front end
- store the LLM API key securely as a Cloudflare secret
- fetch the required Google Sheet tab data at runtime
- parse CSV rows into structured objects
- join data where needed, especially `Classes` with `Coaches`
- detect simple suspicious values before or alongside the LLM step
- call the LLM with constrained context
- return a safe response payload to the browser

## Request flow
1. User submits a message from the GitHub Pages chatbot.
2. `app.js` sends a POST request to the Cloudflare Worker.
3. The Worker classifies the likely intent.
4. The Worker fetches only the relevant sheet tab or tabs.
5. The Worker parses the CSV into objects.
6. The Worker applies normalization and simple anomaly checks.
7. The Worker sends the grounded context to the LLM.
8. The Worker returns the final answer and any caution message to the front end.

## Suggested intent-to-source mapping
- timetable queries -> `Classes`
- availability queries -> `Classes`
- coach queries -> `Coaches`
- class plus coach queries -> `Classes` + `Coaches`
- pricing queries -> `Memberships`
- FAQ queries -> `FAQs`
- update queries -> `Announcements`

## Suggested normalization rules
### Classes
- normalize `slots_left` to a number
- normalize `waitlist_open` to boolean
- keep `start_time` as a comparable string such as `HH:MM`

### Memberships
- normalize `price_eur` to a number

### Coaches
- split `signature_classes` on `|` into an array

### Announcements
- return only `active` items

## Suggested anomaly rules
These should be simple and explainable.

### Class anomalies
- flag any class earlier than `06:00` as suspicious

### Membership anomalies
- flag any membership price above `500` euro as suspicious in this studio context
- this should catch the `Intro 2 Weeks` membership at `5000` euro

### Announcement-assisted caution
- if an active announcement already warns that an item may be a test entry, include that in the grounded context

## Response strategy
If a value is suspicious, the Worker should pass both:
- the raw value
- a short caution flag

The LLM should then respond in a format like:
- what it can see in the live data
- why the value appears unusual
- a recommendation to confirm with the studio before relying on it

## Suggested Worker payload shape
```json
{
  "intent": "availability",
  "query": "Is the 6pm HIIT class full?",
  "results": [],
  "warnings": [],
  "sourceTabs": ["Classes"]
}
```

## Suggested implementation note
For assignment scope, intent classification can be lightweight and rule-based before the LLM call. That keeps the flow more controllable and easier to explain in the final report.
