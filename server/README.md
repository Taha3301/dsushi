# DSushi Email Service

This is the backend email service for the DSushi contact form.

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Variables
Create a `.env` file in the server directory:
```env
EMAIL_PASSWORD=your_gmail_app_password
PORT=3001
```

### 3. Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in your `.env` file

### 4. Run the Service
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### POST /api/send-contact-email
Sends contact form emails to d.sushiftw@gmail.com

**Request Body:**
```json
{
  "from_name": "John Doe",
  "from_email": "john@example.com",
  "phone": "+216 12345678",
  "subject": "Question about menu",
  "message": "Hello, I have a question...",
  "timestamp": "15/10/2025 à 22:35"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

### GET /api/health
Health check endpoint

## Features

- ✅ Sends contact form emails to d.sushiftw@gmail.com
- ✅ Sends auto-reply confirmation to customer
- ✅ HTML formatted emails
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled for frontend integration

## Email Templates

The service sends two emails:
1. **Contact Email**: Formatted email to d.sushiftw@gmail.com with all form details
2. **Auto-Reply**: Confirmation email to the customer

Both emails are HTML formatted with professional styling.
