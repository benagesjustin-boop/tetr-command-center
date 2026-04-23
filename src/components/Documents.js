import { h } from '../dom.js';
import { update } from '../state.js';

const STATUSES = [
  { value: 'pending', label: '⏳ Pendiente' },
  { value: 'received', label: '✅ Recibido' },
  { value: 'submitted', label: '📤 Enviado a Tetr' }
];

export function Documents(state) {
  return h('section', { class: 'card' }, [
    h('h2', {}, '📄 Documentos (Bolivia)'),
    h('p', { class: 'hint' }, 'Docs requeridos para el Financial Aid Form.'),
    h('ul', { class: 'doc-list' }, state.documents.map(doc => docRow(doc)))
  ]);
}

function docRow(doc) {
  const select = h('select', {
    onChange: e => update(s => {
      const target = s.documents.find(x => x.id === doc.id);
      if (target) target.status = e.target.value;
    })
  }, STATUSES.map(opt => {
    const o = h('option', { value: opt.value }, opt.label);
    if (opt.value === doc.status) o.selected = true;
    return o;
  }));

  return h('li', { class: `doc doc-${doc.status}` }, [
    h('span', { class: 'doc-label' }, doc.label),
    select
  ]);
}
