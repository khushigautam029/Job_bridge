
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

const getEmailConfig = () => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || "JobBridge";

    if (!apiKey || !senderEmail) {
        throw new Error("Brevo email configuration is incomplete");
    }

    return { apiKey, senderEmail, senderName };
};

// Validate links before inserting them into email templates.
const validateHttpUrl = (value, fieldName = "URL") => {
    try {
        const url = new URL(value);

        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error();
        }

        return url.href;
    } catch {
        throw new Error(`${fieldName} must be a valid HTTP or HTTPS URL`);
    }
};

const sendBrevoEmail = async ({
    email,
    name,
    subject,
    htmlContent,
    textContent,
}) => {
    const { apiKey, senderEmail, senderName } = getEmailConfig();

    if (!email || !subject || !htmlContent || !textContent) {
        throw new Error(
            "Recipient email, subject, HTML content, and text content are required"
        );
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
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
            subject,
            htmlContent,
            textContent,
        }),
    });

    if (!response.ok) {
        const errorDetails = await response.text();

        // Avoid logging API keys or other credentials.
        console.error("Brevo email request failed:", {
            status: response.status,
            details: errorDetails.slice(0, 1000),
        });

        throw new Error("Unable to send email");
    }
};

// --------------------------------------------------
// Reusable professional JobBridge email template
// --------------------------------------------------

const BRAND = {
    primary: "#2563eb",
    primaryDark: "#1d4ed8",
    text: "#111827",
    body: "#374151",
    muted: "#6b7280",
    background: "#f3f4f6",
    border: "#e5e7eb",
    footer: "#f9fafb",
};

const createEmailTemplate = ({
    preheader = "",
    title,
    greeting = "",
    intro = "",
    content = "",
    closing = "Regards,<br><strong>The JobBridge Team</strong>",
    accentColor = BRAND.primary,
}) => {
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.background};font-family:Arial,Helvetica,sans-serif;color:${BRAND.body};">

    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        ${escapeHtml(preheader)}
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
        style="width:100%;background-color:${BRAND.background};">
        <tr>
            <td align="center" style="padding:32px 12px;">

                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"
                    style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">

                    <tr>
                        <td align="center"
                            style="background-color:${BRAND.primary};padding:30px 24px;">
                            <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:700;letter-spacing:-0.5px;">
                                JobBridge
                            </h1>
                            <p style="margin:9px 0 0;color:#dbeafe;font-size:14px;line-height:1.6;">
                                Connecting Talent with Opportunity
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:34px 28px 30px;">

                            <div style="height:4px;width:44px;background-color:${accentColor};border-radius:4px;margin:0 0 22px;"></div>

                            <h2 style="margin:0 0 22px;color:${BRAND.text};font-size:24px;line-height:1.4;font-weight:700;">
                                ${title}
                            </h2>

                            ${greeting ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:${BRAND.body};">${greeting}</p>` : ""}

                            ${intro ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.8;color:${BRAND.body};">${intro}</p>` : ""}

                            ${content}

                            <p style="margin:28px 0 0;font-size:15px;line-height:1.8;color:${BRAND.body};">
                                ${closing}
                            </p>

                        </td>
                    </tr>

                    <tr>
                        <td style="padding:22px 24px;background-color:${BRAND.footer};border-top:1px solid ${BRAND.border};text-align:center;">
                            <p style="margin:0 0 8px;color:${BRAND.muted};font-size:12px;line-height:1.7;">
                                This is an automated notification from JobBridge.
                            </p>
                            <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.7;">
                                &copy; ${year} JobBridge. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>`;
};

const createButton = (url, label, color = BRAND.primary) => `
<table role="presentation" cellspacing="0" cellpadding="0" border="0"
    style="margin:26px 0;">
    <tr>
        <td align="center" bgcolor="${color}" style="border-radius:7px;">
            <a href="${escapeHtml(url)}"
                style="display:inline-block;padding:14px 26px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;border-radius:7px;">
                ${escapeHtml(label)}
            </a>
        </td>
    </tr>
</table>`;

const createInfoCard = ({ label, value, background = "#eff6ff", color = "#1e3a8a" }) => `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
    style="width:100%;margin:22px 0;background:${background};border-radius:8px;">
    <tr>
        <td style="padding:20px 22px;">
            <p style="margin:0 0 8px;font-size:11px;line-height:1.6;letter-spacing:1px;font-weight:700;color:${color};">
                ${escapeHtml(label)}
            </p>
            <p style="margin:0;font-size:19px;line-height:1.5;font-weight:700;color:${color};overflow-wrap:anywhere;">
                ${escapeHtml(value)}
            </p>
        </td>
    </tr>
</table>`;

const createLinkFallback = (url, label = "If the button does not work, copy this link into your browser:") => `
<p style="margin:18px 0 8px;font-size:13px;line-height:1.7;color:${BRAND.muted};">
    ${escapeHtml(label)}
</p>
<p style="margin:0;font-size:13px;line-height:1.7;overflow-wrap:anywhere;word-break:break-all;">
    <a href="${escapeHtml(url)}" style="color:${BRAND.primary};">${escapeHtml(url)}</a>
</p>`;

// --------------------------------------------------
// 1. Password reset email
// --------------------------------------------------

const sendPasswordResetEmail = async ({ email, name, token }) => {
    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl || !email || !token) {
        throw new Error(
            "Frontend URL, recipient email, and reset token are required"
        );
    }

    const baseUrl = frontendUrl.replace(/\/+$/, "");
    const resetUrl = validateHttpUrl(
        `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`,
        "Password reset URL"
    );

    const safeName = escapeHtml(name || "there");

    const htmlContent = createEmailTemplate({
        preheader: "Reset your JobBridge account password securely.",
        title: "Reset Your Password",
        greeting: `Hello ${safeName},`,
        intro: "We received a request to reset the password associated with your JobBridge account. Use the button below to create a new password.",
        content: `
            ${createButton(resetUrl, "Reset My Password")}

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                style="margin:22px 0;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;">
                <tr>
                    <td style="padding:16px 18px;">
                        <p style="margin:0;font-size:14px;line-height:1.8;color:#92400e;">
                            <strong>Security notice:</strong> This link expires in 15 minutes and can only be used once.
                        </p>
                    </td>
                </tr>
            </table>

            ${createLinkFallback(resetUrl)}

            <p style="margin:22px 0 0;font-size:14px;line-height:1.8;color:${BRAND.muted};">
                If you did not request a password reset, you can safely ignore this email. Your password will not change unless you complete the reset process.
            </p>
        `,
    });

    const textContent = [
        `Hello ${name || "there"},`,
        "",
        "We received a request to reset your JobBridge account password.",
        "",
        `Reset your password here: ${resetUrl}`,
        "",
        "This link expires in 15 minutes and can only be used once.",
        "",
        "If you did not request this change, ignore this email.",
        "",
        "Regards,",
        "The JobBridge Team",
    ].join("\n");

    await sendBrevoEmail({
        email,
        name,
        subject: "Reset your JobBridge password",
        htmlContent,
        textContent,
    });
};

// --------------------------------------------------
// 2. Candidate application confirmation email
// --------------------------------------------------

const sendApplicationConfirmationEmail = async ({
    email,
    name,
    jobTitle,
}) => {
    if (!email || !jobTitle) {
        throw new Error("Candidate email and job title are required");
    }

    const safeName = escapeHtml(name || "Candidate");
    const safeJobTitle = escapeHtml(jobTitle);

    const htmlContent = createEmailTemplate({
        preheader: `Your application for ${jobTitle} has been submitted.`,
        title: "Application Submitted Successfully",
        greeting: `Hello ${safeName},`,
        intro: "Thank you for applying through JobBridge. Your application has been submitted successfully, and you can now track its progress through your account.",
        content: `
            ${createInfoCard({
                label: "POSITION APPLIED FOR",
                value: jobTitle,
            })}

            <p style="margin:20px 0;font-size:15px;line-height:1.8;color:${BRAND.body};">
                Your application has been recorded. The recruiter can review your application and update its status as the hiring process progresses.
            </p>

            <p style="margin:16px 0;font-size:15px;line-height:1.8;color:${BRAND.body};">
                Please keep an eye on your JobBridge account for application updates and interview invitations.
            </p>

            <p style="margin:20px 0 0;font-size:14px;line-height:1.8;color:${BRAND.muted};">
                Thank you for choosing JobBridge for your job search. We wish you the very best!
            </p>
        `,
    });

    const textContent = [
        `Hello ${name || "Candidate"},`,
        "",
        "Your job application has been submitted successfully.",
        `Position: ${jobTitle}`,
        "",
        "You can track your application status through your JobBridge account.",
        "",
        "Thank you for choosing JobBridge.",
        "",
        "Regards,",
        "The JobBridge Team",
    ].join("\n");

    await sendBrevoEmail({
        email,
        name,
        subject: `Application confirmation: ${jobTitle}`,
        htmlContent,
        textContent,
    });
};

// --------------------------------------------------
// 3. Candidate selection email
// --------------------------------------------------

const sendCandidateSelectionEmail = async ({
    email,
    name,
    jobTitle,
}) => {
    if (!email || !jobTitle) {
        throw new Error("Candidate email and job title are required");
    }

    const safeName = escapeHtml(name || "Candidate");

    const htmlContent = createEmailTemplate({
        preheader: `An update on your application for ${jobTitle}.`,
        title: "Congratulations on Your Selection!",
        greeting: `Hello ${safeName},`,
        intro: "We are pleased to share some great news regarding your application. You have been selected for the following position.",
        accentColor: "#16a34a",
        content: `
            ${createInfoCard({
                label: "SELECTED POSITION",
                value: jobTitle,
                background: "#f0fdf4",
                color: "#166534",
            })}

            <p style="margin:20px 0;font-size:15px;line-height:1.8;color:${BRAND.body};">
                Congratulations on reaching this milestone! Please sign in to your JobBridge account to review any updates or next steps shared by the recruiter.
            </p>

            <p style="margin:16px 0;font-size:15px;line-height:1.8;color:${BRAND.body};">
                We appreciate your interest and wish you continued success in your career journey.
            </p>
        `,
    });

    const textContent = [
        `Congratulations, ${name || "Candidate"}!`,
        "",
        `You have been selected for the position: ${jobTitle}.`,
        "",
        "Please check your JobBridge account for updates or next steps from the recruiter.",
        "",
        "We wish you success in your career journey.",
        "",
        "Regards,",
        "The JobBridge Team",
    ].join("\n");

    await sendBrevoEmail({
        email,
        name,
        subject: `Congratulations! Selected for ${jobTitle}`,
        htmlContent,
        textContent,
    });
};

// --------------------------------------------------
// 4. Interview invitation / rescheduling email
// --------------------------------------------------

const sendInterviewInvitationEmail = async ({
    email,
    name,
    jobTitle,
    interviewDate,
    interviewTime,
    meetingLink,
    interviewType = "Online",
    recruiterName,
    isRescheduled = false,
}) => {
    if (!email || !jobTitle || !interviewDate || !meetingLink) {
        throw new Error(
            "Candidate email, job title, interview date, and meeting link are required"
        );
    }

    const safeMeetingLink = validateHttpUrl(
        meetingLink,
        "Interview meeting link"
    );

    const safeName = escapeHtml(name || "Candidate");
    const safeJobTitle = escapeHtml(jobTitle);
    const safeDate = escapeHtml(interviewDate);
    const safeTime = escapeHtml(interviewTime || "As scheduled");
    const safeInterviewType = escapeHtml(interviewType);
    const safeRecruiterName = escapeHtml(
        recruiterName || "Recruitment Team"
    );

    const heading = isRescheduled
        ? "Your Interview Has Been Rescheduled"
        : "Your Interview Invitation";

    const intro = isRescheduled
        ? "Your interview details have been updated. Please review the revised schedule below."
        : "You have been invited to an interview for the position below. Please review the details and make a note of the scheduled time.";

    const htmlContent = createEmailTemplate({
        preheader: `${isRescheduled ? "Updated interview details" : "Interview invitation"} for ${jobTitle}.`,
        title: heading,
        greeting: `Hello ${safeName},`,
        intro,
        content: `
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                style="margin:22px 0;background:#eff6ff;border-radius:8px;">
                <tr>
                    <td style="padding:22px;">
                        <p style="margin:0 0 6px;color:#1d4ed8;font-size:11px;letter-spacing:1px;font-weight:700;">
                            POSITION
                        </p>
                        <h3 style="margin:0 0 20px;color:#1e3a8a;font-size:20px;line-height:1.5;">
                            ${safeJobTitle}
                        </h3>

                        <p style="margin:10px 0;font-size:14px;line-height:1.7;color:${BRAND.body};">
                            <strong>Interview date:</strong> ${safeDate}
                        </p>
                        <p style="margin:10px 0;font-size:14px;line-height:1.7;color:${BRAND.body};">
                            <strong>Interview time:</strong> ${safeTime}
                        </p>
                        <p style="margin:10px 0;font-size:14px;line-height:1.7;color:${BRAND.body};">
                            <strong>Interview type:</strong> ${safeInterviewType}
                        </p>
                        <p style="margin:10px 0 0;font-size:14px;line-height:1.7;color:${BRAND.body};">
                            <strong>Recruiter:</strong> ${safeRecruiterName}
                        </p>
                    </td>
                </tr>
            </table>

            <p style="margin:20px 0;font-size:15px;line-height:1.8;color:${BRAND.body};">
                Please be ready a few minutes before the scheduled time. If you need clarification about the interview, use the contact details provided by the recruiter.
            </p>

            ${createButton(safeMeetingLink, "Join Interview")}

            ${createLinkFallback(safeMeetingLink, "If the meeting button does not work, copy this link into your browser:")}
        `,
    });

    const textContent = [
        `Hello ${name || "Candidate"},`,
        "",
        isRescheduled
            ? `Your interview for ${jobTitle} has been rescheduled.`
            : `Your interview for ${jobTitle} has been scheduled.`,
        "",
        `Date: ${interviewDate}`,
        `Time: ${interviewTime || "As scheduled"}`,
        `Interview type: ${interviewType}`,
        `Recruiter: ${recruiterName || "Recruitment Team"}`,
        "",
        `Join interview: ${safeMeetingLink}`,
        "",
        "Please be ready a few minutes before the scheduled time.",
        "",
        "Regards,",
        "The JobBridge Team",
    ].join("\n");

    await sendBrevoEmail({
        email,
        name,
        subject: `${isRescheduled ? "Interview rescheduled" : "Interview invitation"}: ${jobTitle}`,
        htmlContent,
        textContent,
    });
};

export {
    sendApplicationConfirmationEmail,
    sendCandidateSelectionEmail,
    sendInterviewInvitationEmail,
    sendPasswordResetEmail
};

