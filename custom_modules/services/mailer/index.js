const config = require('../../configuration/app');
const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mailBox,
        pass: config.mailPassword
    },
    from: config.mailBox
});

module.exports.sendMail = async (recipient, subject, textContent, htmlContent) => {
    try {
        const mailOptions = {
            from: config.mailBox,
            to: recipient,
            subject: subject,
            text: textContent,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        error.clientMessage = 'Error occurred while sending mail';
        throw error;
    }
}