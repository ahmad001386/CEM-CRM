'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    Minus,
    Users,
    Calendar,
    Clock,
    AlertCircle,
    ArrowLeft,
    CheckCircle
} from "lucide-react";
import DatePicker, { type DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

// نمونه داده‌های کاربران برای انتخاب انجام دهندگان
const availableUsers = [
    { id: '1', name: 'علی جعفری', role: 'مدیر' },
    { id: '2', name: 'مهندس کریمی', role: 'کارشناس فروش' },
    { id: '3', name: 'حسن محمدی', role: 'مدیر فروش' },
    { id: '4', name: 'رسول کریمی', role: 'کارشناس' },
];

export default function NewTaskPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState<DateObject | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [stages, setStages] = useState<Array<{ id: string; title: string; description: string }>>([]);
    const [newStageTitle, setNewStageTitle] = useState('');
    const [newStageDescription, setNewStageDescription] = useState('');

    const handleAddStage = () => {
        if (!newStageTitle.trim()) return;

        const newStage = {
            id: Date.now().toString(),
            title: newStageTitle,
            description: newStageDescription
        };

        setStages([...stages, newStage]);
        setNewStageTitle('');
        setNewStageDescription('');
    };

    const handleRemoveStage = (stageId: string) => {
        setStages(stages.filter(stage => stage.id !== stageId));
    };

    const handleUserToggle = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = async () => {
        try {
            // در اینجا اطلاعات فرم را به سرور ارسال می‌کنیم
            const taskData = {
                title,
                description,
                priority,
                dueDate,
                assignees: selectedUsers,
                stages: stages.map(stage => ({
                    title: stage.title,
                    description: stage.description
                }))
            };

            // شبیه‌سازی ارسال به سرور
            await new Promise(resolve => setTimeout(resolve, 1000));

            router.push('/dashboard/tasks');
            router.refresh();
        } catch (error) {
            console.error('خطا در ایجاد وظیفه:', error);
            alert('خطا در ایجاد وظیفه');
        }
    };

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="mb-6">
                <Link href="/dashboard/tasks">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="w-4 h-4 ml-2" />
                        بازگشت به لیست وظایف
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold font-vazir">ایجاد وظیفه جدید</h1>
                <p className="text-gray-600 font-vazir">تعریف وظیفه جدید با جزئیات و مراحل</p>
            </div>

            <div className="grid gap-6">
                {/* اطلاعات اصلی وظیفه */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-vazir">اطلاعات وظیفه</CardTitle>
                        <CardDescription className="font-vazir">جزئیات اصلی وظیفه را وارد کنید</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium font-vazir">عنوان وظیفه</label>
                            <Input
                                placeholder="عنوان وظیفه را وارد کنید"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="font-vazir"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium font-vazir">توضیحات</label>
                            <Textarea
                                placeholder="توضیحات وظیفه را وارد کنید"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="font-vazir"
                                rows={4}
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium font-vazir">اولویت</label>
                                <Select value={priority} onValueChange={setPriority}>
                                    <SelectTrigger className="font-vazir">
                                        <SelectValue placeholder="اولویت را انتخاب کنید" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high" className="font-vazir">بالا</SelectItem>
                                        <SelectItem value="medium" className="font-vazir">متوسط</SelectItem>
                                        <SelectItem value="low" className="font-vazir">پایین</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium font-vazir">تاریخ سررسید</label>
                                <div className="relative">
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        value={dueDate}
                                        onChange={date => setDueDate(date as DateObject)}
                                        format="YYYY/MM/DD HH:mm"
                                        plugins={[
                                            <TimePicker key="time" position="bottom" />
                                        ]}
                                        className="rmdp-prime"
                                        calendarPosition="bottom-right"
                                        inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-vazir"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* انتخاب انجام دهندگان */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-vazir">انجام دهندگان</CardTitle>
                        <CardDescription className="font-vazir">افراد مسئول انجام وظیفه را انتخاب کنید</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availableUsers.map(user => (
                                <div
                                    key={user.id}
                                    className={`p-4 border rounded-lg cursor-pointer ${selectedUsers.includes(user.id)
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-200'
                                        }`}
                                    onClick={() => handleUserToggle(user.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium font-vazir">{user.name}</p>
                                            <p className="text-sm text-gray-500 font-vazir">{user.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* تعریف مراحل */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-vazir">مراحل انجام</CardTitle>
                        <CardDescription className="font-vazir">مراحل اجرای وظیفه را مشخص کنید</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stages.map((stage, index) => (
                                <div key={stage.id} className="flex items-start gap-4 p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                                                {index + 1}
                                            </Badge>
                                            <Input
                                                type="text"
                                                className="text-lg font-medium bg-transparent border-none focus:outline-none font-vazir"
                                                value={stage.title}
                                                placeholder="عنوان مرحله را وارد کنید"
                                                onChange={e => {
                                                    const newStages = [...stages];
                                                    newStages[index].title = e.target.value;
                                                    setStages(newStages);
                                                }}
                                            />
                                        </div>
                                        <Textarea
                                            placeholder="توضیحات مرحله را وارد کنید..."
                                            value={stage.description}
                                            onChange={e => {
                                                const newStages = [...stages];
                                                newStages[index].description = e.target.value;
                                                setStages(newStages);
                                            }}
                                            className="mt-2 font-vazir"
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveStage(stage.id)}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            <Card className="p-4">
                                <h4 className="font-medium mb-4 font-vazir">افزودن مرحله جدید</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm mb-2 font-vazir">عنوان مرحله</label>
                                        <Input
                                            placeholder="عنوان مرحله را وارد کنید"
                                            value={newStageTitle}
                                            onChange={e => setNewStageTitle(e.target.value)}
                                            className="font-vazir"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-2 font-vazir">توضیحات مرحله</label>
                                        <Textarea
                                            placeholder="توضیحات مرحله را وارد کنید"
                                            value={newStageDescription}
                                            onChange={e => setNewStageDescription(e.target.value)}
                                            className="font-vazir"
                                        />
                                    </div>
                                    <Button onClick={handleAddStage} className="w-full font-vazir">
                                        <Plus className="w-4 h-4 ml-2" />
                                        افزودن مرحله
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => router.back()} className="font-vazir">
                        انصراف
                    </Button>
                    <Button onClick={handleSubmit} className="font-vazir">
                        <CheckCircle className="w-4 h-4 ml-2" />
                        ایجاد وظیفه
                    </Button>
                </div>
            </div>
        </div>
    );
}
