import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import './csat.css';

type Distribution = {
    [key in 1 | 2 | 3 | 4 | 5]: number;
};

type ScoreType = 1 | 2 | 3 | 4 | 5;

const mockData = {
    overview: {
        current: 4.2,
        previous: 4.0,
        target: 4.5,
        responses: 342,
        distribution: {
            5: 145,
            4: 120,
            3: 50,
            2: 20,
            1: 7
        } as Distribution
    },
    byChannel: [
        { channel: 'ایمیل', score: 4.3, responses: 150 },
        { channel: 'تلفن', score: 4.1, responses: 120 },
        { channel: 'چت', score: 4.0, responses: 72 }
    ],
    byDepartment: [
        { department: 'پشتیبانی', score: 4.4, responses: 200 },
        { department: 'فروش', score: 4.1, responses: 80 },
        { department: 'فنی', score: 3.9, responses: 62 }
    ],
    recentResponses: [
        {
            id: 1,
            customer: 'شرکت الف',
            score: 5,
            comment: 'پشتیبانی عالی و سریع',
            date: '1402/04/15',
            channel: 'ایمیل'
        },
        {
            id: 2,
            customer: 'شرکت ب',
            score: 3,
            comment: 'زمان پاسخگویی طولانی بود',
            date: '1402/04/14',
            channel: 'تلفن'
        }
    ]
};

export default function CSATPage() {
    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-2">امتیاز رضایت مشتری (CSAT)</h1>
                    <p className="text-muted-foreground">تحلیل و بررسی امتیازات رضایت مشتریان</p>
                </div>
                <Button variant="outline">دانلود گزارش</Button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">CSAT فعلی</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold">{mockData.overview.current}</p>
                        <span className="text-sm text-green-600">+{((mockData.overview.current - mockData.overview.previous) * 100).toFixed(1)}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">هدف: {mockData.overview.target}</p>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">تعداد پاسخ‌ها</h3>
                    <p className="text-3xl font-bold">{mockData.overview.responses}</p>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">بهترین کانال</h3>
                    <p className="text-3xl font-bold">{Math.max(...mockData.byChannel.map(c => c.score))}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {mockData.byChannel.find(c => c.score === Math.max(...mockData.byChannel.map(c => c.score)))?.channel}
                    </p>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">بهترین دپارتمان</h3>
                    <p className="text-3xl font-bold">{Math.max(...mockData.byDepartment.map(d => d.score))}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {mockData.byDepartment.find(d => d.score === Math.max(...mockData.byDepartment.map(d => d.score)))?.department}
                    </p>
                </Card>
            </div>

            {/* Distribution */}
            <Card className="p-6 mb-6">
                <h2 className="text-lg font-medium mb-4">توزیع امتیازات</h2>
                <div className="space-y-2">
                    {([5, 4, 3, 2, 1] as const).map(score => {
                        const distributionValue = mockData.overview.distribution[score];
                        const percentage = (distributionValue / mockData.overview.responses) * 100;

                        return (
                            <div key={score} className="flex items-center gap-4">
                                <span className="w-4 text-center">{score}</span>
                                <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="w-20 text-sm text-muted-foreground">
                                    {distributionValue} پاسخ
                                    ({Math.round(percentage)}%)
                                </span>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* By Channel & Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="p-6">
                    <h2 className="text-lg font-medium mb-4">CSAT بر اساس کانال</h2>
                    <div className="space-y-4">
                        {mockData.byChannel.map(item => (
                            <div key={item.channel} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{item.channel}</p>
                                    <p className="text-sm text-muted-foreground">{item.responses} پاسخ</p>
                                </div>
                                <div className="text-2xl font-bold">{item.score}</div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="p-6">
                    <h2 className="text-lg font-medium mb-4">CSAT بر اساس دپارتمان</h2>
                    <div className="space-y-4">
                        {mockData.byDepartment.map(item => (
                            <div key={item.department} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{item.department}</p>
                                    <p className="text-sm text-muted-foreground">{item.responses} پاسخ</p>
                                </div>
                                <div className="text-2xl font-bold">{item.score}</div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Recent Responses */}
            <Card className="p-6">
                <h2 className="text-lg font-medium mb-4">پاسخ‌های اخیر</h2>
                <div className="space-y-4">
                    {mockData.recentResponses.map(response => (
                        <Card key={response.id} className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-medium">{response.customer}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {response.date} - {response.channel}
                                    </p>
                                </div>
                                <Badge className={
                                    response.score >= 4 ? 'bg-green-50 text-green-600' :
                                        response.score >= 3 ? 'bg-yellow-50 text-yellow-600' :
                                            'bg-red-50 text-red-600'
                                }>
                                    {response.score}/5
                                </Badge>
                            </div>
                            {response.comment && (
                                <p className="text-sm mt-2">{response.comment}</p>
                            )}
                        </Card>
                    ))}
                </div>
            </Card>
        </div>
    );
}
