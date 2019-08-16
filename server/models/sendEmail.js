// customizable email sending module
const nodemailer = require('nodemailer')
require('dotenv').config()
module.exports = {
    sendEmail(from, to, subject, text, html) {
        let transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        return transport.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html
        })
    }
}
