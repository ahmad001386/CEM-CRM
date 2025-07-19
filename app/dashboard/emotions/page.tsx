import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockData = {
    summary: {
        positive: 65,
        neutral: 25,
        negative: 10,
    },
    wordCloud: [
        { word: "عالی", count: 45, sentiment: "positive" },
        { word: "سریع", count: 38, sentiment: "positive" },
        { word: "کند", count: 15, sentiment: "negative" },
        // ... more words
    ],
    feedbacks: [
        {
            id: 1,
            text: "تجربه کار با محصول بسیار عالی بود. پشتیبانی سریع و دقیق.",
            sentiment: "positive",
            score: 0.89,
            date: "1402/04/15",
            channel: "ایمیل"
        },
        {
            id: 2,
            text: "سرعت پاسخگویی کمی پایین است.",
            sentiment: "negative",
            score: 0.35,
            date: "1402/04/14",
            channel: "چت"
        },
    ]
};

const sentimentColors = {
    positive: "bg-green-50 text-green-600",
    neutral: "bg-gray-50 text-gray-600",
    negative: "bg-red-50 text-red-600"
};

export default function EmotionsPage() {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">تحلیل احساسات مشتریان</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">احساسات مثبت</h3>
                    <p className="text-3xl font-bold text-green-600">{mockData.summary.positive}%</p>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">احساسات خنثی</h3>
                    <p className="text-3xl font-bold text-gray-600">{mockData.summary.neutral}%</p>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">احساسات منفی</h3>
                    <p className="text-3xl font-bold text-red-600">{mockData.summary.negative}%</p>
                </Card>
            </div>

            {/* Word Cloud */}
            <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">کلمات کلیدی پرتکرار</h2>
                <div className="flex flex-wrap gap-2">
                    {mockData.wordCloud.map(item => (
                        <div
                            key={item.word}
                            className={`px-3 py-1 rounded-full text-sm ${sentimentColors[item.sentiment]
                                }`}
                            style={{
                                fontSize: `${Math.max(0.8, Math.min(1.5, item.count / 30))}rem`
                            }}
                        >
                            {item.word}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Feedback List */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">بازخوردهای اخیر</h2>
                <div className="space-y-4">
                    {mockData.feedbacks.map(feedback => (
                        <Card key={feedback.id} className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <Badge
                                    className={sentimentColors[feedback.sentiment]}
                                >
                                    {feedback.sentiment === 'positive' ? 'مثبت' :
                                        feedback.sentiment === 'neutral' ? 'خنثی' : 'منفی'}
                                    {' '}({Math.round(feedback.score * 100)}%)
                                </Badge>
                                <div className="text-sm text-muted-foreground">
                                    {feedback.date} - {feedback.channel}
                                </div>
                            </div>
                            <p className="text-sm">{feedback.text}</p>
                        </Card>
                    ))}
                </div>
            </Card>
        </div>
    );
}