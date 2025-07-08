'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  mockDashboardStats, 
  mockTasks, 
  mockActivities, 
  mockCalendarEvents,
  mockUsers 
} from '@/lib/mock-data';
import {
  Users,
  TrendingUp,
  Star,
  DollarSign,
  Target,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Bell,
  ArrowUp,
  ArrowDown,
  Eye,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const stats = mockDashboardStats;
  const currentUser = mockUsers[1]; // مریم احمدی
  const userTasks = mockTasks.filter(task => task.assignedTo === currentUser.id);
  const recentActivities = mockActivities.slice(0, 3);
  const todayEvents = mockCalendarEvents.filter(event => 
    new Date(event.startDate).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            داشبورد مدیریت
          </h1>
          <p className="text-muted-foreground font-vazir mt-2">
            خوش آمدید {currentUser.name} - نمای کلی از عملکرد و فعالیت‌های امروز
          </p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <Button variant="outline" className="font-vazir">
            <Calendar className="h-4 w-4 ml-2" />
            تقویم
          </Button>
          <Button className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 font-vazir">
            <Plus className="h-4 w-4 ml-2" />
            فعالیت جدید
          </Button>
        </div>
      </div>

      {/* هشدارهای مهم */}
      {stats.alerts.filter(alert => !alert.isRead && alert.priority === 'high').length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse text-destructive font-vazir">
              <AlertTriangle className="h-5 w-5" />
              <span>هشدارهای مهم</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.alerts.filter(alert => !alert.isRead && alert.priority === 'high').map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-destructive/20">
                  <div>
                    <p className="font-medium font-vazir">{alert.title}</p>
                    <p className="text-sm text-muted-foreground font-vazir">{alert.message}</p>
                  </div>
                  <Button size="sm" variant="outline" className="font-vazir">
                    <Eye className="h-4 w-4 ml-2" />
                    مشاهده
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* آمار کلی */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="فروش کل ماه"
          value={`${(stats.totalSales / 1000000000).toFixed(1)} میلیارد`}
          description="تومان"
          icon={DollarSign}
          trend={{ value: 12, label: 'نسبت به ماه گذشته' }}
          className="border-primary/20 hover:border-primary/40 transition-all duration-300"
        />
        <StatCard
          title="مشتریان فعال"
          value={stats.activeCustomers.toLocaleString('fa-IR')}
          description={`از ${stats.totalCustomers.toLocaleString('fa-IR')} کل مشتری`}
          icon={Users}
          trend={{ value: 8, label: 'رشد هفتگی' }}
          className="border-secondary/20 hover:border-secondary/40 transition-all duration-300"
        />
        <StatCard
          title="لیدهای مهم"
          value={stats.importantLeads.length.toLocaleString('fa-IR')}
          description="نیاز به پیگیری فوری"
          icon={Target}
          trend={{ value: -2, label: 'نسبت به دیروز' }}
          className="border-accent/20 hover:border-accent/40 transition-all duration-300"
        />
        <StatCard
          title="رضایت مشتری"
          value={`${stats.avgSatisfactionScore}/۵`}
          description="میانگین امتیاز CSAT"
          icon={Star}
          trend={{ value: 3, label: 'بهبود ماهانه' }}
          className="border-primary/20 hover:border-primary/40 transition-all duration-300"
        />
      </div>

      {/* فعالیت کاربران و تارگت‌ها */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse font-vazir">
              <Activity className="h-5 w-5 text-primary" />
              <span>فعالیت تیم امروز</span>
            </CardTitle>
            <CardDescription className="font-vazir">عملکرد اعضای تیم فروش</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.userActivity.map((user) => (
                <div key={user.userId} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary via-secondary to-accent text-white font-vazir">
                        {user.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium font-vazir">{user.userName}</p>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1 space-x-reverse">
                          <Phone className="h-3 w-3" />
                          <span className="font-vazir">{user.callsToday.toLocaleString('fa-IR')} تماس</span>
                        </span>
                        <span className="flex items-center space-x-1 space-x-reverse">
                          <Calendar className="h-3 w-3" />
                          <span className="font-vazir">{user.meetingsToday.toLocaleString('fa-IR')} جلسه</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <span className="text-sm font-medium font-vazir">%{user.targetProgress.toLocaleString('fa-IR')}</span>
                      {user.targetProgress >= 70 ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <Progress value={user.targetProgress} className="w-20 h-2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-secondary/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse font-vazir">
              <Target className="h-5 w-5 text-secondary" />
              <span>لیدهای مهم</span>
            </CardTitle>
            <CardDescription className="font-vazir">مشتریان با اولویت بالا</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.importantLeads.slice(0, 4).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-secondary/30 transition-all duration-300">
                  <div>
                    <p className="font-medium font-vazir">{lead.name}</p>
                    <div className="flex items-center space-x-2 space-x-reverse mt-1">
                      <Badge variant={lead.status === 'follow_up' ? 'default' : 'secondary'} className="font-vazir">
                        {lead.status === 'follow_up' ? 'نیاز به پیگیری' : 
                         lead.status === 'active' ? 'فعال' : 'غیرفعال'}
                      </Badge>
                      <span className="text-sm text-muted-foreground font-vazir">
                        {(lead.potentialValue! / 1000000).toLocaleString('fa-IR')}M تومان
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="font-vazir">
                    مشاهده
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* تسک‌های شخصی و برنامه امروز */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 hover:border-accent/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse font-vazir">
              <CheckCircle className="h-5 w-5 text-accent" />
              <span>تسک‌های من</span>
            </CardTitle>
            <CardDescription className="font-vazir">کارهای امروز شما</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-accent/30 transition-all duration-300">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`h-3 w-3 rounded-full ${
                      task.priority === 'high' ? 'bg-destructive' :
                      task.priority === 'medium' ? 'bg-accent' : 'bg-secondary'
                    }`} />
                    <div>
                      <p className="font-medium font-vazir">{task.title}</p>
                      <p className="text-sm text-muted-foreground font-vazir">
                        {new Date(task.dueDate).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={
                    task.status === 'pending' ? 'destructive' :
                    task.status === 'in_progress' ? 'default' : 'secondary'
                  } className="font-vazir">
                    {task.status === 'pending' ? 'در انتظار' :
                     task.status === 'in_progress' ? 'در حال انجام' : 'تکمیل'}
                  </Badge>
                </div>
              ))}
              {userTasks.length === 0 && (
                <p className="text-center text-muted-foreground font-vazir py-4">
                  تسک جدیدی وجود ندارد
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse font-vazir">
              <Calendar className="h-5 w-5 text-primary" />
              <span>برنامه امروز</span>
            </CardTitle>
            <CardDescription className="font-vazir">جلسات و تماس‌های امروز</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`p-2 rounded-full ${
                      event.type === 'meeting' ? 'bg-primary/10 text-primary' :
                      event.type === 'call' ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
                    }`}>
                      {event.type === 'meeting' ? <Calendar className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium font-vazir">{event.title}</p>
                      <p className="text-sm text-muted-foreground font-vazir">
                        {new Date(event.startDate).toLocaleTimeString('fa-IR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} - {event.customerName}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-vazir">
                    {event.type === 'meeting' ? 'جلسه' : 'تماس'}
                  </Badge>
                </div>
              ))}
              {todayEvents.length === 0 && (
                <p className="text-center text-muted-foreground font-vazir py-4">
                  برنامه‌ای برای امروز وجود ندارد
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فعالیت‌های اخیر */}
      <Card className="border-border/50 hover:border-secondary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse font-vazir">
            <Clock className="h-5 w-5 text-secondary" />
            <span>فعالیت‌های اخیر</span>
          </CardTitle>
          <CardDescription className="font-vazir">آخرین تعاملات با مشتریان</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 space-x-reverse p-4 border border-border/50 rounded-lg hover:border-secondary/30 transition-all duration-300">
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
                  <p className="text-sm text-muted-foreground mt-1 font-vazir">{activity.customerName}</p>
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
          </div>
        </CardContent>
      </Card>

      {/* اقدامات سریع */}
      <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="font-vazir">اقدامات سریع</CardTitle>
          <CardDescription className="font-vazir">عملیات پرکاربرد</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300 font-vazir">
              <Users className="h-6 w-6 mb-2 text-primary" />
              افزودن مشتری
            </Button>
            <Button variant="outline" className="h-20 flex-col border-secondary/20 hover:border-secondary hover:bg-secondary/5 transition-all duration-300 font-vazir">
              <Phone className="h-6 w-6 mb-2 text-secondary" />
              ثبت تماس
            </Button>
            <Button variant="outline" className="h-20 flex-col border-accent/20 hover:border-accent hover:bg-accent/5 transition-all duration-300 font-vazir">
              <Calendar className="h-6 w-6 mb-2 text-accent" />
              جلسه جدید
            </Button>
            <Button variant="outline" className="h-20 flex-col border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300 font-vazir">
              <TrendingUp className="h-6 w-6 mb-2 text-primary" />
              فرصت جدید
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}