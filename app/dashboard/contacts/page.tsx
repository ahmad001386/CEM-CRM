'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Contact } from '@/lib/types';
import { Plus, Contact as ContactIcon, Mail, Phone, RefreshCw, AlertCircle, Users } from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [newContact, setNewContact] = useState({
    customer_id: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    is_primary: false,
  });

  // Load data on component mount
  useEffect(() => {
    loadContacts();
    loadCustomers();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError('');
      // Note: We need to create this API endpoint
      const response = await fetch('/api/contacts');
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.data || []);
      } else {
        setError(data.message || 'خطا در دریافت مخاطبین');
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      setError('خطا در اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      
      if (data.success) {
        setCustomers(data.data || []);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newContact.name || !newContact.customer_id) {
      toast({
        title: "خطا",
        description: "نام مخاطب و مشتری الزامی است",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContact),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "موفقیت",
          description: "مخاطب جدید با موفقیت اضافه شد",
        });
        setNewContact({
          customer_id: '',
          name: '',
          email: '',
          phone: '',
          role: '',
          department: '',
          is_primary: false,
        });
        setOpen(false);
        loadContacts();
      } else {
        toast({
          title: "خطا",
          description: data.message || "خطا در افزودن مخاطب",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "خطا",
        description: "خطا در اتصال به سرور",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'مشتری نامشخص';
  };

  const columns = [
    {
      key: 'name',
      label: 'نام مخاطب',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <ContactIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium font-vazir">{value}</p>
            <p className="text-sm text-muted-foreground font-vazir">{row.role || 'نقش تعریف نشده'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'customer_id',
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
          <span className="font-vazir">{value || 'ندارد'}</span>
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
          <span className="font-vazir">{value || 'ندارد'}</span>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'بخش',
      render: (value: string) => (
        <span className="font-vazir">{value || 'تعریف نشده'}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'تاریخ ایجاد',
      sortable: true,
      render: (value: string) => (
        <span className="font-vazir">{new Date(value).toLocaleDateString('fa-IR')}</span>
      ),
    },
  ];

  const handleEditContact = (contact: any) => {
    console.log('ویرایش مخاطب:', contact);
  };

  const handleDeleteContact = (contact: any) => {
    console.log('حذف مخاطب:', contact);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-vazir">در حال بارگذاری مخاطبین...</p>
        </div>
      </div>
    );
  }

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
          <Button variant="outline" onClick={loadContacts} disabled={loading} className="font-vazir">
            <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
            بروزرسانی
          </Button>
          <Button variant="outline" className="font-vazir">
            خروجی CSV
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 font-vazir">
                <Plus className="h-4 w-4 ml-2" />
                افزودن مخاطب
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-vazir">افزودن مخاطب جدید</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddContact} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_id" className="font-vazir">مشتری *</Label>
                  <Select value={newContact.customer_id} onValueChange={(value) => setNewContact({...newContact, customer_id: value})}>
                    <SelectTrigger className="font-vazir">
                      <SelectValue placeholder="انتخاب مشتری" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id} className="font-vazir">
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-vazir">نام مخاطب *</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    placeholder="نام و نام خانوادگی"
                    required
                    className="font-vazir"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-vazir">ایمیل</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                    placeholder="example@company.com"
                    className="font-vazir"
                    dir="ltr"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-vazir">تلفن</Label>
                  <Input
                    id="phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="font-vazir"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role" className="font-vazir">نقش</Label>
                  <Input
                    id="role"
                    value={newContact.role}
                    onChange={(e) => setNewContact({...newContact, role: e.target.value})}
                    placeholder="مدیر فروش، مدیر فنی، ..."
                    className="font-vazir"
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department" className="font-vazir">بخش</Label>
                  <Input
                    id="department"
                    value={newContact.department}
                    onChange={(e) => setNewContact({...newContact, department: e.target.value})}
                    placeholder="فروش، فنی، مالی، ..."
                    className="font-vazir"
                    dir="rtl"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setOpen(false)}
                    disabled={submitting}
                    className="font-vazir"
                  >
                    لغو
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submitting || !newContact.name || !newContact.customer_id}
                    className="font-vazir"
                  >
                    {submitting ? 'در حال افزودن...' : 'افزودن مخاطب'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 space-x-reverse text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="font-vazir">{error}</span>
              <Button variant="outline" size="sm" onClick={loadContacts} className="mr-auto font-vazir">
                تلاش مجدد
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
              {contacts.filter(c => c.is_primary || (c.role && (c.role.includes('مدیر') || c.role.includes('مدیرعامل')))).length.toLocaleString('fa-IR')}
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
              {contacts.filter(c => c.role && (c.role.includes('فنی') || c.role.includes('فناوری'))).length.toLocaleString('fa-IR')}
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
          {contacts.length === 0 ? (
            <div className="text-center py-8">
              <ContactIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-vazir">مخاطبی یافت نشد</p>
              <Button onClick={() => setOpen(true)} className="mt-4 font-vazir">
                <Plus className="h-4 w-4 ml-2" />
                افزودن اولین مخاطب
              </Button>
            </div>
          ) : (
            <DataTable
              data={contacts}
              columns={columns}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}