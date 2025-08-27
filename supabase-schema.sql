-- Create email_records table
CREATE TABLE email_records (
  id SERIAL PRIMARY KEY,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  recipient_company VARCHAR(255),
  template_name VARCHAR(255) NOT NULL,
  template_id VARCHAR(100) NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message TEXT,
  campaign_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_templates table
CREATE TABLE email_templates (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  text TEXT NOT NULL,
  description TEXT,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_email_records_recipient_email ON email_records(recipient_email);
CREATE INDEX idx_email_records_template_id ON email_records(template_id);
CREATE INDEX idx_email_records_status ON email_records(status);
CREATE INDEX idx_email_records_sent_at ON email_records(sent_at);
CREATE INDEX idx_email_records_campaign_name ON email_records(campaign_name);

-- Insert default templates
INSERT INTO email_templates (id, name, subject, html, text, description, category) VALUES
('welcome', 'Welcome & Introduction', 'Welcome to {{company}} - Let''s Connect!', 
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2563eb; margin-bottom: 20px;">Hello {{name}}!</h2>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
    I hope this email finds you well! I''m reaching out from <strong>{{company}}</strong> and wanted to personally welcome you to our community.
  </p>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
    We specialize in helping businesses like yours achieve their goals through innovative solutions and strategic partnerships.
  </p>
  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #1f2937; margin-bottom: 15px;">What we can offer:</h3>
    <ul style="color: #374151; line-height: 1.8;">
      <li>Strategic consulting and planning</li>
      <li>Custom solutions tailored to your needs</li>
      <li>Ongoing support and optimization</li>
      <li>Proven results and case studies</li>
    </ul>
  </div>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
    I''d love to schedule a quick 15-minute call to learn more about your business and see how we might be able to help you achieve your objectives.
  </p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="mailto:{{email}}?subject=Let''s Connect - {{company}}" 
       style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
      Schedule a Call
    </a>
  </div>
  <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
    Best regards,<br>
    The {{company}} Team<br>
    <a href="mailto:{{email}}" style="color: #2563eb;">{{email}}</a>
  </p>
</div>',
'Hello {{name}}!

I hope this email finds you well! I''m reaching out from {{company}} and wanted to personally welcome you to our community.

We specialize in helping businesses like yours achieve their goals through innovative solutions and strategic partnerships.

What we can offer:
• Strategic consulting and planning
• Custom solutions tailored to your needs
• Ongoing support and optimization
• Proven results and case studies

I''d love to schedule a quick 15-minute call to learn more about your business and see how we might be able to help you achieve your objectives.

Best regards,
The {{company}} Team
{{email}}',
'A warm welcome email to introduce yourself and your company', 'Onboarding'),

('value-proposition', 'Value Proposition', 'How {{company}} Can Transform Your Business',
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #059669; margin-bottom: 20px;">Hi {{name}},</h2>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
    I noticed you''re in the {{company}} space, and I wanted to share something that could be game-changing for your business.
  </p>
  <div style="border-left: 4px solid #059669; padding-left: 20px; margin: 20px 0;">
    <h3 style="color: #059669; margin-bottom: 10px;">The Challenge</h3>
    <p style="color: #374151; margin-bottom: 15px;">
      Most companies struggle with [specific pain point] which costs them time, money, and opportunities.
    </p>
  </div>
  <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #059669; margin-bottom: 15px;">Our Solution</h3>
    <p style="color: #374151; margin-bottom: 15px;">
      At {{company}}, we''ve developed a proven system that helps businesses:
    </p>
    <ul style="color: #374151; line-height: 1.8;">
      <li>Increase efficiency by 40%</li>
      <li>Reduce costs by 25%</li>
      <li>Improve customer satisfaction</li>
      <li>Scale operations seamlessly</li>
    </ul>
  </div>
  <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
    <p style="color: #92400e; font-weight: bold; margin: 0;">
      💡 Quick Question: What''s the biggest challenge you''re currently facing in your business?
    </p>
  </div>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
    I''d love to share a quick case study of how we helped a similar company achieve [specific result] in just [timeframe].
  </p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="mailto:{{email}}?subject=Case Study - {{company}}" 
       style="background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
      Share Case Study
    </a>
  </div>
  <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
    Looking forward to connecting!<br>
    Best regards,<br>
    {{company}} Team<br>
    <a href="mailto:{{email}}" style="color: #059669;">{{email}}</a>
  </p>
</div>',
'Hi {{name}},

I noticed you''re in the {{company}} space, and I wanted to share something that could be game-changing for your business.

The Challenge:
Most companies struggle with [specific pain point] which costs them time, money, and opportunities.

Our Solution:
At {{company}}, we''ve developed a proven system that helps businesses:
• Increase efficiency by 40%
• Reduce costs by 25%
• Improve customer satisfaction
• Scale operations seamlessly

💡 Quick Question: What''s the biggest challenge you''re currently facing in your business?

I''d love to share a quick case study of how we helped a similar company achieve [specific result] in just [timeframe].

Looking forward to connecting!
Best regards,
{{company}} Team
{{email}}',
'A focused email highlighting specific value propositions and benefits', 'Sales'),

('follow-up', 'Follow-up & Engagement', 'Quick Follow-up - {{company}}',
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #7c3aed; margin-bottom: 20px;">Hi {{name}},</h2>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
    I hope you''re having a great week! I wanted to follow up on our previous conversation about how {{company}} could help your business.
  </p>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
    I know you''re busy, so I''ll keep this brief. I wanted to share a quick insight that might be relevant to your current situation.
  </p>
  <div style="background-color: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #7c3aed; margin-bottom: 15px;">Recent Success Story</h3>
    <p style="color: #374151; margin-bottom: 15px;">
      We just helped a client in your industry achieve [specific result] in just [timeframe]. 
      The key was implementing [specific strategy/solution].
    </p>
    <p style="color: #374151; font-style: italic;">
      "The results exceeded our expectations. We saw immediate improvements in [metric]." - Client Name
    </p>
  </div>
  <div style="border: 2px dashed #d1d5db; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
    <h3 style="color: #374151; margin-bottom: 10px;">Free Resource</h3>
    <p style="color: #6b7280; margin-bottom: 15px;">
      I''ve put together a quick guide on [relevant topic] that I think you might find valuable.
    </p>
    <a href="#" style="color: #7c3aed; text-decoration: underline; font-weight: bold;">
      Download Free Guide →
    </a>
  </div>
  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
    Would you be interested in a quick 10-minute call to discuss how similar strategies could work for your business?
  </p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="mailto:{{email}}?subject=Quick Call - {{company}}" 
       style="background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
      Schedule Quick Call
    </a>
  </div>
  <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
    No pressure at all - just wanted to stay in touch and share something valuable!<br>
    Best regards,<br>
    {{company}} Team<br>
    <a href="mailto:{{email}}" style="color: #7c3aed;">{{email}}</a>
  </p>
</div>',
'Hi {{name}},

I hope you''re having a great week! I wanted to follow up on our previous conversation about how {{company}} could help your business.

I know you''re busy, so I''ll keep this brief. I wanted to share a quick insight that might be relevant to your current situation.

Recent Success Story:
We just helped a client in your industry achieve [specific result] in just [timeframe]. The key was implementing [specific strategy/solution].

"The results exceeded our expectations. We saw immediate improvements in [metric]." - Client Name

Free Resource:
I''ve put together a quick guide on [relevant topic] that I think you might find valuable.

Would you be interested in a quick 10-minute call to discuss how similar strategies could work for your business?

No pressure at all - just wanted to stay in touch and share something valuable!
Best regards,
{{company}} Team
{{email}}',
'A gentle follow-up email to re-engage and maintain connection', 'Nurture');

-- Enable Row Level Security (RLS)
ALTER TABLE email_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your authentication setup)
CREATE POLICY "Allow all operations on email_records" ON email_records FOR ALL USING (true);
CREATE POLICY "Allow all operations on email_templates" ON email_templates FOR ALL USING (true);
