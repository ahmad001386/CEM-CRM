'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, User, Shield, Activity, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CoworkerProfile() {
    const { id } = useParams();
    const { toast } = useToast();
    
    const [user, setUser] = useState<any>(null);
    const [userPermissions, setUserPermissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [permissionsLoading, setPermissionsLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({
        name: '',
        email: '',
        role: '',
        team: '',
        phone: '',
        status: ''
    });

    // Load user data
    const loadUser = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/users/${id}`);
            const data = await response.json();
            
            if (data.success) {
                setUser(data.data);
                setEditData({
                    name: data.data.name || '',
                    email: data.data.email || '',
                    role: data.data.role || '',
                    team: data.data.team || '',
                    phone: data.data.phone || '',
                    status: data.data.status || ''
                });
            } else {
                setError(data.message || 'خطا در دریافت اطلاعات کاربر');
            }
        } catch (error) {
            console.error('Error loading user:', error);
            setError('خطا در اتصال به سرور');
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Load user permissions
    const loadUserPermissions = useCallback(async () => {
        try {
            setPermissionsLoading(true);
            const response = await fetch(`/api/permissions/user/${id}`);
            const data = await response.json();
            
            if (data.success) {
                setUserPermissions(data.data || []);
            } else {
                console.error('Error loading permissions:', data.message);
            }
        } catch (error) {
            console.error('Error loading permissions:', error);
        } finally {
            setPermissionsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            loadUser();
            loadUserPermissions();
        }
    }, [id, loadUser, loadUserPermissions]);

    const handleUpdateUser = async () => {
        try {
            setSaving(true);
            const response = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editData),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "موفقیت",
                    description: "اطلاعات کاربر بروزرسانی شد",
                });
                setEditMode(false);
                loadUser(); // Reload user data
            } else {
                toast({
                    title: "خطا",
                    description: data.message || "خطا در بروزرسانی اطلاعات",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast({
                title: "خطا",
                description: "خطا در اتصال به سرور",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handlePermissionChange = (moduleId: string, permissionId: string, granted: boolean) => {
        setUserPermissions(prev => 
            prev.map(module => {
                if (module.module_id === moduleId) {
                    return {
                        ...module,
                        permissions: module.permissions.map((perm: any) => 
                            perm.permission_id === permissionId 
                                ? { ...perm, granted }
                                : perm
                        )
                    };
                }
                return module;
            })
        );
    };

    const handleSavePermissions = async () => {
        try {
            setSaving(true);
            
            // Prepare permissions data
            const permissions: any[] = [];
            userPermissions.forEach(module => {
                module.permissions.forEach((perm: any) => {
                    permissions.push({
                        module_id: module.module_id,
                        permission_id: perm.permission_id,
                        granted: perm.granted
                    });
                });
            });

            const response = await fetch(`/api/permissions/user/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ permissions }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "موفقیت",
                    description: "دسترسی‌ها بروزرسانی شد",
                });
            } else {
                toast({
                    title: "خطا",
                    description: data.message || "خطا در بروزرسانی دسترسی‌ها",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error saving permissions:', error);
            toast({
                title: "خطا",
                description: "خطا در اتصال به سرور",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
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

    if (error || !user) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <p className="text-destructive font-vazir mb-4">{error || 'کاربر یافت نشد'}</p>
                    <Link href="/dashboard/coworkers">
                        <Button className="font-vazir">
                            <ArrowLeft className="h-4 w-4 ml-2" />
                            بازگشت
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                    <Link href="/dashboard/coworkers">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            پروفایل همکار
                        </h1>
                        <p className="text-muted-foreground font-vazir mt-2">مدیریت اطلاعات و دسترسی‌های کاربر</p>
                    </div>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                    {editMode ? (
                        <>
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setEditMode(false);
                                    setEditData({
                                        name: user.name || '',
                                        email: user.email || '',
                                        role: user.role || '',
                                        team: user.team || '',
                                        phone: user.phone || '',
                                        status: user.status || ''
                                    });
                                }}
                                className="font-vazir"
                            >
                                لغو
                            </Button>
                            <Button 
                                onClick={handleUpdateUser}
                                disabled={saving}
                                className="font-vazir"
                            >
                                <Save className="h-4 w-4 ml-2" />
                                {saving ? 'در حال ذخیره...' : 'ذخیره'}
                            </Button>
                        </>
                    ) : (
                        <Button 
                            onClick={() => setEditMode(true)}
                            className="font-vazir"
                        >
                            ویرایش اطلاعات
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* User Info Card */}
                <Card className="col-span-12 lg:col-span-4 border-border/50 hover:border-primary/30 transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2 space-x-reverse font-vazir">
                            <User className="h-5 w-5" />
                            <span>اطلاعات شخصی</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-24 w-24">
                                <AvatarFallback className="bg-gradient-to-br from-primary via-secondary to-accent text-white font-vazir text-2xl">
                                    {user.name.split(' ').map((n: string) => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            
                            {editMode ? (
                                <div className="w-full space-y-4">
                                    <div className="space-y-2">
                                        <Label className="font-vazir">نام</Label>
                                        <Input
                                            value={editData.name}
                                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                                            className="font-vazir"
                                            dir="rtl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-vazir">ایمیل</Label>
                                        <Input
                                            value={editData.email}
                                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                                            className="font-vazir"
                                            dir="ltr"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-vazir">نقش</Label>
                                        <Select value={editData.role} onValueChange={(value) => setEditData({...editData, role: value})}>
                                            <SelectTrigger className="font-vazir">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sales_agent" className="font-vazir">کارشناس فروش</SelectItem>
                                                <SelectItem value="sales_manager" className="font-vazir">مدیر فروش</SelectItem>
                                                <SelectItem value="agent" className="font-vazir">کارشناس</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-vazir">تیم</Label>
                                        <Input
                                            value={editData.team}
                                            onChange={(e) => setEditData({...editData, team: e.target.value})}
                                            className="font-vazir"
                                            dir="rtl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-vazir">تلفن</Label>
                                        <Input
                                            value={editData.phone}
                                            onChange={(e) => setEditData({...editData, phone: e.target.value})}
                                            className="font-vazir"
                                            dir="rtl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-vazir">وضعیت</Label>
                                        <Select value={editData.status} onValueChange={(value) => setEditData({...editData, status: value})}>
                                            <SelectTrigger className="font-vazir">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active" className="font-vazir">فعال</SelectItem>
                                                <SelectItem value="inactive" className="font-vazir">غیرفعال</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center w-full">
                                    <h2 className="text-xl font-bold font-vazir">{user.name}</h2>
                                    <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary border-primary/20 font-vazir">
                                        {getRoleLabel(user.role)}
                                    </Badge>
                                    <div className="mt-4 space-y-2 text-sm">
                                        <p className="font-vazir"><strong>ایمیل:</strong> {user.email}</p>
                                        {user.team && <p className="font-vazir"><strong>تیم:</strong> {user.team}</p>}
                                        {user.phone && <p className="font-vazir"><strong>تلفن:</strong> {user.phone}</p>}
                                        <p className="font-vazir">
                                            <strong>وضعیت:</strong> 
                                            <Badge variant="outline" className="mr-2 font-vazir">
                                                {getStatusLabel(user.status)}
                                            </Badge>
                                        </p>
                                        {user.last_active && (
                                            <p className="font-vazir">
                                                <strong>آخرین فعالیت:</strong> {new Date(user.last_active).toLocaleDateString('fa-IR')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Permissions Card */}
                <Card className="col-span-12 lg:col-span-8 border-border/50 hover:border-secondary/30 transition-all duration-300">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center space-x-2 space-x-reverse font-vazir">
                                <Shield className="h-5 w-5" />
                                <span>مدیریت دسترسی‌ها</span>
                            </CardTitle>
                            <Button 
                                onClick={handleSavePermissions}
                                disabled={saving || permissionsLoading}
                                className="font-vazir"
                            >
                                <Save className="h-4 w-4 ml-2" />
                                {saving ? 'در حال ذخیره...' : 'ذخیره دسترسی‌ها'}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {permissionsLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {userPermissions.map((module) => (
                                    <div key={module.module_id} className="border border-border/50 rounded-lg p-4">
                                        <h4 className="font-medium font-vazir mb-3 flex items-center space-x-2 space-x-reverse">
                                            <Activity className="h-4 w-4" />
                                            <span>{module.module_display_name}</span>
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {module.permissions.map((permission: any) => (
                                                <div key={permission.permission_id} className="flex items-center space-x-2 space-x-reverse">
                                                    <Switch
                                                        checked={permission.granted}
                                                        onCheckedChange={(checked) => 
                                                            handlePermissionChange(module.module_id, permission.permission_id, checked)
                                                        }
                                                    />
                                                    <Label className="text-sm font-vazir">
                                                        {permission.permission_display_name}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                
                                {userPermissions.length === 0 && (
                                    <div className="text-center py-8">
                                        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground font-vazir">دسترسی‌ای تعریف نشده است</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
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