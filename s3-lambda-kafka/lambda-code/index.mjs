import { Kafka } from 'kafkajs';

export const handler = async (event, context) => {
    
    // process S3 event
    const fileName = event.Records[0].s3.object.key;
    const eventTime = event.Records[0].eventTime;
    const processTime = Date.now();
    
    var auditType = '';
    switch (fileName) {
        case 'audit-movements.txt':
            auditType = 'M';
            break;
        case 'audit-clients.txt':
            auditType = 'C';
            break;
        default:
            auditType = 'O';

    }
    const auditNotificationKey = auditType + '_' + processTime;
    
    // kafka connection
    const kafka = new Kafka({
        clientId: 'audit-notification-client',
        brokers: ['kafka-server:9092'],
        ssl: true,
        sasl: {
            username: <key>,
            password: <value>,
            mechanism: 'plain'
        }
    });
    
    // build kafka event
    const key = { auditNotificationKey };
    const value = {fileName, auditType, eventTime, processTime};
    
    const keyText = JSON.stringify(key);
    const valueText = JSON.stringify(value);
    
    const producer = kafka.producer();
    const topic = 'audit-notifications';
    
    try {
        await producer.connect();
        await producer.send({
            topic: topic,
            messages: [{key: keyText, value: valueText}]
        });
    } catch (error) {
        console.log(error);
    }
    await producer.disconnect();
    
};
