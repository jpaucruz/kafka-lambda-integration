import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./libs/sesClient.mjs";

const createSendEmailCommand = (toAddress, fromAddress, subject, cardId, cardFraudMovements, fraudTypeDescription) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: "La tarjeta "  + cardId + " tiene " + cardFraudMovements + " movimientos, de tipo " + fraudTypeDescription + ", con sospecha de fraude\r\n",
        },
        Text: {
          Charset: "UTF-8",
          Data: "La tarjeta "  + cardId + " tiene " + cardFraudMovements + " movimientos, de tipo " + fraudTypeDescription + ", con sospecha de fraude\r\n",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const getFraudTypeDescription = (type) => {
  if (type == 4) {
    return 'online';
  } else {
    return'físico';
  }
}

const sendAlert = async (toAddress, subject, data) => {
  
  const cardFraudMovements = data.cardMovements.length;
  const fraudType = data.type;
  const fraudTypeDescription = getFraudTypeDescription(fraudType);
  const cardId = data.cardId;
  const sendEmailCommand = createSendEmailCommand(toAddress, "from@email.com", subject, cardId, cardFraudMovements, fraudTypeDescription);

  try {
    console.log('Sending notification by email...')
    return await sesClient.send(sendEmailCommand);
  } catch (e) {
    console.error("Failed to send email.", e);
    return e;
  }
};

export { sendAlert };
