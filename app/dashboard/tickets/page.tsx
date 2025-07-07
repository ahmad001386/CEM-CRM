'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockTickets } from '@/lib/mock-data';
import { Ticket } from '@/lib/types';
import { Plus, Ticket as TicketIcon, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export default function TicketsPage() {
  const [tickets] = useState<Ticket[]>(mockTickets);

  const columns = [
    {
      key: 'subject',
      label: 'موضوع',
      sortable: true,
      render: (value: string, row: Ticket) => (
        <div>
          <p className="font-medium font-vazir">{value}</p>
          <p className="text-sm text-muted-foreground font-vazir">{row.customerName}</p>
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'اولویت',
      sortable: true,
      render: (value: string) => (
        <Badge variant={
          value === 'high' ? 'destructive' :
          value === 'medium' ? 'default' : 'secondary'
        } className="font-vazir">
          {value === 'high' ? 'بالا' : value === 'medium' ? 'متوسط' : 'پایین'}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'وضعیت',
      sortable: true,
      render: (value: string) => (
        <Badge variant={
          value === 'open' ? 'destructive' :
          value === 'in_progress' ? 'default' : 'secondary'
        } className="font-vazir">
          {value === 'open' ? 'باز' : 
           value === 'in_progress' ? 'در حال انجام' : 'بسته'}
        </Badge>
      ),
    },
    {
      key: 'assignedTo',
      label: 'تخصیص یافته به',
      sortable: true,
      render: (value: string) => (
        <span className="font-vazir">{value || 'تخصیص نیافته'}</span>
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
    {
      key: 'updatedAt',
      label: 'آخرین بروزرسانی',
      sortable: true,
      render: (value: string) => (
        <span className="font-vazir">{new Date(value).toLocaleDateString('fa-IR')}</span>
      ),
    },
  ];

  const handleEditTicket = (ticket: Ticket) => {
    console.log('ویرایش تیکت:', ticket);
  };

  const handleDeleteTicket = (ticket: Ticket) => {
    console.log('حذف تیکت:', ticket);
  };

  const openTickets = tickets.filter(t => t.status === 'open');
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress');
  const closedTickets = tickets.filter(t => t.status === 'closed');

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            تیکت‌های پشتیبانی
          </h1>
          <p className="text-muted-foreground font-vazir mt-2">مدیریت درخواست‌های پشتیبانی مشتریان</p>
        </div>
        <Button className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 font-vazir">
          <Plus className="h-4 w-4 ml-2" />
          ایجاد تیکت
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">کل تیکت‌ها</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">{tickets.length.toLocaleString('fa-IR')}</div>
          </CardContent>
        </Card>
        <Card className="border-destructive/20 hover:border-destructive/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">باز</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 font-vazir">{openTickets.length.toLocaleString('fa-IR')}</div>
          </CardContent>
        </Card>
        <Card className="border-accent/20 hover:border-accent/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">در حال انجام</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 font-vazir">{inProgressTickets.length.toLocaleString('fa-IR')}</div>
          </CardContent>
        </Card>
        <Card className="border-secondary/20 hover:border-secondary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">بسته</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 font-vazir">{closedTickets.length.toLocaleString('fa-IR')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="font-vazir">همه تیکت‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={tickets}
            columns={columns}
            onEdit={handleEditTicket}
            onDelete={handleDeleteTicket}
          />
        </CardContent>
      </Card>
    </div>
  );
}