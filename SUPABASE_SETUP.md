# Supabase Database Setup Guide

## Overview

This guide will help you set up Supabase to track email sending records and manage email templates for your Email Marketing System.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `nurture-hub-email-system`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in your project root
2. Add your Supabase credentials:

```bash
# Resend API Key
RESEND_API_KEY=re_your_actual_resend_api_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire content from `supabase-schema.sql`
4. Click "Run" to execute the SQL

This will create:

- `email_records` table - tracks all sent emails
- `email_templates` table - stores email templates
- Default email templates (Welcome, Value Proposition, Follow-up)

## Step 5: Verify Setup

1. Go to **Table Editor** in Supabase
2. You should see two tables: `email_records` and `email_templates`
3. Check that the default templates are loaded in `email_templates`

## Database Schema

### email_records Table

Tracks every email sent through the system:

| Column            | Type         | Description                     |
| ----------------- | ------------ | ------------------------------- |
| id                | SERIAL       | Primary key                     |
| recipient_email   | VARCHAR(255) | Email address of recipient      |
| recipient_name    | VARCHAR(255) | Name of recipient (optional)    |
| recipient_company | VARCHAR(255) | Company of recipient (optional) |
| template_name     | VARCHAR(255) | Name of template used           |
| template_id       | VARCHAR(100) | ID of template used             |
| subject           | TEXT         | Email subject line              |
| sent_at           | TIMESTAMP    | When email was sent             |
| status            | VARCHAR(20)  | 'sent' or 'failed'              |
| error_message     | TEXT         | Error details if failed         |
| campaign_name     | VARCHAR(255) | Campaign name                   |
| created_at        | TIMESTAMP    | Record creation time            |

### email_templates Table

Stores email templates:

| Column      | Type         | Description                |
| ----------- | ------------ | -------------------------- |
| id          | VARCHAR(100) | Template ID                |
| name        | VARCHAR(255) | Template name              |
| subject     | TEXT         | Email subject              |
| html        | TEXT         | HTML content               |
| text        | TEXT         | Plain text content         |
| description | TEXT         | Template description       |
| category    | VARCHAR(100) | Template category          |
| is_active   | BOOLEAN      | Whether template is active |
| created_at  | TIMESTAMP    | Creation time              |

## Features Enabled

### 1. Email Tracking

- Every email sent is recorded in the database
- Track success/failure rates
- Monitor campaign performance
- View sending history

### 2. Template Management

- Pre-built templates stored in database
- Template categories (Onboarding, Sales, Nurture)
- Easy template selection and customization

### 3. Campaign Analytics

- Track emails by campaign name
- Monitor template performance
- View recipient engagement

### 4. Error Handling

- Failed emails are recorded with error messages
- Helps identify delivery issues
- Track success rates

## API Endpoints

### Send Email

- **POST** `/api/send-email`
- Records email in database automatically
- Returns success/failure status

### Get Email Records

- **GET** `/api/email-records`
- Query parameters:
  - `limit`: Number of records (default: 50)
  - `offset`: Pagination offset (default: 0)
  - `status`: Filter by status ('sent' or 'failed')
  - `template_id`: Filter by template

## Testing

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/admin`
3. Upload a CSV file with contacts
4. Send test emails
5. Check the Analytics tab to see records
6. Verify data in Supabase dashboard

## Troubleshooting

### Common Issues

1. **"Cannot connect to Supabase"**

   - Check your environment variables
   - Verify Supabase URL and API key
   - Ensure internet connection

2. **"Table doesn't exist"**

   - Run the SQL schema again
   - Check table names match exactly

3. **"Permission denied"**

   - Check Row Level Security policies
   - Verify API key permissions

4. **"Email not recorded"**
   - Check browser console for errors
   - Verify API endpoint is working
   - Check Supabase logs

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Consider implementing proper authentication
- Review RLS policies for production use

## Next Steps

1. **Customize Templates**: Modify default templates in database
2. **Add Authentication**: Implement user login system
3. **Advanced Analytics**: Create custom dashboards
4. **Automation**: Set up scheduled email campaigns
5. **Integrations**: Connect with CRM systems
