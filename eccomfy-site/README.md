# Eccomfy — Packaging personalizado (Next.js + Tailwind)

Landing, editor 3D simulado y backoffice inspirado en el flujo de Packlane.

## Requisitos

Antes de arrancar necesitás definir las siguientes variables en un archivo `.env.local`:

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
