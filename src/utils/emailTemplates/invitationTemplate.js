export function invitationTemplate({ inviterName, username, role, token }) {
  const year = new Date().getFullYear();
  return `
    <!doctype html>

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>You're invited to a board</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6fa;font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial,sans-serif;">
    <!-- Outer wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px;">
          <!-- Card -->
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(20,24,40,0.08);">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(90deg,#6366f1,#06b6d4);padding:28px 32px;color:#fff;">
                <h1 style="margin:0;font-size:20px;font-weight:600;line-height:1.1;">You're invited to collaborate</h1>
              </td>
            </tr>

        <tr>
          <td style="padding:28px 32px;color:#0f172a;">
            <p style="margin:0 0 12px 0;font-size:15px;color:#111827;">
              Hi <strong>{{RECIPIENT_NAME}}</strong>,
            </p>

            <p style="margin:0 0 14px 0;font-size:15px;color:#374151;">
              <strong>{{INVITER_NAME}}</strong> has invited you to join the board
              <strong>"{{BOARD_NAME}}"</strong> as a <strong>{{ROLE}}</strong>.
            </p>

            <p style="margin:0 0 20px 0;font-size:14px;color:#6b7280;">
              Click the button below to accept the invitation and open the board. If you don't have an account yet, you'll be prompted to sign up — after that you'll automatically become a member of the board.
            </p>

            <!-- CTA button -->
            <table cellpadding="0" cellspacing="0" role="presentation" style="margin:18px 0;">
              <tr>
                <td align="left">
                  <a href="{{INVITE_LINK}}" target="_blank" rel="noopener noreferrer"
                     style="display:inline-block;padding:12px 20px;border-radius:10px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;">
                    Accept invitation and open board
                  </a>
                </td>
              </tr>
            </table>

            <!-- Link fallback -->
            <p style="margin:12px 0 0 0;font-size:13px;color:#9ca3af;line-height:1.4;">
              If the button doesn't work, copy & paste this link into your browser:
            </p>
            <p style="word-break:break-all;margin:8px 0 0 0;font-size:13px;color:#3b82f6;">
              <a href="{{INVITE_LINK}}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">{{INVITE_LINK}}</a>
            </p>

            <hr style="border:none;border-top:1px solid #eef2ff;margin:22px 0;">

            <p style="margin:0;font-size:12px;color:#94a3b8;">
              This invitation link will expire in <strong>{{EXPIRY_HOURS}} hours</strong>. If you weren't expecting this invite, you can safely ignore this email or contact <strong>{{INVITER_NAME}}</strong>.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:16px 32px;color:#6b7280;font-size:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
              <div>Board: <strong>{{BOARD_NAME}}</strong></div>
              <div>Invited by: <strong>{{INVITER_NAME}}</strong></div>
            </div>
            <div style="margin-top:10px;color:#9ca3af;">
              © {{YEAR}} Your App Name. All rights reserved.
            </div>
          </td>
        </tr>
      </table>
      <!-- End card -->
    </td>
  </tr>
</table>

  </body>
</html>

  `;
}
