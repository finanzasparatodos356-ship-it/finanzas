import { NextResponse } from "next/server";
import { Resend } from "resend";

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
    const replyToEnv = process.env.REPLY_TO;

    const timestamp = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });

    const subject = "Nueva inscripción: Taller Educación Financiera";
    const text = `Se ha recibido una nueva inscripción.\n\nNombre: ${name}\nTeléfono: ${phone}\nFecha: ${timestamp}`;

    const html = `
      <div style=\"font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Arial; line-height:1.5; color:#0f172a;\">
        <h2 style=\"margin:0 0 12px; font-size:18px;\">Nueva inscripción: Taller Educación Financiera</h2>
        <table style=\"width:100%; max-width:520px; border-collapse:collapse;\">
          <tbody>
            <tr>
              <td style=\"padding:8px 0; font-weight:600; width:140px;\">Nombre</td>
              <td style=\"padding:8px 0;\">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style=\"padding:8px 0; font-weight:600;\">Teléfono</td>
              <td style=\"padding:8px 0;\">${escapeHtml(phone)}</td>
            </tr>
            <tr>
              <td style=\"padding:8px 0; font-weight:600;\">Fecha</td>
              <td style=\"padding:8px 0;\">${escapeHtml(timestamp)}</td>
            </tr>
          </tbody>
        </table>
      </div>`;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Falta RESEND_API_KEY en el entorno" }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    const sendOptions: Parameters<typeof resend.emails.send>[0] = {
      from,
      to,
      subject,
      text,
      html,
    };
    if (replyToEnv && replyToEnv.trim().length > 0) {
      sendOptions.replyTo = replyToEnv.trim();
    }

    const { error: resendError } = await resend.emails.send(sendOptions);

    if (resendError) {
      const details = typeof resendError === "object" ? JSON.stringify(resendError) : String(resendError);
      console.error("Resend error:", details);
      const payload = { error: "No se pudo enviar el correo" } as { error: string; details?: string };
      if (process.env.NODE_ENV !== "production") {
        payload.details = details;
      }
      return NextResponse.json(payload, { status: 500 });
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
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
} 