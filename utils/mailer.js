import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = (recipientEmail, username, otp = null, type = "signup") => {
  if (!recipientEmail) {
    console.error("Recipient email is undefined");
    throw new Error("Recipient email is required");
  }

  const mailOptions = {
    from: process.env.MAIL_FORM,
    to: recipientEmail,
    subject:
      type === "signup"
        ? "Welcome! You Have Successfully Signed Up!"
        : "Password Reset Request",
    html:
      type === "signup"
        ? `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto;">
          <div style="text-align: center; padding: 10px 0; background-color: #f9f9f9; border-radius: 10px;">
            <h1 style="color: #4CAF50; font-size: 24px;">Welcome, ${username}!</h1>
            <p style="font-size: 18px; color: #555;">Thank you for signing up and logging in to our service.</p>
          </div>
        </div>`
        : `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto;">
          <div style="text-align: center; padding: 10px 0; background-color: #f9f9f9; border-radius: 10px;">
            <h1 style="color: #4CAF50; font-size: 24px;">Password Reset Request</h1>
            <p style="font-size: 18px; color: #555;">Hello, ${username}</p>
            <p style="font-size: 20px; font-weight: bold; color: #333;">${otp}</p>
          </div>
        </div>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};

export default sendMail;
