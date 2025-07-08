'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockActivities, mockCustomers, mockUsers } from '@/lib/mock-data';
import { Activity } from '@/lib/types';
import {
  Plus,
  Phone,
  Calendar,
  Mail,
  MessageCircle,
  Clock,
  Filter,
  Search,
  User,
  Building,
  CheckCircle,
  AlertCircle,
  XCircle,
  Activity as ActivityIcon,
} from 'lucide-react';

export default function ActivitiesPage() {
  const [activities] = useState<Activity[]>(mockActivities);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterOutcome, setFilterOutcome] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newActivity, setNewActivity] = useState({
    type: 'call',
    customerId: '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    outcome: 'successful',
  });

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesOutcome = filterOutcome === 'all' || activity.outcome === filterOutcome;
    
    return matchesSearch && matchesType && matchesOutcome;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'meeting': return Calendar;
      case 'email': return Mail;
      case 'sms': return MessageCircle;
      case 'whatsapp': return MessageCircle;
      default: return ActivityIcon;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-primary/10 text-primary';
      case 'meeting': return 'bg-secondary/10 text-secondary';
      case 'email': return 'bg-accent/10 text-accent';
      case 'sms': return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200';
      case 'whatsapp': return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'successful': return CheckCircle;
      case 'follow_up_needed': return AlertCircle;
      case 'no_response': return XCircle;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'successful': return 'text-green-600';
      case 'follow_up_needed': return 'text-yellow-600';
      case 'no_response': return 'text-red-600';
      case 'completed': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getOutcomeLabel = (outcome: string) => {
    switch (outcome) {
      case 'successful': return 'موفق';
      case 'follow_up_needed': return 'نیاز به پیگیری';
      case 'no_response': return 'بدون پاسخ';
      case 'completed': return 'تکمیل شده';
      case 'cancelled': return 'لغو شده';
      default: return outcome;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'call': return 'تماس تلفنی';
      case 'meeting': return 'جلسه';
      case 'email': return 'ایمیل';
      case 'sms': return 'پیامک';
      case 'whatsapp': return 'واتساپ';
      case 'follow_up': return 'پیگیری';
      case 'system_task': return 'تسک سیستمی';
      default: return type;
    }
  };

  const handleAddActivity = () => {
    console.log('افزودن فعالیت:', newActivity);
    setShowAddForm(false);
    setNewActivity({
      type: 'call',
      customerId: '',
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      outcome: 'successful',
    });
  };

  const todayActivities = activities.filter(activity => 
    new Date(activity.startTime).toDateString() === new Date().toDateString()
  );

  const thisWeekActivities = activities.filter(activity => {
    const activityDate = new Date(activity.startTime);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return activityDate >= weekAgo && activityDate <= today;
  });

  const activityStats = {
    total: activities.length,
    today: todayActivities.length,
    thisWeek: thisWeekActivities.length,
    successful: activities.filter(a => a.outcome === 'successful').length,
    followUp: activities.filter(a => a.outcome === 'follow_up_needed').length,
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            مدیریت فعالیت‌ها
          </h1>
          <p className="text-muted-foreground font-vazir mt-2">پیگیری و ثبت تمام تعاملات با مشتریان</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 font-vazir"
        >
          <Plus className="h-4 w-4 ml-2" />
          فعالیت جدید
        </Button>
      </div>

      {/* آمار فعالیت‌ها */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">کل فعالیت‌ها</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">{activityStats.total.toLocaleString('fa-IR')}</div>
          </CardContent>
        </Card>
        
        <Card className="border-secondary/20 hover:border-secondary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">امروز</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">{activityStats.today.toLocaleString('fa-IR')}</div>
          </CardContent>
        </Card>
        
        <Card className="border-accent/20 hover:border-accent/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">این هفته</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">{activityStats.thisWeek.toLocaleString('fa-IR')}</div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 hover:border-green-400 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">موفق</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 font-vazir">{activityStats.successful.toLocaleString('fa-IR')}</div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200 hover:border-yellow-400 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">نیاز به پیگیری</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 font-vazir">{activityStats.followUp.toLocaleString('fa-IR')}</div>
          </CardContent>
        </Card>
      </div>

      {/* فرم افزودن فعالیت */}
      {showAddForm && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="font-vazir">ثبت فعالیت جدید</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="activity-type" className="font-vazir">نوع فعالیت</Label>
                <Select value={newActivity.type} onValueChange={(value) => setNewActivity({...newActivity, type: value})}>
                  <SelectTrigger className="font-vazir">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call" className="font-vazir">تماس تلفنی</SelectItem>
                    <SelectItem value="meeting" className="font-vazir">جلسه</SelectItem>
                    <SelectItem value="email" className="font-vazir">ایمیل</SelectItem>
                    <SelectItem value="sms" className="font-vazir">پیامک</SelectItem>
                    <SelectItem value="whatsapp" className="font-vazir">واتساپ</SelectItem>
                    <SelectItem value="follow_up" className="font-vazir">پیگیری</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer" className="font-vazir">مشتری</Label>
                <Select value={newActivity.customerId} onValueChange={(value) => setNewActivity({...newActivity, customerId: value})}>
                  <SelectTrigger className="font-vazir">
                    <SelectValue placeholder="انتخاب مشتری" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCustomers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id} className="font-vazir">
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="font-vazir">عنوان</Label>
                <Input
                  id="title"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                  placeholder="عنوان فعالیت"
                  className="font-vazir"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outcome" className="font-vazir">نتیجه</Label>
                <Select value={newActivity.outcome} onValueChange={(value) => setNewActivity({...newActivity, outcome: value})}>
                  <SelectTrigger className="font-vazir">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="successful" className="font-vazir">موفق</SelectItem>
                    <SelectItem value="follow_up_needed" className="font-vazir">نیاز به پیگیری</SelectItem>
                    <SelectItem value="no_response" className="font-vazir">بدون پاسخ</SelectItem>
                    <SelectItem value="completed" className="font-vazir">تکمیل شده</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description" className="font-vazir">توضیحات</Label>
                <Textarea
                  id="description"
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                  placeholder="توضیحات تفصیلی فعالیت..."
                  rows={3}
                  className="font-vazir"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse mt-6">
              <Button onClick={handleAddActivity} className="font-vazir">
                ثبت فعالیت
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} className="font-vazir">
                انصراف
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* فیلترها */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse font-vazir">
            <Filter className="h-5 w-5" />
            <span>فیلتر فعالیت‌ها</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجوی عنوان یا مشتری..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 font-vazir"
                dir="rtl"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="font-vazir">
                <SelectValue placeholder="نوع فعالیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-vazir">همه انواع</SelectItem>
                <SelectItem value="call" className="font-vazir">تماس تلفنی</SelectItem>
                <SelectItem value="meeting" className="font-vazir">جلسه</SelectItem>
                <SelectItem value="email" className="font-vazir">ایمیل</SelectItem>
                <SelectItem value="sms" className="font-vazir">پیامک</SelectItem>
                <SelectItem value="whatsapp" className="font-vazir">واتساپ</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterOutcome} onValueChange={setFilterOutcome}>
              <SelectTrigger className="font-vazir">
                <SelectValue placeholder="نتیجه" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-vazir">همه نتایج</SelectItem>
                <SelectItem value="successful" className="font-vazir">موفق</SelectItem>
                <SelectItem value="follow_up_needed" className="font-vazir">نیاز به پیگیری</SelectItem>
                <SelectItem value="no_response" className="font-vazir">بدون پاسخ</SelectItem>
                <SelectItem value="completed" className="font-vazir">تکمیل شده</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterOutcome('all');
              }}
              className="font-vazir"
            >
              پاک کردن فیلترها
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* تب‌های فعالیت‌ها */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="font-vazir">همه فعالیت‌ها</TabsTrigger>
          <TabsTrigger value="today" className="font-vazir">امروز</TabsTrigger>
          <TabsTrigger value="week" className="font-vazir">این هفته</TabsTrigger>
          <TabsTrigger value="follow-up" className="font-vazir">نیاز به پیگیری</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="font-vazir">
                همه فعالیت‌ها ({filteredActivities.length.toLocaleString('fa-IR')} مورد)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  const OutcomeIcon = getOutcomeIcon(activity.outcome);
                  
                  return (
                    <div key={activity.id} className="flex items-start space-x-4 space-x-reverse p-4 border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300">
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium font-vazir">{activity.title}</h4>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <OutcomeIcon className={`h-4 w-4 ${getOutcomeColor(activity.outcome)}`} />
                            <Badge variant="outline" className="font-vazir">
                              {getOutcomeLabel(activity.outcome)}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 font-vazir">{activity.customerName}</p>
                        <p className="text-sm mt-2 font-vazir">{activity.description}</p>
                        <div className="flex items-center space-x-4 space-x-reverse mt-3">
                          <span className="text-xs text-muted-foreground font-vazir">
                            {getTypeLabel(activity.type)}
                          </span>
                          <span className="text-xs text-muted-foreground font-vazir">
                            {new Date(activity.startTime).toLocaleDateString('fa-IR')} - 
                            {new Date(activity.startTime).toLocaleTimeString('fa-IR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          <span className="text-xs text-muted-foreground font-vazir">
                            توسط: {activity.performedBy}
                          </span>
                          {activity.duration && (
                            <span className="text-xs text-muted-foreground font-vazir">
                              مدت زمان: {activity.duration.toLocaleString('fa-IR')} دقیقه
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredActivities.length === 0 && (
                  <p className="text-center text-muted-foreground font-vazir py-8">
                    فعالیتی یافت نشد
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle className="font-vazir">
                فعالیت‌های امروز ({todayActivities.length.toLocaleString('fa-IR')} مورد)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  const OutcomeIcon = getOutcomeIcon(activity.outcome);
                  
                  return (
                    <div key={activity.id} className="flex items-start space-x-4 space-x-reverse p-4 border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300">
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium font-vazir">{activity.title}</h4>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <OutcomeIcon className={`h-4 w-4 ${getOutcomeColor(activity.outcome)}`} />
                            <Badge variant="outline" className="font-vazir">
                              {getOutcomeLabel(activity.outcome)}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 font-vazir">{activity.customerName}</p>
                        <p className="text-sm mt-2 font-vazir">{activity.description}</p>
                      </div>
                    </div>
                  );
                })}
                {todayActivities.length === 0 && (
                  <p className="text-center text-muted-foreground font-vazir py-8">
                    امروز فعالیتی ثبت نشده است
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week">
          <Card>
            <CardHeader>
              <CardTitle className="font-vazir">
                فعالیت‌های این هفته ({thisWeekActivities.length.toLocaleString('fa-IR')} مورد)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {thisWeekActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  const OutcomeIcon = getOutcomeIcon(activity.outcome);
                  
                  return (
                    <div key={activity.id} className="flex items-start space-x-4 space-x-reverse p-4 border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300">
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium font-vazir">{activity.title}</h4>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <OutcomeIcon className={`h-4 w-4 ${getOutcomeColor(activity.outcome)}`} />
                            <Badge variant="outline" className="font-vazir">
                              {getOutcomeLabel(activity.outcome)}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 font-vazir">{activity.customerName}</p>
                        <p className="text-sm mt-2 font-vazir">{activity.description}</p>
                        <div className="flex items-center space-x-4 space-x-reverse mt-3">
                          <span className="text-xs text-muted-foreground font-vazir">
                            {new Date(activity.startTime).toLocaleDateString('fa-IR')}
                          </span>
                          <span className="text-xs text-muted-foreground font-vazir">
                            توسط: {activity.performedBy}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="follow-up">
          <Card>
            <CardHeader>
              <CardTitle className="font-vazir">
                فعالیت‌های نیاز به پیگیری ({activities.filter(a => a.outcome === 'follow_up_needed').length.toLocaleString('fa-IR')} مورد)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.filter(a => a.outcome === 'follow_up_needed').map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  
                  return (
                    <div key={activity.id} className="flex items-start space-x-4 space-x-reverse p-4 border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 rounded-lg">
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium font-vazir">{activity.title}</h4>
                          <Badge variant="destructive" className="font-vazir">
                            نیاز به پیگیری
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 font-vazir">{activity.customerName}</p>
                        <p className="text-sm mt-2 font-vazir">{activity.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted-foreground font-vazir">
                            {new Date(activity.startTime).toLocaleDateString('fa-IR')} - {activity.performedBy}
                          </span>
                          <Button size="sm" className="font-vazir">
                            پیگیری کن
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}