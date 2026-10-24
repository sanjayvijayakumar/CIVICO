# CIVICO Tokenisation Playbook

This GitBook explores how to tokenize the social impact of Digital Public Goods (DPGs) like CARE using a multidisciplinary approach across philosophy, engineering, economics, governance, and regulation.

Start with the “Philosophy” section to understand what value means in traditional and cryptonative paradigms.

## Adhyayana learning pilot

Adhyayana is a dependency-free browser prototype of an integral learning model.
Its first inquiry, **Sound, Music, and Meaning**, connects Science, Arts,
Philosophy, History & Sociology, Psychology, and Linguistics through seven
perspectives and six faculties: Body, Prana, Sight, Hearing, Mind, and Speech.

### Run locally

Requires Node.js 22 or newer. No dependency installation or build step is needed.

```sh
npm start
```

Open <http://127.0.0.1:3000>. `PORT` changes the port; `HOST` changes the bind
address (loopback by default). The server serves only the application assets,
not the playbook or other repository files.

```sh
npm run check
npm test
```

The syntax checks and Node.js built-in tests cover curriculum completeness,
unrestricted age/depth choices, optional faculties, evidence validation,
portfolio/journal separation, and static-server security. There is no separate
linter or compilation pipeline.

### Explore the pilot

1. Choose an age-appropriate presentation, reading style, depth, prior experience,
   and learning intention. Age never locks intellectual depth.
2. Set a guiding question and select any perspectives. The knowledge map shows
   starting knowledge, connections, and possible evidence.
3. Visit Encounter → Observe → Question → Investigate → Connect → Create →
   Reflect in any order. Optional checkmarks record navigation, not attainment.
4. Select faculty activities. Every activity has accessible alternatives;
   Prana is off by default, optional, and distinguishes traditional
   interpretations from established physiology.
5. Add text-based artifacts to the portfolio and self-review against the
   criteria for your selected depth. Download the portfolio as JSON to keep it.
6. Reflect privately or skip reflection. Optional pilot feedback prompts address
   mastery, cross-disciplinary transfer, access, agency, and reflective engagement.

### Privacy, assessment, and limits

- This is a **single-page, session-only pilot**, not a production learning
  management system. There are no accounts, databases, analytics, external
  resources, or uploads. Enter no identifying or sensitive information.
- Journal, portfolio, and optional feedback exist only in page memory. Refresh,
  navigation away, or closing the page clears the session. Use **Clear journal**
  or **Clear all session work** on shared devices. An open page is visible to
  anyone using the device; this is not an encrypted personal vault.
- Portfolio downloads explicitly exclude journal, feedback, and age settings.
  Artifacts may contain whatever the learner typed: review them before sharing.
  Downloaded files remain on disk until the learner deletes them.
- No learner input is transmitted. A hosting provider may still retain ordinary
  HTTP access logs. Review hosting policies before deployment with children.
- Assessment is labeled **unverified learner self-review**, never a consciousness
  score. Accredited-pathway mode offers preparation guidance only. Formal
  recognition needs an institution, agreed standards, and independent assessment.
- Awareness and self-awareness are educational aspirations, not measured
  outcomes or a fixed developmental sequence. Cross-disciplinary transfer is
  a hypothesis to evaluate, not evidence of neurological changes.
- Breathing awareness is optional and never involves breath holding. No
  contemplative participation, sensory ability, or personal disclosure is
  required for learning or assessment.

### Implementation

`public/curriculum.js` contains the subject lenses, activities, age presentations,
cycle, and depth rubrics. `public/model.js` keeps session state and explicitly
allowlists exported portfolio fields. `public/app.js` renders user text through
DOM text nodes. `server.js` is an allowlisted static server with restrictive
security headers. Existing GitBook content remains unchanged.
