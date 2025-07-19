'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Calendar,
  Filter,
  Users,
} from 'lucide-react';

// نمونه داده برای کاربران
const mockUsers = [
  {
    id: '1',
    name: 'علی محمدی',
    email: 'ali@example.com',
    avatar: null,
    role: 'مدیر فروش',
  },
  {
    id: '2',
    name: 'سارا احمدی',
    email: 'sara@example.com',
    avatar: null,
    role: 'کارشناس پشتیبانی',
  },
  {
    id: '3',
    name: 'رضا کریمی',
    email: 'reza@example.com',
    avatar: null,
    role: 'توسعه‌دهنده',
  },
  {
    id: '4',
    name: 'مریم حسینی',
    email: 'maryam@example.com',
    avatar: null,
    role: 'مدیر محصول',
  },
];

// نمونه داده برای وظایف
const mockTasks = [
  {
    id: '1',
    title: 'تماس با مشتری جدید',
    description: 'پیگیری درخواست همکاری و ارسال پیش‌فاکتور',
    status: 'pending',
    priority: 'high',
    dueDate: '2025-07-20',
    assignee: {
      name: 'علی محمدی',
      avatar: null,
      email: 'ali@example.com',
    },
    completed: false,
  },
  {
    id: '2',
    title: 'بررسی گزارش ماهانه',
    description: 'تحلیل عملکرد تیم فروش و تهیه گزارش برای مدیریت',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2025-07-18',
    assignee: {
      name: 'سارا احمدی',
      avatar: null,
      email: 'sara@example.com',
    },
    completed: false,
  },
  {
    id: '3',
    title: 'به‌روزرسانی وب‌سایت',
    description: 'اضافه کردن محصولات جدید و به‌روزرسانی قیمت‌ها',
    status: 'completed',
    priority: 'low',
    dueDate: '2025-07-15',
    assignee: {
      name: 'رضا کریمی',
      avatar: null,
      email: 'reza@example.com',
    },
    completed: true,
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(mockTasks);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigneeId: '',
    priority: 'medium',
    dueDate: '',
  });

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = () => {
    const assignee = mockUsers.find(user => user.id === newTask.assigneeId);
    const task = {
      id: (tasks.length + 1).toString(),
      ...newTask,
      status: 'pending',
      completed: false,
      assignee: assignee || mockUsers[0],
    };
    setTasks([task, ...tasks]);
    setShowAddTask(false);
    setNewTask({
      title: '',
      description: '',
      assigneeId: '',
      priority: 'medium',
      dueDate: '',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-950';
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-950';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-950';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'ضروری';
      case 'medium': return 'متوسط';
      case 'low': return 'عادی';
      default: return priority;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* هدر */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            مدیریت وظایف
          </h1>
          <p className="text-muted-foreground font-vazir mt-2">مدیریت و پیگیری وظایف تیم</p>
        </div>
        <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 font-vazir"
            >
              <Plus className="h-4 w-4 ml-2" />
              وظیفه جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-vazir text-lg">ایجاد وظیفه جدید</DialogTitle>
              <DialogDescription className="font-vazir text-sm text-muted-foreground">
                مشخصات وظیفه جدید را وارد کنید
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium font-vazir">عنوان وظیفه</label>
                <Input
                  placeholder="عنوان وظیفه را وارد کنید"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="font-vazir"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium font-vazir">توضیحات</label>
                <Textarea
                  placeholder="توضیحات وظیفه را وارد کنید"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="font-vazir"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium font-vazir">اولویت</label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger className="font-vazir">
                      <SelectValue placeholder="انتخاب اولویت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high" className="font-vazir">ضروری</SelectItem>
                      <SelectItem value="medium" className="font-vazir">متوسط</SelectItem>
                      <SelectItem value="low" className="font-vazir">عادی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium font-vazir">تاریخ سررسید</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="font-vazir"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium font-vazir">محول به</label>
                <Select
                  value={newTask.assigneeId}
                  onValueChange={(value) => setNewTask({ ...newTask, assigneeId: value })}
                >
                  <SelectTrigger className="font-vazir">
                    <SelectValue placeholder="انتخاب همکار" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map(user => (
                      <SelectItem key={user.id} value={user.id} className="font-vazir">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="font-vazir bg-primary/10 text-primary text-xs">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.role}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddTask(false)}
                  className="font-vazir"
                >
                  انصراف
                </Button>
                <Button
                  onClick={handleAddTask}
                  disabled={!newTask.title || !newTask.assigneeId || !newTask.dueDate}
                  className="font-vazir bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  ایجاد وظیفه
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* آمار سریع */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">کل وظایف</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">{tasks.length.toLocaleString('fa-IR')}</div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 hover:border-yellow-400 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">در حال انجام</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 font-vazir">
              {tasks.filter(t => !t.completed && t.status === 'in_progress').length.toLocaleString('fa-IR')}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 hover:border-red-400 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">ضروری</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 font-vazir">
              {tasks.filter(t => t.priority === 'high' && !t.completed).length.toLocaleString('fa-IR')}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 hover:border-green-400 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">تکمیل شده</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 font-vazir">
              {tasks.filter(t => t.completed).length.toLocaleString('fa-IR')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* لیست وظایف */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 space-x-reverse font-vazir">
              <CheckCircle2 className="h-5 w-5" />
              <span>لیست وظایف</span>
            </CardTitle>
            <Button variant="outline" size="sm" className="font-vazir">
              <Filter className="h-4 w-4 ml-2" />
              فیلتر
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`flex items-start space-x-4 space-x-reverse p-4 border rounded-lg transition-all duration-300 ${task.completed
                  ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-900/20'
                  : 'border-border/50 hover:border-primary/30'
                  }`}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-medium font-vazir ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h4>
                      <p className={`text-sm text-muted-foreground font-vazir mt-1 ${task.completed ? 'line-through' : ''}`}>
                        {task.description}
                      </p>
                    </div>
                    <Badge variant="outline" className={`${getPriorityColor(task.priority)} font-vazir`}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse mt-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="font-vazir bg-primary/10 text-primary text-xs">
                          {task.assignee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground font-vazir">
                        {task.assignee.name}
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 ml-1" />
                      <span className="text-sm font-vazir">
                        {new Date(task.dueDate).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}