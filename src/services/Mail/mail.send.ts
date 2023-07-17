import SES from "aws-sdk/clients/ses";
import logger from "../../utils/logger";
import { MailProps } from "../../models/Mail/Mail.types";

const SESClient = new SES({
  region: "us-east-1",
});

type MessageBodyProps = {
  Text: {
    Data: string;
    Charset?: string;
  };
  Html: {
    Data: string;
    Charset?: string;
  };
};

export const send = async (mail: MailProps, setName = "default") => {
  const messageBody = {} as MessageBodyProps;

  if (mail.text) messageBody.Text = { Data: mail.text };

  if (mail.html) messageBody.Html = { Data: mail.html };
  try {
    await SESClient.sendEmail({
      Source: `${mail.fromName || mail.from}<${mail.from}>`,
      Destination: {
        ToAddresses: [`${mail.toName || mail.to}<${mail.to}>`],
      },
      Message: {
        Subject: {
          Data: mail.subject || "",
        },
        Body: messageBody,
      },
      ConfigurationSetName: setName,
    }).promise();
  } catch (error) {
    console.log(error);
    logger.error("Error on Amazon SES sender");
  }
};
