import { h } from '../dom.js';
import { exportJSON, importJSON, resetState } from '../state.js';

const PROMPTS = [
  {
    id: 'sop',
    label: '📝 Draft SOP',
    prompt: 'Ayudame a escribir un Statement of Purpose para Tetr College of Business (Dubai). Perfil: Adrian Benages, boliviano, background biotech + product, experiencia en Boehringer Ingelheim, proyecto FLASH, construyendo marca personal. Necesito enfatizar por qué Tetr, qué aporto y por qué necesito Financial Aid. Pedí los datos que te falten.'
  },
  {
    id: 'aid',
    label: '💰 Financial Aid letter',
    prompt: 'Ayudame a redactar la sección de justificación económica del Financial Aid Form de Tetr. Contexto: familia en Bolivia, mamá empleada, papá desempleado, hermana menor en colegio. Necesito que suene honesto, documentado y sin exagerar. Pedí los números que te falten.'
  },
  {
    id: 'portfolio',
    label: '📂 Portfolio case studies',
    prompt: 'Ayudame a estructurar 2 case studies para mi portfolio de aplicación a Tetr: (1) FLASH (mi proyecto personal de producto) y (2) Boehringer Ingelheim (mi experiencia laboral). Formato: problema → approach → resultado → aprendizaje. Máximo 1 página cada uno.'
  },
  {
    id: 'scholarships',
    label: '🎓 External scholarships',
    prompt: 'Hacé research de becas externas que aplique yo (boliviano, aceptado en Tetr Dubai para undergraduate business). Stack prioritario: Fundación Carolina, Santander, Min. Educación Bolivia, fundaciones UAE, YC Future Founders. Dame deadlines, requisitos y links de aplicación.'
  },
  {
    id: 'appeal',
    label: '📨 Appeal letter (si aid bajo)',
    prompt: 'Ayudame a preparar una appeal letter a Tetr para solicitar revisión del Financial Aid inicial. Tono: respetuoso, con datos, explicando que sin más ayuda no puedo asistir. Pedí los montos actuales y el gap a cubrir.'
  }
];

export function ActionButtons(state) {
  const toast = h('span', { class: 'toast', style: { display: 'none' } }, '');

  const buttons = PROMPTS.map(p => h('button', {
    class: 'btn btn-prompt',
    onClick: () => {
      navigator.clipboard.writeText(p.prompt).then(() => {
        toast.textContent = `✓ Prompt "${p.label}" copiado — pegalo en Claude`;
        toast.style.display = 'inline-block';
        setTimeout(() => { toast.style.display = 'none'; }, 2500);
      });
    }
  }, p.label));

  const importInput = h('input', {
    type: 'file',
    accept: 'application/json',
    style: { display: 'none' },
    onChange: async e => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        await importJSON(file);
        toast.textContent = '✓ Backup importado';
        toast.style.display = 'inline-block';
        setTimeout(() => { toast.style.display = 'none'; }, 2500);
      } catch (err) {
        alert('Error importando JSON: ' + err.message);
      }
      e.target.value = '';
    }
  });

  return h('section', { class: 'card' }, [
    h('h2', {}, '⚡ Acciones rápidas'),
    h('p', { class: 'hint' }, 'Los botones de prompt copian el texto al clipboard. Pegalo en Claude Desktop o en el CLI.'),
    h('div', { class: 'btn-row' }, buttons),
    h('div', { class: 'btn-row btn-row-divider' }, [
      h('button', { class: 'btn btn-secondary', onClick: () => exportJSON() }, '⬇ Export JSON'),
      h('button', { class: 'btn btn-secondary', onClick: () => importInput.click() }, '⬆ Import JSON'),
      h('button', {
        class: 'btn btn-danger',
        onClick: () => {
          if (confirm('¿Resetear todo al estado inicial? Perdés tus datos.')) resetState();
        }
      }, '↺ Reset')
    ]),
    importInput,
    toast
  ]);
}
