# 🚀 INSTRUCCIONES DE INSTALACIÓN — KPIs NBHD/PYN

## ARCHIVOS QUE RECIBÍS
- `index.html` → el sistema completo (va al repo de GitHub)
- `Code.gs`    → el backend de Google Sheets (va en Apps Script)

---

## PASO 1 — Configurar Google Sheets

1. Abrí tu hoja: https://docs.google.com/spreadsheets/d/1fwSn8EUXX4VPlXtGJQA9_RfE4cFr2v17fBdOPdwjT2s
2. Arriba: **Extensions → Apps Script**
3. Borrá todo el código que aparece
4. Pegá el contenido de `Code.gs`
5. Guardá (Ctrl+S) — Nombre del proyecto: "KPIs NBHD"

---

## PASO 2 — Deployar el Apps Script

1. Click en **Deploy → New deployment**
2. Click en el engranaje ⚙️ → **Web app**
3. Configurar:
   - Description: `KPIs v1`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Autorizar el acceso (aceptar todos los permisos)
6. **COPIÁ la URL** que aparece — se ve así:
   `https://script.google.com/macros/s/XXXXXXXX/exec`

---

## PASO 3 — Pegar la URL en index.html

1. Abrí `index.html` con un editor de texto (Notepad, VS Code, etc.)
2. Buscá esta línea (está cerca del final, en el bloque `<script>`):
   ```
   const SCRIPT_URL = 'PEGAR_URL_APPS_SCRIPT_AQUI';
   ```
3. Reemplazá `PEGAR_URL_APPS_SCRIPT_AQUI` con tu URL, ejemplo:
   ```
   const SCRIPT_URL = 'https://script.google.com/macros/s/XXXXXXXX/exec';
   ```
4. Guardá el archivo

---

## PASO 4 — Crear el repositorio en GitHub Pages

1. Andá a https://github.com/new
2. Repository name: `nbhd-kpis` (o el nombre que prefieras)
3. Visibilidad: **Private**
4. ✅ Add a README file
5. Click **Create repository**

---

## PASO 5 — Subir el archivo

1. En tu nuevo repo, click **Add file → Upload files**
2. Subí `index.html`
3. Commit message: "Sistema KPIs v1"
4. Click **Commit changes**

---

## PASO 6 — Activar GitHub Pages

1. En el repo: **Settings → Pages** (menú izquierdo)
2. Source: **Deploy from a branch**
3. Branch: **main** / **/ (root)**
4. Click **Save**
5. Esperá 2-3 minutos
6. Tu URL será: `https://TU-USUARIO.github.io/nbhd-kpis`

---

## USUARIOS Y CONTRASEÑAS

| Usuario   | Contraseña |
|-----------|------------|
| valeria   | vale2024   |
| teresita  | tere2024   |
| valentina | vale2024   |
| veronica  | vero2024   |
| sandra    | sand2024   |
| willy     | will2024   |
| pedro     | pedr2024   |

---

## NOTAS

- La primera vez que cargue la hoja, el Apps Script crea automáticamente
  la pestaña "KPIs" con los datos de ejemplo
- Los datos se guardan en Google Sheets en tiempo real
- Todos los usuarios ven los mismos datos
- Si algo falla, el sistema entra en "modo demo" con datos locales
