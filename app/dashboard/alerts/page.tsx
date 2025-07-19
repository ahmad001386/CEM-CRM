import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const mockAlerts = [
    {
        id: 1,
        type: 'critical',
        title: 'کاهش شدید NPS',
        description: 'امتیاز NPS در 7 روز گذشته 15 واحد کاهش یافته است',
        customer: 'شرکت الف',
        metric: 'NPS',
        value: '-15',
        threshold: '-10',
        date: '1402/04/15',
        status: 'new'
    },
    {
        id: 2,
        type: 'warning',
        title: 'افزایش تیکت‌های پشتیبانی',
        description: 'تعداد تیکت‌های پشتیبانی در 24 ساعت گذشته 50% افزایش داشته است',
        customer: 'عمومی',
        metric: 'Support Tickets',
        value: '+50%',
        threshold: '+30%',
        date: '1402/04/14',
        status: 'in_progress'
    },
    {
        id: 3,
        type: 'info',
        title: 'کاهش استفاده از محصول',
        description: 'میزان استفاده از محصول در هفته گذشته 20% کاهش یافته است',
        customer: 'شرکت ب',
        metric: 'Product Usage',
        value: '-20%',
        threshold: '-15%',
        date: '1402/04/13',
        status: 'resolved'
    }
];

const typeColors = {
    critical: 'bg-red-50 text-red-600',
    warning: 'bg-yellow-50 text-yellow-600',
    info: 'bg-blue-50 text-blue-600'
};

const statusColors = {
    new: 'bg-red-50 text-red-600',
    in_progress: 'bg-yellow-50 text-yellow-600',
    resolved: 'bg-green-50 text-green-600'
};

export default function AlertsPage() {
    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-2">هشدارهای تجربه منفی</h1>
                    <p className="text-muted-foreground">مدیریت و پیگیری هشدارهای مرتبط با تجربه مشتری</p>
                </div>
                <Button>تنظیمات هشدارها</Button>
            </div>

            {/* Filters */}
            <Card className="p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-sm font-medium">نوع هشدار</label>
                        <select className="w-full mt-1 rounded-md border border-input px-3 py-2" title="نوع هشدار">
                            <option value="all">همه</option>
                            <option value="critical">بحرانی</option>
                            <option value="warning">هشدار</option>
                            <option value="info">اطلاعات</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-sm font-medium">وضعیت</label>
                        <select className="w-full mt-1 rounded-md border border-input px-3 py-2" title="وضعیت">
                            <option value="all">همه</option>
                            <option value="new">جدید</option>
                            <option value="in_progress">در حال بررسی</option>
                            <option value="resolved">حل شده</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-sm font-medium">معیار</label>
                        <select className="w-full mt-1 rounded-md border border-input px-3 py-2" title="معیار">
                            <option value="all">همه</option>
                            <option value="nps">NPS</option>
                            <option value="csat">CSAT</option>
                            <option value="tickets">تیکت‌ها</option>
                            <option value="usage">استفاده از محصول</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Alerts List */}
            <div className="space-y-4">
                {mockAlerts.map(alert => (
                    <Card key={alert.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge className={typeColors[alert.type]}>
                                        {alert.type === 'critical' ? 'بحرانی' :
                                            alert.type === 'warning' ? 'هشدار' : 'اطلاعات'}
                                    </Badge>
                                    <Badge className={statusColors[alert.status]}>
                                        {alert.status === 'new' ? 'جدید' :
                                            alert.status === 'in_progress' ? 'در حال بررسی' : 'حل شده'}
                                    </Badge>
                                </div>
                                <h3 className="text-lg font-medium">{alert.title}</h3>
                                <p className="text-muted-foreground">{alert.description}</p>
                            </div>
                            <Button variant="outline">اقدام سریع</Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">مشتری:</span>
                                <span className="mr-2">{alert.customer}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">معیار:</span>
                                <span className="mr-2">{alert.metric}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">مقدار:</span>
                                <span className="mr-2 font-medium text-red-600">{alert.value}</span>
                                <span className="text-muted-foreground">(آستانه: {alert.threshold})</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">تاریخ:</span>
                                <span className="mr-2">{alert.date}</span>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4 pt-4 border-t">
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">جزئیات</Button>
                                <Button variant="outline" size="sm">ارجاع</Button>
                                <Button size="sm">بررسی</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}