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

interface EmailContact {
  email: string;
  name?: string;
  company?: string;
  status?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<EmailContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setContacts(results.data as EmailContact[]);
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

        {/* Data Table */}
        {contacts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Contacts</CardTitle>
              <CardDescription>
                {contacts.length} contacts successfully uploaded
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(contacts[0]).map((header) => (
                        <TableHead key={header} className="font-semibold">
                          {header.charAt(0).toUpperCase() + header.slice(1)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact, index) => (
                      <TableRow key={index}>
                        {Object.values(contact).map((value, valueIndex) => (
                          <TableCell
                            key={valueIndex}
                            className="max-w-xs truncate"
                          >
                            {String(value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
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
