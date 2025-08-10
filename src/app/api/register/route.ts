import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";

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
    const { name, phone } = await request.json();

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

    const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    if (hasSmtp) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from,
        to: to.join(","),
        subject,
        text,
        html,
        replyTo,
      });

      return NextResponse.json({ ok: true });
    }

    // Fallback to Resend if SMTP is not configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Falta configuración de envío (SMTP o RESEND_API_KEY)" }, { status: 500 });
    }

    const sendResult = await resend.emails.send({
      from,
      to,
      subject,
      text,
      html,
      reply_to: replyTo,
    });

    if ((sendResult as any)?.error) {
      console.error("Resend error:", (sendResult as any).error);
      return NextResponse.json({ error: "No se pudo enviar el correo" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error procesando la solicitud" }, { status: 500 });
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