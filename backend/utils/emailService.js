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

const sendBrevoEmail = async ({
    email,
    name,
    subject,
    htmlContent,
    textContent,
}) => {
    const { apiKey, senderEmail, senderName } = getEmailConfig();

    if (!email) {
        throw new Error("Recipient email is required");
    }

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
                subject,
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

        throw new Error("Unable to send email");
    }
};

// Existing password-reset email functionality.
const sendPasswordResetEmail = async ({ email, name, token }) => {
    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
        throw new Error("Frontend URL is not configured");
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
                        <td align="center" style="background:#2563eb;padding:28px 24px;">
                            <h1 style="margin:0;color:#ffffff;font-size:28px;">JobBridge</h1>
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
                            <p style="font-size:15px;line-height:1.7;">
                                Hello ${safeName},
                            </p>
                            <p style="font-size:15px;line-height:1.7;">
                                We received a request to reset the password for your
                                JobBridge account. Click below to choose a new password.
                            </p>
                            <table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0;">
                                <tr>
                                    <td align="center" bgcolor="#2563eb" style="border-radius:8px;">
                                        <a href="${safeResetUrl}"
                                            style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <p style="font-size:14px;line-height:1.7;color:#4b5563;">
                                This link expires in <strong>15 minutes</strong> and can only be used once.
                            </p>
                            <p style="font-size:14px;line-height:1.7;color:#4b5563;">
                                If the button doesn't work, copy this URL into your browser:
                            </p>
                            <p style="font-size:13px;line-height:1.7;overflow-wrap:anywhere;">
                                <a href="${safeResetUrl}" style="color:#2563eb;word-break:break-all;">
                                    ${safeResetUrl}
                                </a>
                            </p>
                            <p style="font-size:14px;line-height:1.7;color:#4b5563;">
                                If you did not request a password reset, you can safely ignore this email.
                            </p>
                            <p style="font-size:15px;line-height:1.7;margin-top:28px;">
                                Regards,<br><strong>JobBridge Team</strong>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="background:#f9fafb;padding:20px 24px;border-top:1px solid #e5e7eb;">
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

    await sendBrevoEmail({
        email,
        name,
        subject: "Reset your JobBridge password",
        htmlContent,
        textContent,
    });
};

// Email sent to the candidate after applying for a job.
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

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Submitted - JobBridge</title>
</head>
<body style="margin:0;padding:32px 12px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
            <td align="center" style="background:#2563eb;padding:28px;">
                <h1 style="margin:0;color:#ffffff;">JobBridge</h1>
                <p style="margin:8px 0 0;color:#dbeafe;">Connecting Talent with Opportunity</p>
            </td>
        </tr>
        <tr>
            <td style="padding:32px 28px;">
                <h2 style="color:#111827;">Application Submitted Successfully!</h2>
                <p style="font-size:15px;line-height:1.7;">Hello ${safeName},</p>
                <p style="font-size:15px;line-height:1.7;">
                    Your application for the following position has been submitted successfully:
                </p>
                <div style="margin:24px 0;padding:18px;background:#eff6ff;border-radius:8px;">
                    <p style="margin:0;color:#1d4ed8;font-size:12px;">POSITION APPLIED FOR</p>
                    <h3 style="margin:8px 0 0;color:#1e3a8a;">${safeJobTitle}</h3>
                </div>
                <p style="font-size:15px;line-height:1.7;">
                    The recruiter has been notified of your application. You can check your application status through your JobBridge account.
                </p>
                <p style="font-size:15px;line-height:1.7;">
                    Best wishes for your job search!
                </p>
                <p style="font-size:15px;line-height:1.7;">
                    Regards,<br><strong>JobBridge Team</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td align="center" style="background:#f9fafb;padding:18px;border-top:1px solid #e5e7eb;">
                <p style="margin:0;color:#6b7280;font-size:12px;">
                    This is an automated email. Please do not reply.
                </p>
                <p style="margin:8px 0 0;color:#9ca3af;font-size:12px;">
                    &copy; ${new Date().getFullYear()} JobBridge. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;

    const textContent = [
        `Hello ${name || "Candidate"},`,
        "",
        "Your job application has been submitted successfully.",
        `Position: ${jobTitle}`,
        "",
        "The recruiter has been notified. You can check your application status in your JobBridge account.",
        "",
        "Regards,",
        "JobBridge Team",
    ].join("\n");

    await sendBrevoEmail({
        email,
        name,
        subject: `Application submitted: ${jobTitle}`,
        htmlContent,
        textContent,
    });
};


const sendCandidateSelectionEmail = async ({
    email,
    name,
    jobTitle,
}) => {
    if (!email || !jobTitle) {
        throw new Error("Candidate email and job title are required");
    }

    const safeName = escapeHtml(name || "Candidate");
    const safeJobTitle = escapeHtml(jobTitle);

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Congratulations - JobBridge</title>
</head>
<body style="margin:0;padding:32px 12px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
            <td align="center" style="background:#2563eb;padding:28px;">
                <h1 style="margin:0;color:#ffffff;">JobBridge</h1>
                <p style="margin:8px 0 0;color:#dbeafe;">Connecting Talent with Opportunity</p>
            </td>
        </tr>
        <tr>
            <td style="padding:32px 28px;">
                <h2 style="color:#15803d;">Congratulations, ${safeName}!</h2>
                <p style="font-size:15px;line-height:1.7;">
                    We are pleased to inform you that you have been selected for the following position:
                </p>
                <div style="margin:24px 0;padding:18px;background:#f0fdf4;border-radius:8px;">
                    <p style="margin:0;color:#166534;font-size:12px;">SELECTED POSITION</p>
                    <h3 style="margin:8px 0 0;color:#14532d;">${safeJobTitle}</h3>
                </div>
                <p style="font-size:15px;line-height:1.7;">
                    Congratulations on this achievement! Please check your JobBridge account
                    for any updates or further communication from the recruiter.
                </p>
                <p style="font-size:15px;line-height:1.7;">
                    We wish you success in your career journey.
                </p>
                <p style="font-size:15px;line-height:1.7;">
                    Regards,<br><strong>JobBridge Team</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td align="center" style="background:#f9fafb;padding:18px;border-top:1px solid #e5e7eb;">
                <p style="margin:0;color:#6b7280;font-size:12px;">
                    This is an automated email. Please do not reply.
                </p>
                <p style="margin:8px 0 0;color:#9ca3af;font-size:12px;">
                    &copy; ${new Date().getFullYear()} JobBridge. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;

    const textContent = [
        `Congratulations, ${name || "Candidate"}!`,
        "",
        `You have been selected for the position: ${jobTitle}.`,
        "",
        "Please check your JobBridge account for updates or further communication from the recruiter.",
        "",
        "Regards,",
        "JobBridge Team",
    ].join("\n");

    await sendBrevoEmail({
        email,
        name,
        subject: `Congratulations! You've been selected for ${jobTitle}`,
        htmlContent,
        textContent,
    });
};

// Email sent to the candidate when an interview is scheduled.
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

    const safeName = escapeHtml(name || "Candidate");
    const safeJobTitle = escapeHtml(jobTitle);
    const safeDate = escapeHtml(interviewDate);
    const safeTime = escapeHtml(interviewTime || "As scheduled");
    const safeMeetingLink = escapeHtml(meetingLink);
    const safeInterviewType = escapeHtml(interviewType);
    const safeRecruiterName = escapeHtml(recruiterName || "Recruitment Team");

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Invitation - JobBridge</title>
</head>
<body style="margin:0;padding:32px 12px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
            <td align="center" style="background:#2563eb;padding:28px;">
                <h1 style="margin:0;color:#ffffff;">JobBridge</h1>
                <p style="margin:8px 0 0;color:#dbeafe;">Connecting Talent with Opportunity</p>
            </td>
        </tr>
        <tr>
            <td style="padding:32px 28px;">
                <h2 style="color:#1d4ed8;">Your Interview Has Been Scheduled!</h2>
                <p style="font-size:15px;line-height:1.7;">Hello ${safeName},</p>
                <p style="font-size:15px;line-height:1.7;">
                    You have been invited to an interview for the following position.
                    Please review the details below.
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                    style="margin:24px 0;background:#eff6ff;border-radius:8px;">
                    <tr>
                        <td style="padding:20px;">
                            <p style="margin:0 0 6px;color:#1d4ed8;font-size:12px;">POSITION</p>
                            <h3 style="margin:0 0 18px;color:#1e3a8a;">${safeJobTitle}</h3>
                            <p style="margin:8px 0;font-size:14px;"><strong>Date:</strong> ${safeDate}</p>
                            <p style="margin:8px 0;font-size:14px;"><strong>Time:</strong> ${safeTime}</p>
                            <p style="margin:8px 0;font-size:14px;"><strong>Interview type:</strong> ${safeInterviewType}</p>
                            <p style="margin:8px 0;font-size:14px;"><strong>Recruiter:</strong> ${safeRecruiterName}</p>
                        </td>
                    </tr>
                </table>
                <p style="font-size:15px;line-height:1.7;">
                    Please join the interview at the scheduled time using the meeting link below.
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0;">
                    <tr>
                        <td align="center" bgcolor="#2563eb" style="border-radius:8px;">
                            <a href="${safeMeetingLink}"
                                style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;">
                                Join Interview
                            </a>
                        </td>
                    </tr>
                </table>
                <p style="font-size:14px;line-height:1.7;color:#4b5563;">
                    If the button does not work, copy this link into your browser:
                </p>
                <p style="font-size:13px;line-height:1.7;overflow-wrap:anywhere;">
                    <a href="${safeMeetingLink}" style="color:#2563eb;word-break:break-all;">
                        ${safeMeetingLink}
                    </a>
                </p>
                <p style="font-size:15px;line-height:1.7;">
                    Please be ready a few minutes before the scheduled time.
                </p>
                <p style="font-size:15px;line-height:1.7;">
                    Regards,<br><strong>JobBridge Team</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td align="center" style="background:#f9fafb;padding:18px;border-top:1px solid #e5e7eb;">
                <p style="margin:0;color:#6b7280;font-size:12px;">
                    This is an automated email. Please do not reply.
                </p>
                <p style="margin:8px 0 0;color:#9ca3af;font-size:12px;">
                    &copy; ${new Date().getFullYear()} JobBridge. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;

    const textContent = [
        `Hello ${name || "Candidate"},`,
        "",
        `Your interview for ${jobTitle} has been scheduled.`,
        `Date: ${interviewDate}`,
        `Time: ${interviewTime || "As scheduled"}`,
        `Interview type: ${interviewType}`,
        `Recruiter: ${recruiterName || "Recruitment Team"}`,
        "",
        `Join the interview: ${meetingLink}`,
        "",
        "Please be ready a few minutes before the scheduled time.",
        "",
        "Regards,",
        "JobBridge Team",
    ].join("\n");

    await sendBrevoEmail({
        email,
        name,
        subject: `${isRescheduled ? "Updated Interview Invitation" : "Interview Invitation"}: ${jobTitle}`,
        htmlContent,
        textContent,
    });
};

export {
    sendApplicationConfirmationEmail, sendCandidateSelectionEmail, sendInterviewInvitationEmail, sendPasswordResetEmail
};

