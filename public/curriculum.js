export const subjects = [
  {
    id: 'science', name: 'Science', lens: 'Scientific',
    question: 'How does vibration become sound?',
    investigation: 'Gently tap a tabletop or pluck a stretched rubber band with a caregiver. Observe vibration, or study a drawn vibration sequence instead. Never stretch bands near faces.',
    connection: 'Connect vibration patterns to musical rhythm and the sounds used in speech.',
    prerequisite: 'No prerequisite. Begin with noticing a repeated pattern.',
    evidence: 'A labeled diagram or explanation connecting vibration, a medium, and sound.',
  },
  {
    id: 'arts', name: 'Arts', lens: 'Artistic',
    question: 'How can a pattern express an idea?',
    investigation: 'Create a four-beat pattern using marks, gentle taps, or imagined sounds. Change one part and describe the effect.',
    connection: 'Connect artistic choices to psychological interpretations; a pattern has no single universal emotion.',
    prerequisite: 'Notice repetition and difference, using any sensory modality.',
    evidence: 'An original pattern with an explanation of one creative choice.',
  },
  {
    id: 'philosophy', name: 'Philosophy', lens: 'Philosophical',
    question: 'What makes something music rather than noise?',
    investigation: 'Compare two possible definitions of music. Invent a case that challenges each definition.',
    connection: 'Connect definitions to historical and social contexts rather than assuming one universal standard.',
    prerequisite: 'Distinguish an example from a reason for choosing it.',
    evidence: 'A claim, a reason, and a respectful response to a different view.',
  },
  {
    id: 'history', name: 'History & Sociology', lens: 'Historical',
    question: 'How do musical practices travel and change?',
    investigation: 'Choose a musical practice from a library or museum source. Record its place, time, source, and whose perspective the source represents. Do not collect anyone’s personal details.',
    connection: 'Connect instrument materials and social settings to artistic choices; avoid treating a culture as uniform.',
    prerequisite: 'Identify where a claim came from and distinguish past from present.',
    evidence: 'A sourced account distinguishing documented facts from interpretation.',
  },
  {
    id: 'society', name: 'History & Sociology', lens: 'Social',
    question: 'Who gets to participate in making music?',
    investigation: 'Design an imaginary music gathering. Consider access, cost, sensory needs, and whose traditions are represented.',
    connection: 'Connect accessible design to art, language, and the ethics of participation.',
    prerequisite: 'Consider that different people may have different access needs.',
    evidence: 'An inclusive design and an explanation of a barrier it removes.',
  },
  {
    id: 'psychology', name: 'Psychology', lens: 'Psychological',
    question: 'Why can the same music mean different things to different people?',
    investigation: 'Compare two fictional listeners with different experiences. Suggest why their interpretations might differ. No personal emotional disclosure is needed.',
    connection: 'Connect perception and memory to artistic interpretation without claiming music causes a universal feeling.',
    prerequisite: 'Distinguish an observation from an inference about someone’s experience.',
    evidence: 'Two plausible interpretations and an explanation of uncertainty.',
  },
  {
    id: 'linguistics', name: 'Linguistics', lens: 'Linguistic',
    question: 'What do rhythm and language have in common?',
    investigation: 'Mark the syllables of a short invented phrase with dots or gentle taps. Compare its pattern with a four-beat musical pattern. Signed and written language are valid alternatives.',
    connection: 'Connect speech timing and musical rhythm while explaining that language and music are not identical.',
    prerequisite: 'Notice units in a spoken, signed, or written sequence.',
    evidence: 'An annotated comparison identifying one similarity and one difference.',
  },
];

export const faculties = [
  { id: 'body', name: 'Body', activity: 'Trace a rhythm with comfortable movement, or arrange four marks or objects without moving your body.', alternative: 'Describe or imagine the arrangement; movement is never required.' },
  { id: 'prana', name: 'Prana', activity: 'If comfortable, notice ordinary breathing for a moment, without changing or holding your breath. Stop whenever you wish.', alternative: 'Notice a neutral object instead, or skip entirely. Traditional ideas of vital energy are not established physiological measurements.' },
  { id: 'sight', name: 'Sight', activity: 'Draw repeated marks to represent a rhythm and notice differences.', alternative: 'Use a tactile arrangement, spoken description, or text pattern instead.' },
  { id: 'hearing', name: 'Hearing', activity: 'Listen to quiet, comfortable taps and notice a repeated pattern. No sound playback or microphone is needed.', alternative: 'Read a written rhythm or use a visual or tactile pattern; hearing is not required.' },
  { id: 'mind', name: 'Mind', activity: 'Predict what changes when a pattern changes. Compare your prediction with an observation.', alternative: 'Use a concrete example, drawing, or support from a learning companion.' },
  { id: 'speech', name: 'Speech', activity: 'Explain an idea and give a reason. Invite a respectful alternative interpretation.', alternative: 'Write, sign, use assistive communication, or ask a companion to transcribe.' },
];

export const ages = {
  early: { label: 'Early childhood · with a caregiver', intro: 'Explore a pattern together through a short story, play, and making.', theme: 'play', reading: 'simple', companion: 'Caregiver: read aloud, support safe material choices, and let the learner choose or skip every activity.' },
  child: { label: 'Children', intro: 'Follow clues, try a small project, and discover how ideas connect.', theme: 'discover', reading: 'simple', companion: 'A trusted adult can help with materials and reading. Do not enter your name, school, or contact details.' },
  teen: { label: 'Adolescents', intro: 'Explore a cross-disciplinary challenge, question assumptions, and choose your own evidence.', theme: 'inquire', reading: 'standard', companion: 'Choose your own route. Use fictional examples instead of sharing personal information.' },
  adult: { label: 'Adults', intro: 'Build a self-directed inquiry connecting ideas, practice, and responsible application.', theme: 'inquire', reading: 'standard', companion: 'Choose the level of depth that suits your interests, independently of age.' },
};

export const depths = {
  explore: { label: 'Explore', task: 'Notice a pattern and explain one idea in your own way.', criteria: ['Describe a pattern using an example.', 'Make one meaningful connection between perspectives.', 'Share an observation without guessing what others feel.'] },
  practice: { label: 'Practice', task: 'Try two variations, compare them, and explain a connection.', criteria: ['Explain a pattern and compare two variations.', 'Explain how two perspectives inform each other.', 'Distinguish what you observed from what you inferred.'] },
  apply: { label: 'Apply', task: 'Design an accessible pattern-based activity and justify your choices with evidence.', criteria: ['Apply a sound or rhythm concept accurately.', 'Use multiple perspectives to justify a design.', 'Explain an access choice and a limitation of your evidence.'] },
  research: { label: 'Research', task: 'Frame a focused question, compare credible sources, and state limitations and an alternative explanation.', criteria: ['Support a focused claim with traceable sources.', 'Synthesize perspectives and consider a counterexample.', 'Explain uncertainty, ethical considerations, and study limitations.'] },
};

export const stages = [
  { id: 'encounter', name: 'Encounter', simple: 'Imagine a little drum saying “tap, tap, pause, tap.” Tell or draw what happens next.', standard: 'Encounter a four-beat pattern: tap, tap, rest, tap. Represent it in a modality you prefer. What might it communicate?' },
  { id: 'observe', name: 'Observe', simple: 'Notice what repeats. Use dots, words, objects, or comfortable taps.', standard: 'Describe repetition, timing, and variation. Separate directly observed features from interpretations.' },
  { id: 'question', name: 'Question', simple: 'What would you like to find out about this pattern?', standard: 'Choose a guiding question. What evidence would help answer it, and what assumptions are you bringing?' },
  { id: 'investigate', name: 'Investigate', simple: 'Try one small change. What stayed the same? What changed?', standard: 'Investigate your selected perspectives below. Compare a variation and document observations, sources, and uncertainties.' },
  { id: 'connect', name: 'Connect', simple: 'How does your pattern connect to a picture, a story, or words?', standard: 'Use the knowledge map to connect your chosen perspectives. Explain the connection rather than merely naming two subjects.' },
  { id: 'create', name: 'Create', simple: 'Make a pattern, picture, or short story. Show one choice you made.', standard: 'Create an artifact that addresses your question: a pattern, explanation, accessible activity, or sourced argument. Add evidence to your portfolio.' },
  { id: 'reflect', name: 'Reflect', simple: 'What did you discover? What would you like to try next? You can keep this to yourself.', standard: 'Consider what changed in your understanding and how you could apply it responsibly. Reflection is optional and never assessed.' },
];

export const reflectionPrompts = [
  'What did I discover?',
  'Which perspectives changed my understanding?',
  'What did I notice about my attention, emotions, or assumptions?',
  'Where could I apply this responsibly?',
];
