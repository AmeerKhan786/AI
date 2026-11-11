const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const els = new Map();
function el(sel) {
  if (!els.has(sel)) els.set(sel, {
    textContent: '', innerHTML: '', onclick: null,
    classList: { remove() {}, add() {}, toggle() {} },
    querySelector() { return null; }
  });
  return els.get(sel);
}
const store = new Map();
const document = {
  querySelector: el,
  querySelectorAll: () => [],
  addEventListener() {},
  createElement: () => ({ click() {} })
};
const ctx = {
  console, Date, Math, Number, String, Object, Array, JSON, Intl, URL,
  Blob: function Blob() {}, FileReader: function FileReader() {}, document,
  window: { scrollTo() {}, addEventListener() {} },
  navigator: { serviceWorker: { register: () => Promise.resolve() } },
  localStorage: {
    getItem: key => store.get(key) || null,
    setItem: (key, value) => store.set(key, value)
  },
  innerWidth: 400, setTimeout: () => 0, confirm: () => true,
  alert() {}, prompt: () => null, Event: function Event() {}
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/app.js', 'utf8'), ctx);
const run = expression => vm.runInContext(expression, ctx);
let checks = 0;
function check(expression, expected, message) {
  assert.deepStrictEqual(run(expression), expected, message);
  checks++;
}
function truth(expression, message) {
  assert.ok(run(expression), message);
  checks++;
}
function falsity(expression, message) {
  assert.ok(!run(expression), message);
  checks++;
}

// Roadmap integrity and schedule invariants.
check('LESSONS.length', 100, '100 lessons remain');
check('phases.length', 7, '7 phases remain');
check('new Set(LESSONS.map(x=>x.day)).size', 100, 'lesson day numbers are unique');
check('DATES[1]', '2026-11-14', 'Block 1 starts on the source date');
check('DATES[74]', '2027-02-08', 'Block 1 ends on the source date');
check('DATES[75]', '2027-03-18', 'Day 75 date is preserved');
check('new Set(Object.values(DATES)).size', 100, 'scheduled lesson dates are unique');
falsity("Object.values(DATES).some(d=>d>='2027-02-09'&&d<='2027-03-17')", 'no lesson scheduled during break/re-entry');
check("Object.values(DATES).filter(d=>new Date(d+'T12:00:00').getDay()===0).length", 0, 'Block 1 avoids Sundays');

// Rendering and lesson state must not create unrelated daily records.
check('Object.keys(state.days).length', 0, 'fresh state has no daily records');
run("renderOverview()");
check('Object.keys(state.days).length', 0, 'dashboard render is side-effect free');
truth("setStatus(1,'in-progress')", 'valid lesson status is accepted');
check("lessonStatus(1)", 'in-progress', 'lesson status is persisted in memory');
falsity("setStatus(101,'done')", 'out-of-range lesson status is rejected');
falsity("setStatus(1,'unexpected')", 'unknown lesson status is rejected');

// Backup shape validation, normalization and sanitization.
check("normalizeState({days:{},lessons:{},projects:'bad'}).projects.length", 0, 'malformed projects normalize to empty');
truth("(()=>{try{normalizeState({days:[],lessons:{}});return false}catch(e){return true}})()", 'array-shaped days are rejected');
check("normalizeState({days:{'2026-02-30':{hours:4},'2026-02-28':{hours:30,tasks:{learn:1}}},lessons:{'1':{status:'bogus'},'101':{status:'done'}},projects:[{id:'x',url:'javascript:alert(1)'},{id:'y',url:'https://example.com'}]}).days['2026-02-28'].hours", 24, 'study hours are clamped to 24');
check("Object.keys(normalizeState({days:{'2026-02-30':{hours:4}},lessons:{}}).days).length", 0, 'invalid calendar dates are discarded');
check("normalizeState({days:{},lessons:{'1':{status:'bogus'},'101':{status:'done'}},projects:[{id:'x',url:'javascript:alert(1)'},{id:'y',url:'https://example.com'}]}).lessons['1'].status", 'not-started', 'unknown imported status is normalized');
check("normalizeState({days:{},lessons:{},projects:[{id:'x',url:'javascript:alert(1)'},{id:'y',url:'https://example.com'}]}).projects[0].url", '', 'unsafe imported project URL is removed');
check("normalizeState({days:{},lessons:{},projects:[{id:'x',url:'javascript:alert(1)'},{id:'y',url:'https://example.com'}]}).projects[1].url", 'https://example.com/', 'safe project URL is normalized');
check("safeHttpUrl('data:text/html,hi')", '', 'data URLs are rejected');
check("safeHttpUrl('https://example.com')", 'https://example.com/', 'HTTPS URLs are accepted');

// Analytics edge cases and streak behavior.
check("average('energy')", '—', 'empty days do not bias quality averages');
run("state.days[addDays(todayISO(),-1)]={checkin:true,tasks:{review:false},hours:1,energy:4}");
check('calcStreak()', 1, 'streak carries yesterday forward when today is incomplete');
check("average('energy')", '4.0', 'averages use days with actual activity');
check("monthDayDenominator('2999-01')", 0, 'future month has no elapsed-day denominator');
check("monthDayDenominator('2000-02')", 29, 'leap-year month uses correct number of days');

console.log(`PASS: ${checks} application regression assertions`);
