import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "tsyringe";

@injectable()
class EtherealMailProvider implements IMailProvider {
    private client: Transporter;

    constructor() {
        nodemailer
            .createTestAccount()
            .then((account) => {
                const transporter = nodemailer.createTransport({
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: {
                        user: account.user,
                        pass: account.pass,
                    },
                });

                this.client = transporter;
            })
            .catch((error) => console.log(error));
    }

    async sendMail(to: string, subject: string, body: string): Promise<void> {
        const message = await this.client.sendMail({
            to,
            from: "Rentx <noreply@rentx.com.br>",
            subject,
            text: body,
            html: body,
        });

        console.log("Message sent: %s", message.messageId);
        console.log("Preview Url: %s", nodemailer.getTestMessageUrl(message));
    }
}

export { EtherealMailProvider };