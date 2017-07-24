'use strict';
const sendgrid = require('sendgrid');
const Helper = sendgrid.mail;
const templateFactories = require('./template-factory');
const {ServerError} = require('../utilities/error-factory');

class EmailService {
    static _prepareEmail(recipient, template, params) {
        const sg = sendgrid(process.env.SENDGRID_API_KEY);
        const mail = new Helper.Mail(
            new Helper.Email(process.env.EMAIL_SENDER),
            template.getSubject(),
            new Helper.Email(recipient),
            new Helper.Content('text/html', template.getContent()(params))
        );

        template.getFiles().forEach(file => {
            mail.addAttachment(EmailService._createAttachment(file));
        });

        return sg.API(
            sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail.toJSON()
            })
        );
    }

    static _createAttachment(file) {
        const attachment = new Helper.Attachment();
        attachment.setContent(file.content);
        attachment.setType('image/png');
        attachment.setFilename(file.filename);
        attachment.setDisposition('attachment');
        return attachment;
    }

    static _sendEmail(recipient, template, params) {
        return template instanceof templateFactories.BaseTemplateFactory ?
            EmailService._prepareEmail(recipient, template, params) :
            Promise.reject(new ServerError());
    }

    static sendVerificationCode(recipient, recipientName, code, qrCode) {
        return EmailService._sendEmail(recipient, new templateFactories.VerificationCodeTemplateFactory(qrCode), {
            recipientName,
            code
        });
    }
}

module.exports = {EmailService};