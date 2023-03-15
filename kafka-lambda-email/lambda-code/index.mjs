import { run } from "./sesSendEmail.mjs";

export const handler = async(event) => {
    const notifications = event.records["fraud-notifications-0"];
    for (let notification of notifications) {
        let payload = JSON.parse(Buffer.from(notification.value, 'base64').toString());
        await sendNotfication(payload);
    }
};

const sendNotfication = async(message) => {
    const toAddress = "to@email.com";
    const subject = "Notificación de posible fraude";
    console.log('Sending notification to ' +  toAddress + `...`);
    await run(toAddress, subject, message);
};
