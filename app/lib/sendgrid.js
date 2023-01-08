const { SENDGRID_API_KEY } = process.env;
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(SENDGRID_API_KEY);

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

export async function sendPasswordResetEmail(resetToken, to) {
  const msg = {
    to, // Change to your recipient
    from: "dropshipjs.com@gmail.com", // Change to your verified sender
    // subject: "Password Reset",
    // text: "and easy to do anywhere, even with Node.js",
    // html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    template_id: "d-79d77c84fdf14b95b5c8a219dbed2875",
    personalizations: [
      {
        to: { email: to },
        dynamic_template_data: {
          // subject: "New Post: " + poster.username + " just posted something",
          // recipient_name: recipients[i].username,
          // poster_name: poster.username,
          // group_name: group.name,
          // post_text: newPost.post.body,
          // button_url: process.env.VUE_HOME_URL,
          reset_link: process.env.FRONTEND_URL + "/reset?token=" + resetToken,
        },
      },
    ],
  };
  const info = await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function sendOrderDetailsEmail(user, order) {
  //console.log(order, user);
  const msg = {
    to: user.email, // Change to your recipient
    from: "dropshipjs.com@gmail.com", // Change to your verified sender
    template_id: "d-c0e1377087144bf4a8463ecdcaf5835e",
    personalizations: [
      {
        to: { email: user.email },
        dynamic_template_data: {
          order,
          user,
          button_url: process.env.FRONTEND_URL,
        },
      },
    ],
  };
  const info = await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}
