import { h } from '../dom.js';
import { update, daysUntil } from '../state.js';

export function TaskPipeline(state) {
  const groups = new Map();
  state.tasks.forEach(t => {
    if (!groups.has(t.phase)) groups.set(t.phase, []);
    groups.get(t.phase).push(t);
  });

  const phases = [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([phase, tasks]) => {
    const done = tasks.filter(t => t.done).length;
    return h('div', { class: 'phase' }, [
      h('div', { class: 'phase-head' }, [
        h('h3', {}, state.phaseLabels[phase] || `Fase ${phase}`),
        h('span', { class: 'phase-count' }, `${done}/${tasks.length}`)
      ]),
      h('ul', { class: 'task-list' }, tasks.map(t => taskRow(t)))
    ]);
  });

  return h('section', { class: 'card' }, [
    h('h2', {}, '✅ Pipeline de tareas'),
    ...phases
  ]);
}

function taskRow(task) {
  const days = daysUntil(task.due);
  const tone = task.done ? 'done' : days < 0 ? 'past' : days <= 3 ? 'urgent' : days <= 10 ? 'soon' : 'ok';
  return h('li', { class: `task task-${tone}` }, [
    h('input', {
      type: 'checkbox',
      checked: task.done,
      onChange: e => update(s => {
        const target = s.tasks.find(x => x.id === task.id);
        if (target) target.done = e.target.checked;
      })
    }),
    h('div', { class: 'task-body' }, [
      h('span', { class: 'task-label' }, task.label),
      h('span', { class: 'task-meta' }, `${task.due} · ${days < 0 ? `hace ${Math.abs(days)}d` : `en ${days}d`}`)
    ])
  ]);
}
