"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { EmailRecord } from "@/lib/supabase";
import Papa from "papaparse";
import { useEffect, useState } from "react";

interface EmailContact {
  email: string;
  name?: string;
  company?: string;
  status?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text: string;
  description: string;
  category: string;
}

interface EditingCell {
  rowIndex: number;
  columnKey: string;
}

// Pre-built email templates
const emailTemplates: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Welcome & Introduction",
    subject: "Welcome to {{company}} - Let's Connect!",
    description: "A warm welcome email to introduce yourself and your company",
    category: "Onboarding",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb; margin-bottom: 20px;">Hello {{name}}!</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          I hope this email finds you well! I'm reaching out from <strong>{{company}}</strong> and wanted to personally welcome you to our community.
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
          I'd love to schedule a quick 15-minute call to learn more about your business and see how we might be able to help you achieve your objectives.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:{{email}}?subject=Let's Connect - {{company}}" 
             style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Schedule a Call
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          Best regards,<br>
          The {{company}} Team<br>
          <a href="mailto:{{email}}" style="color: #2563eb;">{{email}}</a>
        </p>
      </div>
    `,
    text: `
Hello {{name}}!

I hope this email finds you well! I'm reaching out from {{company}} and wanted to personally welcome you to our community.

We specialize in helping businesses like yours achieve their goals through innovative solutions and strategic partnerships.

What we can offer:
• Strategic consulting and planning
• Custom solutions tailored to your needs
• Ongoing support and optimization
• Proven results and case studies

I'd love to schedule a quick 15-minute call to learn more about your business and see how we might be able to help you achieve your objectives.

Best regards,
The {{company}} Team
{{email}}
    `,
  },
  {
    id: "value-proposition",
    name: "Value Proposition",
    subject: "How {{company}} Can Transform Your Business",
    description:
      "A focused email highlighting specific value propositions and benefits",
    category: "Sales",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #059669; margin-bottom: 20px;">Hi {{name}},</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          I noticed you're in the {{company}} space, and I wanted to share something that could be game-changing for your business.
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
            At {{company}}, we've developed a proven system that helps businesses:
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
            💡 Quick Question: What's the biggest challenge you're currently facing in your business?
          </p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          I'd love to share a quick case study of how we helped a similar company achieve [specific result] in just [timeframe].
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
      </div>
    `,
    text: `
Hi {{name}},

I noticed you're in the {{company}} space, and I wanted to share something that could be game-changing for your business.

The Challenge:
Most companies struggle with [specific pain point] which costs them time, money, and opportunities.

Our Solution:
At {{company}}, we've developed a proven system that helps businesses:
• Increase efficiency by 40%
• Reduce costs by 25%
• Improve customer satisfaction
• Scale operations seamlessly

💡 Quick Question: What's the biggest challenge you're currently facing in your business?

I'd love to share a quick case study of how we helped a similar company achieve [specific result] in just [timeframe].

Looking forward to connecting!
Best regards,
{{company}} Team
{{email}}
    `,
  },
  {
    id: "follow-up",
    name: "Follow-up & Engagement",
    subject: "Quick Follow-up - {{company}}",
    description:
      "A gentle follow-up email to re-engage and maintain connection",
    category: "Nurture",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #7c3aed; margin-bottom: 20px;">Hi {{name}},</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          I hope you're having a great week! I wanted to follow up on our previous conversation about how {{company}} could help your business.
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          I know you're busy, so I'll keep this brief. I wanted to share a quick insight that might be relevant to your current situation.
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
            I've put together a quick guide on [relevant topic] that I think you might find valuable.
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
      </div>
    `,
    text: `
Hi {{name}},

I hope you're having a great week! I wanted to follow up on our previous conversation about how {{company}} could help your business.

I know you're busy, so I'll keep this brief. I wanted to share a quick insight that might be relevant to your current situation.

Recent Success Story:
We just helped a client in your industry achieve [specific result] in just [timeframe]. The key was implementing [specific strategy/solution].

"The results exceeded our expectations. We saw immediate improvements in [metric]." - Client Name

Free Resource:
I've put together a quick guide on [relevant topic] that I think you might find valuable.

Would you be interested in a quick 10-minute call to discuss how similar strategies could work for your business?

No pressure at all - just wanted to stay in touch and share something valuable!
Best regards,
{{company}} Team
{{email}}
    `,
  },
];

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<EmailContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendingEmails, setSendingEmails] = useState<Set<number>>(new Set());
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("welcome");
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate>(
    emailTemplates[0]
  );
  const [campaignName, setCampaignName] = useState<string>("");
  const [emailRecords, setEmailRecords] = useState<EmailRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  // Load email records on component mount
  useEffect(() => {
    loadEmailRecords();
  }, []);

  const loadEmailRecords = async () => {
    setLoadingRecords(true);
    try {
      const response = await fetch("/api/email-records?limit=100");
      const result = await response.json();
      if (result.data) {
        setEmailRecords(result.data);
      }
    } catch (error) {
      console.error("Error loading email records:", error);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsLoading(false);
        if (results.errors.length > 0) {
          setError("Error parsing CSV file. Please check the file format.");
          return;
        }
        // Filter out empty rows and ensure all contacts have at least an email field
        const validContacts = (results.data as EmailContact[]).filter(
          (contact) =>
            contact && Object.keys(contact).length > 0 && contact.email
        );
        setContacts(validContacts);
      },
      error: (error) => {
        setIsLoading(false);
        setError("Error reading file: " + error.message);
      },
    });
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      {
        email: "john.doe@example.com",
        name: "John Doe",
        company: "Tech Corp",
        status: "Active",
      },
      {
        email: "jane.smith@example.com",
        name: "Jane Smith",
        company: "Design Studio",
        status: "Active",
      },
      {
        email: "mike.johnson@example.com",
        name: "Mike Johnson",
        company: "Marketing Inc",
        status: "Inactive",
      },
    ];

    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_contacts.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const startEditing = (rowIndex: number, columnKey: string, value: string) => {
    setEditingCell({ rowIndex, columnKey });
    setEditValue(value || "");
  };

  const saveEdit = () => {
    if (!editingCell) return;

    setContacts((prevContacts) => {
      const newContacts = [...prevContacts];
      newContacts[editingCell.rowIndex] = {
        ...newContacts[editingCell.rowIndex],
        [editingCell.columnKey]: editValue,
      };
      return newContacts;
    });

    setEditingCell(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find((t) => t.id === templateId);
    if (template) {
      setEmailTemplate(template);
    }
  };

  const sendEmail = async (contact: EmailContact, index: number) => {
    if (!contact.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      alert("Invalid email address");
      return;
    }

    setSendingEmails((prev) => new Set(prev).add(index));

    try {
      // Replace template variables
      const personalizedHtml = emailTemplate.html
        .replace(/\{\{name\}\}/g, contact.name || "there")
        .replace(/\{\{company\}\}/g, contact.company || "your company")
        .replace(/\{\{email\}\}/g, contact.email);

      const personalizedText = emailTemplate.text
        .replace(/\{\{name\}\}/g, contact.name || "there")
        .replace(/\{\{company\}\}/g, contact.company || "your company")
        .replace(/\{\{email\}\}/g, contact.email);

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: contact.email,
          subject: emailTemplate.subject,
          html: personalizedHtml,
          text: personalizedText,
          templateName: emailTemplate.name,
          templateId: emailTemplate.id,
          recipientName: contact.name,
          recipientCompany: contact.company,
          campaignName: campaignName || "Default Campaign",
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Email sent successfully to ${contact.email}`);
        // Reload email records to show the new record
        loadEmailRecords();
      } else {
        alert(`Failed to send email to ${contact.email}: ${result.error}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert(`Error sending email to ${contact.email}`);
    } finally {
      setSendingEmails((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const sendBulkEmails = async () => {
    const validContacts = contacts.filter(
      (contact) =>
        contact.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
    );

    if (validContacts.length === 0) {
      alert("No valid email addresses found");
      return;
    }

    if (!confirm(`Send emails to ${validContacts.length} contacts?`)) {
      return;
    }

    for (let i = 0; i < validContacts.length; i++) {
      const contact = validContacts[i];
      await sendEmail(contact, contacts.indexOf(contact));
      // Add a small delay between emails to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const downloadUpdatedCSV = () => {
    if (contacts.length === 0) {
      alert("No contacts to download");
      return;
    }

    const csv = Papa.unparse(contacts);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "updated_contacts.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getEmailStats = () => {
    const totalSent = emailRecords.filter((r) => r.status === "sent").length;
    const totalFailed = emailRecords.filter(
      (r) => r.status === "failed"
    ).length;
    const successRate =
      totalSent + totalFailed > 0
        ? ((totalSent / (totalSent + totalFailed)) * 100).toFixed(1)
        : "0";

    return { totalSent, totalFailed, successRate };
  };

  const stats = getEmailStats();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Email Marketing Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Upload and manage your email contacts for warm-up campaigns
          </p>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Email Contacts</CardTitle>
                <CardDescription>
                  Upload a CSV file containing your email contacts. The file
                  should have headers and include at least an email column.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="csv-upload">CSV File</Label>
                  <Input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                    className="cursor-pointer"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={downloadSampleCSV}
                    variant="outline"
                    size="sm"
                  >
                    Download Sample CSV
                  </Button>
                  {contacts.length > 0 && (
                    <Button
                      onClick={downloadUpdatedCSV}
                      variant="outline"
                      size="sm"
                    >
                      Download Updated CSV
                    </Button>
                  )}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      Processing...
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Email Template Section */}
            {contacts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Email Campaign Setup</CardTitle>
                  <CardDescription>
                    Choose from pre-built templates or customize your own. Use{" "}
                    {"{{name}}"}, {"{{company}}"}, and {"{{email}}"} as
                    placeholders.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Campaign Name */}
                  <div className="space-y-2">
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input
                      id="campaign-name"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Enter campaign name (e.g., Q1 Welcome Series)"
                    />
                  </div>

                  {/* Template Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="template-select">Choose Template</Label>
                    <Select
                      value={selectedTemplate}
                      onValueChange={handleTemplateChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {emailTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm text-gray-500">
                                {template.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-subject">Subject</Label>
                    <Input
                      id="email-subject"
                      value={emailTemplate.subject}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmailTemplate((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                      placeholder="Email subject"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-html">HTML Content</Label>
                    <Textarea
                      id="email-html"
                      value={emailTemplate.html}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setEmailTemplate((prev) => ({
                          ...prev,
                          html: e.target.value,
                        }))
                      }
                      placeholder="HTML email content"
                      rows={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-text">Plain Text Content</Label>
                    <Textarea
                      id="email-text"
                      value={emailTemplate.text}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setEmailTemplate((prev) => ({
                          ...prev,
                          text: e.target.value,
                        }))
                      }
                      placeholder="Plain text email content"
                      rows={6}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={sendBulkEmails}
                      variant="default"
                      size="sm"
                    >
                      Send to All Valid Emails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            {/* Data Table */}
            {contacts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Contacts</CardTitle>
                  <CardDescription>
                    {contacts.length} contacts successfully uploaded.
                    Double-click any cell to edit.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {contacts.length > 0 &&
                            Object.keys(contacts[0]).map((header) => (
                              <TableHead key={header} className="font-semibold">
                                {header.charAt(0).toUpperCase() +
                                  header.slice(1)}
                              </TableHead>
                            ))}
                          <TableHead className="font-semibold">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contacts.length > 0 ? (
                          contacts.map((contact, index) => (
                            <TableRow key={index}>
                              {Object.entries(contact).map(([key, value]) => (
                                <TableCell
                                  key={key}
                                  className="max-w-xs truncate cursor-pointer hover:bg-gray-50"
                                  onDoubleClick={() =>
                                    startEditing(
                                      index,
                                      key,
                                      String(value || "")
                                    )
                                  }
                                >
                                  {editingCell?.rowIndex === index &&
                                  editingCell?.columnKey === key ? (
                                    <div className="flex gap-1">
                                      <Input
                                        value={editValue}
                                        onChange={(e) =>
                                          setEditValue(e.target.value)
                                        }
                                        onKeyDown={handleKeyPress}
                                        onBlur={saveEdit}
                                        autoFocus
                                        className="h-8 text-sm"
                                      />
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={saveEdit}
                                        className="h-8 px-2"
                                      >
                                        ✓
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={cancelEdit}
                                        className="h-8 px-2"
                                      >
                                        ✕
                                      </Button>
                                    </div>
                                  ) : (
                                    String(value || "")
                                  )}
                                </TableCell>
                              ))}
                              <TableCell>
                                <Button
                                  onClick={() => sendEmail(contact, index)}
                                  disabled={
                                    sendingEmails.has(index) ||
                                    !contact.email ||
                                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                      contact.email
                                    )
                                  }
                                  size="sm"
                                  variant="outline"
                                >
                                  {sendingEmails.has(index) ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900 mr-2"></div>
                                      Sending...
                                    </>
                                  ) : (
                                    "Send Email"
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={100}
                              className="text-center text-gray-500"
                            >
                              No valid contacts found in the uploaded file
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Email Records */}
            <Card>
              <CardHeader>
                <CardTitle>Email Sending History</CardTitle>
                <CardDescription>
                  Track all sent emails and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {stats.totalSent}
                      </div>
                      <div className="text-sm text-gray-600">Emails Sent</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-red-600">
                        {stats.totalFailed}
                      </div>
                      <div className="text-sm text-gray-600">Failed</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.successRate}%
                      </div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-purple-600">
                        {emailRecords.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Records</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Template</TableHead>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sent At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingRecords ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            Loading records...
                          </TableCell>
                        </TableRow>
                      ) : emailRecords.length > 0 ? (
                        emailRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {record.recipient_email}
                                </div>
                                {record.recipient_name && (
                                  <div className="text-sm text-gray-500">
                                    {record.recipient_name}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {record.template_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {record.template_id}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{record.campaign_name}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  record.status === "sent"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(record.sent_at).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-gray-500"
                          >
                            No email records found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Stats Cards */}
        {contacts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contacts.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Valid Emails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    contacts.filter(
                      (contact) =>
                        contact.email &&
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
                    ).length
                  }
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Ready for Campaign
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {
                    contacts.filter(
                      (contact) =>
                        contact.email &&
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
                    ).length
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
