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
          const {
                    name,
                    email,
                    phone,
                    date,
                    time,
                    description,
                    placement,
                    size,
                    colorPreference,
                    references,
          } = req.body;

        if (!name || !email || !phone || !date || !time || !description) {
                  return res.status(400).json({ error: 'Missing required fields' });
        }

        const extraRow = (label, value) =>
                  value
              ? `<tr><td style="padding: 10px; border-bottom: 1px solid #3a332b;"><strong>${label}:</strong></td><td style="padding: 10px; border-bottom: 1px solid #3a332b;">${value}</td></tr>`
                    : '';

        const gmailUser = process.env.GMAIL_USER;

        // ---- Send confirmation email to client ----
        const clientEmailHtml = `
              <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; background: #FBF8F2;">
                      <div style="background: #120F0D; padding: 28px 30px; color: #FBF8F2; border-bottom: 3px solid #B08D57;">
                                <h1 style="margin: 0; color: #DDC9A3; font-size: 22px; letter-spacing: 0.04em;">tonywulfman.art</h1>
                                          <p style="margin: 6px 0 0 0; font-size: 13px; color: #C9BEB0;">Old Town Tatu &mdash; Chicago</p>
                                                  </div>

                                                          <div style="padding: 32px 30px;">
                                                                    <h2 style="color: #120F0D; font-weight: 600;">Your request has been received</h2>
                                                                              <p style="color: #4a4038; line-height: 1.6;">Hi ${name},</p>
                                                                                        <p style="color: #4a4038; line-height: 1.6;">Thanks for reaching out to Tony. He personally reviews every request and will follow up within 24-48 hours to confirm details and next steps.</p>

                                                                                                  <div style="background: #F3EDE0; padding: 22px; border-left: 4px solid #B08D57; margin: 24px 0;">
                                                                                                              <h3 style="margin-top: 0; color: #120F0D;">What you submitted</h3>
                                                                                                                          <p style="margin: 6px 0;"><strong>Preferred date:</strong> ${new Date(date).toLocaleDateString()}</p>
                                                                                                                                      <p style="margin: 6px 0;"><strong>Preferred time:</strong> ${time}</p>
                                                                                                                                                  <p style="margin: 6px 0;"><strong>Phone:</strong> ${phone}</p>
                                                                                                                                                              ${placement ? `<p style="margin: 6px 0;"><strong>Placement:</strong> ${placement}</p>` : ''}
                                                                                                                                                                          ${size ? `<p style="margin: 6px 0;"><strong>Size:</strong> ${size}</p>` : ''}
                                                                                                                                                                                      <p style="margin: 12px 0 0 0;"><strong>Tattoo idea:</strong><br/>${description}</p>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                
                                                                                                                                                                                                          <p style="color: #4a4038; line-height: 1.6;">If anything changes on your end, just reply to this email or reach out on Instagram <a href="https://www.instagram.com/tonywulfman.art/" style="color: #8A2C30;">@tonywulfman.art</a>.</p>
                                                                                                                                                                                                                    <p style="margin-top: 30px; color: #8a8072; font-size: 12px;">
                                                                                                                                                                                                                                Questions? Reply to this email or contact ${gmailUser}
                                                                                                                                                                                                                                          </p>
                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                            `;

        await transporter.sendMail({
                  from: gmailUser,
                  to: email,
                  subject: 'tonywulfman.art - Your appointment request was received',
                  html: clientEmailHtml,
        });

        // ---- Send notification email to Tony ----
        const tonyEmailHtml = `
              <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; background: #FBF8F2;">
                      <div style="background: #B08D57; padding: 22px 30px; color: #120F0D;">
                                <h1 style="margin: 0; font-size: 20px;">New appointment request</h1>
                                        </div>

                                                <div style="padding: 26px 30px;">
                                                          <h2 style="color: #120F0D;">Client details</h2>
                                                                    <table style="width: 100%; border-collapse: collapse; color: #4a4038;">
                                                                                <tr>
                                                                                              <td style="padding: 10px; border-bottom: 1px solid #3a332b;"><strong>Name:</strong></td>
                                                                                                            <td style="padding: 10px; border-bottom: 1px solid #3a332b;">${name}</td>
                                                                                                                        </tr>
                                                                                                                                    <tr>
                                                                                                                                                  <td style="padding: 10px; border-bottom: 1px solid #3a332b;"><strong>Email:</strong></td>
                                                                                                                                                                <td style="padding: 10px; border-bottom: 1px solid #3a332b;"><a href="mailto:${email}">${email}</a></td>
                                                                                                                                                                            </tr>
                                                                                                                                                                                        <tr>
                                                                                                                                                                                                      <td style="padding: 10px; border-bottom: 1px solid #3a332b;"><strong>Phone:</strong></td>
                                                                                                                                                                                                                    <td style="padding: 10px; border-bottom: 1px solid #3a332b;">${phone}</td>
                                                                                                                                                                                                                                </tr>
                                                                                                                                                                                                                                            <tr>
                                                                                                                                                                                                                                                          <td style="padding: 10px; border-bottom: 1px solid #3a332b;"><strong>Requested date:</strong></td>
                                                                                                                                                                                                                                                                        <td style="padding: 10px; border-bottom: 1px solid #3a332b;">${new Date(date).toLocaleDateString()}</td>
                                                                                                                                                                                                                                                                                    </tr>
                                                                                                                                                                                                                                                                                                <tr>
                                                                                                                                                                                                                                                                                                              <td style="padding: 10px; border-bottom: 1px solid #3a332b;"><strong>Requested time:</strong></td>
                                                                                                                                                                                                                                                                                                                            <td style="padding: 10px; border-bottom: 1px solid #3a332b;">${time}</td>
                                                                                                                                                                                                                                                                                                                                        </tr>
                                                                                                                                                                                                                                                                                                                                                    ${extraRow('Placement', placement)}
                                                                                                                                                                                                                                                                                                                                                                ${extraRow('Size', size)}
                                                                                                                                                                                                                                                                                                                                                                            ${extraRow('Color preference', colorPreference)}
                                                                                                                                                                                                                                                                                                                                                                                        ${extraRow('References provided', references)}
                                                                                                                                                                                                                                                                                                                                                                                                  </table>
                                                                                                                                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                                                                                                                                            <h3 style="margin-top: 22px; color: #120F0D;">Tattoo description</h3>
                                                                                                                                                                                                                                                                                                                                                                                                                      <p style="background: #F3EDE0; padding: 16px; border-left: 4px solid #B08D57; color: #4a4038;">${description}</p>
                                                                                                                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                        `;

        await transporter.sendMail({
                  from: gmailUser,
                  to: gmailUser,
                  subject: `New request - ${name} - ${new Date(date).toLocaleDateString()} @ ${time}`,
                  html: tonyEmailHtml,
        });

        // ---- Create Google Calendar event (optional) ----
        if (calendarApi && process.env.GOOGLE_REFRESH_TOKEN) {
                  try {
                              const [hours, minutes] = time.split(':');
                              const eventDate = new Date(date);
                              eventDate.setHours(parseInt(hours), parseInt(minutes));

                    const event = {
                                  summary: `Consultation: ${name}`,
                                  description: `Tattoo idea: ${description}\n\nClient: ${name}\nPhone: ${phone}\nEmail: ${email}`,
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
