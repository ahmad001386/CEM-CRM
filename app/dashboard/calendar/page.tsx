'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockCalendarEvents, mockTasks } from '@/lib/mock-data';
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Phone,
  Users,
  Clock,
  MapPin,
} from 'lucide-react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  // تقویم فارسی
  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const persianDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

  const toPersianDate = (date: Date) => {
    // تبدیل ساده به تقویم فارسی (برای نمایش)
    const persianDate = new Intl.DateTimeFormat('fa-IR').format(date);
    return persianDate;
  };

  const getCurrentPersianMonth = () => {
    const month = currentDate.getMonth();
    return persianMonths[month];
  };

  const getCurrentPersianYear = () => {
    return (currentDate.getFullYear() - 621).toString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date: Date) => {
    return mockCalendarEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getTasksForDate = (date: Date) => {
    return mockTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const renderMonthView = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // روزهای خالی ابتدای ماه
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border border-border/20"></div>);
    }

    // روزهای ماه
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const events = getEventsForDate(date);
      const tasks = getTasksForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div key={day} className={`h-32 border border-border/20 p-2 ${isToday ? 'bg-primary/5 border-primary/30' : ''}`}>
          <div className={`text-sm font-medium mb-2 font-vazir ${isToday ? 'text-primary' : ''}`}>
            {day.toLocaleString('fa-IR')}
          </div>
          <div className="space-y-1">
            {events.slice(0, 2).map(event => (
              <div key={event.id} className={`text-xs p-1 rounded truncate font-vazir ${
                event.type === 'meeting' ? 'bg-primary/10 text-primary' :
                event.type === 'call' ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
              }`}>
                {event.title}
              </div>
            ))}
            {tasks.slice(0, 1).map(task => (
              <div key={task.id} className="text-xs p-1 rounded truncate bg-gray-100 dark:bg-gray-800 font-vazir">
                {task.title}
              </div>
            ))}
            {(events.length + tasks.length) > 3 && (
              <div className="text-xs text-muted-foreground font-vazir">
                +{(events.length + tasks.length - 3).toLocaleString('fa-IR')} مورد دیگر
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0 border border-border/20 rounded-lg overflow-hidden">
        {persianDays.map(day => (
          <div key={day} className="bg-muted p-3 text-center font-medium font-vazir border-b border-border/20">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderTodayEvents = () => {
    const today = new Date();
    const todayEvents = getEventsForDate(today);
    const todayTasks = getTasksForDate(today);

    return (
      <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse font-vazir">
            <Clock className="h-5 w-5" />
            <span>برنامه امروز</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`p-2 rounded-full ${
                    event.type === 'meeting' ? 'bg-primary/10 text-primary' :
                    event.type === 'call' ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
                  }`}>
                    {event.type === 'meeting' ? <Users className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium font-vazir">{event.title}</p>
                    <p className="text-sm text-muted-foreground font-vazir">
                      {new Date(event.startDate).toLocaleTimeString('fa-IR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} - {event.customerName}
                    </p>
                    {event.location && (
                      <p className="text-xs text-muted-foreground flex items-center space-x-1 space-x-reverse mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="font-vazir">{event.location}</span>
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={event.status === 'scheduled' ? 'default' : 'secondary'} className="font-vazir">
                  {event.status === 'scheduled' ? 'برنامه‌ریزی شده' : 
                   event.status === 'completed' ? 'تکمیل شده' : 'لغو شده'}
                </Badge>
              </div>
            ))}
            
            {todayTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-accent/30 transition-all duration-300">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`h-3 w-3 rounded-full ${
                    task.priority === 'high' ? 'bg-destructive' :
                    task.priority === 'medium' ? 'bg-accent' : 'bg-secondary'
                  }`} />
                  <div>
                    <p className="font-medium font-vazir">{task.title}</p>
                    <p className="text-sm text-muted-foreground font-vazir">{task.description}</p>
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

            {todayEvents.length === 0 && todayTasks.length === 0 && (
              <p className="text-center text-muted-foreground font-vazir py-4">
                برنامه‌ای برای امروز وجود ندارد
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            تقویم کاری
          </h1>
          <p className="text-muted-foreground font-vazir mt-2">مدیریت جلسات، تماس‌ها و تسک‌ها</p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <div className="flex border border-border rounded-lg">
            <Button
              variant={view === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('month')}
              className="font-vazir"
            >
              ماهانه
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('week')}
              className="font-vazir"
            >
              هفتگی
            </Button>
            <Button
              variant={view === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('day')}
              className="font-vazir"
            >
              روزانه
            </Button>
          </div>
          <Button className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 font-vazir">
            <Plus className="h-4 w-4 ml-2" />
            رویداد جدید
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* تقویم اصلی */}
        <div className="lg:col-span-3">
          <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 space-x-reverse font-vazir">
                  <Calendar className="h-5 w-5" />
                  <span>{getCurrentPersianMonth()} {getCurrentPersianYear()}</span>
                </CardTitle>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="font-vazir">
                    امروز
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {view === 'month' && renderMonthView()}
              {view === 'week' && (
                <div className="text-center py-8 text-muted-foreground font-vazir">
                  نمای هفتگی در حال توسعه است
                </div>
              )}
              {view === 'day' && (
                <div className="text-center py-8 text-muted-foreground font-vazir">
                  نمای روزانه در حال توسعه است
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* سایدبار */}
        <div className="space-y-6">
          {renderTodayEvents()}

          {/* رویدادهای آینده */}
          <Card className="border-border/50 hover:border-secondary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="font-vazir">رویدادهای آینده</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockCalendarEvents
                  .filter(event => new Date(event.startDate) > new Date())
                  .slice(0, 5)
                  .map(event => (
                    <div key={event.id} className="flex items-center space-x-3 space-x-reverse p-2 border border-border/50 rounded-lg hover:border-secondary/30 transition-all duration-300">
                      <div className={`p-1 rounded-full ${
                        event.type === 'meeting' ? 'bg-primary/10 text-primary' :
                        event.type === 'call' ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
                      }`}>
                        {event.type === 'meeting' ? <Users className="h-3 w-3" /> : <Phone className="h-3 w-3" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium font-vazir">{event.title}</p>
                        <p className="text-xs text-muted-foreground font-vazir">
                          {new Date(event.startDate).toLocaleDateString('fa-IR')}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* آمار سریع */}
          <Card className="border-border/50 hover:border-accent/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="font-vazir">آمار این ماه</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-vazir">جلسات</span>
                  <span className="font-bold font-vazir">
                    {mockCalendarEvents.filter(e => e.type === 'meeting').length.toLocaleString('fa-IR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-vazir">تماس‌ها</span>
                  <span className="font-bold font-vazir">
                    {mockCalendarEvents.filter(e => e.type === 'call').length.toLocaleString('fa-IR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-vazir">تسک‌ها</span>
                  <span className="font-bold font-vazir">
                    {mockTasks.length.toLocaleString('fa-IR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-vazir">تکمیل شده</span>
                  <span className="font-bold text-green-600 font-vazir">
                    {mockTasks.filter(t => t.status === 'completed').length.toLocaleString('fa-IR')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}