const STORAGE_KEY = 'tetr-command-center-v1';

const listeners = new Set();
let state = null;
let seed = null;

function baseUrl() {
  return import.meta.env.BASE_URL;
}

export async function initState() {
  const seedUrl = `${baseUrl()}seed-data.json`;
  const res = await fetch(seedUrl);
  seed = await res.json();

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      state = migrate(JSON.parse(raw), seed);
    } catch {
      state = structuredClone(seed);
    }
  } else {
    state = structuredClone(seed);
  }
  return state;
}

function migrate(stored, freshSeed) {
  const merged = structuredClone(freshSeed);
  if (stored.finance) Object.assign(merged.finance, stored.finance);
  if (stored.family) Object.assign(merged.family, stored.family);
  if (typeof stored.notes === 'string') merged.notes = stored.notes;

  if (Array.isArray(stored.tasks)) {
    const doneMap = new Map(stored.tasks.map(t => [t.id, t.done]));
    merged.tasks.forEach(t => {
      if (doneMap.has(t.id)) t.done = doneMap.get(t.id);
    });
  }
  if (Array.isArray(stored.documents)) {
    const statusMap = new Map(stored.documents.map(d => [d.id, d.status]));
    merged.documents.forEach(d => {
      if (statusMap.has(d.id)) d.status = statusMap.get(d.id);
    });
  }
  return merged;
}

export function getState() {
  return state;
}

export function update(mutator) {
  mutator(state);
  persist();
  notify();
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function notify() {
  listeners.forEach(fn => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `tetr-backup-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importJSON(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  state = migrate(parsed, seed);
  persist();
  notify();
}

export function resetState() {
  state = structuredClone(seed);
  persist();
  notify();
}

export function computeFinance(f) {
  const gross = f.tuitionBase - f.financialAidExpected - f.scholarshipAcademic - (f.internshipIncome * 12);
  let rebate = 0;
  if (f.prepaidYears === 1) rebate = gross * f.rebate1yr;
  else if (f.prepaidYears === 2) rebate = gross * f.rebate2yr;
  const net = Math.max(0, gross - rebate);
  const savings = f.tuitionBase - net;
  return { gross: Math.max(0, gross), rebate, net, savings };
}

export function daysUntil(iso) {
  const target = new Date(iso + 'T23:59:59');
  const now = new Date();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}
