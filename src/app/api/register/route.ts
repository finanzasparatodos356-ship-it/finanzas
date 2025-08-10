import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function getRecipients(): string[] {
  const envList = process.env.EMAIL_TO?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  if (envList.length > 0) return envList;
  // Fallback to the provided emails if env is not set
  return [
    "victor.garciasanmartin@ovb.es",
    "katerina.solcova1@ovb.es",
  ];
}

export async function POST(request: Request) {
  try {
    const { name, phone } = (await request.json()) as { name?: string; phone?: string };

    if (!name || !phone) {
      return NextResponse.json({ error: "Nombre y teléfono son obligatorios" }, { status: 400 });
    }

    const to = getRecipients();
    const from = process.env.EMAIL_FROM || "Taller EF <onboarding@resend.dev>";
    const replyTo = process.env.REPLY_TO;

    const timestamp = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });

    const subject = "Nueva inscripción: Taller Educación Financiera";
    const text = `Se ha recibido una nueva inscripción.\n\nNombre: ${name}\nTeléfono: ${phone}\nFecha: ${timestamp}`;

    const html = `
      <div style="font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Arial; line-height:1.5; color:#0f172a;">
        <h2 style="margin:0 0 12px; font-size:18px;">Nueva inscripción: Taller Educación Financiera</h2>
        <table style="width:100%; max-width:520px; border-collapse:collapse;">
          <tbody>
            <tr>
              <td style="padding:8px 0; font-weight:600; width:140px;">Nombre</td>
              <td style="padding:8px 0;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-weight:600;">Teléfono</td>
              <td style="padding:8px 0;">${escapeHtml(phone)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; font-weight:600;">Fecha</td>
              <td style="padding:8px 0;">${escapeHtml(timestamp)}</td>
            </tr>
          </tbody>
        </table>
      </div>`;

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Falta RESEND_API_KEY en el entorno" }, { status: 500 });
    }

    const { error: resendError } = await resend.emails.send({
      from,
      to,
      subject,
      text,
      html,
      reply_to: replyTo,
    });

    if (resendError) {
      console.error("Resend error:", resendError);
      return NextResponse.json({ error: "No se pudo enviar el correo" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error procesando la solicitud";
    console.error(message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
} 