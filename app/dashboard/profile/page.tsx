"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Clock,
    Edit,
    FileText,
    Upload,
    CheckCircle2
} from "lucide-react";

const user = {
    id: '2',
    name: 'مهندس کریمی',
    email: '1@gmail.com',
    role: 'کارشناس فروش',
    status: 'online',
    phone: '09123456789',
    nationalCode: '1234567890',
    age: 35,
    address: 'تهران، خیابان آزادی، پلاک 12',
    avatar: '/images/avatar-default.png',
};

const tasks = [
    { id: '1', title: 'پیگیری پیشنهاد شرکت آکمه', status: 'pending' },
    { id: '2', title: 'آماده‌سازی ارائه برای پارس تک', status: 'in_progress' },
];

export default function ProfilePage() {
    const [report, setReport] = useState('');

    const handleUploadImage = () => {
        // در اینجا منطق آپلود تصویر قرار می‌گیرد
        alert('این قابلیت در نسخه بعدی اضافه خواهد شد');
    };

    const handleSaveReport = () => {
        if (!report.trim()) {
            alert('لطفاً گزارش خود را وارد کنید');
            return;
        }
        // در اینجا منطق ذخیره گزارش قرار می‌گیرد
        alert('گزارش با موفقیت ثبت شد');
        setReport('');
    };

    return (
        <div className="container mx-auto py-6 px-4">
            <Card className="mb-6">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="relative">
                        <Image
                            src={user.avatar}
                            alt="avatar"
                            width={100}
                            height={100}
                            className="rounded-full border-4 border-primary/20"
                        />
                        <Button
                            size="icon"
                            variant="outline"
                            className="absolute bottom-0 right-0 rounded-full"
                            onClick={handleUploadImage}
                        >
                            <Upload className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{user.name}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default">{user.role}</Badge>
                            <Badge variant="outline" className="bg-green-50">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    {user.status}
                                </div>
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="info">اطلاعات شخصی</TabsTrigger>
                    <TabsTrigger value="tasks">وظایف من</TabsTrigger>
                    <TabsTrigger value="reports">گزارش‌ها</TabsTrigger>
                    <TabsTrigger value="settings">تنظیمات</TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                    <Card>
                        <CardHeader>
                            <CardTitle>اطلاعات شخصی</CardTitle>
                            <CardDescription>اطلاعات پایه و تماس شما</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">ایمیل</p>
                                        <p className="font-medium">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">تلفن</p>
                                        <p className="font-medium">{user.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">کد ملی</p>
                                        <p className="font-medium">{user.nationalCode}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">سن</p>
                                        <p className="font-medium">{user.age} سال</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">آدرس</p>
                                        <p className="font-medium">{user.address}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full sm:w-auto">
                                <Edit className="w-4 h-4 ml-2" />
                                ویرایش اطلاعات
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="tasks">
                    <Card>
                        <CardHeader>
                            <CardTitle>وظایف من</CardTitle>
                            <CardDescription>لیست وظایف و کارهای در دست اقدام</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {tasks.map(task => (
                                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">{task.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    <Clock className="h-3 w-3 inline ml-1" />
                                                    وضعیت: {task.status}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <CheckCircle2 className="h-4 w-4 ml-2" />
                                            تکمیل
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reports">
                    <Card>
                        <CardHeader>
                            <CardTitle>ثبت گزارش</CardTitle>
                            <CardDescription>گزارش فعالیت‌های خود را ثبت کنید</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="گزارش خود را بنویسید..."
                                value={report}
                                onChange={e => setReport(e.target.value)}
                                className="min-h-[150px] mb-4"
                            />
                            <Button onClick={handleSaveReport}>
                                <FileText className="w-4 h-4 ml-2" />
                                ثبت گزارش
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>تنظیمات حساب کاربری</CardTitle>
                            <CardDescription>تنظیمات و ترجیحات شخصی خود را مدیریت کنید</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="font-medium">تصویر پروفایل</h4>
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={user.avatar}
                                        alt="avatar preview"
                                        width={60}
                                        height={60}
                                        className="rounded-full border"
                                    />
                                    <Button variant="outline" onClick={handleUploadImage}>
                                        <Upload className="w-4 h-4 ml-2" />
                                        آپلود تصویر جدید
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium">تغییر رمز عبور</h4>
                                <div className="grid gap-2">
                                    <Input type="password" placeholder="رمز عبور فعلی" />
                                    <Input type="password" placeholder="رمز عبور جدید" />
                                    <Input type="password" placeholder="تکرار رمز عبور جدید" />
                                    <Button variant="outline" className="w-full sm:w-auto mt-2">
                                        تغییر رمز عبور
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
