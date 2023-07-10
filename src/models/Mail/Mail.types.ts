import { UserProps } from "../User/User.types";

type MailListProps = {
  name: string;
  email: string;
};

export interface MailProps {
  from: string;
  fromName: string;
  to: string;
  toList: MailListProps[];
  toName: string;
  subject: string;
  text: string;
  html: string;
  setName: string;
  user: UserProps;
}
