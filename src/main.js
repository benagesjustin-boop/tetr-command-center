import { initState, getState, subscribe } from './state.js';
import { h, clearNode } from './dom.js';
import { Header } from './components/Header.js';
import { FinancialCalc } from './components/FinancialCalc.js';
import { TaskPipeline } from './components/TaskPipeline.js';
import { FamilyInfo } from './components/FamilyInfo.js';
import { Documents } from './components/Documents.js';
import { Notes } from './components/Notes.js';
import { ActionButtons } from './components/ActionButtons.js';
import './styles.css';

const root = document.getElementById('app');

async function boot() {
  await initState();
  render();
  subscribe(render);
}

function render() {
  const state = getState();
  clearNode(root);
  root.append(
    Header(state),
    h('main', { class: 'grid' }, [
      h('div', { class: 'col col-left' }, [
        FinancialCalc(state),
        TaskPipeline(state)
      ]),
      h('div', { class: 'col col-right' }, [
        Documents(state),
        FamilyInfo(state),
        Notes(state),
        ActionButtons(state)
      ])
    ]),
    h('footer', { class: 'footer' }, [
      h('span', {}, 'Tetr Command Center · '),
      h('a', { href: 'https://github.com/benagesjustin/tetr-command-center', target: '_blank', rel: 'noopener' }, 'source')
    ])
  );
}

boot().catch(err => {
  root.innerHTML = `<pre style="color:#f88;padding:20px">Error booting: ${err.message}\n${err.stack}</pre>`;
});
