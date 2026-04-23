import { h } from '../dom.js';
import { daysUntil } from '../state.js';

export function Header(state) {
  const tasksDone = state.tasks.filter(t => t.done).length;
  const tasksTotal = state.tasks.length;
  const taskPct = Math.round((tasksDone / tasksTotal) * 100);

  const docsReceived = state.documents.filter(d => d.status === 'received' || d.status === 'submitted').length;
  const docsTotal = state.documents.length;
  const docPct = Math.round((docsReceived / docsTotal) * 100);

  const deadlines = state.deadlines.map(d => {
    const days = daysUntil(d.date);
    const tone = days < 0 ? 'past' : days <= 7 ? 'urgent' : days <= 21 ? 'soon' : 'ok';
    return h('div', { class: `deadline deadline-${tone}` }, [
      h('div', { class: 'deadline-label' }, d.label),
      h('div', { class: 'deadline-date' }, d.date),
      h('div', { class: 'deadline-days' }, days < 0 ? `hace ${Math.abs(days)}d` : `${days}d restantes`)
    ]);
  });

  return h('header', { class: 'header' }, [
    h('div', { class: 'header-top' }, [
      h('h1', {}, '🎯 Tetr Command Center'),
      h('p', { class: 'subtitle' }, 'Dubai · Application Tracker · Adrian Benages')
    ]),
    h('div', { class: 'deadlines' }, deadlines),
    h('div', { class: 'progress-row' }, [
      progressBar('Tareas', tasksDone, tasksTotal, taskPct),
      progressBar('Documentos', docsReceived, docsTotal, docPct)
    ])
  ]);
}

function progressBar(label, done, total, pct) {
  return h('div', { class: 'progress-card' }, [
    h('div', { class: 'progress-head' }, [
      h('span', { class: 'progress-label' }, label),
      h('span', { class: 'progress-count' }, `${done}/${total} · ${pct}%`)
    ]),
    h('div', { class: 'progress-track' }, [
      h('div', { class: 'progress-fill', style: { width: `${pct}%` } })
    ])
  ]);
}
