import { Env } from "../config/env.config.js";
import { InternalServerException } from "../utils/app-error.js"
import { ErrorCodeEnum } from "../utils/error-code.enum.js"
import { createTransporter } from "./mailer.js";
import { empCredentialsEmailTemplate } from "./templates/credentials.template.js";

interface CredentialsEmail {
    name: string;
    email: string;
    password: string;
    employeeId: string;
    role: string;
}


export const sendEmpCredentialsEmail = async ({
    name, email, password, employeeId, role
}: CredentialsEmail): Promise<void> => {
    try {
        const transporter = createTransporter();
        const htmlBody = empCredentialsEmailTemplate(name, email, password, employeeId, role.toLocaleUpperCase());
        const fallbackText = `Hello ${name},\n\nWelcome to our team! Your employee account has been created.\n\nEmployee ID: ${employeeId}\nEmail: ${email}\nPassword: ${password}\nRole: ${role}\n\nPlease log in and change your password immediately for security purposes.\n\nIf you need any assistance, please contact our support team.\n\nBest regards,\nThe HR Team`;
        await transporter.sendMail({
            from: Env.NODEMAILER_EMAIL,
            to: email,
            subject: `Welcome Aboard, ${name}! Your Account is Ready`,
            text: fallbackText,
            html: htmlBody,
        })
    } catch (error) {
        throw new InternalServerException('Failed to send Email', ErrorCodeEnum.INTERNAL_SERVER_ERROR);
    }
}