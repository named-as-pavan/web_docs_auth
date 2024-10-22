import SibApiV3Sdk from 'sib-api-v3-sdk';
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESSFUL_TEMPLATE,
  WELCOME_EMAIL,
} from "./emailTemplates.js";





// Initialize Brevo API client with your API Key
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = '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'; // Your API Key

const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendVerificationEmail = async (email, verificationToken) => {
  const emailData = {
    sender: { email: "pavan111222111@gmail.com", name: "Pavan" },
    to: [{ email }],
    subject: "Verify your Email",
    htmlContent: VERIFICATION_EMAIL_TEMPLATE.replace("{Insert OTP}", verificationToken),
  };

  try {
    const response = await transactionalEmailApi.sendTransacEmail(emailData);
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error(`Error sending verification email: `, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const emailData = {
    sender: { email: "pavan111222111@gmail.com", name: "Pavan" },
    to: [{ email }],
    subject:"Welcome to Web_docs",
    htmlContent: WELCOME_EMAIL.replace("[User's Name]", name),
// Replace with your actual template ID from Brevo
  };

  try {
    const response = await transactionalEmailApi.sendTransacEmail(emailData);
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email: ${error}`);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const emailData = {
    sender: { email: "pavan111222111@gmail.com", name: "Pavan" },
    to: [{ email }],
    subject: "Reset your password",
    htmlContent: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
  };

  try {
    const response = await transactionalEmailApi.sendTransacEmail(emailData);
    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error('Error sending reset email', error);
    throw new Error(`Error sending reset email: ${error}`);
  }
};

export const sendResetSuccessfulEmail = async (name) => {
  const emailData = {
    sender: { email: "pavan111222111@gmail.com", name: "Pavan" },
    to: [{ email }],
    subject: "Password Reset",
    htmlContent: PASSWORD_RESET_SUCCESSFUL_TEMPLATE.replace("[User's Name]", name),
  };

  try {
    const response = await transactionalEmailApi.sendTransacEmail(emailData);
    console.log("Reset successful email sent successfully", response);
  } catch (error) {
    console.error('Error sending reset successful email', error);
    throw new Error(`Error sending reset successful email: ${error}`);
  }
};
