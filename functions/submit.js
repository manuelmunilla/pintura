export async function onRequestPost(context) {
  try {
    const data = await context.request.formData();
    const nombre = data.get('nombre');
    const email = data.get('email');
    const mensaje = data.get('mensaje');

    // To send an actual email, you typically use a service like Mailchannels 
    // (which is free for Cloudflare Workers) or SendGrid/Postmark.
    
    // Example using Mailchannels (Cloudflare's partner for free emails):
    const send_request = new Request("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            personalizations: [
                { to: [{ email: "manuelmunilla@gmail.com", name: "Manuel Munilla" }] }
            ],
            from: { email: "no-reply@tu-dominio.com", name: "sitio de Pinturas Cloudflare" },
            subject: `Nueva consulta de ${nombre}`,
            content: [
                {
                    type: "text/plain",
                    value: `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`,
                },
            ],
        }),
    });

    const resp = await fetch(send_request);
    
    if (resp.ok) {
      return Response.redirect(`${new URL(context.request.url).origin}/gracias.html`, 303);
    } else {
      return new Response("Error al enviar el correo", { status: 500 });
    }

  } catch (err) {
    return new Response("Error interno: " + err.message, { status: 500 });
  }
}
