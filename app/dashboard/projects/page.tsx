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
  DollarSign,
} from 'lucide-react';
import { mockProjects, mockUsers } from '@/lib/mock-data';

export default function ProjectsPage() {
  const [projects] = useState(mockProjects);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : 'نامشخص';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'in_progress': return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200';
      case 'review': return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'on_hold': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'برنامه‌ریزی';
      case 'in_progress': return 'در حال انجام';
      case 'review': return 'بررسی';
      case 'completed': return 'تکمیل شده';
      case 'on_hold': return 'متوقف شده';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'اولویت بالا';
      case 'medium': return 'اولویت متوسط';
      case 'low': return 'اولویت کم';
      default: return priority;
    }
  };

  const filteredProjects = selectedStatus === 'all' ? projects : projects.filter(p => p.status === selectedStatus);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            پروژه‌ها
          </h1>
          <p className="text-muted-foreground font-vazir mt-2">
            مدیریت و پیگیری پروژه‌های در حال انجام
          </p>
        </div>
        <Button className="font-vazir">
          <Plus className="h-4 w-4 ml-2" />
          پروژه جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">
              کل پروژه‌ها
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">{projects.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 hover:border-secondary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">
              در حال انجام
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">
              {projects.filter(p => p.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 hover:border-accent/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">
              تکمیل شده
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">
              {projects.filter(p => p.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">
              بودجه کل
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">
              {(projects.reduce((sum, p) => sum + p.budget, 0) / 1000000).toLocaleString('fa-IR')}M
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="font-vazir">همه</TabsTrigger>
          <TabsTrigger value="planning" className="font-vazir">برنامه‌ریزی</TabsTrigger>
          <TabsTrigger value="in_progress" className="font-vazir">در حال انجام</TabsTrigger>
          <TabsTrigger value="review" className="font-vazir">بررسی</TabsTrigger>
          <TabsTrigger value="completed" className="font-vazir">تکمیل شده</TabsTrigger>
          <TabsTrigger value="on_hold" className="font-vazir">متوقف</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="border-border/50 hover:border-primary/20 transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl font-vazir">{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground font-vazir">{project.description}</p>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <Badge variant="outline" className={`${getStatusColor(project.status)} font-vazir`}>
                    {getStatusLabel(project.status)}
                  </Badge>
                  <Badge variant="outline" className={`${getPriorityColor(project.priority)} font-vazir`}>
                    {getPriorityLabel(project.priority)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-vazir">پیشرفت پروژه</span>
                  <span className="font-vazir">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 space-x-reverse text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="font-vazir">{project.customerName}</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="font-vazir">
                    {new Date(project.endDate).toLocaleDateString('fa-IR')}
                  </span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span className="font-vazir">{project.tasks} وظیفه</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-vazir">{project.completedTasks} تکمیل شده</span>
                </div>
              </div>

              {/* Budget Information */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-vazir">بودجه مصرفی</span>
                  <span className="font-vazir">
                    {((project.spent / project.budget) * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={(project.spent / project.budget) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-vazir">
                    مصرف شده: {(project.spent / 1000000).toLocaleString('fa-IR')}M
                  </span>
                  <span className="font-vazir">
                    کل: {(project.budget / 1000000).toLocaleString('fa-IR')}M
                  </span>
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium font-vazir">اعضای تیم</span>
                  <div className="flex -space-x-2 space-x-reverse">
                    {project.team.map((memberId, index) => (
                      <Avatar key={memberId} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-xs font-vazir bg-primary/10 text-primary">
                          {getUserName(memberId).split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-2">
                <span className="text-sm font-medium font-vazir">نقاط عطف</span>
                <div className="space-y-1">
                  {project.milestones.slice(0, 2).map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {milestone.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="font-vazir">{milestone.name}</span>
                      </div>
                      <span className="text-muted-foreground font-vazir">
                        {new Date(milestone.date).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 space-x-reverse pt-2">
                <Button variant="outline" size="sm" className="font-vazir">
                  مشاهده جزئیات
                </Button>
                <Button variant="outline" size="sm" className="font-vazir">
                  ویرایش
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}