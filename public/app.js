import { ages, depths, faculties, reflectionPrompts, stages, subjects } from './curriculum.js';
import { addEvidence, completeStage, createSession, exportPortfolio, setPreference, toggleChoice } from './model.js';

let session = createSession();
const $ = id => document.getElementById(id);
const reviewLabels = { 'not-reviewed': 'Not yet reviewed', developing: 'Developing', demonstrated: 'Demonstrated (self-review)' };

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function paragraph(label, text) {
  const node = element('p');
  node.append(element('strong', `${label} `), document.createTextNode(text));
  return node;
}

function renderChoices(key, options, container) {
  $(container).replaceChildren(...options.map(option => {
    const label = element('label', undefined, 'choice');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = option.id;
    input.checked = session[key].includes(option.id);
    input.addEventListener('change', () => {
      toggleChoice(session, key, option.id, input.checked);
      if (key === 'perspectives') {
        renderMap();
        renderStage();
      } else renderFaculties();
    });
    label.append(input, document.createTextNode(option.lens || option.name));
    return label;
  }));
}

function renderMap() {
  const selected = subjects.filter(subject => session.perspectives.includes(subject.id));
  $('perspective-status').textContent = selected.length
    ? `${selected.length} perspectives selected. Choose a map question to make it your guiding question.`
    : 'No perspectives selected. You can explore freely, or select a perspective for suggested connections.';
  $('knowledge-map').replaceChildren(...selected.map(subject => {
    const card = element('article', undefined, 'knowledge-card');
    const choose = element('button', 'Use this question', 'secondary');
    choose.type = 'button';
    choose.setAttribute('aria-label', `Use question: ${subject.question}`);
    choose.addEventListener('click', () => {
      session.question = subject.question;
      $('question').value = subject.question;
      $('question').focus();
    });
    card.append(
      element('span', subject.lens, 'pill'),
      element('h4', subject.name),
      element('p', subject.question),
      paragraph('Starting knowledge:', subject.prerequisite),
      paragraph('Connection:', subject.connection),
      paragraph('Possible evidence:', subject.evidence),
      choose,
    );
    return card;
  }));
}

function renderStage() {
  const stage = stages.find(item => item.id === session.stage);
  $('stage-nav').replaceChildren(...stages.map((item, index) => {
    const button = element('button', `${index + 1}. ${item.name}${session.completed.has(item.id) ? ' ✓' : ''}`);
    button.type = 'button';
    if (item.id === stage.id) button.setAttribute('aria-current', 'step');
    button.addEventListener('click', () => {
      session.stage = item.id;
      renderStage();
      $('stage-nav').querySelector('[aria-current="step"]').focus();
    });
    return button;
  }));
  const content = $('stage-content');
  content.replaceChildren(element('h3', stage.name), element('p', stage[session.reading]), paragraph('Your chosen depth:', depths[session.depth].task));
  if (['investigate', 'connect'].includes(stage.id)) {
    const list = element('ul');
    subjects.filter(subject => session.perspectives.includes(subject.id)).forEach(subject => {
      list.append(element('li', `${subject.lens}: ${stage.id === 'investigate' ? subject.investigation : subject.connection}`));
    });
    content.append(list);
  }
  if (stage.id === 'reflect') {
    const link = element('a', 'Open optional reflection');
    link.href = '#journal-heading';
    content.append(link);
  }
  if (stage.id === 'create') {
    const link = element('a', 'Add evidence to your portfolio');
    link.href = '#portfolio-heading';
    content.append(link);
  }
  $('stage-complete').checked = session.completed.has(stage.id);
  $('cycle-status').textContent = `${session.completed.size} of 7 invitations marked explored. This records your route, not your ability or consciousness.`;
  $('next-stage').textContent = stage.id === 'reflect' ? 'Return to encounter ↺' : 'Next invitation →';
}

function renderFaculties() {
  $('faculty-activities').replaceChildren(...faculties.filter(faculty => session.faculties.includes(faculty.id)).map(faculty => {
    const card = element('article', undefined, 'faculty-card');
    card.append(element('h3', faculty.name), element('p', faculty.activity), paragraph('Alternative:', faculty.alternative));
    return card;
  }));
}

function renderRubric() {
  $('depth-task').textContent = depths[session.depth].task;
  $('rubric').replaceChildren(...depths[session.depth].criteria.map((criterion, index) => {
    const label = element('label', criterion);
    const select = document.createElement('select');
    select.id = `review-${index}`;
    for (const [value, text] of Object.entries(reviewLabels)) {
      const option = element('option', text);
      option.value = value;
      select.append(option);
    }
    label.append(select);
    return label;
  }));
}

function renderPortfolio() {
  $('portfolio-entries').replaceChildren(...session.portfolio.map((entry, index) => {
    const article = element('article', undefined, 'portfolio-entry');
    article.append(element('h3', entry.title), paragraph('Question:', entry.question), element('p', entry.evidence, 'evidence'));
    article.append(paragraph('Depth:', depths[entry.depth].label));
    article.append(paragraph('Perspectives:', subjects.filter(subject => entry.perspectives.includes(subject.id)).map(subject => subject.lens).join(', ') || 'Self-directed'));
    const list = element('ul');
    entry.assessment.forEach(item => list.append(element('li', `${item.criterion} — ${reviewLabels[item.review]}; ${item.reviewer}`)));
    const remove = element('button', 'Remove entry', 'secondary');
    remove.type = 'button';
    remove.setAttribute('aria-label', `Remove entry: ${entry.title}`);
    remove.addEventListener('click', () => {
      session.portfolio.splice(index, 1);
      renderPortfolio();
      $('portfolio-status').textContent = 'Entry removed.';
      $('evidence-title').focus();
    });
    article.append(list, remove);
    return article;
  }));
  $('export-portfolio').disabled = session.portfolio.length === 0;
}

function renderPreferences() {
  document.body.dataset.theme = ages[session.age].theme;
  for (const key of ['age', 'reading', 'depth', 'prior', 'pathway']) $(key).value = session[key];
  $('age-guidance').textContent = ages[session.age].companion;
  $('inquiry-intro').textContent = ages[session.age].intro;
  $('prior-guidance').textContent = session.prior === 'new'
    ? 'Suggested starting point: Encounter. Every step is open; revisit or skip freely.'
    : 'Already familiar? Jump to Investigate or Create, and return to earlier steps whenever useful.';
  $('pathway-guidance').textContent = session.pathway === 'credential'
    ? 'Accreditation preparation only: choose an institution, confirm its standards and depth requirements, and arrange independent assessment. This prototype only collects evidence; it cannot award a credential.'
    : 'Personal exploration: no credential, required assessment, or disclosure is needed.';
}

function renderAll() {
  renderPreferences();
  renderChoices('perspectives', subjects, 'perspective-options');
  renderChoices('faculties', faculties, 'faculty-options');
  renderMap();
  renderStage();
  renderFaculties();
  renderRubric();
  renderPortfolio();
}

for (const key of ['age', 'reading', 'depth', 'prior', 'pathway']) {
  $(key).addEventListener('change', event => {
    setPreference(session, key, event.target.value);
    renderPreferences();
    renderStage();
    if (key === 'depth') renderRubric();
  });
}
$('question').addEventListener('input', event => { session.question = event.target.value; });
$('stage-complete').addEventListener('change', event => {
  completeStage(session, session.stage, event.target.checked);
  renderStage();
});
$('next-stage').addEventListener('click', () => {
  session.stage = stages[(stages.findIndex(stage => stage.id === session.stage) + 1) % stages.length].id;
  renderStage();
});
$('large-text').addEventListener('change', event => document.body.classList.toggle('large-text', event.target.checked));
$('reduce-motion').addEventListener('change', event => document.body.classList.toggle('reduce-motion', event.target.checked));
$('evidence-form').addEventListener('submit', event => {
  event.preventDefault();
  try {
    addEvidence(session, {
      title: $('evidence-title').value,
      evidence: $('evidence-text').value,
      reviews: [0, 1, 2].map(index => $(`review-${index}`).value),
    });
    $('evidence-form').reset();
    renderPortfolio();
    $('portfolio-status').textContent = 'Evidence added for this session. Download your portfolio to keep it. Your journal remains separate.';
  } catch (error) {
    $('portfolio-status').textContent = error.message;
  }
});
$('export-portfolio').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(exportPortfolio(session), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = element('a');
  link.href = url;
  link.download = 'adhyayana-portfolio.json';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$('journal').addEventListener('input', event => {
  session.journal = event.target.value;
  $('journal-status').textContent = 'Held in this session only. Not saved or exported.';
});
$('feedback').addEventListener('input', event => { session.feedback = event.target.value; });
$('clear-journal').addEventListener('click', () => {
  session.journal = '';
  $('journal').value = '';
  $('journal-status').textContent = 'Journal cleared.';
});
$('reset-session').addEventListener('click', () => {
  if (!window.confirm('Clear all session evidence, reflections, feedback, and learning choices? Download portfolio evidence first if you want to keep it.')) return;
  session = createSession();
  resetInputs();
  renderAll();
  $('reset-status').textContent = 'All session work cleared. Previously downloaded files are not deleted.';
});

function resetInputs() {
  $('question').value = session.question;
  for (const id of ['journal', 'feedback', 'evidence-title', 'evidence-text']) $(id).value = '';
  for (const id of ['journal-status', 'portfolio-status', 'reset-status']) $(id).textContent = '';
}

window.addEventListener('pagehide', () => {
  session = createSession();
  resetInputs();
});
window.addEventListener('pageshow', event => {
  if (event.persisted) renderAll();
});
$('large-text').checked = false;
$('reduce-motion').checked = false;
resetInputs();
$('reflection-prompts').replaceChildren(...reflectionPrompts.map(prompt => element('li', prompt)));
renderAll();
