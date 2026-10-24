import test from 'node:test';
import assert from 'node:assert/strict';
import { ages, depths, faculties, stages, subjects } from '../public/curriculum.js';
import { addEvidence, completeStage, createSession, exportPortfolio, setPreference, toggleChoice } from '../public/model.js';

const artifact = () => ({
  title: 'A rhythm in dots',
  evidence: 'The dots represent a repeated pattern. Rhythm also groups language into units.',
  reviews: ['demonstrated', 'developing', 'not-reviewed'],
});

test('sessions are independent and do not require identity or contemplative activities', () => {
  const first = createSession();
  const second = createSession();
  first.perspectives.push('history');
  first.completed.add('encounter');
  first.journal = 'A private thought';
  assert.equal(second.perspectives.includes('history'), false);
  assert.equal(second.completed.size, 0);
  assert.equal(second.journal, '');
  assert.equal(first.faculties.includes('prana'), false);
  assert.equal('name' in first, false);
  assert.equal('birthdate' in first, false);
});

test('all age presentations allow every depth and independently chosen reading style', () => {
  const session = createSession();
  for (const age of Object.keys(ages)) {
    setPreference(session, 'age', age);
    assert.equal(session.reading, ages[age].reading);
    setPreference(session, 'reading', 'standard');
    for (const depth of Object.keys(depths)) {
      setPreference(session, 'depth', depth);
      assert.equal(session.depth, depth);
      assert.equal(session.reading, 'standard');
    }
  }
});

test('invalid preferences are rejected without altering the session', () => {
  const session = createSession();
  assert.throws(() => setPreference(session, 'depth', 'consciousness-level'));
  assert.throws(() => setPreference(session, 'journal', 'public'));
  assert.equal(session.depth, 'explore');
  assert.equal(session.journal, '');
});

test('perspectives and faculties are optional and duplicate-free', () => {
  const session = createSession();
  toggleChoice(session, 'perspectives', 'science', true);
  toggleChoice(session, 'perspectives', 'science', true);
  assert.equal(session.perspectives.filter(id => id === 'science').length, 1);
  for (const subject of subjects) toggleChoice(session, 'perspectives', subject.id, false);
  for (const faculty of faculties) toggleChoice(session, 'faculties', faculty.id, false);
  assert.deepEqual(session.perspectives, []);
  assert.deepEqual(session.faculties, []);
  toggleChoice(session, 'faculties', 'prana', true);
  toggleChoice(session, 'faculties', 'prana', false);
  assert.deepEqual(session.faculties, []);
  assert.throws(() => toggleChoice(session, 'faculties', 'score', true));
  assert.throws(() => toggleChoice(session, 'journal', 'mind', true));
});

test('learning cycle can be explored out of order and revisited without scoring', () => {
  const session = createSession();
  completeStage(session, 'reflect', true);
  completeStage(session, 'reflect', true);
  assert.equal(session.completed.size, 1);
  completeStage(session, 'reflect', false);
  assert.equal(session.completed.size, 0);
  assert.throws(() => completeStage(session, 'rank', true));
  assert.equal('score' in session, false);
});

test('curriculum covers all subjects, perspectives, faculties, and cycle stages', () => {
  assert.equal(new Set(subjects.map(subject => subject.name)).size, 6);
  assert.equal(new Set(subjects.map(subject => subject.lens)).size, 7);
  assert.equal(faculties.length, 6);
  for (const subject of subjects) {
    for (const key of ['question', 'investigation', 'connection', 'prerequisite', 'evidence']) {
      assert.ok(subject[key].length > 10);
    }
  }
  for (const faculty of faculties) assert.ok(faculty.alternative.length > 10);
  assert.deepEqual(stages.map(stage => stage.id), ['encounter', 'observe', 'question', 'investigate', 'connect', 'create', 'reflect']);
  for (const stage of stages) {
    assert.ok(stage.simple);
    assert.ok(stage.standard);
  }
});

test('evidence preserves the chosen depth, connections, and transparent assessment', () => {
  const session = createSession();
  setPreference(session, 'depth', 'research');
  session.question = 'How does rhythm relate to language?';
  const entry = addEvidence(session, artifact());
  assert.equal(session.portfolio.length, 1);
  assert.equal(entry.depth, 'research');
  assert.equal(entry.question, session.question);
  assert.deepEqual(entry.assessment.map(item => item.criterion), depths.research.criteria);
  assert.ok(entry.assessment.every(item => item.reviewer.includes('not verified')));
  session.perspectives.length = 0;
  setPreference(session, 'depth', 'explore');
  assert.equal(entry.perspectives.length, 3);
  assert.equal(entry.depth, 'research');
});

test('blank, oversized, and invalid evidence cannot be added', () => {
  const session = createSession();
  for (const invalid of [
    { ...artifact(), title: ' ' },
    { ...artifact(), evidence: '\n ' },
    { ...artifact(), title: 'a'.repeat(121) },
    { ...artifact(), evidence: 'a'.repeat(5001) },
    { ...artifact(), reviews: [] },
    { ...artifact(), reviews: ['ranked', 'developing', 'demonstrated'] },
  ]) assert.throws(() => addEvidence(session, invalid));
  assert.equal(session.portfolio.length, 0);
});

test('portfolio exports exclude reflection, feedback, age, and session internals', () => {
  const session = createSession();
  session.journal = 'PRIVATE_JOURNAL_SENTINEL';
  session.feedback = 'PRIVATE_FEEDBACK_SENTINEL';
  session.completed.add('reflect');
  session.unexpectedPrivateField = 'PRIVATE_EXTRA_SENTINEL';
  setPreference(session, 'pathway', 'credential');
  addEvidence(session, artifact());
  const exported = exportPortfolio(session);
  assert.deepEqual(Object.keys(exported).sort(), ['accreditation', 'entries', 'inquiry', 'tool', 'version']);
  assert.match(exported.accreditation, /No accredited credential/);
  const serialized = JSON.stringify(exported);
  assert.doesNotMatch(serialized, /PRIVATE_|journal|feedback|completed|"age"|"pathway"/);
  exported.entries[0].perspectives.push('private-change');
  exported.entries[0].assessment[0].review = 'changed';
  assert.equal(session.portfolio[0].perspectives.includes('private-change'), false);
  assert.equal(session.portfolio[0].assessment[0].review, 'demonstrated');
});

test('export remains valid for an empty portfolio and preserves untrusted text as data', () => {
  const session = createSession();
  assert.deepEqual(exportPortfolio(session).entries, []);
  const evidence = '<img src=x onerror=alert(1)>';
  addEvidence(session, { ...artifact(), evidence });
  assert.equal(JSON.parse(JSON.stringify(exportPortfolio(session))).entries[0].evidence, evidence);
});
