'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockContacts, mockCustomers } from '@/lib/mock-data';
import { Contact } from '@/lib/types';
import { Plus, Contact as ContactIcon, Mail, Phone } from 'lucide-react';

export default function ContactsPage() {
  const [contacts] = useState<Contact[]>(mockContacts);

  const getCustomerName = (customerId: string) => {
    const customer = mockCustomers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const columns = [
    {
      key: 'name',
      label: 'Contact Name',
      sortable: true,
      render: (value: string, row: Contact) => (
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <ContactIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-sm text-muted-foreground">{row.role}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'customerId',
      label: 'Customer',
      sortable: true,
      render: (value: string) => getCustomerName(value),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'notes',
      label: 'Notes',
      render: (value: string) => value || 'No notes',
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleEditContact = (contact: Contact) => {
    console.log('Edit contact:', contact);
  };

  const handleDeleteContact = (contact: Contact) => {
    console.log('Delete contact:', contact);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">Manage customer contacts and relationships</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            Export CSV
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <ContactIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Primary Contacts</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.role.toLowerCase().includes('manager') || c.role.toLowerCase().includes('ceo')).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technical Contacts</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.role.toLowerCase().includes('tech') || c.role.toLowerCase().includes('cto')).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={contacts}
            columns={columns}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
          />
        </CardContent>
      </Card>
    </div>
  );
}