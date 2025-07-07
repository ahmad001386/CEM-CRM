'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockDashboardStats, mockCustomers, mockTickets, mockFeedback } from '@/lib/mock-data';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Star, 
  Download,
  Calendar,
  Filter
} from 'lucide-react';

export default function ReportsPage() {
  const stats = mockDashboardStats;
  
  const monthlyGrowth = 15.2;
  const customerRetention = 94.5;
  const avgResolutionTime = 2.3;
  const satisfactionTrend = 8.1;

  const handleExportReport = (type: string) => {
    console.log(`در حال خروجی گرفتن گزارش ${type}...`);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            گزارش‌ها و تحلیل‌ها
          </h1>
          <p className="text-muted-foreground font-vazir mt-2">تحلیل روابط مشتریان و عملکرد کسب‌وکار شما</p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <Button variant="outline" className="font-vazir">
            <Filter className="h-4 w-4 ml-2" />
            فیلتر
          </Button>
          <Button variant="outline" className="font-vazir">
            <Calendar className="h-4 w-4 ml-2" />
            بازه زمانی
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-green-200 hover:border-green-400 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">رشد ماهانه</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 font-vazir">+%{monthlyGrowth.toLocaleString('fa-IR')}</div>
            <p className="text-xs text-muted-foreground font-vazir">جذب مشتری</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 hover:border-blue-400 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">نگهداری مشتری</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 font-vazir">%{customerRetention.toLocaleString('fa-IR')}</div>
            <p className="text-xs text-muted-foreground font-vazir">نرخ نگهداری ۱۲ ماهه</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 hover:border-orange-400 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">میانگین زمان حل</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 font-vazir">{avgResolutionTime.toLocaleString('fa-IR')} روز</div>
            <p className="text-xs text-muted-foreground font-vazir">تیکت‌های پشتیبانی</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 hover:border-yellow-400 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">رشد رضایت</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 font-vazir">+%{satisfactionTrend.toLocaleString('fa-IR')}</div>
            <p className="text-xs text-muted-foreground font-vazir">بهبود CSAT</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-vazir">عملکرد فروش</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handleExportReport('فروش')} className="font-vazir">
              <Download className="h-4 w-4 ml-2" />
              خروجی
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="font-vazir">نمودار روند فروش در اینجا نمایش داده می‌شود</p>
                <p className="text-sm font-vazir">پیشرفت درآمد ۱۲ ماهه</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-secondary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-vazir">رضایت مشتری</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handleExportReport('رضایت')} className="font-vazir">
              <Download className="h-4 w-4 ml-2" />
              خروجی
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-secondary/5 via-accent/5 to-primary/5 rounded-lg">
              <div className="text-center">
                <Star className="h-12 w-12 mx-auto mb-4 text-secondary" />
                <p className="font-vazir">نمودار توزیع CSAT در اینجا نمایش داده می‌شود</p>
                <p className="text-sm font-vazir">تفکیک امتیازات رضایت</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="font-vazir">گزارش رشد مشتری</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium font-vazir">مشتریان جدید (ماهانه)</span>
                <Badge variant="default" className="font-vazir">+{Math.floor(monthlyGrowth).toLocaleString('fa-IR')}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium font-vazir">بخش سازمانی</span>
                <Badge variant="secondary" className="font-vazir">
                  {mockCustomers.filter(c => c.segment === 'enterprise').length.toLocaleString('fa-IR')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium font-vazir">کسب‌وکار کوچک</span>
                <Badge variant="secondary" className="font-vazir">
                  {mockCustomers.filter(c => c.segment === 'small_business').length.toLocaleString('fa-IR')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium font-vazir">فردی</span>
                <Badge variant="secondary" className="font-vazir">
                  {mockCustomers.filter(c => c.segment === 'individual').length.toLocaleString('fa-IR')}
                </Badge>
              </div>
            </div>
            <Button className="w-full mt-4 font-vazir" onClick={() => handleExportReport('رشد-مشتری')}>
              <Download className="h-4 w-4 ml-2" />
              خروجی گزارش رشد مشتری
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-secondary/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="font-vazir">عملکرد پشتیبانی</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium font-vazir">تیکت‌های باز</span>
                <Badge variant="destructive" className="font-vazir">
                  {mockTickets.filter(t => t.status === 'open').length.toLocaleString('fa-IR')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium font-vazir">در حال انجام</span>
                <Badge variant="default" className="font-vazir">
                  {mockTickets.filter(t => t.status === 'in_progress').length.toLocaleString('fa-IR')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium font-vazir">حل شده</span>
                <Badge variant="secondary" className="font-vazir">
                  {mockTickets.filter(t => t.status === 'closed').length.toLocaleString('fa-IR')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium font-vazir">میانگین امتیاز CSAT</span>
                <Badge variant="default" className="font-vazir">
                  {stats.avgSatisfactionScore.toLocaleString('fa-IR')}/۵
                </Badge>
              </div>
            </div>
            <Button className="w-full mt-4 font-vazir" onClick={() => handleExportReport('عملکرد-پشتیبانی')}>
              <Download className="h-4 w-4 ml-2" />
              خروجی گزارش پشتیبانی
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Analysis */}
      <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="font-vazir">تحلیل بازخورد مشتریان</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium font-vazir">توزیع CSAT</h4>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map(score => {
                  const count = mockFeedback.filter(f => f.type === 'csat' && Math.floor(f.score) === score).length;
                  const percentage = mockFeedback.length > 0 ? (count / mockFeedback.length) * 100 : 0;
                  return (
                    <div key={score} className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-sm w-8 font-vazir">{score.toLocaleString('fa-IR')}★</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary via-secondary to-accent h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 font-vazir">{count.toLocaleString('fa-IR')}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium font-vazir">دسته‌بندی بازخوردها</h4>
              <div className="space-y-2">
                {['پشتیبانی', 'محصول', 'کلی'].map(category => {
                  const count = mockFeedback.filter(f => 
                    (category === 'پشتیبانی' && f.category === 'Support') ||
                    (category === 'محصول' && f.category === 'Product') ||
                    (category === 'کلی' && f.category === 'Overall')
                  ).length;
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm font-vazir">{category}</span>
                      <Badge variant="outline" className="font-vazir">{count.toLocaleString('fa-IR')}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium font-vazir">بازخوردهای اخیر</h4>
              <div className="space-y-2">
                {mockFeedback.slice(0, 3).map(feedback => (
                  <div key={feedback.id} className="p-2 border border-border/50 rounded hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium font-vazir">{feedback.customerName}</span>
                      <Badge variant="outline" className="font-vazir">{feedback.score.toLocaleString('fa-IR')}/۵</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate font-vazir">
                      {feedback.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}