import { h } from '../dom.js';
import { update } from '../state.js';

export function Notes(state) {
  let timer;
  const status = h('span', { class: 'save-status' }, 'guardado ✓');

  const textarea = h('textarea', {
    rows: 8,
    placeholder: 'Notas libres: conversaciones con mamá, calls con Lina, dudas, ideas para el SOP...',
    onInput: e => {
      status.textContent = 'escribiendo...';
      clearTimeout(timer);
      timer = setTimeout(() => {
        update(s => { s.notes = e.target.value; });
        status.textContent = 'guardado ✓';
      }, 400);
    }
  }, state.notes || '');

  return h('section', { class: 'card' }, [
    h('div', { class: 'notes-head' }, [
      h('h2', {}, '📝 Notas'),
      status
    ]),
    textarea
  ]);
}
