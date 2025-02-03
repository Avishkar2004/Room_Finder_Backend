import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendMail = async (
  recipientEmail,
  username,
  otp = null,
  type = "signup"
) => {
  if (!recipientEmail) {
    console.error("Recipient email is undefined");
    throw new Error("Recipient email is required");
  }

  const mailOptions = {
    from: process.env.EMAIL, // Ensure this matches the sender email in transporter
    to: recipientEmail,
    subject:
      type === "signup"
        ? "Welcome! You Have Successfully Signed Up!"
        : type === "reset"
        ? "Password Reset Request - OTP"
        : "Login Successful",
    html:
      type === "signup"
        ? `<div style="font-family: Arial, sans-serif; color: #333; padding: 30px; max-width: 700px; margin: auto; background-color: #f9f9f9; border-radius: 8px;">
  <div style="text-align: center; padding: 20px 0; background-color: #4CAF50; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; font-size: 32px; font-weight: bold;">Welcome, ${username}!</h1>
    <p style="font-size: 18px; color: #fff;">Thank you for signing up with us. We're excited to have you as part of our community!</p>
  </div>

  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <h2 style="color: #333; font-size: 24px;">You're all set!</h2>
    <p style="font-size: 16px; color: #555;">
      Congratulations! You've successfully created an account with us. You can now start exploring all the features we offer. 
      If you have any questions or need assistance, feel free to reach out to our support team. We're here to help!
    </p>
    <p style="font-size: 16px; color: #555;">
      You can log in to your account using the email and password you just registered with.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://your-website.com/login" style="background-color: #4CAF50; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 18px;">Log In</a>
    </div>

    <p style="font-size: 14px; color: #777; margin-top: 20px;">
      If you didn't create this account, please ignore this email or contact us immediately.
    </p>
  </div>
</div>
`
        : type === "reset"
        ? `<div style="font-family: Arial, sans-serif; color: #333; padding: 30px; max-width: 700px; margin: auto; background-color: #f9f9f9; border-radius: 8px;">
  <div style="text-align: center; padding: 20px 0; background-color: #FF6F61; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; font-size: 32px; font-weight: bold;">Password Reset Request</h1>
    <p style="font-size: 18px; color: #fff;">Hello, ${username}</p>
  </div>

  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <h2 style="color: #333; font-size: 24px;">We received a request to reset your password</h2>
    <p style="font-size: 16px; color: #555;">
      Please use the following One-Time Password (OTP) to reset your password. The OTP is valid for the next 15 minutes.
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <h2 style="font-size: 36px; color: #4CAF50; font-weight: bold;">${otp}</h2>
    </div>

    <p style="font-size: 16px; color: #555;">
      If you didn't request a password reset, please ignore this message or reach out to us immediately.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://your-website.com/reset-password" style="background-color: #FF6F61; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 18px;">Reset Your Password</a>
    </div>

    <p style="font-size: 14px; color: #777; margin-top: 20px;">
      Please note that if you don't reset your password within 15 minutes, the OTP will expire and you'll need to request a new one.
    </p>
  </div>
</div>
`
        : `<div style="font-family: Arial, sans-serif; color: #333; padding: 30px; max-width: 700px; margin: auto; background-color: #f9f9f9; border-radius: 8px;">
  <div style="text-align: center; padding: 20px 0; background-color: #007BFF; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; font-size: 32px; font-weight: bold;">Login Notification</h1>
    <p style="font-size: 18px; color: #fff;">Hello, ${username}</p>
  </div>

  <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
    <h2 style="color: #333; font-size: 24px;">Your recent login activity</h2>
    <p style="font-size: 16px; color: #555;">
      We wanted to let you know that a login was successfully completed using your account. 
      If this was you, no further action is required. However, if you didn’t log in, please reset your password immediately for your security.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://your-website.com/reset-password" style="background-color: #007BFF; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 18px;">Reset Your Password</a>
    </div>

    <p style="font-size: 14px; color: #777; margin-top: 20px;">
      For further assistance, feel free to reach out to our support team. We are here to help!
    </p>
  </div>
</div>
`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendMail;
