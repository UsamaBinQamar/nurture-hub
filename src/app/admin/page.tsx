"use client";

import { useState } from "react";
import Papa from "papaparse";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

interface EmailContact {
  email: string;
  name?: string;
  company?: string;
  status?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface EditingCell {
  rowIndex: number;
  columnKey: string;
}

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<EmailContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendingEmails, setSendingEmails] = useState<Set<number>>(new Set());
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate>({
    subject: "Welcome to Our Email Campaign!",
    html: `
      <h2>Hello {{name}}!</h2>
      <p>Thank you for joining our email list. We're excited to have you on board!</p>
      <p>Best regards,<br>The Team</p>
    `,
    text: `
Hello {{name}}!

Thank you for joining our email list. We're excited to have you on board!

Best regards,
The Team
    `,
  });

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
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Email sent successfully to ${contact.email}`);
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

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Email Contacts</CardTitle>
            <CardDescription>
              Upload a CSV file containing your email contacts. The file should
              have headers and include at least an email column.
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
              <Button onClick={downloadSampleCSV} variant="outline" size="sm">
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
              <CardTitle>Email Template</CardTitle>
              <CardDescription>
                Customize your email template. Use {"{{name}}"}, {"{{company}}"}
                , and {"{{email}}"} as placeholders.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  rows={6}
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
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={sendBulkEmails} variant="default" size="sm">
                  Send to All Valid Emails
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Table */}
        {contacts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Contacts</CardTitle>
              <CardDescription>
                {contacts.length} contacts successfully uploaded. Double-click
                any cell to edit.
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
                            {header.charAt(0).toUpperCase() + header.slice(1)}
                          </TableHead>
                        ))}
                      <TableHead className="font-semibold">Actions</TableHead>
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
                                startEditing(index, key, String(value || ""))
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
