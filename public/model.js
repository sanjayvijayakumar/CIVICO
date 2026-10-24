import { ages, depths, faculties, stages, subjects } from './curriculum.js';

export function createSession() {
  return {
    age: 'child', reading: 'simple', depth: 'explore', prior: 'new',
    pathway: 'informal', question: 'How can a rhythm carry meaning?',
    perspectives: ['science', 'arts', 'linguistics'],
    faculties: ['mind', 'hearing'],
    stage: 'encounter', completed: new Set(), portfolio: [],
    journal: '', feedback: '',
  };
}

export function setPreference(session, key, value) {
  const choices = {
    age: Object.keys(ages), reading: ['simple', 'standard'],
    depth: Object.keys(depths), prior: ['new', 'familiar'],
    pathway: ['informal', 'credential'],
  };
  if (!choices[key]?.includes(value)) throw new Error('Unknown preference');
  session[key] = value;
  if (key === 'age') session.reading = ages[value].reading;
}

export function toggleChoice(session, key, id, selected) {
  const options = key === 'perspectives' ? subjects : key === 'faculties' ? faculties : [];
  if (!options.some(option => option.id === id)) throw new Error('Unknown choice');
  session[key] = session[key].filter(value => value !== id);
  if (selected) session[key].push(id);
}

export function completeStage(session, id, completed) {
  if (!stages.some(stage => stage.id === id)) throw new Error('Unknown stage');
  if (completed) session.completed.add(id);
  else session.completed.delete(id);
}

export function addEvidence(session, { title, evidence, reviews }) {
  if (!title?.trim() || !evidence?.trim()) throw new Error('Add a title and evidence before saving.');
  if (title.length > 120 || evidence.length > 5000) throw new Error('Your entry is too long.');
  const validReviews = ['not-reviewed', 'developing', 'demonstrated'];
  if (!Array.isArray(reviews) || reviews.length !== 3 || reviews.some(review => !validReviews.includes(review))) {
    throw new Error('Choose a valid review for each criterion.');
  }
  const entry = {
    title: title.trim(), evidence: evidence.trim(),
    question: session.question, depth: session.depth,
    perspectives: [...session.perspectives], faculties: [...session.faculties],
    assessment: depths[session.depth].criteria.map((criterion, i) => ({
      criterion, review: reviews[i], reviewer: 'Learner self-review; not verified',
    })),
  };
  session.portfolio.push(entry);
  return entry;
}

export function exportPortfolio(session) {
  return {
    tool: 'Adhyayana', inquiry: 'Sound, Music, and Meaning', version: 1,
    accreditation: 'Learning evidence only. No accredited credential is issued.',
    entries: session.portfolio.map(entry => ({
      title: entry.title, evidence: entry.evidence, question: entry.question,
      depth: entry.depth, perspectives: [...entry.perspectives], faculties: [...entry.faculties],
      assessment: entry.assessment.map(item => ({ ...item })),
    })),
  };
}
