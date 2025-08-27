# Email Marketing Dashboard Setup

## Prerequisites

1. **Resend Account**: Sign up at [resend.com](https://resend.com)
2. **Verified Domain**: Add and verify a domain in your Resend account

## Setup Instructions

### 1. Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and sign up/login
2. Navigate to API Keys section
3. Create a new API key
4. Copy the API key (starts with `re_`)

### 2. Configure Environment Variables

1. Create a `.env.local` file in your project root:

```bash
RESEND_API_KEY=re_your_actual_api_key_here
```

### 3. Update Email Configuration

1. Open `src/app/api/send-email/route.ts`
2. Update the `from` email address to use your verified domain:

```typescript
from: 'Your Name <noreply@yourdomain.com>', // Replace with your verified domain
```

### 4. Test the Setup

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/admin`
3. Upload a CSV file with email contacts
4. Customize the email template
5. Test sending individual emails or bulk emails

## Features

- ✅ CSV file upload and parsing
- ✅ Individual email sending with personalized templates
- ✅ Bulk email sending to all valid contacts
- ✅ Email template customization with placeholders
- ✅ Real-time sending status and feedback
- ✅ Email validation and error handling

## Template Variables

Use these placeholders in your email templates:

- `{{name}}` - Contact's name (falls back to "there" if not available)
- `{{company}}` - Contact's company (falls back to "your company" if not available)
- `{{email}}` - Contact's email address

## CSV Format

Your CSV file should have headers and include at least an `email` column. Additional columns like `name`, `company`, `status` are optional but will be used for personalization.

Example:

```csv
email,name,company,status
john.doe@example.com,John Doe,Tech Corp,Active
jane.smith@example.com,Jane Smith,Design Studio,Active
```

## Security Notes

- Never commit your `.env.local` file to version control
- Use environment variables for all sensitive data
- Consider implementing rate limiting for production use
- Add proper authentication for admin access in production
