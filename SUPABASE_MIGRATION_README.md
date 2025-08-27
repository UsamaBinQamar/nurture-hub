# Supabase Migration Setup

This project includes a proper Supabase migration file for setting up the email marketing system database.

## Migration File Location

The migration file is located at:
```
supabase/migrations/20241201000000_create_email_system.sql
```

## How to Apply the Migration

### Option 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref YOUR_PROJECT_ID
   ```

4. **Apply the migration**:
   ```bash
   supabase db push
   ```

### Option 2: Manual SQL Execution

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy the content from `supabase/migrations/20241201000000_create_email_system.sql`
4. Paste and execute the SQL

## What the Migration Creates

### Tables
- **`email_records`** - Tracks all sent emails with metadata
- **`email_templates`** - Stores email templates with categories

### Indexes
- Performance indexes for email lookup and filtering
- Optimized for common query patterns

### Default Templates
- **Welcome & Introduction** (Onboarding category)
- **Value Proposition** (Sales category)  
- **Follow-up & Engagement** (Nurture category)

### Security
- Row Level Security (RLS) enabled
- Public access policies (adjust for production)

## Migration Features

### ✅ Safe Execution
- Uses `IF NOT EXISTS` to prevent conflicts
- `ON CONFLICT DO NOTHING` for template inserts
- Idempotent operations

### ✅ Performance Optimized
- Proper indexes on frequently queried columns
- Optimized data types (BIGSERIAL, TIMESTAMPTZ)
- Efficient query patterns

### ✅ Production Ready
- Proper constraints and validations
- Comprehensive documentation comments
- Security policies included

## Verification

After running the migration, verify:

1. **Tables Created**:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('email_records', 'email_templates');
   ```

2. **Templates Loaded**:
   ```sql
   SELECT id, name, category FROM email_templates;
   ```

3. **Indexes Created**:
   ```sql
   SELECT indexname FROM pg_indexes 
   WHERE tablename IN ('email_records', 'email_templates');
   ```

## Local Development

For local development with Supabase:

1. **Start local Supabase**:
   ```bash
   supabase start
   ```

2. **Apply migrations locally**:
   ```bash
   supabase db reset
   ```

3. **Access local Studio**:
   - URL: http://localhost:54323
   - API: http://localhost:54321

## Environment Variables

Update your `.env.local` with local Supabase credentials:

```bash
# For local development
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key

# For production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

## Troubleshooting

### Migration Fails
- Check if tables already exist
- Verify Supabase connection
- Check SQL syntax in Supabase dashboard

### Templates Not Loading
- Verify the INSERT statements executed
- Check for conflicts with existing data
- Review error logs in Supabase dashboard

### Performance Issues
- Verify indexes were created
- Check query execution plans
- Monitor database performance metrics

## Next Steps

1. **Test the System**: Send test emails and verify records
2. **Customize Templates**: Modify default templates as needed
3. **Add Authentication**: Implement proper user management
4. **Monitor Performance**: Set up database monitoring
5. **Backup Strategy**: Configure automated backups

## Support

For issues with the migration:
1. Check Supabase documentation
2. Review migration logs
3. Test with local Supabase first
4. Contact Supabase support if needed
