"use client";
import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const TO = "contacto@eccomfy.com"; // cambialo si querés

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = encodeURIComponent(`Contacto desde eccomfy — ${name}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\n\nMensaje:\n${message}`
    );
    window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <label className="text-sm text-slate-600">
          Nombre
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </label>
        <label className="text-sm text-slate-600">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </label>
      </div>

      <label className="text-sm text-slate-600">
        Teléfono (opcional)
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
      </label>

      <label className="text-sm text-slate-600">
        Mensaje
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
      </label>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg bg-brand-blue text-white px-5 py-3 font-medium hover:opacity-95"
      >
        Enviar mensaje
      </button>

      <p className="text-xs text-slate-500">
        * Abre tu cliente de correo con los datos cargados. Luego integramos una API.
      </p>
    </form>
  );
}
