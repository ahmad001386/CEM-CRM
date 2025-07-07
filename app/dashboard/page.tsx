'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { mockDashboardStats, mockChartData, mockFeedback, mockTickets } from '@/lib/mock-data';
import {
  Users,
  Ticket,
  TrendingUp,
  Star,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const stats = mockDashboardStats;
  const recentTickets = mockTickets.slice(0, 5);
  const recentFeedback = mockFeedback.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            داشبورد مدیریت
          </h1>
          <p className="text-muted-foreground font-vazir mt-2">نمای کلی از عملکرد سیستم و آمار مهم</p>
        </div>
        <Button className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 font-vazir">
          تولید گزارش
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="کل مشتریان"
          value={stats.totalCustomers.toLocaleString('fa-IR')}
          description={`${stats.activeCustomers.toLocaleString('fa-IR')} مشتری فعال`}
          icon={Users}
          trend={{ value: 12, label: 'نسبت به ماه گذشته' }}
          className="border-primary/20 hover:border-primary/40 transition-all duration-300"
        />
        <StatCard
          title="تیکت‌های باز"
          value={stats.openTickets.toLocaleString('fa-IR')}
          description={`${stats.ticketResolutionTime} روز میانگین حل`}
          icon={Ticket}
          trend={{ value: -5, label: 'نسبت به هفته گذشته' }}
          className="border-accent/20 hover:border-accent/40 transition-all duration-300"
        />
        <StatCard
          title="رضایت مشتری"
          value={`${stats.avgSatisfactionScore}/۵`}
          description="میانگین امتیاز CSAT"
          icon={Star}
          trend={{ value: 3, label: 'نسبت به ماه گذشته' }}
          className="border-secondary/20 hover:border-secondary/40 transition-all duration-300"
        />
        <StatCard
          title="درآمد ماهانه"
          value={`${(stats.monthlyRevenue / 1000000).toFixed(1)} میلیون`}
          description="درآمد ماه جاری"
          icon={DollarSign}
          trend={{ value: 8, label: 'نسبت به ماه گذشته' }}
          className="border-primary/20 hover:border-primary/40 transition-all duration-300"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="font-vazir flex items-center space-x-2 space-x-reverse">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>روند فروش</span>
            </CardTitle>
            <CardDescription className="font-vazir">درآمد ماهانه در ۱۲ ماه اخیر</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="font-vazir">نمودار روند فروش در اینجا نمایش داده می‌شود</p>
                <p className="text-sm font-vazir mt-2">پیشرفت ۱۲ ماهه درآمد</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="font-vazir flex items-center space-x-2 space-x-reverse">
              <PieChart className="h-5 w-5 text-secondary" />
              <span>رضایت مشتری</span>
            </CardTitle>
            <CardDescription className="font-vazir">توزیع امتیازات رضایت</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-secondary/5 via-accent/5 to-primary/5 rounded-lg">
              <div className="text-center">
                <Star className="h-12 w-12 mx-auto mb-4 text-secondary" />
                <p className="font-vazir">نمودار رضایت مشتری در اینجا نمایش داده می‌شود</p>
                <p className="text-sm font-vazir mt-2">توزیع امتیازات رضایت</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="font-vazir flex items-center space-x-2 space-x-reverse">
              <Ticket className="h-5 w-5 text-accent" />
              <span>تیکت‌های اخیر</span>
            </CardTitle>
            <CardDescription className="font-vazir">آخرین تیکت‌های پشتیبانی</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`h-2 w-2 rounded-full ${
                      ticket.priority === 'high' ? 'bg-destructive' :
                      ticket.priority === 'medium' ? 'bg-accent' : 'bg-secondary'
                    }`} />
                    <div>
                      <p className="font-medium font-vazir">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground font-vazir">{ticket.customerName}</p>
                    </div>
                  </div>
                  <Badge variant={
                    ticket.status === 'open' ? 'destructive' :
                    ticket.status === 'in_progress' ? 'default' : 'secondary'
                  } className="font-vazir">
                    {ticket.status === 'open' ? 'باز' :
                     ticket.status === 'in_progress' ? 'در حال انجام' : 'بسته'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="font-vazir flex items-center space-x-2 space-x-reverse">
              <Star className="h-5 w-5 text-secondary" />
              <span>بازخوردهای اخیر</span>
            </CardTitle>
            <CardDescription className="font-vazir">آخرین بازخوردهای مشتریان</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentFeedback.map((feedback) => (
                <div key={feedback.id} className="p-3 border border-border/50 rounded-lg hover:border-secondary/30 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium font-vazir">{feedback.customerName}</p>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm font-vazir">{feedback.score.toLocaleString('fa-IR')}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-vazir">{feedback.comment}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="font-vazir">
                      {feedback.type === 'csat' ? 'رضایت' : 
                       feedback.type === 'nps' ? 'توصیه' : 'سهولت'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(feedback.createdAt).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
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
            <Button variant="outline" className="h-20 flex-col border-accent/20 hover:border-accent hover:bg-accent/5 transition-all duration-300 font-vazir">
              <Ticket className="h-6 w-6 mb-2 text-accent" />
              ایجاد تیکت
            </Button>
            <Button variant="outline" className="h-20 flex-col border-secondary/20 hover:border-secondary hover:bg-secondary/5 transition-all duration-300 font-vazir">
              <TrendingUp className="h-6 w-6 mb-2 text-secondary" />
              فرصت جدید
            </Button>
            <Button variant="outline" className="h-20 flex-col border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300 font-vazir">
              <Star className="h-6 w-6 mb-2 text-primary" />
              ارسال نظرسنجی
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}