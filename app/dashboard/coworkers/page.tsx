"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Plus, Users, UserCheck, AlertCircle } from 'lucide-react';

export default function CoworkersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCoworker, setNewCoworker] = useState({ 
        name: '', 
        role: '', 
        email: '', 
        password: '', 
        team: '', 
        phone: '' 
    });
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { toast } = useToast();

    // Load users on component mount
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users');
            const data = await response.json();
            
            if (data.success) {
                setUsers(data.data || []);
            } else {
                setError(data.message || 'خطا در دریافت کاربران');
            }
        } catch (error) {
            console.error('Error loading users:', error);
            setError('خطا در اتصال به سرور');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCoworker = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCoworker),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "موفقیت",
                    description: "همکار جدید با موفقیت اضافه شد",
                });
                setNewCoworker({ name: '', role: '', email: '', password: '', team: '', phone: '' });
                setOpen(false);
                loadUsers(); // Reload users list
            } else {
                setError(data.message || 'خطا در افزودن همکار');
            }
        } catch (error) {
            console.error('Error adding coworker:', error);
            setError('خطا در اتصال به سرور');
        } finally {
            setSubmitting(false);
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'ceo': return 'مدیر عامل';
            case 'sales_manager': return 'مدیر فروش';
            case 'sales_agent': return 'کارشناس فروش';
            case 'agent': return 'کارشناس';
            case 'مدیر': return 'مدیر';
            case 'کارشناس فروش': return 'کارشناس فروش';
            case 'مدیر فروش': return 'مدیر فروش';
            default: return role;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'فعال';
            case 'inactive': return 'غیرفعال';
            case 'online': return 'آنلاین';
            case 'offline': return 'آفلاین';
            case 'away': return 'غایب';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
            case 'online': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'away': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'inactive':
            case 'offline': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground font-vazir">در حال بارگذاری...</p>
                </div>
            </div>
        );
    }

    if (error && users.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <p className="text-destructive font-vazir mb-4">{error}</p>
                    <Button onClick={loadUsers} className="font-vazir">
                        تلاش مجدد
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        مدیریت همکاران
                    </h1>
                    <p className="text-muted-foreground font-vazir mt-2">مدیریت کاربران و تعیین سطح دسترسی</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 font-vazir">
                            <Plus className="h-4 w-4 ml-2" />
                            افزودن همکار
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="font-vazir max-w-md">
                        <DialogHeader>
                            <DialogTitle>افزودن همکار جدید</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddCoworker} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">نام کامل *</Label>
                                <Input
                                    id="name"
                                    value={newCoworker.name}
                                    onChange={(e) => setNewCoworker({ ...newCoworker, name: e.target.value })}
                                    placeholder="نام و نام خانوادگی"
                                    required
                                    className="font-vazir"
                                    dir="rtl"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="email">ایمیل *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newCoworker.email}
                                    onChange={(e) => setNewCoworker({ ...newCoworker, email: e.target.value })}
                                    placeholder="example@company.com"
                                    required
                                    className="font-vazir"
                                    dir="ltr"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="password">رمز عبور *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newCoworker.password}
                                    onChange={(e) => setNewCoworker({ ...newCoworker, password: e.target.value })}
                                    placeholder="رمز عبور"
                                    required
                                    className="font-vazir"
                                    dir="ltr"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="role">نقش *</Label>
                                <Select value={newCoworker.role} onValueChange={(value) => setNewCoworker({ ...newCoworker, role: value })}>
                                    <SelectTrigger className="font-vazir">
                                        <SelectValue placeholder="انتخاب نقش" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sales_agent" className="font-vazir">کارشناس فروش</SelectItem>
                                        <SelectItem value="sales_manager" className="font-vazir">مدیر فروش</SelectItem>
                                        <SelectItem value="agent" className="font-vazir">کارشناس</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="team">تیم</Label>
                                <Input
                                    id="team"
                                    value={newCoworker.team}
                                    onChange={(e) => setNewCoworker({ ...newCoworker, team: e.target.value })}
                                    placeholder="نام تیم"
                                    className="font-vazir"
                                    dir="rtl"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="phone">تلفن</Label>
                                <Input
                                    id="phone"
                                    value={newCoworker.phone}
                                    onChange={(e) => setNewCoworker({ ...newCoworker, phone: e.target.value })}
                                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                                    className="font-vazir"
                                    dir="rtl"
                                />
                            </div>
                            
                            {error && (
                                <div className="text-destructive text-sm font-vazir bg-destructive/10 p-3 rounded-md">
                                    {error}
                                </div>
                            )}
                            
                            <div className="flex justify-end gap-2 pt-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => {
                                        setOpen(false);
                                        setError('');
                                        setNewCoworker({ name: '', role: '', email: '', password: '', team: '', phone: '' });
                                    }}
                                    className="font-vazir"
                                >
                                    لغو
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={submitting || !newCoworker.name || !newCoworker.email || !newCoworker.password || !newCoworker.role}
                                    className="font-vazir"
                                >
                                    {submitting ? 'در حال افزودن...' : 'افزودن همکار'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium font-vazir">کل همکاران</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-vazir">{users.length.toLocaleString('fa-IR')}</div>
                    </CardContent>
                </Card>
                
                <Card className="border-green-200 hover:border-green-400 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium font-vazir">فعال</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 font-vazir">
                            {users.filter(u => u.status === 'active' || u.status === 'online').length.toLocaleString('fa-IR')}
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="border-secondary/20 hover:border-secondary/40 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium font-vazir">مدیران</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-vazir">
                            {users.filter(u => u.role.includes('manager') || u.role.includes('مدیر') || u.role === 'ceo').length.toLocaleString('fa-IR')}
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="border-accent/20 hover:border-accent/40 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium font-vazir">کارشناسان</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-vazir">
                            {users.filter(u => u.role.includes('agent') || u.role.includes('کارشناس')).length.toLocaleString('fa-IR')}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                    <CardTitle className="font-vazir">لیست همکاران</CardTitle>
                </CardHeader>
                <CardContent>
                    {users.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground font-vazir">همکاری یافت نشد</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {users.map(user => (
                                <Link key={user.id} href={`/dashboard/coworkers/${user.id}`}>
                                    <div className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="bg-gradient-to-br from-primary via-secondary to-accent text-white font-vazir">
                                                {user.name.split(' ').map((n: string) => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-medium font-vazir text-lg">{user.name}</h3>
                                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-vazir">
                                                    {getRoleLabel(user.role)}
                                                </Badge>
                                                <Badge variant="outline" className={`${getStatusColor(user.status)} font-vazir`}>
                                                    {getStatusLabel(user.status)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="font-vazir">{user.email}</span>
                                                {user.team && (
                                                    <span className="font-vazir">تیم: {user.team}</span>
                                                )}
                                                {user.phone && (
                                                    <span className="font-vazir">{user.phone}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground font-vazir">
                                            {user.last_active && (
                                                <span>آخرین فعالیت: {new Date(user.last_active).toLocaleDateString('fa-IR')}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            setOpen(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        لیست همکاران
                    </h1>
                    <p className="text-muted-foreground font-vazir mt-2">مشاهده و انتخاب همکاران برای تخصیص وظایف</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="font-vazir">افزودن همکار</Button>
                    </DialogTrigger>
                    <DialogContent className="font-vazir">
                        <DialogHeader>
                            <DialogTitle>افزودن همکار جدید</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddCoworker} className="space-y-4">
                            <div>
                                <Label htmlFor="name">نام</Label>
                                <Input
                                    id="name"
                                    value={newCoworker.name}
                                    onChange={(e) => setNewCoworker({ ...newCoworker, name: e.target.value })}
                                    placeholder="نام همکار"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="role">نقش</Label>
                                <select
                                    id="role"
                                    value={newCoworker.role}
                                    onChange={(e) => setNewCoworker({ ...newCoworker, role: e.target.value })}
                                    className="w-full border rounded-md p-2"
                                    required
                                >
                                    <option value="">انتخاب نقش</option>
                                    <option value="sales_agent">کارشناس فروش</option>
                                    <option value="sales_manager">مدیر فروش</option>
                                    <option value="agent">کارشناس</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="email">ایمیل</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newCoworker.email}
                                    onChange={(e) => setNewCoworker({ ...newCoworker, email: e.target.value })}
                                    placeholder="ایمیل همکار"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">رمز عبور</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newCoworker.password}
                                    onChange={(e) => setNewCoworker({ ...newCoworker, password: e.target.value })}
                                    placeholder="رمز عبور"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="status">وضعیت</Label>
                                <select
                                    id="status"
                                    aria-label="وضعیت همکار"
                                    value={newCoworker.status}
                                    onChange={(e) => setNewCoworker({ ...newCoworker, status: e.target.value })}
                                    className="w-full border rounded-md p-2"
                                >
                                    <option value="online">آنلاین</option>
                                    <option value="offline">آفلاین</option>
                                </select>
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm">{error}</div>
                            )}
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    لغو
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'در حال افزودن...' : 'افزودن'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-vazir">همکاران</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[60vh]">
                        <div className="space-y-4">
                            {users.map(user => (
                                <button
                                    key={user.id}
                                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer w-full text-right"
                                    onClick={() => window.location.href = `/dashboard/coworkers/${user.id}`}
                                >
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className="bg-primary/10 text-primary font-vazir">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium font-vazir text-lg truncate">{user.name}</span>
                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-vazir">
                                                {user.role}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1 font-vazir">
                                            {user.status === 'online' ? 'آنلاین' : user.status === 'away' ? 'غایب' : 'آفلاین'}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}