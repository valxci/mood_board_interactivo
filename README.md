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

1. Copia `.env.example` a `.env` y cambia al menos `ADMIN_PASSWORD` y
   `JWT_SECRET`.
2. Construye y levanta los servicios:

   ```bash
   docker compose up --build
   ```

3. Abre:
   - Experiencia: <http://localhost:3000>
   - Panel: <http://localhost:3000/admin>
   - API: <http://localhost:4000/api>

Los datos de Postgres viven en el volumen `db_data` y las imágenes subidas en el
volumen `uploads`.

```bash
docker compose down      # detener (conserva los datos)
docker compose down -v   # detener y borrar datos e imágenes
```

## Despliegue

La app necesita tres cosas: la web de Next, el API de NestJS y Postgres. Las
imágenes que se suben desde el panel se guardan en un disco persistente del API,
así que **no basta con publicar el frontend en Vercel**.

### Render (Blueprint)

El archivo `render.yaml` crea la base de datos, el API con disco persistente y la
web. Pasos:

1. Entra en <https://dashboard.render.com/blueprints> y crea un Blueprint con el
   repositorio de GitHub.
2. Cuando pida `ADMIN_PASSWORD`, escribe la contraseña del panel (por ejemplo,
   `copoytobi`). `JWT_SECRET` se genera automáticamente.
3. Espera a que terminen los tres recursos y abre la URL de
   `moodboard-web-valxci.onrender.com`.

El API usa un plan de pago porque los discos persistentes no están disponibles
en el plan free. La web puede quedarse en free (se duerme tras unos minutos de
inactividad); para evitarlo, cambia su `plan` a `0.5c-512mb`.

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
habla solo con el dominio de la web (Next hace de proxy). Las subidas quedan en
el volumen `uploads` y la base de datos en `db_data`.

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
| `ADMIN_PASSWORD`      | Contraseña del panel `/admin`                    | `moodboard-admin`       |
| `JWT_SECRET`          | Secreto para firmar la sesión del panel          | `cambia-este-secreto`   |
| `NEXT_PUBLIC_API_URL` | URL externa del API (vacío = mismo origen)       | vacío                   |
| `API_INTERNAL_URL`    | URL interna del API para los rewrites de Next    | `http://localhost:4000` |
| `WEB_ORIGIN`          | Origen permitido por CORS                        | `http://localhost:3000` |
| `POSTGRES_DB`         | Nombre de la base de datos                       | `moodboard`             |
| `POSTGRES_USER`       | Usuario de Postgres                              | `moodboard`             |
| `POSTGRES_PASSWORD`   | Contraseña de Postgres                           | `moodboard`             |

`NEXT_PUBLIC_API_URL` y `API_INTERNAL_URL` se aplican al construir la imagen web,
así que después de cambiarlas hay que reconstruirla
(`docker compose up -d --build web`).

El API también acepta `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`,
`DB_SYNC` y `UPLOADS_DIR` (revisa `api/.env.example`).

## Notas

- TypeORM usa `synchronize: true` para simplificar el desarrollo. Si el proyecto
  crece, conviene pasar a migraciones.
- Las imágenes semilla viven en `public/references` y
  `public/mascot-references`; las subidas se sirven en `/uploads`. Next hace de
  proxy hacia el API, así que el navegador solo habla con el origen de la web
  (sin problemas de CORS).
- Antes de publicar, cambia las contraseñas, usa HTTPS y no expongas el puerto de
  Postgres.
