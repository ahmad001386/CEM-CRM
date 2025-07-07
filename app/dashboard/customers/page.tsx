'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCustomers } from '@/lib/mock-data';
import { Customer } from '@/lib/types';
import { Plus, Users, Building, User } from 'lucide-react';

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(mockCustomers);

  const columns = [
    {
      key: 'name',
      label: 'نام مشتری',
      sortable: true,
      render: (value: string, row: Customer) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            {row.segment === 'enterprise' ? (
              <Building className="h-4 w-4 text-primary" />
            ) : (
              <User className="h-4 w-4 text-primary" />
            )}
          </div>
          <div>
            <p className="font-medium font-vazir">{value}</p>
            <p className="text-sm text-muted-foreground font-vazir">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'segment',
      label: 'بخش',
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'enterprise' ? 'default' : 'secondary'} className="font-vazir">
          {value === 'enterprise' ? 'سازمانی' : 
           value === 'small_business' ? 'کسب‌وکار کوچک' : 'فردی'}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'وضعیت',
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'default' : 'secondary'} className="font-vazir">
          {value === 'active' ? 'فعال' : 'غیرفعال'}
        </Badge>
      ),
    },
    {
      key: 'totalTickets',
      label: 'تیکت‌ها',
      sortable: true,
      render: (value: number) => (
        <span className="font-vazir">{value.toLocaleString('fa-IR')}</span>
      ),
    },
    {
      key: 'satisfactionScore',
      label: 'امتیاز رضایت',
      sortable: true,
      render: (value: number) => value ? (
        <span className="font-vazir">{value.toLocaleString('fa-IR')}/۵</span>
      ) : 'ندارد',
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

  const handleEditCustomer = (customer: Customer) => {
    console.log('ویرایش مشتری:', customer);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    console.log('حذف مشتری:', customer);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            مشتریان
          </h1>
          <p className="text-muted-foreground font-vazir mt-2">مدیریت روابط مشتریان شما</p>
        </div>
        <Button className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 font-vazir">
          <Plus className="h-4 w-4 ml-2" />
          افزودن مشتری
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">کل مشتریان</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">{customers.length.toLocaleString('fa-IR')}</div>
          </CardContent>
        </Card>
        <Card className="border-secondary/20 hover:border-secondary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">سازمانی</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">
              {customers.filter(c => c.segment === 'enterprise').length.toLocaleString('fa-IR')}
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/20 hover:border-accent/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">فعال</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">
              {customers.filter(c => c.status === 'active').length.toLocaleString('fa-IR')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="font-vazir">لیست مشتریان</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={customers}
            columns={columns}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
          />
        </CardContent>
      </Card>
    </div>
  );
}