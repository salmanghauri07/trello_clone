export function verificationTemplate({ name = "User", otp }) {
  const year = new Date().getFullYear();

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
                <h1 style="margin:0; font-size:20px; font-weight:600;">Verify your email</h1>
                <p style="margin:6px 0 0; font-size:13px; opacity:0.95;">One-time password (OTP) for signing in</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px 32px; color:#0f172a;">
                <p style="margin:0 0 16px; font-size:15px;">
                  Hi <strong>${name}</strong>,
                </p>

                <p style="margin:0 0 24px; font-size:15px; color:#334155;">
                  Use the verification code below to complete your signup. This code will expire in <strong>5 minutes</strong>.
                </p>

                <!-- OTP box -->
                <div style="display:flex; justify-content:center; margin:0 0 22px;">
                  <div style="background:#f8fafc; border:1px dashed #e2e8f0; padding:18px 28px; border-radius:8px; text-align:center; font-size:28px; letter-spacing:4px; font-weight:700; color:#0f172a;">
                    ${otp}
                  </div>
                </div>

                <p style="margin:0 0 18px; font-size:13px; color:#64748b;">
                  If you didn't request this, you can ignore this email — no changes were made to your account.
                </p>

                <hr style="border:none; border-top:1px solid #eef2f7; margin:18px 0;" />

                <p style="margin:0; font-size:12px; color:#94a3b8;">
                  Need help? Reply to this email or contact support at 
                  <a href="mailto:support@example.com" style="color:#0ea5a4; text-decoration:none;">support@example.com</a>.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 24px; background:#fbfdff; text-align:center; font-size:12px; color:#94a3b8;">
                © ${year} InvexTech. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}
