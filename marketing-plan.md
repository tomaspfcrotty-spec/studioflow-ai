# Marketing Plan

## Agent
Saoirse Nolan, Communicator

## Review of the Maker's build notes
Aoife's implementation notes are clear, credible, and appropriately restrained. The strongest aspect of the build is that it solves a real customer problem rather than presenting a generic AI chatbot. The prototype is positioned as a live information assistant, not a full booking system, which is the right scope for this assignment. The backend architecture is also now clear: the customer-facing site lives on GitHub Pages, while the LLM and secret handling sit behind a Cloudflare Worker. That separation supports trust and technical defensibility.

I accept the build notes with the following communication constraints:
- we should not claim direct booking unless it is implemented
- we should not present every answer as perfect real-time truth if the source data depends on manual upkeep
- we should emphasize clarity, confidence, and coach visibility rather than generic AI novelty

## Target audience
- prospective first-time customers who feel unsure about which class or coach to choose
- existing or returning customers who want quick, reliable timetable and availability answers
- busy customers who do not want to search through social media posts or send direct messages for basic information

## Positioning
StudioFlow AI is a live studio assistant that helps customers find classes, check availability, and discover the right coach in one place. It replaces uncertainty with clearer answers and reduces dependence on social posts for operational questions.

## Message hierarchy
### Primary message
Find classes, check availability, and discover the right coach without relying on scattered social posts.

### Secondary messages
- See whether a class has spaces left before you commit.
- Get to know the coach behind the class, not just the class title.
- Ask about pricing, FAQs, and updates in one place.
- Get fast answers from the studio's live information source.

### Trust message
StudioFlow AI is an AI assistant that uses live studio information to answer common questions. If live information is missing or unclear, it will say so.

## Campaign assets
### Homepage hero copy
**Heading**
Find the right class. Check availability. Meet the right coach.

**Subheading**
StudioFlow AI helps you see what's on, whether spaces are available, and who is teaching, all from one live assistant.

**Primary CTA**
Ask StudioFlow AI

### Short launch copy
Stop scrolling through stories to work out what's available. StudioFlow AI gives you one place to check class times, see whether spaces are left, and learn more about the coaches behind each session.

### Social caption
Class times on social media are useful, but they do not always tell you if a session is full or who is teaching. StudioFlow AI gives you a clearer way to check availability, explore coaches, and get answers in one place.

### Email or announcement copy
We have launched StudioFlow AI to make it easier to find classes, check availability, and learn more about our coaches. You can now ask one assistant about schedules, spaces, memberships, FAQs, and studio updates without having to search across posts or messages.

### In-product disclosure copy
You are chatting with StudioFlow AI. It uses live studio information to answer common questions. If information is unavailable or unclear, it will let you know.

## Recommended channels
- the GitHub Pages prototype as the primary demonstration channel
- studio social media as a traffic driver, not the operational source of truth
- email or newsletter for launch awareness
- a link in Instagram bio or story highlight directing customers to the assistant

## Success metrics
- number of chatbot interactions
- number of availability questions handled without manual intervention
- number of coach-profile queries
- reduction in repetitive timetable and fullness direct messages
- click-throughs from social media to the assistant
- qualitative signs of reduced confusion in customer questions

## Monitoring and metrics
### Measurement setup
Success should be monitored across three simple layers:
- front-end interaction tracking on the GitHub Pages site
- request and intent logging in the Cloudflare Worker
- a live reporting log stored in a Google Sheet or similar lightweight data store

### Front-end events to track
- chatbot opened
- message sent
- quick prompt clicked
- follow-up prompt clicked
- outbound CTA or support link clicked

These events support measurement of total chatbot interactions and general engagement with the assistant.

### Cloudflare Worker events to log
- timestamp
- session ID
- query text or a safe redacted version
- detected intent
- live data source used
- response status: success, fallback, or error
- whether live data fetch succeeded
- channel source if available

These logs support measurement of:
- availability questions handled without manual intervention
- coach-profile queries
- fallback frequency
- the most common customer intents

### Suggested analytics log fields
- `timestamp`
- `session_id`
- `query`
- `intent`
- `data_source_used`
- `response_status`
- `fallback_used`
- `channel_source`

### Social-to-assistant tracking
Traffic from Instagram or other social channels should use tagged links such as:
- `?source=instagram_bio`
- `?source=instagram_story`
- `?source=instagram_highlight`

This allows the studio to measure whether social media is successfully shifting customers away from direct-message dependence and toward the assistant.

### Manual-query comparison
To measure whether the assistant reduces repetitive manual support, the studio should compare common direct-message categories before and after launch, especially:
- class fullness questions
- timetable questions
- coach identity or suitability questions

### Qualitative monitoring
The team should review fallback queries and unclear questions to identify:
- missing data fields
- confusing phrasing customers use
- coach information gaps
- recurring uncertainty around availability

### Reporting interpretation
- higher chatbot usage suggests stronger adoption
- a high number of successful availability answers suggests the assistant is solving the core timetable problem
- a meaningful number of coach queries suggests improved coach visibility
- lower repetitive DMs suggests operational value
- repeated fallbacks highlight where the data model or UX needs improvement

## Claims to emphasize
- customers can check class times in one place
- customers can see whether classes have spaces left when that live data is available
- customers can learn more about coaches and specialities
- customers can ask about memberships, FAQs, and announcements through the same interface

## Claims to avoid
- do not claim guaranteed booking
- do not claim that every answer is instant real-time truth regardless of source quality
- do not claim personalized coaching advice
- do not claim the assistant replaces staff or human judgement

## Why this messaging works
The value is not "we have AI." The value is reduced uncertainty. The customer problem starts when social media creates attention but does not complete the service journey. This messaging reframes the assistant as the operational layer that helps customers act on interest with more confidence.

## manager_handoff
### Safe customer-facing claims
- the assistant helps users find class times
- the assistant can show class availability when live data supports it
- the assistant improves coach visibility by connecting classes to named coaches and specialties
- the assistant can answer common pricing, FAQ, and update questions
- the assistant is clearly disclosed as AI

### Claims to avoid downstream
- the assistant books classes automatically
- the assistant knows more than the live source provides
- the assistant gives expert fitness, health, or medical advice
- the assistant guarantees perfect availability accuracy independent of source maintenance

### Disclosure and trust handling
- disclose AI at the start of interaction
- use plain language rather than hype
- reassure users that the assistant will state limits when information is missing
- keep social media positioned as a discovery channel, while the assistant is the clearer operational reference point

### Evidence the Manager should capture
- screenshots of hero copy and disclosure
- transcript examples of availability and coach questions
- evidence that wording matches actual prototype scope
- examples of claims intentionally avoided to preserve credibility
