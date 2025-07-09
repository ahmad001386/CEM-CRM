'use client';

import { notFound } from 'next/navigation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Save, X } from 'lucide-react';

export default function NewCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    segment: '',
    status: 'active',
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ایجاد مشتری جدید:', formData);
    // اینجا باید API call انجام شود
    router.push('/dashboard/customers');
  };

  const handleCancel = () => {
    router.push('/dashboard/customers');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="hover:bg-primary/10"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              افزودن مشتری جدید
            </h1>
            <p className="text-muted-foreground font-vazir mt-2">اطلاعات مشتری جدید را وارد کنید</p>
          </div>
        </div>
      </div>

      <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="font-vazir">اطلاعات مشتری</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-vazir">نام مشتری *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="نام شرکت یا فرد"
                  required
                  className="font-vazir"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-vazir">ایمیل *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@company.com"
                  required
                  className="font-vazir"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-vazir">تلفن</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="۰۲۱-۱۲۳۴۵۶۷۸"
                  className="font-vazir"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="segment" className="font-vazir">بخش *</Label>
                <Select value={formData.segment} onValueChange={(value) => handleInputChange('segment', value)}>
                  <SelectTrigger className="font-vazir">
                    <SelectValue placeholder="انتخاب بخش" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enterprise" className="font-vazir">سازمانی</SelectItem>
                    <SelectItem value="small_business" className="font-vazir">کسب‌وکار کوچک</SelectItem>
                    <SelectItem value="individual" className="font-vazir">فردی</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-vazir">وضعیت</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="font-vazir">
                    <SelectValue placeholder="انتخاب وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active" className="font-vazir">فعال</SelectItem>
                    <SelectItem value="inactive" className="font-vazir">غیرفعال</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="font-vazir">یادداشت‌ها</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="یادداشت‌های اضافی در مورد مشتری..."
                rows={4}
                className="font-vazir"
                dir="rtl"
              />
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 font-vazir"
              >
                <Save className="h-4 w-4 ml-2" />
                ذخیره مشتری
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="font-vazir"
              >
                <X className="h-4 w-4 ml-2" />
                انصراف
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}