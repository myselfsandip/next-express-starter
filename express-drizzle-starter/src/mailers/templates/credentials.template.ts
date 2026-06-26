export const empCredentialsEmailTemplate = (
    name: string,
    email: string,
    password: string,
    employeeId: string,
    role: string
): string => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Employee Login Credentials</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 20px 0;">
            <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to Our Team!</h1>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                    Hello <strong>${name}</strong>,
                  </p>
                  
                  <p style="margin: 0 0 30px; color: #666666; font-size: 15px; line-height: 1.6;">
                    Your employee account has been created successfully. Below are your login credentials to access the system:
                  </p>
                  
                  <!-- Credentials Box -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 25px;">
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: 600;">Employee ID:</td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px;">${employeeId}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: 600;">Email:</td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px;">${email}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: 600;">Password:</td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 8px 12px; border-radius: 4px; display: inline-block;">${password}</td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: 600;">Role:</td>
                            <td style="padding: 8px 0; color: #667eea; font-size: 14px; font-weight: 600;">${role}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Security Notice -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 15px 20px;">
                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
                          <strong>⚠️ Important Security Notice:</strong><br>
                          Please change your password after your first login. Do not share your credentials with anyone.
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 20px; color: #666666; font-size: 15px; line-height: 1.6;">
                    If you have any questions or need assistance, please don't hesitate to contact our support team.
                  </p>
                  
                  <p style="margin: 0; color: #666666; font-size: 15px; line-height: 1.6;">
                    Best regards,<br>
                    <strong style="color: #333333;">The HR Team</strong>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                    This is an automated message. Please do not reply to this email.<br>
                    © ${new Date().getFullYear()} Your Company. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

