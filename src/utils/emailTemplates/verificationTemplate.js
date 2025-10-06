export function invitationTemplate({
  inviterName = "A team member",
  username = "User",
  role = "viewer",
  token,
}) {
  const year = new Date().getFullYear();
  const inviteLink = `https://yourapp.com/invite/${token}`; // replace with your actual invite URL

  return `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" 
      style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f6f8; padding: 24px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" 
            style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.06);">
            
            <!-- Header -->
            <tr>
              <td style="padding:28px 32px; text-align:center; background:linear-gradient(90deg,#4f46e5,#06b6d4); color:white;">
                <h1 style="margin:0; font-size:20px; font-weight:600;">You're invited to collaborate</h1>
                <p style="margin:6px 0 0; font-size:13px; opacity:0.95;">Join your team and start working together</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px 32px; color:#0f172a;">
                <p style="margin:0 0 16px; font-size:15px;">
                  Hi <strong>${username}</strong>,
                </p>

                <p style="margin:0 0 20px; font-size:15px; color:#334155;">
                  <strong>${inviterName}</strong> has invited you to join a board as a <strong>${role}</strong>.
                </p>

                <p style="margin:0 0 28px; font-size:14px; color:#475569;">
                  Click the button below to accept the invitation and start collaborating instantly.
                </p>

                <!-- Button -->
                <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto 28px;">
                  <tr>
                    <td align="center">
                      <a href="${inviteLink}" target="_blank" rel="noopener noreferrer"
                        style="display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none;
                        font-weight:600; font-size:15px; padding:12px 26px; border-radius:8px;">
                        Accept Invitation
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Fallback link -->
                <p style="margin:0 0 18px; font-size:13px; color:#64748b;">
                  Or copy this link into your browser:
                </p>
                <p style="word-break:break-all; margin:8px 0 0; font-size:13px;">
                  <a href="${inviteLink}" target="_blank" style="color:#2563eb; text-decoration:underline;">${inviteLink}</a>
                </p>

                <hr style="border:none; border-top:1px solid #eef2f7; margin:24px 0;" />

                <p style="margin:0; font-size:12px; color:#94a3b8;">
                  If you didn't expect this invitation, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 24px; background:#fbfdff; text-align:center; font-size:12px; color:#94a3b8;">
                Invited by <strong>${inviterName}</strong><br/>
                © ${year} InvexTech. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  `;
}
