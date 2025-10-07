# Eccomfy — Packaging personalizado (Next.js + Tailwind)

Landing, editor 3D simulado y backoffice inspirado en el flujo de Packlane.

## Requisitos

Antes de arrancar necesitás definir las siguientes variables en un archivo `.env.local`:

Podés copiar el archivo `.env.example` como base:

```bash
cp .env.example .env.local
```

Luego completá los valores reales:

```bash
# Canal principal (clientes)
RESEND_API_KEY=                # API key de https://resend.com/ para correos transaccionales
MAIL_FROM="Eccomfy <no-reply@tudominio.com>"  # Remitente que verán tus clientes

# Canal alternativo para staff (opcional)
RESEND_STAFF_API_KEY=          # API key asociada al remitente de staff (ej. eccomfyarg@gmail.com)
MAIL_FROM_STAFF="Eccomfy Staff <eccomfyarg@gmail.com>"

APP_URL="http://localhost:3000"             # URL pública usada en los enlaces de verificación y reseteo
```

> ⚠️ Si no definís `RESEND_API_KEY` y `MAIL_FROM` la app no podrá enviar códigos de verificación ni enlaces de restablecimiento.
> Si completás además `RESEND_STAFF_API_KEY` y `MAIL_FROM_STAFF`, los correos dirigidos a usuarios con rol staff usarán ese remitente.

## Scripts

```bash
npm install
npm run dev       # Levanta el entorno de desarrollo
npm run build     # Compila la app en modo producción
```

## Funcionalidades

- Autenticación con verificación obligatoria de email (códigos de 6 dígitos enviados con Resend).
- Recupero de contraseña mediante enlace temporal (1 hora de vigencia).
- Panel para staff con gestión de contenidos, usuarios y opciones del editor 3D.
- Editor de cajas que toma materiales, tamaños, terminaciones y tiradas desde SQLite.
- Diferenciación total entre usuarios staff y clientes (navegación, accesos y permisos).

## Flujo de verificación y contraseñas

1. **Registro:** el usuario recibe un código en su correo. No puede iniciar sesión hasta validarlo en `/verify-email`.
2. **Reenvío:** desde la misma página puede solicitar un nuevo código si el anterior venció.
3. **Olvido de contraseña:** `/forgot-password` envía un enlace válido por 60 minutos. Al usarlo se cierran las sesiones anteriores.

Todo el contenido dinámico (productos destacados, testimonios, métricas, opciones del editor) vive en `data/eccomfy.db` y se administra desde `/admin/*` con un usuario marcado como staff.

## ¿Qué hacer cuando aparecen conflictos de merge?

Si al actualizar tu rama GitHub muestra un mensaje como el de la captura (lista de archivos con el botón **Resolve conflicts**), significa que los cambios de tu rama chocan con los que ya existen en `main` u otra rama base. Para destrabarlos seguí estos pasos:

1. **Actualizá tu rama local.**
   ```bash
   git fetch origin
   git checkout tu-rama
   git merge origin/main   # o la rama base que corresponda
   ```
   Git marcará los archivos en conflicto y dejará el estado `MERGING`.

2. **Abrí los archivos en conflicto.** Dentro de cada archivo vas a ver bloques con marcadores:
   ```
   <<<<<<< HEAD
   tu versión
   =======
   versión de la rama base
   >>>>>>> origin/main
   ```
   Conservá o combiná las líneas que correspondan y borrá los marcadores (`<<<<<<<`, `=======`, `>>>>>>>`).

3. **Probá y marcá los archivos como resueltos.**
   ```bash
   npm run lint     # o los comandos de verificación que uses
   git add archivo/en/conflicto.tsx
   ```

4. **Finalizá el merge y subilo.**
   ```bash
   git commit
   git push origin tu-rama
   ```

Después de esto el botón de GitHub pasará a **Mark as resolved** y podrás continuar con el Pull Request.
