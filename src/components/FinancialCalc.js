import { h, fmtUSD } from '../dom.js';
import { update, computeFinance } from '../state.js';

export function FinancialCalc(state) {
  const f = state.finance;
  const result = computeFinance(f);

  const section = h('section', { class: 'card' }, [
    h('h2', {}, '💰 Calculadora financiera'),
    h('p', { class: 'hint' }, 'Moveé los valores para simular escenarios. Se guarda automáticamente.'),
    h('div', { class: 'calc-grid' }, [
      numInput('Tuition base (USD)', f.tuitionBase, v => update(s => { s.finance.tuitionBase = v; })),
      numInput('Financial Aid esperado', f.financialAidExpected, v => update(s => { s.finance.financialAidExpected = v; })),
      numInput('Scholarship académica', f.scholarshipAcademic, v => update(s => { s.finance.scholarshipAcademic = v; })),
      numInput('Internship income (USD/mes)', f.internshipIncome, v => update(s => { s.finance.internshipIncome = v; })),
      prepaidSelect(f.prepaidYears, v => update(s => { s.finance.prepaidYears = v; }))
    ]),
    h('div', { class: 'calc-result' }, [
      resultRow('Costo gross (tras aid)', fmtUSD(result.gross)),
      resultRow('Rebate pago adelantado', `− ${fmtUSD(result.rebate)}`),
      resultRow('Costo neto', fmtUSD(result.net), 'result-net'),
      resultRow('Ahorro vs tuition base', fmtUSD(result.savings), 'result-savings')
    ])
  ]);
  return section;
}

function numInput(label, value, onChange) {
  return h('label', { class: 'field' }, [
    h('span', { class: 'field-label' }, label),
    h('input', {
      type: 'number',
      value,
      min: '0',
      step: '500',
      onInput: e => onChange(Number(e.target.value) || 0)
    })
  ]);
}

function prepaidSelect(value, onChange) {
  const select = h('select', {
    onChange: e => onChange(Number(e.target.value))
  }, [
    option('0', 'Pago normal', value === 0),
    option('1', '1 año adelantado (3% rebate)', value === 1),
    option('2', '2 años adelantados (5.5% rebate)', value === 2)
  ]);
  return h('label', { class: 'field' }, [
    h('span', { class: 'field-label' }, 'Modalidad de pago'),
    select
  ]);
}

function option(val, label, selected) {
  const o = h('option', { value: val }, label);
  if (selected) o.selected = true;
  return o;
}

function resultRow(label, value, extraClass = '') {
  return h('div', { class: `result-row ${extraClass}` }, [
    h('span', {}, label),
    h('strong', {}, value)
  ]);
}
