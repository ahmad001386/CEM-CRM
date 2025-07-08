'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  FileText,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Target,
  Briefcase,
  Settings,
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  customerId: string;
  customerName: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  teamMembers: string[];
  tasks: ProjectTask[];
  milestones: Milestone[];
}

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'todo' | 'in_progress' | 'completed';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
  progress: number;
}

export default function ProjectsPage() {
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'پیاده‌سازی سیستم CRM شرکت آکمه',
      description: 'پیاده‌سازی کامل سیستم مدیریت روابط مشتریان برای شرکت آکمه',
      customerId: '1',
      customerName: 'شرکت آکمه',
      status: 'in_progress',
      priority: 'high',
      progress: 65,
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      budget: 200000000,
      spent: 130000000,
      teamMembers: ['مریم احمدی', 'علی جعفری', 'حسن محمدی'],
      tasks: [
        {
          id: '1',
          title: 'تحلیل نیازمندی‌ها',
          description: 'بررسی و تحلیل نیازهای مشتری',
          assignedTo: 'مریم احمدی',
          status: 'completed',
          dueDate: '2024-01-25',
          priority: 'high',
        },
        {
          id: '2',
          title: 'طراحی معماری سیستم',
          description: 'طراحی معماری کلی سیستم CRM',
          assignedTo: 'علی جعفری',
          status: 'in_progress',
          dueDate: '2024-02-05',
          priority: 'high',
        },
        {
          id: '3',
          title: 'توسعه ماژول مشتریان',
          description: 'پیاده‌سازی ماژول مدیریت مشتریان',
          assignedTo: 'حسن محمدی',
          status: 'todo',
          dueDate: '2024-02-20',
          priority: 'medium',
        },
      ],
      milestones: [
        {
          id: '1',
          title: 'تکمیل تحلیل نیازمندی‌ها',
          description: 'تحلیل کامل نیازهای مشتری و تایید نهایی',
          dueDate: '2024-01-25',
          status: 'completed',
          progress: 100,
        },
        {
          id: '2',
          title: 'تحویل نسخه آزمایشی',
          description: 'تحویل نسخه اولیه برای تست مشتری',
          dueDate: '2024-02-15',
          status: 'pending',
          progress: 40,
        },
      ],
    },
    {
      id: '2',
      name: 'مشاوره CRM پارس تک',
      description: 'ارائه مشاوره و راهنمایی برای بهینه‌سازی فرآیندهای CRM',
      customerId: '2',
      customerName: 'راه‌حل‌های فناوری پارس',
      status: 'planning',
      priority: 'medium',
      progress: 25,
      startDate: '2024-02-01',
      endDate: '2024-04-01',
      budget: 75000000,
      spent: 18750000,
      teamMembers: ['زهرا کریمی', 'مریم احمدی'],
      tasks: [
        {
          id: '4',
          title: 'بررسی فرآیندهای فعلی',
          description: 'تحلیل فرآیندهای موجود مشتری',
          assignedTo: 'زهرا کریمی',
          status: 'in_progress',
          dueDate: '2024-02-10',
          priority: 'high',
        },
      ],
      milestones: [
        {
          id: '3',
          title: 'تکمیل بررسی اولیه',
          description: 'بررسی کامل وضعیت فعلی مشتری',
          dueDate: '2024-02-15',
          status: 'pending',
          progress: 25,
        },
      ],
    },
  ]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'برنامه‌ریزی';
      case 'in_progress': return 'در حال اجرا';
      case 'review': return 'بررسی';
      case 'completed': return 'تکمیل شده';
      case 'on_hold': return 'متوقف';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'secondary';
      case 'in_progress': return 'default';
      case 'review': return 'default';
      case 'completed': return 'default';
      case 'on_hold': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'بالا';
      case 'medium': return 'متوسط';
      case 'low': return 'پایین';
      default: return priority;
    }
  };

  const getTaskStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return 'انجام نشده';
      case 'in_progress': return 'در حال انجام';
      case 'completed': return 'تکمیل شده';
      default: return status;
    }
  };

  const activeProjects = projects.filter(p => p.status === 'in_progress');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const onHoldProjects = projects.filter(p => p.status === 'on_hold');
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            مدیریت پروژه‌ها
          </h1>
          <p className="text-muted-foreground font-vazir mt-2">پیگیری و مدیریت پروژه‌های مشتریان</p>
        </div>
        <Button className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 font-vazir">
          <Plus className="h-4 w-4 ml-2" />
          پروژه جدید
        </Button>
      </div>

      {/* آمار پروژه‌ها */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">کل پروژه‌ها</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">{projects.length.toLocaleString('fa-IR')}</div>
            <p className="text-xs text-muted-foreground font-vazir">
              {activeProjects.length.toLocaleString('fa-IR')} در حال اجرا
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-secondary/20 hover:border-secondary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">تکمیل شده</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 font-vazir">{completedProjects.length.toLocaleString('fa-IR')}</div>
            <p className="text-xs text-muted-foreground font-vazir">
              موفقیت‌آمیز
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-accent/20 hover:border-accent/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">بودجه کل</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">
              {(totalBudget / 1000000000).toFixed(1)} میلیارد
            </div>
            <p className="text-xs text-muted-foreground font-vazir">
              تومان
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-destructive/20 hover:border-destructive/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">هزینه شده</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">
              {((totalSpent / totalBudget) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground font-vazir">
              از بودجه کل
            </p>
          </CardContent>
        </Card>
      </div>

      {/* تب‌های پروژه‌ها */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="font-vazir">همه پروژه‌ها</TabsTrigger>
          <TabsTrigger value="active" className="font-vazir">در حال اجرا</TabsTrigger>
          <TabsTrigger value="planning" className="font-vazir">برنامه‌ریزی</TabsTrigger>
          <TabsTrigger value="completed" className="font-vazir">تکمیل شده</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.id} className="border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-vazir">{project.name}</CardTitle>
                    <Badge variant={getStatusColor(project.status)} className="font-vazir">
                      {getStatusLabel(project.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-vazir">{project.customerName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm font-vazir">{project.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-vazir">
                        <span>پیشرفت</span>
                        <span>%{project.progress.toLocaleString('fa-IR')}</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground font-vazir">شروع</p>
                        <p className="font-vazir">{new Date(project.startDate).toLocaleDateString('fa-IR')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-vazir">پایان</p>
                        <p className="font-vazir">{new Date(project.endDate).toLocaleDateString('fa-IR')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground font-vazir">بودجه</p>
                        <p className="font-vazir">{(project.budget / 1000000).toLocaleString('fa-IR')}M تومان</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-vazir">هزینه شده</p>
                        <p className="font-vazir">{(project.spent / 1000000).toLocaleString('fa-IR')}M تومان</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2 font-vazir">تیم پروژه</p>
                      <div className="flex -space-x-2 space-x-reverse">
                        {project.teamMembers.map((member, index) => (
                          <Avatar key={index} className="h-8 w-8 border-2 border-background">
                            <AvatarFallback className="bg-gradient-to-br from-primary via-secondary to-accent text-white text-xs font-vazir">
                              {member.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button size="sm" className="font-vazir">
                        <FileText className="h-4 w-4 ml-1" />
                        جزئیات
                      </Button>
                      <Button size="sm" variant="outline" className="font-vazir">
                        <Settings className="h-4 w-4 ml-1" />
                        مدیریت
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="grid gap-6 md:grid-cols-2">
            {activeProjects.map((project) => (
              <Card key={project.id} className="border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-vazir">{project.name}</CardTitle>
                    <Badge variant="default" className="font-vazir">در حال اجرا</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-vazir">{project.customerName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-vazir">
                        <span>پیشرفت</span>
                        <span>%{project.progress.toLocaleString('fa-IR')}</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2 font-vazir">تسک‌های فعال</p>
                      <div className="space-y-2">
                        {project.tasks.filter(t => t.status !== 'completed').slice(0, 3).map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-2 border border-border/50 rounded">
                            <div>
                              <p className="text-sm font-vazir">{task.title}</p>
                              <p className="text-xs text-muted-foreground font-vazir">{task.assignedTo}</p>
                            </div>
                            <Badge variant={task.status === 'in_progress' ? 'default' : 'secondary'} className="text-xs font-vazir">
                              {getTaskStatusLabel(task.status)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button size="sm" className="font-vazir">
                        <FileText className="h-4 w-4 ml-1" />
                        جزئیات
                      </Button>
                      <Button size="sm" variant="outline" className="font-vazir">
                        <Calendar className="h-4 w-4 ml-1" />
                        تایم‌لاین
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="planning">
          <div className="grid gap-6 md:grid-cols-2">
            {projects.filter(p => p.status === 'planning').map((project) => (
              <Card key={project.id} className="border-border/50 hover:border-secondary/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-vazir">{project.name}</CardTitle>
                    <Badge variant="secondary" className="font-vazir">برنامه‌ریزی</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-vazir">{project.customerName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm font-vazir">{project.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground font-vazir">شروع برنامه‌ریزی شده</p>
                        <p className="font-vazir">{new Date(project.startDate).toLocaleDateString('fa-IR')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-vazir">بودجه تخمینی</p>
                        <p className="font-vazir">{(project.budget / 1000000).toLocaleString('fa-IR')}M تومان</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button size="sm" className="font-vazir">
                        شروع پروژه
                      </Button>
                      <Button size="sm" variant="outline" className="font-vazir">
                        ویرایش برنامه
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-6 md:grid-cols-2">
            {completedProjects.map((project) => (
              <Card key={project.id} className="border-border/50 hover:border-secondary/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-vazir">{project.name}</CardTitle>
                    <Badge variant="default" className="font-vazir">تکمیل شده</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-vazir">{project.customerName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground font-vazir">تاریخ تکمیل</p>
                        <p className="font-vazir">{new Date(project.endDate).toLocaleDateString('fa-IR')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-vazir">هزینه نهایی</p>
                        <p className="font-vazir">{(project.spent / 1000000).toLocaleString('fa-IR')}M تومان</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button size="sm" variant="outline" className="font-vazir">
                        <FileText className="h-4 w-4 ml-1" />
                        گزارش نهایی
                      </Button>
                      <Button size="sm" variant="outline" className="font-vazir">
                        بازخورد مشتری
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {completedProjects.length === 0 && (
              <p className="text-center text-muted-foreground font-vazir py-8 col-span-2">
                پروژه تکمیل شده‌ای وجود ندارد
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}