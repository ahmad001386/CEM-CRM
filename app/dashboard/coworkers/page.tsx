"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockUsers } from '@/lib/mock-data';
import Link from 'next/link';

export default function CoworkersPage() {
    const [users, setUsers] = useState(mockUsers);
    const [newCoworker, setNewCoworker] = useState({ name: '', role: '', status: 'offline', email: '', password: '' });
    const [open, setOpen] = useState(false);

    const isAdmin = newCoworker.role === 'ادمین';

    const handleAddCoworker = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCoworker.name && newCoworker.role && newCoworker.email && newCoworker.password) {
            setUsers([...users, {
                id: users.length + 1,
                name: newCoworker.name,
                role: newCoworker.role,
                status: newCoworker.status as 'online' | 'away' | 'offline',
                email: isAdmin ? newCoworker.email : undefined,
                password: isAdmin ? newCoworker.password : undefined,
            }]);
            setNewCoworker({ name: '', role: '', status: 'offline', email: '', password: '' });
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
                                <Input
                                    id="role"
                                    value={newCoworker.role}
                                    onChange={(e) => setNewCoworker({ ...newCoworker, role: e.target.value })}
                                    placeholder="نقش همکار"
                                    required
                                />
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
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    لغو
                                </Button>
                                <Button type="submit">افزودن</Button>
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