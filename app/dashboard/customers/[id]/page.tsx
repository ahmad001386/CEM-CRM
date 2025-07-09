'use client';

import { notFound } from 'next/navigation';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { mockCustomers, mockActivities, mockNotes, mockContacts } from '@/lib/mock-data';
import {
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Tag,
  FileText,
  TrendingUp,
  Clock,
  User,
  Building,
  Star,
  Edit,
  Plus,
  MessageCircle,
  Activity,
} from 'lucide-react';

// تولید پارامترهای استاتیک برای export
export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;
  
  const customer = mockCustomers.find(c => c.id === customerId);
  const customerActivities = mockActivities.filter(a => a.customerId === customerId);
  const customerNotes = mockNotes.filter(n => n.customerId === customerId);
  const customerContacts = mockContacts.filter(c => c.customerId === customerId);

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground font-vazir">مشتری یافت نشد</p>
      </div>
    );
  }

  const getStageName = (stage: string) => {
    switch (stage) {
      case 'new_lead': return 'لید جدید';
      case 'contacted': return 'تماس برقرار شده';
      case 'needs_analysis': return 'نیازسنجی';
      case 'proposal_sent': return 'ارسال پیشنهاد';
      case 'negotiation': return 'مذاکره';
      case 'closed_won': return 'بسته شده - برنده';
      case 'closed_lost': return 'بسته شده - بازنده';
      default: return stage;
    }
  };

  const getStageProgress = (stage: string) => {
    const stages = ['new_lead', 'contacted', 'needs_analysis', 'proposal_sent', 'negotiation', 'closed_won'];
    const currentIndex = stages.indexOf(stage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {customer.name}
            </h1>
            <p className="text-muted-foreground font-vazir mt-2">جزئیات کامل مشتری و مسیر فروش</p>
          </div>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <Button variant="outline" className="font-vazir">
            <Edit className="h-4 w-4 ml-2" />
            ویرایش
          </Button>
          <Button className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 font-vazir">
            <Plus className="h-4 w-4 ml-2" />
            فعالیت جدید
          </Button>
        </div>
      </div>

      {/* اطلاعات کلی مشتری */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse font-vazir">
              <Building className="h-5 w-5" />
              <span>اطلاعات مشتری</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-vazir">{customer.email}</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-vazir">{customer.phone}</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-vazir">
                    عضویت: {new Date(customer.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-vazir">مسئول: {customer.assignedTo}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Badge variant={customer.status === 'active' ? 'default' : 'secondary'} className="font-vazir">
                    {customer.status === 'active' ? 'فعال' : 
                     customer.status === 'follow_up' ? 'نیاز به پیگیری' : 'غیرفعال'}
                  </Badge>
                  <Badge variant="outline" className="font-vazir">
                    {customer.segment === 'enterprise' ? 'سازمانی' : 
                     customer.segment === 'small_business' ? 'کسب‌وکار کوچک' : 'فردی'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="font-vazir">
                    ارزش بالقوه: {(customer.potentialValue! / 1000000).toLocaleString('fa-IR')} میلیون تومان
                  </span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="font-vazir">
                    رضایت: {customer.satisfactionScore?.toLocaleString('fa-IR')}/۵
                  </span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-1">
                    {customer.tags?.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs font-vazir">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-secondary/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse font-vazir">
              <Activity className="h-5 w-5" />
              <span>آمار سریع</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-vazir">تیکت‌ها</span>
                <span className="font-bold font-vazir">{customer.totalTickets.toLocaleString('fa-IR')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-vazir">فعالیت‌ها</span>
                <span className="font-bold font-vazir">{customerActivities.length.toLocaleString('fa-IR')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-vazir">مخاطبین</span>
                <span className="font-bold font-vazir">{customerContacts.length.toLocaleString('fa-IR')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-vazir">پروژه‌ها</span>
                <span className="font-bold font-vazir">{customer.projects?.length.toLocaleString('fa-IR') || '۰'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* مسیر فروش */}
      {customer.salesPipeline && (
        <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse font-vazir">
              <TrendingUp className="h-5 w-5" />
              <span>مسیر فروش اختصاصی</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* وضعیت کلی فرآیند */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 border border-border/50 rounded-lg">
                  <div className={`text-2xl font-bold mb-2 ${customer.salesPipeline.productSelected ? 'text-green-600' : 'text-red-600'}`}>
                    {customer.salesPipeline.productSelected ? '✓' : '✗'}
                  </div>
                  <p className="text-sm font-vazir">محصول انتخاب شده</p>
                </div>
                <div className="text-center p-4 border border-border/50 rounded-lg">
                  <div className={`text-2xl font-bold mb-2 ${customer.salesPipeline.contactMade ? 'text-green-600' : 'text-red-600'}`}>
                    {customer.salesPipeline.contactMade ? '✓' : '✗'}
                  </div>
                  <p className="text-sm font-vazir">تماس برقرار شده</p>
                </div>
                <div className="text-center p-4 border border-border/50 rounded-lg">
                  <div className={`text-2xl font-bold mb-2 ${customer.salesPipeline.purchased ? 'text-green-600' : 'text-red-600'}`}>
                    {customer.salesPipeline.purchased ? '✓' : '✗'}
                  </div>
                  <p className="text-sm font-vazir">خریداری شده</p>
                </div>
              </div>

              {/* اطلاعات تماس */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-medium font-vazir mb-2">آخرین تماس</h4>
                  <p className="text-sm text-muted-foreground font-vazir">
                    {customer.salesPipeline.lastContactDate 
                      ? new Date(customer.salesPipeline.lastContactDate).toLocaleDateString('fa-IR')
                      : 'تماسی برقرار نشده'
                    }
                  </p>
                </div>
                <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                  <h4 className="font-medium font-vazir mb-2">تعداد تماس‌ها</h4>
                  <p className="text-sm text-muted-foreground font-vazir">
                    {customer.salesPipeline.contactAttempts?.toLocaleString('fa-IR') || '۰'} بار
                  </p>
                </div>
              </div>

              {/* اقدام بعدی */}
              {customer.salesPipeline.nextAction && (
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <h4 className="font-medium font-vazir mb-2">اقدام بعدی</h4>
                  <p className="text-sm font-vazir">{customer.salesPipeline.nextAction}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium font-vazir">
                    مرحله فعلی: {getStageName(customer.salesPipeline.currentStage)}
                  </h3>
                  <p className="text-sm text-muted-foreground font-vazir">
                    ورود به مرحله: {new Date(customer.salesPipeline.stageEntryDate).toLocaleDateString('fa-IR')}
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-bold font-vazir">
                    احتمال موفقیت: %{customer.salesPipeline.successProbability?.toLocaleString('fa-IR')}
                  </p>
                  <p className="text-sm text-muted-foreground font-vazir">
                    ارزش معامله: {(customer.salesPipeline.dealValue! / 1000000).toLocaleString('fa-IR')} میلیون
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-vazir">
                  <span>پیشرفت مسیر فروش</span>
                  <span>%{getStageProgress(customer.salesPipeline.currentStage).toLocaleString('fa-IR', { maximumFractionDigits: 0 })}</span>
                </div>
                <Progress value={getStageProgress(customer.salesPipeline.currentStage)} className="h-2" />
              </div>

              <div className="grid grid-cols-6 gap-2 mt-4">
                {['new_lead', 'contacted', 'needs_analysis', 'proposal_sent', 'negotiation', 'closed_won'].map((stage, index) => (
                  <div key={stage} className="text-center">
                    <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-bold ${
                      customer.salesPipeline!.currentStage === stage 
                        ? 'bg-primary text-white' 
                        : getStageProgress(customer.salesPipeline!.currentStage) > (index * 100 / 6)
                        ? 'bg-secondary text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <p className="text-xs font-vazir">{getStageName(stage)}</p>
                  </div>
                ))}
              </div>

              {/* تاریخچه مراحل */}
              {customer.salesPipeline.stageHistory && (
                <div className="mt-6">
                  <h4 className="font-medium font-vazir mb-4">تاریخچه مراحل</h4>
                  <div className="space-y-2">
                    {customer.salesPipeline.stageHistory.map((history, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className={`w-3 h-3 rounded-full ${
                            history.exitDate ? 'bg-green-500' : 'bg-primary'
                          }`} />
                          <span className="font-vazir">{getStageName(history.stage)}</span>
                        </div>
                        <div className="text-sm text-muted-foreground font-vazir">
                          {new Date(history.entryDate).toLocaleDateString('fa-IR')}
                          {history.exitDate && (
                            <span> - {new Date(history.exitDate).toLocaleDateString('fa-IR')}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* تب‌های جزئیات */}
      <Tabs defaultValue="activities" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activities" className="font-vazir">فعالیت‌ها</TabsTrigger>
          <TabsTrigger value="contacts" className="font-vazir">مخاطبین</TabsTrigger>
          <TabsTrigger value="notes" className="font-vazir">یادداشت‌ها</TabsTrigger>
          <TabsTrigger value="projects" className="font-vazir">پروژه‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle className="font-vazir">فعالیت‌های انجام شده</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 space-x-reverse p-4 border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'call' ? 'bg-primary/10 text-primary' :
                      activity.type === 'meeting' ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
                    }`}>
                      {activity.type === 'call' ? <Phone className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium font-vazir">{activity.title}</h4>
                        <span className="text-sm text-muted-foreground font-vazir">
                          {new Date(activity.startTime).toLocaleDateString('fa-IR')}
                        </span>
                      </div>
                      <p className="text-sm mt-2 font-vazir">{activity.description}</p>
                      <div className="flex items-center space-x-4 space-x-reverse mt-2">
                        <span className="text-xs text-muted-foreground font-vazir">
                          توسط: {activity.performedBy}
                        </span>
                        {activity.duration && (
                          <span className="text-xs text-muted-foreground font-vazir">
                            مدت زمان: {activity.duration.toLocaleString('fa-IR')} دقیقه
                          </span>
                        )}
                        <Badge variant={activity.outcome === 'successful' ? 'default' : 'secondary'} className="text-xs font-vazir">
                          {activity.outcome === 'successful' ? 'موفق' : 
                           activity.outcome === 'follow_up_needed' ? 'نیاز به پیگیری' : 'بدون پاسخ'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                {customerActivities.length === 0 && (
                  <p className="text-center text-muted-foreground font-vazir py-8">
                    فعالیتی ثبت نشده است
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle className="font-vazir">مخاطبین مرتبط</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-secondary/30 transition-all duration-300">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-primary via-secondary to-accent text-white font-vazir">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium font-vazir">{contact.name}</p>
                        <p className="text-sm text-muted-foreground font-vazir">{contact.role}</p>
                        <div className="flex items-center space-x-4 space-x-reverse mt-1">
                          <span className="text-xs text-muted-foreground font-vazir">{contact.email}</span>
                          <span className="text-xs text-muted-foreground font-vazir">{contact.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 space-x-reverse">
                      <Button size="sm" variant="outline" className="font-vazir">
                        <Phone className="h-4 w-4 ml-2" />
                        تماس
                      </Button>
                      <Button size="sm" variant="outline" className="font-vazir">
                        <Mail className="h-4 w-4 ml-2" />
                        ایمیل
                      </Button>
                    </div>
                  </div>
                ))}
                {customerContacts.length === 0 && (
                  <p className="text-center text-muted-foreground font-vazir py-8">
                    مخاطبی ثبت نشده است
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle className="font-vazir">یادداشت‌ها و سابقه تماس</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerNotes.map((note) => (
                  <div key={note.id} className="p-4 border border-border/50 rounded-lg hover:border-accent/30 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium font-vazir">{note.title}</h4>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Badge variant="outline" className="font-vazir">
                          {note.category === 'customer_need' ? 'نیاز مشتری' :
                           note.category === 'objection' ? 'اعتراض' :
                           note.category === 'sales_tip' ? 'نکته فروش' : 'عمومی'}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-vazir">
                          {new Date(note.createdAt).toLocaleDateString('fa-IR')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-vazir mb-2">{note.content}</p>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-xs text-muted-foreground font-vazir">توسط: {note.createdBy}</span>
                      <div className="flex space-x-1 space-x-reverse">
                        {note.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs font-vazir">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {customerNotes.length === 0 && (
                  <p className="text-center text-muted-foreground font-vazir py-8">
                    یادداشتی ثبت نشده است
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle className="font-vazir">پروژه‌های مرتبط</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customer.projects?.map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium font-vazir">{project}</p>
                        <p className="text-sm text-muted-foreground font-vazir">در حال اجرا</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="font-vazir">
                      مشاهده جزئیات
                    </Button>
                  </div>
                )) || (
                  <p className="text-center text-muted-foreground font-vazir py-8">
                    پروژه‌ای تعریف نشده است
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}