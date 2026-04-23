import { h } from '../dom.js';
import { update } from '../state.js';

export function FamilyInfo(state) {
  const f = state.family;
  return h('section', { class: 'card' }, [
    h('h2', {}, '👨‍👩‍👧 Información familiar'),
    h('p', { class: 'hint' }, 'Solo vive en tu navegador (localStorage). No se sube al repo.'),
    h('div', { class: 'calc-grid' }, [
      numField('Ingreso mensual mamá', f.monthlyIncomeMom, v => update(s => { s.family.monthlyIncomeMom = v; })),
      numField('Ingreso mensual papá', f.monthlyIncomeDad, v => update(s => { s.family.monthlyIncomeDad = v; })),
      numField('Gastos mensuales hogar', f.monthlyExpenses, v => update(s => { s.family.monthlyExpenses = v; })),
      numField('Costo colegio hermana', f.sisterSchoolCost, v => update(s => { s.family.sisterSchoolCost = v; })),
      currencyField(f.currency, v => update(s => { s.family.currency = v; }))
    ]),
    h('label', { class: 'field field-wide' }, [
      h('span', { class: 'field-label' }, 'Notas sobre situación familiar'),
      h('textarea', {
        rows: 3,
        placeholder: 'Contexto adicional para el Financial Aid form...',
        onInput: e => update(s => { s.family.notes = e.target.value; })
      }, f.notes || '')
    ])
  ]);
}

function numField(label, value, onChange) {
  return h('label', { class: 'field' }, [
    h('span', { class: 'field-label' }, label),
    h('input', {
      type: 'number',
      value,
      min: '0',
      step: '100',
      onInput: e => onChange(Number(e.target.value) || 0)
    })
  ]);
}

function currencyField(value, onChange) {
  const select = h('select', {
    onChange: e => onChange(e.target.value)
  }, ['BOB', 'USD', 'EUR'].map(code => {
    const o = h('option', { value: code }, code);
    if (code === value) o.selected = true;
    return o;
  }));
  return h('label', { class: 'field' }, [
    h('span', { class: 'field-label' }, 'Moneda'),
    select
  ]);
}
