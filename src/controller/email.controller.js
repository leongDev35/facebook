import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
const GOOGLE_MAILER_CLIENT_ID =
  '991351297491-nvc4frjhcq7873thseuk7b2lpr0fnh79.apps.googleusercontent.com';
const GOOGLE_MAILER_CLIENT_SECRET = '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';
const GOOGLE_MAILER_REFRESH_TOKEN =
  '1//0483hlDdWmWIdCgYIARAAGAQSNwF-L9Irceh2PlLb8YqNU-N6goxAIaSg8OAnYR-qZaZlx94Dz4QYOxuWFw1ma7Z34zql2sf32eY';
const ADMIN_EMAIL_ADDRESS = 'mach0jc0d0n14@gmail.com';

// Khởi tạo OAuth2Client với Client ID và Client Secret
const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
);
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
});
 export async function sentEmail(email, subject, content) {
    try {
      if (!email || !subject || !content)
        throw new Error('Please provide email, subject and content!');
      /**
       * Lấy AccessToken từ RefreshToken (bởi vì Access Token cứ một khoảng thời gian ngắn sẽ bị hết hạn)
       * Vì vậy mỗi lần sử dụng Access Token, chúng ta sẽ generate ra một thằng mới là chắc chắn nhất.
       */
      const myAccessTokenObject = await myOAuth2Client.getAccessToken();
      // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
      const myAccessToken = myAccessTokenObject?.token;

      // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: ADMIN_EMAIL_ADDRESS,
          clientId: GOOGLE_MAILER_CLIENT_ID,
          clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
          refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
          accessToken: myAccessToken
        }
      });

      // mailOption là những thông tin gửi từ phía client lên thông qua API
      const mailOptions = {
        to: email, // Gửi đến ai?
        subject: subject, // Tiêu đề email
        html: `<h3>${content}</h3>` // Nội dung email
      };

      // Gọi hành động gửi email
      await transport.sendMail(mailOptions);
      console.log('Sent Mail Successfully');
    } catch (error) {
      console.log(error);
    }
  }

