import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import './nps.css';

const mockData = {
    overview: {
        current: 45,
        previous: 42,
        target: 50,
        responses: 583,
        distribution: {
            promoters: 290,    // 9-10
            passives: 203,     // 7-8
            detractors: 90     // 0-6
        }
    },
    byProduct: [
        { product: 'محصول الف', score: 52, responses: 200 },
        { product: 'محصول ب', score: 48, responses: 180 },
        { product: 'محصول ج', score: 35, responses: 203 }
    ],
    byChannel: [
        { channel: 'ایمیل', score: 47, responses: 250 },
        { channel: 'وب‌سایت', score: 44, responses: 220 },
        { channel: 'اپلیکیشن', score: 43, responses: 113 }
    ],
    recentFeedback: [
        {
            id: 1,
            customer: 'شرکت الف',
            score: 9,
            comment: 'کیفیت محصولات عالی و پشتیبانی سریع',
            date: '1402/04/15',
            product: 'محصول الف'
        },
        {
            id: 2,
            customer: 'شرکت ب',
            score: 6,
            comment: 'قیمت‌ها نسبتاً بالاست و زمان تحویل طولانی',
            date: '1402/04/14',
            product: 'محصول ج'
        },
        {
            id: 3,
            customer: 'شرکت ج',
            score: 8,
            comment: 'محصول خوب اما نیاز به بهبود در بخش پشتیبانی',
            date: '1402/04/13',
            product: 'محصول ب'
        }
    ]
};

function NPSScoreBox({ score, type }: { score: number; type: 'current' | 'target' | 'previous' }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${type === 'current' ? 'bg-primary' :
                    type === 'target' ? 'bg-accent' :
                        'bg-muted'
                }`} />
            <span className="font-medium">{score}</span>
        </div>
    );
}

export default function NPSPage() {
    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-2">امتیاز خالص مروج (NPS)</h1>
                    <p className="text-muted-foreground">معیار اندازه‌گیری وفاداری مشتریان</p>
                </div>
                <Button variant="outline">دانلود گزارش</Button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">NPS فعلی</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold">{mockData.overview.current}</p>
                        <span className="text-sm text-green-600">
                            +{((mockData.overview.current - mockData.overview.previous)).toFixed(0)}
                        </span>
                    </div>
                    <div className="mt-2 space-y-1">
                        <NPSScoreBox score={mockData.overview.current} type="current" />
                        <NPSScoreBox score={mockData.overview.target} type="target" />
                        <NPSScoreBox score={mockData.overview.previous} type="previous" />
                    </div>
                </Card>

                <Card className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">تعداد پاسخ‌ها</h3>
                    <p className="text-3xl font-bold">{mockData.overview.responses}</p>
                    <div className="mt-2 text-sm text-muted-foreground">
                        <div>مروجین: {mockData.overview.distribution.promoters}</div>
                        <div>خنثی: {mockData.overview.distribution.passives}</div>
                        <div>منتقدین: {mockData.overview.distribution.detractors}</div>
                    </div>
                </Card>

                <Card className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">بهترین محصول</h3>
                    <p className="text-3xl font-bold">
                        {Math.max(...mockData.byProduct.map(p => p.score))}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {mockData.byProduct.find(p =>
                            p.score === Math.max(...mockData.byProduct.map(p => p.score))
                        )?.product}
                    </p>
                </Card>

                <Card className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">بهترین کانال</h3>
                    <p className="text-3xl font-bold">
                        {Math.max(...mockData.byChannel.map(c => c.score))}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {mockData.byChannel.find(c =>
                            c.score === Math.max(...mockData.byChannel.map(c => c.score))
                        )?.channel}
                    </p>
                </Card>
            </div>

            {/* Distribution Chart */}
            <Card className="p-6 mb-6">
                <h2 className="text-lg font-medium mb-4">توزیع امتیازات</h2>
                <div className="h-8 rounded-full overflow-hidden flex">
                    <div
                        className="nps-distribution-bar nps-promoters"
                        style={{ '--promoters-width': `${(mockData.overview.distribution.promoters / mockData.overview.responses) * 100}%` } as React.CSSProperties}
                    />
                    <div
                        className="nps-distribution-bar nps-passives"
                        style={{ '--passives-width': `${(mockData.overview.distribution.passives / mockData.overview.responses) * 100}%` } as React.CSSProperties}
                    />
                    <div
                        className="nps-distribution-bar nps-detractors"
                        style={{ '--detractors-width': `${(mockData.overview.distribution.detractors / mockData.overview.responses) * 100}%` } as React.CSSProperties}
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <div className="text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span>مروجین ({Math.round((mockData.overview.distribution.promoters / mockData.overview.responses) * 100)}%)</span>
                        </div>
                    </div>
                    <div className="text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span>خنثی ({Math.round((mockData.overview.distribution.passives / mockData.overview.responses) * 100)}%)</span>
                        </div>
                    </div>
                    <div className="text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span>منتقدین ({Math.round((mockData.overview.distribution.detractors / mockData.overview.responses) * 100)}%)</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Product & Channel Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="p-6">
                    <h2 className="text-lg font-medium mb-4">NPS بر اساس محصول</h2>
                    <div className="space-y-4">
                        {mockData.byProduct.map(item => (
                            <div key={item.product} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{item.product}</p>
                                    <p className="text-sm text-muted-foreground">{item.responses} پاسخ</p>
                                </div>
                                <div className="text-2xl font-bold">{item.score}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-lg font-medium mb-4">NPS بر اساس کانال</h2>
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
            </div>

            {/* Recent Feedback */}
            <Card className="p-6">
                <h2 className="text-lg font-medium mb-4">بازخوردهای اخیر</h2>
                <div className="space-y-4">
                    {mockData.recentFeedback.map(feedback => (
                        <Card key={feedback.id} className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-medium">{feedback.customer}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {feedback.date} - {feedback.product}
                                    </p>
                                </div>
                                <Badge className={
                                    feedback.score >= 9 ? 'bg-green-50 text-green-600' :
                                        feedback.score >= 7 ? 'bg-yellow-50 text-yellow-600' :
                                            'bg-red-50 text-red-600'
                                }>
                                    {feedback.score}/10
                                </Badge>
                            </div>
                            {feedback.comment && (
                                <p className="text-sm mt-2">{feedback.comment}</p>
                            )}
                        </Card>
                    ))}
                </div>
            </Card>
        </div>
    );
}
