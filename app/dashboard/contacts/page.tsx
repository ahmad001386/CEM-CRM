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
    return customer?.name || 'مشتری نامشخص';
  };

  const columns = [
    {
      key: 'name',
      label: 'نام مخاطب',
      sortable: true,
      render: (value: string, row: Contact) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <ContactIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium font-vazir">{value}</p>
            <p className="text-sm text-muted-foreground font-vazir">{row.role}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'customerId',
      label: 'مشتری',
      sortable: true,
      render: (value: string) => (
        <span className="font-vazir">{getCustomerName(value)}</span>
      ),
    },
    {
      key: 'email',
      label: 'ایمیل',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="font-vazir">{value}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'تلفن',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="font-vazir">{value}</span>
        </div>
      ),
    },
    {
      key: 'notes',
      label: 'یادداشت‌ها',
      render: (value: string) => (
        <span className="font-vazir">{value || 'بدون یادداشت'}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاریخ ایجاد',
      sortable: true,
      render: (value: string) => (
        <span className="font-vazir">{new Date(value).toLocaleDateString('fa-IR')}</span>
      ),
    },
  ];

  const handleEditContact = (contact: Contact) => {
    console.log('ویرایش مخاطب:', contact);
  };

  const handleDeleteContact = (contact: Contact) => {
    console.log('حذف مخاطب:', contact);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            مخاطبین
          </h1>
          <p className="text-muted-foreground font-vazir mt-2">مدیریت مخاطبین و روابط مشتریان</p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <Button variant="outline" className="font-vazir">
            خروجی CSV
          </Button>
          <Button className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 font-vazir">
            <Plus className="h-4 w-4 ml-2" />
            افزودن مخاطب
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">کل مخاطبین</CardTitle>
            <ContactIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">{contacts.length.toLocaleString('fa-IR')}</div>
          </CardContent>
        </Card>
        <Card className="border-secondary/20 hover:border-secondary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">مخاطبین اصلی</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">
              {contacts.filter(c => c.role.includes('مدیر') || c.role.includes('مدیرعامل')).length.toLocaleString('fa-IR')}
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/20 hover:border-accent/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">مخاطبین فنی</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">
              {contacts.filter(c => c.role.includes('فنی') || c.role.includes('فناوری')).length.toLocaleString('fa-IR')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Table */}
      <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="font-vazir">همه مخاطبین</CardTitle>
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