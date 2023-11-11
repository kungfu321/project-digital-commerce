import axios from 'axios';

const apiKey = process.env.MAILERSEND_API_KEY as string;
const FROM_EMAIL = process.env.FROM_EMAIL as string;

export async function senEmail(props: { email: string, subject: string, text?: string, html?: string }) {
  const { email, subject, text, html } = props;

  const mailerSendEndpoint = 'https://api.mailersend.com/v1/email';
  const emailData = {
    from: {
      email: FROM_EMAIL,
      name: FROM_EMAIL
    },
    to: [
      {
        email,
        name: email
      }
    ],
    subject,
    text,
    html,
  };


  return await axios.post(mailerSendEndpoint, emailData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
  });
}
