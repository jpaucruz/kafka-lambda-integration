import { SESClient } from "@aws-sdk/client-ses";

const REGION = "eu-west-3";
const sesClient = new SESClient({ region: REGION });

export { sesClient };
