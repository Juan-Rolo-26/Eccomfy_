/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0C2851",     // principal / fondos oscuros
          blue: "#3971A0",     // secundario
          sky: "#C5DFF6",      // fondo suave
          yellow: "#F2C857",   // acento principal (CTAs)
          ink: "#0C2851"       // color de texto por defecto
        }
      },
      boxShadow: {
        card: "0 10px 30px rgba(12,40,81,0.10)"
      },
      backgroundImage: {
        // gradiente del hero usando tu azul + navy
        "hero-sweep":
          "radial-gradient(80% 60% at 70% 10%, rgba(57,113,160,0.30), rgba(57,113,160,0)), radial-gradient(100% 60% at 10% 10%, rgba(12,40,81,0.70), rgba(12,40,81,0.20))"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    },
  },
  plugins: [],
};
