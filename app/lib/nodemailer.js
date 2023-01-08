import { createTransport, getTestMessageUrl } from "nodemailer";

const transporter = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeANiceEmail(text) {
  return `
    <div className="email" style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello There!</h2>
      <p>${text}</p>
      <p>😘, DropshipJS</p>
    </div>
  `;
}

export async function sendPasswordReset(resetToken, to) {
  // email the user a token
  const info = await transporter.sendMail({
    to,
    from: "test@example.com",
    subject: "Your password reset token!",
    html: makeANiceEmail(`Your Password Reset Token is here!
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to reset</a>
    `),
  });
  if (process.env.MAIL_USER.includes("ethereal.email")) {
    console.log(`💌 Message Sent!`);
  }
}

export async function sendEmail(text, to) {
  // email
  const textEmail = await transporter.sendMail({
    to,
    from: "test@example.com",
    subject: "Email to you",
    html: makeANiceEmail(`Text: ${text}`),
  });
  if (process.env.MAIL_USER.includes("ethereal.email")) {
    console.log(
      `💌 Message Sent! - Preview it at ${getTestMessageUrl(textEmail)}`
    );
  }
}
