const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (character) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[character];
    });

const sendPasswordResetEmail = async ({ email, name, token }) => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || "JobBridge";
    const frontendUrl = process.env.FRONTEND_URL;

    if (!apiKey || !senderEmail || !frontendUrl) {
        throw new Error("Brevo email configuration is incomplete");
    }

    const resetUrl =
        `${frontendUrl.replace(/\/+$/, "")}` +
        `/reset-password?token=${encodeURIComponent(token)}`;

    const safeName = escapeHtml(name || "User");
    const safeResetUrl = escapeHtml(resetUrl);

    const response = await fetch(
        "https://api.brevo.com/v3/smtp/email",
        {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                sender: {
                    name: senderName,
                    email: senderEmail,
                },
                to: [
                    {
                        email,
                        name: name || email,
                    },
                ],
                subject: "Reset your JobBridge password",
                htmlContent: `
                    <!DOCTYPE html>
                    <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2>Reset your JobBridge password</h2>
                        <p>Hello ${safeName},</p>
                        <p>We received a request to reset your JobBridge account password.</p>
                        <p>
                            <a href="${safeResetUrl}"
                                style="display:inline-block;padding:12px 20px;
                                background:#2563eb;color:#ffffff;
                                text-decoration:none;border-radius:6px;">
                                Reset Password
                            </a>
                        </p>
                        <p>This link expires in 15 minutes and can only be used once.</p>
                        <p>If you did not request a password reset, you can ignore this email.</p>
                        <p>Regards,<br />JobBridge Team</p>
                    </body>
                    </html>
                `,
                textContent:
                    `Hello ${name || "User"},\n\n` +
                    "Use the following link to reset your JobBridge password. " +
                    "It expires in 15 minutes and can only be used once:\n\n" +
                    `${resetUrl}\n\n` +
                    "If you did not request this, ignore this email.",
            }),
        }
    );

    if (!response.ok) {
        // Keep provider details out of the API response.
        console.error(
            "Brevo email request failed with status:",
            response.status
        );

        throw new Error("Unable to send password reset email");
    }
};

export { sendPasswordResetEmail };
