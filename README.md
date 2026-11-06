# Moodboard interactivo

Experiencia web para descubrir la identidad visual de una marca: formula de
bienvenida, selección de referencias, paletas de color, mascota, preguntas
abiertas y un resumen tipo moodboard. Todas las respuestas se guardan en una base
de datos y se revisan desde el panel de administración.

## Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS 4 y daisyUI.
- **Backend:** NestJS 11 + TypeORM.
- **Base de datos:** PostgreSQL 16.
- **Infraestructura:** Docker Compose.

## Estructura

```
app/                    Páginas de Next (`/` y `/admin`)
components/moodboard/   Pantallas y pasos del flujo público
components/admin/       Login, navbar y paneles del administrador
content/                Preguntas abiertas de la marca
lib/                    Cliente del API y tipos compartidos
api/                    Backend NestJS (entidades, endpoints y subidas)
docker-compose.yml      Web + API + base de datos
```

## Levantar todo con Docker (recomendado)

1. Copia `.env.example` a `.env` y cambia `ADMIN_PASSWORD`, `JWT_SECRET` y
   `POSTGRES_PASSWORD`.
2. Construye y levanta los servicios:

   ```bash
   docker compose up --build
   ```

3. Abre:
   - Experiencia: <http://localhost:3000>
   - Panel: <http://localhost:3000/admin>
   - API: <http://localhost:4000/api>

Los datos de Postgres viven en el volumen `db_data`. Las imágenes que subes desde
el panel también se guardan en PostgreSQL, así que no hace falta un volumen de
archivos.

```bash
docker compose down      # detener (conserva los datos)
docker compose down -v   # detener y borrar datos e imágenes
```

## Despliegue

La app necesita tres cosas: la web de Next, el API de NestJS y Postgres. Las
imágenes que se suben desde el panel se guardan dentro de PostgreSQL, así que el
API no necesita disco persistente. Eso permite usar planes gratuitos.

### Render free + Neon free (recomendado para gratis)

Esta combinación no requiere tarjeta ni servidor propio. Render duerme los
servicios free tras unos minutos sin visitas; el primer acceso puede tardar
entre 30 y 60 segundos.

1. Crea un proyecto gratuito en <https://neon.tech> y copia su connection string
   (`postgresql://...`). Neon free es permanente e incluye 1 GB.
2. En Render, crea una cuenta nueva con tu email (no la conectes a GitHub) y
   genera una API key en **Account Settings > API Keys**.
3. Crea un Blueprint con el repositorio público y `render.yaml`, o pide que se
   creen los dos servicios por API.
4. Cuando Render pida `ADMIN_PASSWORD` y `DATABASE_URL`, escribe una contraseña
   nueva y la connection string de Neon.
5. Abre la URL de `moodboard-web-valxci.onrender.com`.

`render.yaml` ya usa `plan: free` para el API y para la web. El API guarda las
imágenes en PostgreSQL; no hay disco que pagar.

Si Render añade un sufijo a los nombres porque ya están ocupados, actualiza
`API_INTERNAL_URL` (servicio web) y `WEB_ORIGIN` (servicio API) con las URLs
reales y vuelve a desplegar la web.

### VPS con Docker

En un servidor con Docker y un dominio apuntando a su IP:

1. Copia `.env.example` a `.env` y define `ADMIN_PASSWORD`, un `JWT_SECRET`
   aleatorio y `WEB_ORIGIN=https://tu-dominio.com`.
2. Levanta la app:

   ```bash
   docker compose up -d --build
   ```

3. Instala Caddy (o Nginx) como reverse proxy con HTTPS hacia
   `http://localhost:3000`. Ejemplo de `Caddyfile`:

   ```caddyfile
   moodboard.tu-dominio.com {
     reverse_proxy localhost:3000
   }
   ```

4. Abre solo los puertos 80 y 443 en el firewall. No expongas el puerto 5432 de
   Postgres a Internet.

En Docker, `API_INTERNAL_URL` se hornea como `http://api:4000` y el navegador
habla solo con el dominio de la web (Next hace de proxy). Las imágenes y la base
de datos quedan dentro del volumen `db_data`.

## Desarrollo local

Necesitas Postgres. Puedes levantarlo solo con Docker:

```bash
docker compose up -d db

npm install
npm --prefix api install

npm run dev:api   # API en http://localhost:4000
npm run dev       # Web en http://localhost:3000
```

> `npm run dev` usa **webpack** porque Turbopack tiene un problema al parsear el
> CSS que genera daisyUI 5.7.50 (`@scope`). El build de producción sí usa
> Turbopack y funciona correctamente.

## Panel de administración

Entra en `/admin` con la contraseña definida en `ADMIN_PASSWORD`.

- **Marcas:** cada envío aparece como una carpeta con las referencias, paletas,
  mascota, respuestas y un análisis automático. Puedes añadir notas internas,
  descargar el JSON o eliminar la solicitud.
- **Imágenes:** sube PNG, JPG o WebP (máximo 8 MB), indica si es referencia de
  estilo o de mascota y, opcionalmente, una categoría para el análisis. También
  puedes eliminar imágenes existentes.
- **Paletas:** crea familias y paletas con hasta 10 colores, o elimina las que ya
  no uses.

Todo lo que subas desde el panel aparece automáticamente en la experiencia
pública, sin tocar el código.

## Flujo de la experiencia

1. Bienvenida.
2. Mini formulario: nombre de la marca y nombre de la persona.
3. **Paso 1:** referencias visuales (mínimo una).
4. **Paso 2:** paletas de color (mínimo una).
5. **Paso 3:** mascota (mínimo una referencia o «No quiero mascota»).
6. **Paso 4:** preguntas abiertas (mínimo una respuesta).
7. **Resumen:** canvas con todo lo elegido y botón para enviar.

El botón «Siguiente» permanece deshabilitado hasta cumplir el mínimo de cada
paso, y la página vuelve al inicio al cambiar de paso.

## Datos y análisis

- Al enviar se guarda una **copia** de las referencias y paletas elegidas, de modo
  que la solicitud no cambia si luego editas la biblioteca.
- El análisis calcula categorías de estilo, colores dominantes, uso de mascota y
  preguntas respondidas.
- En el primer arranque, si las tablas están vacías, se cargan 27 referencias de
  estilo, 10 de mascota y 14 paletas.

## Variables de entorno

| Variable              | Descripción                                      | Por defecto             |
| --------------------- | ------------------------------------------------ | ----------------------- |
| `ADMIN_PASSWORD`      | Contraseña del panel `/admin`                    | definida en `.env`      |
| `JWT_SECRET`          | Secreto para firmar la sesión del panel          | definido en `.env`      |
| `NEXT_PUBLIC_API_URL` | URL externa del API (vacío = mismo origen)       | vacío                   |
| `API_INTERNAL_URL`    | URL interna del API para los rewrites de Next    | `http://localhost:4000` |
| `WEB_ORIGIN`          | Origen permitido por CORS                        | `http://localhost:3000` |
| `DATABASE_URL`        | Connection string de PostgreSQL (Neon, etc.)     | vacío                   |
| `DB_SSL`              | Activa SSL para la base de datos remota          | `false`                 |
| `POSTGRES_DB`         | Nombre de la base de datos                       | `moodboard`             |
| `POSTGRES_USER`       | Usuario de Postgres                              | `moodboard`             |
| `POSTGRES_PASSWORD`   | Contraseña de Postgres                           | definida en `.env`      |

`NEXT_PUBLIC_API_URL` y `API_INTERNAL_URL` se aplican al construir la imagen web,
así que después de cambiarlas hay que reconstruirla
(`docker compose up -d --build web`).

El API usa `DATABASE_URL` si está definida; si no, acepta `DB_HOST`, `DB_PORT`,
`DB_USER`, `DB_PASSWORD` y `DB_NAME`. `DB_SYNC` controla si TypeORM crea las
tablas automáticamente. En Render se configura `DB_SSL=true` para Neon. No hace
falta un archivo `.env` dentro de `api/`.

## Seguridad: qué no se sube al repositorio

- `.env`, `api/.env` y `.backups/` están en `.gitignore` porque contienen
  contraseñas, secretos o datos de usuarios. No los añadas con `git add -f`.
- `.env.example` solo debe contener marcadores de posición, nunca credenciales
  reales.
- En Render, `ADMIN_PASSWORD` y `DATABASE_URL` se piden al crear el Blueprint
  (`sync: false`) y `JWT_SECRET` se genera automáticamente. No los escribas en
  `render.yaml`.
- Si una contraseña o un secreto llegó a un commit público, considéralo
  filtrado: cámbialo y vuelve a desplegar. Borrarlo en un commit nuevo no lo
  elimina del historial de Git.

## Notas

- TypeORM usa `synchronize: true` para simplificar el desarrollo. Si el proyecto
  crece, conviene pasar a migraciones.
- Las imágenes semilla viven en `public/references` y
  `public/mascot-references`; las subidas desde el panel se guardan en la tabla
  `stored_files` de PostgreSQL y se sirven en `/uploads`. Next hace de proxy
  hacia el API, así que el navegador solo habla con el origen de la web (sin
  problemas de CORS).
- Antes de publicar, cambia las contraseñas, usa HTTPS y no expongas el puerto de
  Postgres.
