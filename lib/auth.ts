'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { mockUsers, mockTasks } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

export default function CoworkerProfile() {
    const { id } = useParams();
    const { toast } = useToast();
    const user = mockUsers.find(u => u.id === id);
    const userTasks = mockTasks.filter(task => task.assignedTo === id);

    const accessOptions = [
        { id: 'tasks', label: 'دسترسی به لیست کلی وظایف' },
        { id: 'customers', label: 'دسترسی به مشتریان' },
        { id: 'sales', label: 'دسترسی به فروش' },
        { id: 'feedbacks', label: 'دسترسی به بازخورد‌ها' },
        { id: 'projects', label: 'دسترسی به پروژه‌ها' },
        { id: 'reports', label: 'دسترسی به گزارش‌ها' },
        { id: 'settings', label: 'دسترسی به تنظیمات' },
        { id: 'users', label: 'دسترسی به مدیریت کاربران' },
    ];

    const accessLevels = [
        { id: 'full', label: 'دسترسی کامل' },
        { id: 'limited', label: 'دسترسی محدود' },
        { id: 'custom', label: 'دسترسی سفارشی' },
    ];

    const [selectedAccessLevel, setSelectedAccessLevel] = useState('custom');
    const [access, setAccess] = useState({});

    useEffect(() => {
        if (user) {
            setAccess(
                accessOptions.reduce((acc, item) => {
                    acc[item.id] = user.role === 'ادمین'
                        ? true
                        : ['tasks', 'customers', 'projects'].includes(item.id);
                    return acc;
                }, {})
            );
        }
    }, [user]);

    const handleAccessLevelChange = (levelId) => {
        setSelectedAccessLevel(levelId);

        if (levelId === 'full') {
            setAccess(accessOptions.reduce((acc, item) => {
                acc[item.id] = true;
                return acc;
            }, {}));
        } else if (levelId === 'limited') {
            setAccess(accessOptions.reduce((acc, item) => {
                acc[item.id] = ['tasks', 'customers', 'projects'].includes(item.id);
                return acc;
            }, {}));
        }
    };

    const handleToggle = (id) => {
        setAccess((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleSave = () => {
        toast({
            title: "ذخیره تنظیمات",
            description: "سطح دسترسی با موفقیت ذخیره شد",
            variant: "success",
        });
    };

    if (!user) return null;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        پروفایل همکار
                    </h1>
                    <p className="text-muted-foreground font-vazir mt-2">مشاهده اطلاعات و وظایف همکار</p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <Card className="col-span-12 lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="font-vazir">اطلاعات شخصی</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-24 w-24">
                                <AvatarFallback className="bg-primary/10 text-primary font-vazir text-2xl">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <h2 className="text-xl font-bold font-vazir">{user.name}</h2>
                                <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary border-primary/20 font-vazir">
                                    {user.role}
                                </Badge>
                                <p className="text-sm text-muted-foreground mt-2 font-vazir">{user.email}</p>
                                <div className="mt-2 text-sm font-vazir">
                                    وضعیت: {user.status === 'online' ? 'آنلاین' : user.status === 'away' ? 'غایب' : 'آفلاین'}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-12 lg:col-span-8">
                    <CardContent className="pt-6">
                        <Tabs defaultValue="tasks" dir="rtl">
                            <TabsList className="w-full justify-start font-vazir">
                                <TabsTrigger value="tasks">وظایف</TabsTrigger>
                                <TabsTrigger value="stats">آمار عملکرد</TabsTrigger>
                                <TabsTrigger value="access">دسترسی‌ها</TabsTrigger>
                            </TabsList>

                            {/* Tasks Tab */}
                            <TabsContent value="tasks" className="space-y-4 mt-4">
                                {userTasks.length === 0 ? (
                                    <p className="text-center text-muted-foreground font-vazir">وظیفه‌ای یافت نشد</p>
                                ) : (
                                    userTasks.map(task => (
                                        <div key={task.id} className="p-4 rounded-lg bg-muted/30">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium font-vazir">{task.title}</h3>
                                                <Badge variant="secondary" className={`
                                                    ${task.priority === 'high' ? 'bg-red-100 text-red-700 border-red-200' :
                                                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                            'bg-green-100 text-green-700 border-green-200'}
                                                    font-vazir
                                                `}>
                                                    {task.priority === 'high' ? 'ضروری' :
                                                        task.priority === 'medium' ? 'متوسط' : 'عادی'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-2 font-vazir">{task.description}</p>
                                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground font-vazir">
                                                <span>تاریخ تحویل: {new Date(task.dueDate).toLocaleDateString('fa-IR')}</span>
                                                <span>وضعیت: {
                                                    task.status === 'pending' ? 'در انتظار' :
                                                        task.status === 'in_progress' ? 'در حال انجام' :
                                                            task.status === 'completed' ? 'تکمیل شده' : 'لغو شده'
                                                }</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </TabsContent>

                            {/* Stats Tab */}
                            <TabsContent value="stats">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-lg bg-muted/30">
                                            <h3 className="text-sm font-medium font-vazir">تعداد وظایف فعال</h3>
                                            <p className="text-2xl font-bold mt-2 font-vazir">
                                                {userTasks.filter(t => t.status === 'in_progress').length}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-muted/30">
                                            <h3 className="text-sm font-medium font-vazir">وظایف تکمیل شده</h3>
                                            <p className="text-2xl font-bold mt-2 font-vazir">
                                                {userTasks.filter(t => t.status === 'completed').length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Access Control Tab */}
                            <TabsContent value="access">
                                <div className="space-y-6">
                                    {/* Access Level Selection */}
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <h3 className="font-bold font-vazir mb-3">سطح دسترسی</h3>
                                        <div className="flex flex-wrap gap-4">
                                            {accessLevels.map((level) => (
                                                <div
                                                    key={level.id}
                                                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all ${selectedAccessLevel === level.id
                                                        ? 'bg-primary/10 border border-primary text-primary'
                                                        : 'bg-muted/50 hover:bg-muted'
                                                        }`}
                                                    onClick={() => handleAccessLevelChange(level.id)}
                                                >
                                                    <div
                                                        className={`w-4 h-4 rounded-full ${selectedAccessLevel === level.id
                                                            ? 'bg-primary'
                                                            : 'bg-muted-foreground/30'
                                                            }`}
                                                    ></div>
                                                    <span className="font-vazir">{level.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Access Toggles */}
                                    <div className="space-y-4">
                                        {accessOptions.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                            >
                                                <Label htmlFor={item.id} className="text-right font-vazir">
                                                    {item.label}
                                                </Label>
                                                <Switch
                                                    id={item.id}
                                                    checked={access[item.id]}
                                                    onCheckedChange={() => handleToggle(item.id)}
                                                    disabled={selectedAccessLevel !== 'custom'}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        className="w-full font-vazir"
                                        onClick={handleSave}
                                        disabled={selectedAccessLevel === 'custom' && Object.values(access).every(v => v)}
                                    >
                                        ذخیره تنظیمات
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}