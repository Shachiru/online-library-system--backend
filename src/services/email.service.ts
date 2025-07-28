import transporter from '../config/email.config';

export const sendEmail = async (to: string, subject: string, text: string, html?: string): Promise<void> => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw error;
    }
};