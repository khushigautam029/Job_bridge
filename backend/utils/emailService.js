
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

    if (!email || !token) {
        throw new Error("Email and reset token are required");
    }

    const baseUrl = frontendUrl.replace(/\/+$/, "");
    const resetUrl =
        `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;

    const safeName = escapeHtml(name || "User");
    const safeResetUrl = escapeHtml(resetUrl);

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your JobBridge Password</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        style="background-color:#f3f4f6;padding:32px 12px;">
        <tr>
            <td align="center">

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                    style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">

                    <tr>
                        <td align="center"
                            style="background:#2563eb;padding:28px 24px;">
                            <h1 style="margin:0;color:#ffffff;font-size:28px;">
                                JobBridge
                            </h1>
                            <p style="margin:8px 0 0;color:#dbeafe;font-size:14px;">
                                Connecting Talent with Opportunity
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:36px 28px 24px;">
                            <h2 style="margin:0 0 20px;font-size:23px;color:#111827;">
                                Reset Your Password
                            </h2>

                            <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
                                Hello ${safeName},
                            </p>

                            <p style="font-size:15px;line-height:1.7;margin:0 0 20px;">
                                We received a request to reset the password
                                for your JobBridge account. Click the button
                                below to choose a new password.
                            </p>

                            <table role="presentation" cellspacing="0" cellpadding="0"
                                style="margin:28px 0;">
                                <tr>
                                    <td align="center" bgcolor="#2563eb"
                                        style="border-radius:8px;">
                                        <a href="${safeResetUrl}"
                                            style="display:inline-block;padding:14px 28px;
                                            color:#ffffff;text-decoration:none;font-size:15px;
                                            font-weight:bold;border-radius:8px;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="font-size:14px;line-height:1.7;color:#4b5563;">
                                This link expires in <strong>15 minutes</strong>
                                and can only be used once.
                            </p>

                            <p style="font-size:14px;line-height:1.7;color:#4b5563;">
                                If the button doesn't work, copy and paste
                                this URL into your browser:
                            </p>

                            <p style="font-size:13px;line-height:1.7;overflow-wrap:anywhere;">
                                <a href="${safeResetUrl}"
                                    style="color:#2563eb;word-break:break-all;">
                                    ${safeResetUrl}
                                </a>
                            </p>

                            <p style="font-size:14px;line-height:1.7;color:#4b5563;margin-top:24px;">
                                If you did not request a password reset,
                                you can safely ignore this email. Your
                                password will remain unchanged.
                            </p>

                            <p style="font-size:15px;line-height:1.7;margin:28px 0 0;">
                                Regards,<br>
                                <strong>JobBridge Team</strong>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center"
                            style="background:#f9fafb;padding:20px 24px;border-top:1px solid #e5e7eb;">
                            <p style="margin:0 0 6px;color:#6b7280;font-size:12px;">
                                This is an automated email. Please do not reply.
                            </p>
                            <p style="margin:0;color:#9ca3af;font-size:12px;">
                                &copy; ${new Date().getFullYear()} JobBridge. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>`;

    const textContent = [
        `Hello ${name || "User"},`,
        "",
        "We received a request to reset your JobBridge account password.",
        "",
        `Reset your password using this link: ${resetUrl}`,
        "",
        "This link expires in 15 minutes and can only be used once.",
        "",
        "If you did not request a password reset, ignore this email.",
        "",
        "Regards,",
        "JobBridge Team",
    ].join("\n");

    const response = await fetch(
        "https://api.brevo.com/v3/smtp/email",
        {
            method: "POST",
            headers: {
                accept: "application/json",
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
                htmlContent,
                textContent,
            }),
        }
    );

    if (!response.ok) {
        console.error(
            "Brevo email request failed with status:",
            response.status
        );

        throw new Error("Unable to send password reset email");
    }
};

export { sendPasswordResetEmail };
