# Impressive Studio — Portal

Base del portal interno de Impressive Studio. Cada herramienta vive como una ruta dentro de este mismo proyecto Next.js, para que todo se despliegue desde un solo repo de GitHub a un solo dominio.

- `/` — landing con las 3 herramientas
- `/cotizador` — **listo**: crear cotizaciones y compartir un link único por cliente
- `/onboarding` — placeholder, próxima herramienta
- `/agentes` — placeholder, próxima herramienta

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind
- Almacenamiento: Vercel Blob (`@vercel/blob`) — cada cotización es un JSON en el store
- Auth simple por contraseña compartida (cookie) para las rutas internas; las páginas `/q/[id]` son públicas para poder compartirlas con clientes

## 1) Subir el código a GitHub

```bash
cd impressive-portal
git init
git add .
git commit -m "Portal inicial: cotizador"
```

Crea un repo vacío en GitHub (ej. `impressive-studio-portal`) y luego:

```bash
git remote add origin https://github.com/TU-USUARIO/impressive-studio-portal.git
git branch -M main
git push -u origin main
```

## 2) Conectar el repo a Vercel (deploys automáticos)

1. Entra a vercel.com → **Add New → Project** → importa el repo `impressive-studio-portal`.
2. Vercel detecta Next.js automáticamente, dale a **Deploy**.
3. Desde ahora, cada `git push` a `main` despliega solo. Cualquier herramienta nueva que agregues al repo (onboarding, agentes) se publica igual, sin pasos extra.

> Ya existe un deploy inicial hecho directo (sin git) para que puedas ver el portal funcionando ahora mismo — más abajo te paso esa URL. Cuando conectes el repo de GitHub, ese pasa a ser el proyecto "oficial" con auto-deploy.

## 3) Crear el Blob Store (guarda las cotizaciones)

1. En el proyecto de Vercel → **Storage → Create Database → Blob**.
2. Conéctalo al proyecto. Vercel agrega automáticamente la variable `BLOB_READ_WRITE_TOKEN`.

## 4) Variables de entorno

En **Settings → Environment Variables** agrega:

| Variable | Valor |
|---|---|
| `PORTAL_PASSWORD` | la contraseña que va a usar el equipo para entrar a `/cotizador` |
| `BLOB_READ_WRITE_TOKEN` | se agrega solo al conectar el Blob Store (paso 3) |

Redeploy después de guardar las variables.

## 5) Conectar el dominio impressivestudio.cl

En el proyecto de Vercel → **Settings → Domains** → agrega `impressivestudio.cl` (y `www.impressivestudio.cl` si quieres). Vercel te va a mostrar los registros DNS exactos a usar — normalmente:

- Dominio raíz (`impressivestudio.cl`): registro **A** → `76.76.21.21`
- Subdominio `www`: registro **CNAME** → `cname.vercel-dns.com`

### Dónde cambiarlo en NIC Chile

1. Entra a tu cuenta en **nic.cl**.
2. Ve a tu dominio `impressivestudio.cl` → **Zona DNS / Editar DNS**.
3. Si tu dominio usa los servidores DNS de NIC Chile, edita ahí los registros A/CNAME de arriba.
4. Si en algún momento delegaste los nameservers a otro proveedor (Cloudflare, GoDaddy, etc.), el cambio se hace allá, no en NIC Chile — revisa la sección "Nameservers" del dominio para confirmar.
5. La propagación puede tardar minutos a un par de horas.

Vercel valida el dominio automáticamente apenas detecta el DNS correcto y emite el certificado SSL solo.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completa PORTAL_PASSWORD; BLOB_READ_WRITE_TOKEN solo hace falta si quieres probar el store en local
npm run dev
```
