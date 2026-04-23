# Tetr Command Center

Live dashboard personal para trackear el proceso de aplicación a [Tetr College of Business](https://tetr.com) (Dubai). Single-user, sin backend, deploy gratis en GitHub Pages.

**Live URL:** https://benagesjustin.github.io/tetr-command-center/ _(después de deploy)_

## Features

- ⏰ Countdown a deadlines críticos (Financial Aid, depósito, acceptance)
- ✅ 18 tareas agrupadas en 5 fases con checkboxes persistentes
- 💰 Calculadora financiera con escenarios (aid, scholarship, internship, prepaid rebates)
- 📄 Checklist de documentos Bolivia con status (pending/received/submitted)
- 👨‍👩‍👧 Formulario de información familiar (solo localStorage)
- 📝 Notas libres con autosave
- ⚡ Botones que copian prompts listos para Claude
- ⬇ Export/Import JSON para backup y sync cross-device

## Stack

Vanilla JS + Vite. Zero runtime dependencies. Persistencia = `localStorage`.

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

## Deploy a GitHub Pages

1. Crear repo público `tetr-command-center` en GitHub
2. Settings → Pages → Source: `GitHub Actions`
3. Push a `main`:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<tu-user>/tetr-command-center.git
   git push -u origin main
   ```
4. El workflow `.github/workflows/deploy.yml` builda y deploya automático

## Sync entre dispositivos

No hay backend. Workflow recomendado:

1. En desktop: click **⬇ Export JSON** → guarda archivo
2. Subir archivo a iCloud/Dropbox/email
3. En móvil: abrir URL live → click **⬆ Import JSON** → seleccionar archivo

## Seguridad

- Repo público → **nunca commitear datos financieros reales**
- `seed-data.json` solo contiene estructura y placeholders
- Toda data sensible vive en `localStorage` del browser
- Archivos exportados van a `.gitignore` (carpeta `exports/`, `backups/`)

## Estructura

```
src/
  main.js           # Entry
  state.js          # Store + persistence + export/import
  dom.js            # Helper h()
  styles.css        # Dark mode
  components/
    Header.js       # Countdown + progress bars
    FinancialCalc.js
    TaskPipeline.js
    FamilyInfo.js
    Documents.js
    Notes.js
    ActionButtons.js
public/
  seed-data.json    # Tareas, deadlines, placeholders
```

## Licencia

Personal. No redistribuir.
