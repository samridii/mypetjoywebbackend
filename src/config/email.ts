import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER as string;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD as string;

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    await transporter.sendMail({
        from: `My Pet Joy <${EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

