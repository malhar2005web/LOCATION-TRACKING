const steps = document.querySelectorAll('.step');
const tabIndicator = document.getElementById('tabIndicator');
const lineFill = document.getElementById('lineFill');
const stepsTrack = document.getElementById('stepsTrack');

const screens = {
  0: document.getElementById('screen0'),
  1: document.getElementById('screen1'),
  2: document.getElementById('screenPlaceholder'),
  3: document.getElementById('screenPlaceholder')
};

const pctLabel = document.getElementById('pctLabel');
const ringProgress = document.getElementById('ringProgress');
const footerTitle = document.getElementById('footerTitle');
const footerSub = document.getElementById('footerSub');

const RADIUS = 27;
const CIRC = 2 * Math.PI * RADIUS;

let current = 0;
const maxUnlocked = 1; // only steps 0 & 1 are built out from the design

function positionIndicator(){
  const el = steps[current];
  const circle = el.querySelector('.circle');
  const trackRect = stepsTrack.getBoundingClientRect();
  const circleRect = circle.getBoundingClientRect();
  const centerX = circleRect.left + circleRect.width / 2 - trackRect.left;
  tabIndicator.style.left = (centerX - 48) + 'px';
  tabIndicator.style.top = (circleRect.top - trackRect.top - 14) + 'px';
}

function updateSteps(){
  steps.forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i < current) s.classList.add('done');
    if (i === current) s.classList.add('active');
  });
  const pct = (current / (steps.length - 1)) * 100;
  lineFill.style.width = pct + '%';
  positionIndicator();
}

function updateFooter(){
  const shown = current === 0 ? 25 : Math.min(100, (current + 1) * 25);
  pctLabel.textContent = shown + '%';
  const offset = CIRC - (shown / 100) * CIRC;
  ringProgress.style.strokeDashoffset = offset;
  footerSub.textContent = (current === 0 ? 1 : current + 1) + ' of 4 steps completed';
  footerTitle.textContent = shown >= 100 ? 'All set!' : "You're doing great!";
}

function goTo(index){
  if (index > maxUnlocked) return;
  current = index;
  Object.values(screens).forEach(s => { if (s) s.style.display = 'none'; });
  (screens[index] || screens[1]).style.display = 'block';
  updateSteps();
  updateFooter();
}

steps.forEach(s => {
  s.addEventListener('click', () => {
    const idx = parseInt(s.dataset.step, 10);
    goTo(idx);
  });
});

document.getElementById('backBtn').addEventListener('click', () => {
  if (current > 0) goTo(current - 1);
});

document.querySelectorAll('.status-pill').forEach(p => {
  p.addEventListener('click', () => {
    document.querySelectorAll('.status-pill').forEach(x => x.classList.remove('active'));
    p.classList.add('active');
  });
});

document.querySelectorAll('textarea.notes[data-charcount]').forEach(ta => {
  ta.addEventListener('input', () => {
    const counter = document.getElementById(ta.dataset.charcount);
    if (counter) counter.textContent = ta.value.length + ' / ' + ta.maxLength;
  });
});

window.addEventListener('resize', positionIndicator);
window.addEventListener('load', () => { goTo(0); });
