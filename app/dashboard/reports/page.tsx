'use client';

import { useState } from 'react';
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
  Filter,
  Target,
  UserCheck,
  RotateCcw,
  DollarSign,
  UserPlus,
  Clock,
  ThumbsUp,
  Headphones,
  PieChart
} from 'lucide-react';

// Import Recharts for professional charts
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function ReportsPage() {
  const stats = mockDashboardStats;

  // تعریف متغیرهای گم‌شده با مقادیر پیش‌فرض
  const monthlyGrowth = 15.7;
  const customerRetention = 92.3;
  const avgResolutionTime = 3.2;
  const satisfactionTrend = 8.5;

  // KPI Data - درصد فروش نسبت به هدف
  const salesTargetData = [
    { date: '۱۴۰۳/۰۱', actual: 85, target: 100 },
    { date: '۱۴۰۳/۰۲', actual: 120, target: 110 },
    { date: '۱۴۰۳/۰۳', actual: 95, target: 120 },
    { date: '۱۴۰۳/۰۴', actual: 140, target: 130 },
    { date: '۱۴۰۳/۰۵', actual: 160, target: 140 },
    { date: '۱۴۰۳/۰۶', actual: 135, target: 150 },
  ];

  // درصد مشتریان فعال
  const activeCustomersData = {
    total: 156,
    active: 142,
    inactive: 14,
    percentage: 91.0
  };

  // نرخ بازگشت مشتری
  const customerReturnData = {
    returning: 89,
    new: 67,
    returnRate: 57.1
  };

  // CLV Data
  const clvData = [
    { segment: 'سازمانی', clv: 45000000, count: 23 },
    { segment: 'کسب‌وکار کوچک', clv: 18000000, count: 67 },
    { segment: 'فردی', clv: 8500000, count: 66 }
  ];

  // مشتریان جدید
  const newCustomersData = [
    { month: 'فروردین', count: 12 },
    { month: 'اردیبهشت', count: 18 },
    { month: 'خرداد', count: 15 },
    { month: 'تیر', count: 22 },
    { month: 'مرداد', count: 19 },
    { month: 'شهریور', count: 25 }
  ];

  // زمان پاسخگویی تیکت‌ها
  const responseTimeData = {
    avgResponseTime: 2.3,
    under1Hour: 45,
    under4Hours: 78,
    over4Hours: 12
  };

  // نظرات مثبت
  const sentimentData = {
    positive: 68,
    neutral: 22,
    negative: 10
  };

  // تعداد تیکت‌های پشتیبانی
  const ticketData = [
    { status: 'باز', count: 23, color: '#ef4444' },
    { status: 'در حال انجام', count: 34, color: '#f59e0b' },
    { status: 'حل شده', count: 89, color: '#10b981' },
    { status: 'بسته شده', count: 156, color: '#6b7280' }
  ];

  const handleExportReport = (type: string) => {
    console.log(`در حال خروجی گرفتن گزارش ${type}...`);
    // در اینجا می‌توانید منطق خروجی گرفتن گزارش را اضافه کنید
  };

  // کامپوننت نمودار دایره‌ای
  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = '#00BCD4' }: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold font-vazir">{percentage.toLocaleString('fa-IR')}%</span>
        </div>
      </div>
    );
  };

  // کامپوننت جدول
  const DataTable = ({ data, columns }: any) => (
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column: any) => (
              <th
                key={column.key}
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-vazir"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row: any, index: number) => (
            <tr key={index}>
              {columns.map((column: any) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-vazir"
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            گزارش‌ها و تحلیل‌ها
          </h1>
          <p className="text-muted-foreground font-vazir mt-2">
            تحلیل روابط مشتریان و عملکرد کسب‌وکار شما
          </p>
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
            <CardTitle className="text-sm font-medium font-vazir">
              رشد ماهانه
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 font-vazir">
              +%{monthlyGrowth.toLocaleString('fa-IR')}
            </div>
            <p className="text-xs text-muted-foreground font-vazir">
              جذب مشتری
            </p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 hover:border-blue-400 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">
              نگهداری مشتری
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 font-vazir">
              %{customerRetention.toLocaleString('fa-IR')}
            </div>
            <p className="text-xs text-muted-foreground font-vazir">
              نرخ نگهداری ۱۲ ماهه
            </p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 hover:border-orange-400 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">
              میانگین زمان حل
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 font-vazir">
              {avgResolutionTime.toLocaleString('fa-IR')} روز
            </div>
            <p className="text-xs text-muted-foreground font-vazir">
              تیکت‌های پشتیبانی
            </p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 hover:border-yellow-400 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">
              رشد رضایت
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 font-vazir">
              +%{satisfactionTrend.toLocaleString('fa-IR')}
            </div>
            <p className="text-xs text-muted-foreground font-vazir">
              بهبود CSAT
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Sales Performance Chart */}
        <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-vazir">عملکرد فروش</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handleExportReport('فروش')} className="font-vazir">
              <Download className="h-4 w-4 ml-2" />
              خروجی
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesTargetData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" reversed={true} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actual" name="فروش واقعی" fill="#3b82f6" />
                  <Bar dataKey="target" name="هدف فروش" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Satisfaction Chart */}
        <Card className="border-border/50 hover:border-secondary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-vazir">رضایت مشتری</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handleExportReport('رضایت')} className="font-vazir">
              <Download className="h-4 w-4 ml-2" />
              خروجی
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={newCustomersData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" reversed={true} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="تعداد مشتریان جدید"
                    stroke="#8b5cf6"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
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
                <Badge variant="default" className="font-vazir">
                  +{Math.floor(monthlyGrowth).toLocaleString('fa-IR')}
                </Badge>
              </div>

              {/* Customer Segment Pie Chart */}
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={clvData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="segment"
                    >
                      {clvData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#ec4899'][index % 3]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              <DataTable
                data={clvData.map(item => ({
                  segment: item.segment,
                  clv: item.clv.toLocaleString('fa-IR'),
                  count: item.count.toLocaleString('fa-IR')
                }))}
                columns={[
                  { title: 'بخش', key: 'segment' },
                  { title: 'ارزش طول عمر (تومان)', key: 'clv' },
                  { title: 'تعداد', key: 'count' }
                ]}
              />
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
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm font-vazir mb-2">میانگین زمان پاسخگویی</p>
                  <CircularProgress
                    percentage={responseTimeData.avgResponseTime * 10}
                    color="#3b82f6"
                    size={100}
                  />
                  <p className="text-sm font-vazir mt-2">{responseTimeData.avgResponseTime.toLocaleString('fa-IR')} ساعت</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-vazir mb-2">وضعیت تیکت‌ها</p>
                  <div className="flex items-center justify-center h-full">
                    <ResponsiveContainer width="100%" height={150}>
                      <RechartsPieChart>
                        <Pie
                          data={ticketData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="count"
                        >
                          {ticketData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <DataTable
                data={ticketData.map(item => ({
                  status: item.status,
                  count: item.count.toLocaleString('fa-IR'),
                  percentage: `${Math.round((item.count / 302) * 100).toLocaleString('fa-IR')}%`
                }))}
                columns={[
                  { title: 'وضعیت', key: 'status' },
                  { title: 'تعداد', key: 'count' },
                  { title: 'درصد', key: 'percentage' }
                ]}
              />
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