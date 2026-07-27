const otpTemplate = (otp) => {
    return `
    <div style="margin:0;padding:0;background:#f3f6f8;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
            Your verification code for MH.
        </div>

        <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
            <div style="background:linear-gradient(135deg,#0f766e 0%,#134e4a 100%);border-radius:24px 24px 0 0;padding:28px 32px;color:#ffffff;box-shadow:0 18px 40px rgba(15,23,42,0.12);">
                <div style="display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,0.12);padding:8px 14px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                    <span style="width:10px;height:10px;border-radius:50%;background:#f59e0b;display:inline-block;"></span>
                    MH Clinic
                </div>
                <h1 style="margin:18px 0 8px;font-size:28px;line-height:1.2;">Email verification code</h1>
                <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.88);">
                    Use the code below to complete your verification.
                </p>
            </div>

            <div style="background:#ffffff;border-radius:0 0 24px 24px;padding:32px;text-align:center;box-shadow:0 18px 40px rgba(15,23,42,0.12);border:1px solid #e5e7eb;border-top:none;">
                <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#475569;">
                    Your one-time password is:
                </p>

                <div style="display:inline-block;padding:18px 28px;background:linear-gradient(180deg,#ecfeff 0%,#f8fafc 100%);border:1px solid #99f6e4;border-radius:18px;font-size:34px;font-weight:800;letter-spacing:0.22em;color:#0f766e;box-shadow:inset 0 1px 0 rgba(255,255,255,0.75);">
                    ${otp}
                </div>

                <p style="margin:20px 0 0;font-size:14px;line-height:1.7;color:#475569;">
                    This code expires in 5 minutes. If you did not request it, you can ignore this email.
                </p>

                <div style="margin-top:28px;padding:20px 22px;background:#f8fafc;border-left:4px solid #0f766e;border-radius:16px;text-align:left;">
                    <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0f766e;letter-spacing:0.02em;">Security tip</p>
                    <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">
                        Never share this code with anyone. MH will never ask for your OTP over call or message.
                    </p>
                </div>

                <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e5e7eb;font-size:12px;line-height:1.6;color:#64748b;">
                    MH Clinic · Safe, simple, and secure access.
                </div>
            </div>
        </div>
    </div>
    `;
};

export default otpTemplate;