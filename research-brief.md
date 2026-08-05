# Research Brief

## Agent
Niamh Keane, Researcher

## Executive summary
StudioFlow's customer engagement problem is not lack of interest. It is service friction caused by fragmented information. The studio currently relies too heavily on social media to communicate class times and updates, but social posts are not a reliable operational channel for answering real customer questions. A prospective customer may see that a class exists, but still cannot tell whether it is full, has spaces left, or offers a waitlist. At the same time, coach visibility is too weak. Customers cannot easily understand who teaches which class, what each coach specialises in, or which coach is suitable for beginners or specific goals.

This creates uncertainty at the exact point where the customer should be moving from interest to booking. The strongest opportunity is to create a live assistant that becomes the studio's reliable source of truth for timetable, availability, pricing, coach discovery, FAQs, and announcements.

## Business challenge in concrete terms
- Social media is being used as both a promotional channel and a service-information channel.
- Customers can discover classes through posts and stories, but cannot confirm live availability from those channels.
- Manual messaging is likely required to answer basic questions such as whether a class is full.
- Coach profiles are not visible enough to support trust, fit, and confident booking.
- The studio lacks one clear place where customers can compare schedule, coach, pricing, and FAQs together.

## Key findings
1. The highest-friction question is likely not "What classes do you offer?" but "Can I actually book the class I want right now?"
2. Social posts are useful for attraction, but weak for operational clarity because they do not communicate real-time fullness or waitlist status.
3. Coach visibility is part of customer engagement, not just background information. Customers often choose a service partly because of who delivers it.
4. New customers are especially likely to hesitate when they cannot tell whether a class is beginner-friendly or who teaches it.
5. A live assistant grounded in structured studio data would reduce uncertainty more effectively than static schedule communication.
6. The experience should prioritize timetable clarity, class availability, coach discovery, pricing explanation, and concise FAQ support.

## Review of current service weaknesses
### Timetable clarity
- Social media posts can show time slots, but they are hard to search, easy to miss, and quickly become outdated.
- Customers have to piece together information across multiple posts, stories, captions, or replies.

### Class fullness visibility
- Social channels do not clearly indicate whether a class is available, full, or waitlist-only.
- This creates unnecessary manual back-and-forth and slows conversion.

### Coach discovery
- Customers do not get enough visibility into who teaches which class.
- Coach specialities, teaching style, and beginner suitability are likely under-explained.
- This weakens trust and reduces confidence for first-time bookings.

## Likely customer questions to support
- What classes are on today or tomorrow?
- Is the 6pm class full?
- Which classes still have spaces left?
- Is there a waitlist for reformer Pilates?
- Who teaches yoga on Thursdays?
- Which coach is best for beginners?
- Tell me about a specific coach.
- What membership should I choose?
- What has changed this week?
- Do I need to bring anything to my first class?

## Evidence or assumptions
### Evidence-backed
- The assignment concept explicitly defines overreliance on social media for class times as a current problem.
- The assignment concept explicitly defines weak coach visibility as a current problem.
- A live data assistant is a suitable response because the brief rewards runtime data access and customer-facing utility.

### Assumptions
- Customers currently message staff manually to confirm availability.
- Social posts are the studio's main outward-facing timetable surface.
- Coach data will be available in structured form and include enough detail to support discovery.
- Beginners are an important audience segment for the studio.

These assumptions are reasonable for the concept, but should be stated as assumptions rather than facts unless validated by live data or additional business context.

## Live data requirements by tab
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

## Risks or unknowns
- If `slots_left`, `status`, or `waitlist_open` are missing or inconsistently maintained, the assistant cannot answer availability questions reliably.
- If coach data is too thin, the experience will not solve the coach visibility problem in a meaningful way.
- If class-to-coach linking is weak, the assistant may not be able to answer combined questions such as availability plus coach identity.
- If announcement dates are unclear, customers may receive stale updates.
- The system should not imply live booking unless booking functionality actually exists.

## Top opportunities
1. Replace social-media-led timetable confusion with a searchable live schedule assistant.
2. Make availability a first-class answer, not an afterthought.
3. Treat coaches as a trust-building asset by making them discoverable through customer questions.
4. Create one joined-up path from interest to decision instead of forcing customers across disconnected channels.

## Handoff recommendations for the Designer
- Prioritize two main journeys: finding a class with confirmed availability, and finding the right coach.
- Make class status plain-language and prominent.
- Ensure users can ask about class, coach, and suitability in the same flow.
- Design the assistant as the reliable source of current operational information, while social media remains a promotional surface.
- Include honest fallback behavior when the data is missing, unclear, or stale.
- Keep the experience simple enough to build defensibly for the assignment.

## designer_handoff
### Priority user problems in ranked order
1. Customers cannot clearly tell whether a class is available, full, or waitlist-only.
2. Customers cannot easily understand who the coaches are and which coach suits their needs.
3. Customers must piece together information from social media instead of using a reliable source of truth.
4. Membership and FAQ information may require too much effort to locate.

### Exact questions the experience must answer
- What classes are on today, tomorrow, or this week?
- Which classes still have spaces left?
- Is a specific class full?
- Is a waitlist available?
- Who teaches a specific class?
- Which coach fits a beginner or a specific goal?
- What memberships exist and how much do they cost?
- What key studio updates or announcements are active?

### Required live data fields
- `Classes`: `class_name`, `date`, `day`, `start_time`, `coach_id`, `slots_left`, `status`, `waitlist_open`
- `Memberships`: `membership_name`, `price_eur`, `description`, `billing_period`
- `Coaches`: `coach_id`, `coach_name`, `specialty`, `bio`, `experience_level_focus`, `style`
- `FAQs`: `question`, `answer`
- `Announcements`: `message`, `effective_date`

### Claims status
- Evidence-backed: social-media overreliance, weak coach visibility, need for clearer live customer information
- Assumption: current message volume, exact booking drop-off points, and specific coach-selection behavior

### Missing fields that may break downstream work
- No direct `capacity` field was specified, so fullness may depend entirely on `slots_left` and `status`.
- No explicit `class_description` or `difficulty_level` field was specified, which may limit suitability recommendations.
- No `booking_link` field was specified, so the design should avoid assuming direct booking support unless added.
