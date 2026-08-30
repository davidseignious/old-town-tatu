// pages/api/book-appointment.js
// Vercel serverless function - handles appointment booking, emails, and calendar

import nodemailer from 'nodemailer';
import { google } from 'googleapis';

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
    },
});

// Google Calendar setup (optional)
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

let calendarApi = null;

if (process.env.GOOGLE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    calendarApi = google.calendar({ version: 'v3', auth: oauth2Client });
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
    }

  try {
        const { name, email, phone, date, time, description } = req.body;

      if (!name || !email || !phone || !date || !time || !description) {
              return res.status(400).json({ error: 'Missing required fields' });
      }

      const gmailUser = process.env.GMAIL_USER;

      const clientEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #0a0a0a; padding: 20px; color: #fff; border-bottom: 3px solid #d4a574;">
                              <h1 style="margin: 0; color: #d4a574;">OLD TOWN TATU</h1>
                                        <p style="margin: 5px 0 0 0; font-size: 14px;">Tony Wulfman</p>
                                                </div>
                                                        <div style="padding: 30px; background: #f5f5f5;">
                                                                  <h2>Appointment Request Received</h2>
                                                                            <p>Hi ${name},</p>
                                                                                      <p>Thanks for booking with Old Town Tatu! We've received your appointment request and Tony will confirm within 24 hours.</p>
                                                                                                <div style="background: #fff; padding: 20px; border-left: 4px solid #d4a574; margin: 20px 0;">
                                                                                                            <h3 style="margin-top: 0;">Your Details</h3>
                                                                                                                        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
                                                                                                                                    <p><strong>Time:</strong> ${time}</p>
                                                                                                                                                <p><strong>Phone:</strong> ${phone}</p>
                                                                                                                                                            <p><strong>Tattoo Description:</strong> ${description}</p>
                                                                                                                                                                      </div>
                                                                                                                                                                                <p>If Tony needs to reschedule or has questions, he'll reach out at this email or by phone.</p>
                                                                                                                                                                                          <p style="margin-top: 30px; color: #666; font-size: 12px;">
                                                                                                                                                                                                      Questions? Reply to this email or contact ${gmailUser}
                                                                                                                                                                                                                </p>
                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                  `;

      await transporter.sendMail({
              from: gmailUser,
              to: email,
              subject: 'Old Town Tatu - Appointment Request Received',
              html: clientEmailHtml,
      });

      const tonyEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #d4a574; padding: 20px; color: #000;">
                              <h1 style="margin: 0;">NEW APPOINTMENT REQUEST</h1>
                                      </div>
                                              <div style="padding: 20px; background: #f5f5f5;">
                                                        <h2>Client Details</h2>
                                                                  <table style="width: 100%; border-collapse: collapse;">
                                                                              <tr>
                                                                                            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
                                                                                                          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
                                                                                                                      </tr>
                                                                                                                                  <tr>
                                                                                                                                                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
                                                                                                                                                              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
                                                                                                                                                                          </tr>
                                                                                                                                                                                      <tr>
                                                                                                                                                                                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Phone:</strong></td>
                                                                                                                                                                                                                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${phone}</td>
                                                                                                                                                                                                                              </tr>
                                                                                                                                                                                                                                          <tr>
                                                                                                                                                                                                                                                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Requested Date:</strong></td>
                                                                                                                                                                                                                                                                      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${new Date(date).toLocaleDateString()}</td>
                                                                                                                                                                                                                                                                                  </tr>
                                                                                                                                                                                                                                                                                              <tr>
                                                                                                                                                                                                                                                                                                            <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Requested Time:</strong></td>
                                                                                                                                                                                                                                                                                                                          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${time}</td>
                                                                                                                                                                                                                                                                                                                                      </tr>
                                                                                                                                                                                                                                                                                                                                                </table>
                                                                                                                                                                                                                                                                                                                                                          <h3 style="margin-top: 20px;">Tattoo Description</h3>
                                                                                                                                                                                                                                                                                                                                                                    <p style="background: #fff; padding: 15px; border-left: 4px solid #d4a574;">${description}</p>
                                                                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                                                                                                                                      `;

      await transporter.sendMail({
              from: gmailUser,
              to: gmailUser,
              subject: `New Appointment Request - ${name} - ${new Date(date).toLocaleDateString()} @ ${time}`,
              html: tonyEmailHtml,
      });

      if (calendarApi && process.env.GOOGLE_REFRESH_TOKEN) {
              try {
                        const [hours, minutes] = time.split(':');
                        const eventDate = new Date(date);
                        eventDate.setHours(parseInt(hours), parseInt(minutes));

                const event = {
                            summary: `Consultation: ${name}`,
                            description: `Tattoo Description: ${description}\n\nClient: ${name}\nPhone: ${phone}\nEmail: ${email}`,
                            start: {
                                          dateTime: eventDate.toISOString(),
                                          timeZone: 'America/Chicago',
                            },
                            end: {
                                          dateTime: new Date(eventDate.getTime() + 60 * 60000).toISOString(),
                                          timeZone: 'America/Chicago',
                            },
                            attendees: [{ email: email }],
                };

                await calendarApi.events.insert({
                            calendarId: process.env.CALENDAR_ID || 'primary',
                            resource: event,
                            sendUpdates: 'all',
                });
              } catch (calError) {
                        console.log('Calendar event creation skipped:', calError.message);
              }
      }

      return res.status(200).json({
              success: true,
              message: 'Appointment request submitted'
      });

  } catch (error) {
        console.error('Booking error:', error);
        return res.status(500).json({
                error: 'Failed to process appointment',
                details: error.message
        });
  }
}
