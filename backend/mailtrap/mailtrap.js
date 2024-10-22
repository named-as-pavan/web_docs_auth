import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from "dotenv";

dotenv.config();

// Initialize Brevo API client with your API Key
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; // Store your API Key in .env file

// Create the transactional email API instance
const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// Sender information
export const sender = {
  email: "pavan111222111@gmail.com",  // Your sender email
  name: "Pavan",                       // Your sender name
};

// Function to send email
export const sendEmail = async (to, subject, htmlContent) => {
  const emailData = {
    sender: sender,
    to: [{ email: to }], // Recipient information
    subject: subject,    // Email subject
    htmlContent: htmlContent, // HTML content for the email
  };

  try {
    const response = await transactionalEmailApi.sendTransacEmail(emailData);
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Example usage
// Make sure to call this function when you want to send an email
// sendEmail('user_email@example.com', 'Email Verification', '<p>Click <a href="https://example.com/verify?token=123">here</a> to verify your email.</p>');
