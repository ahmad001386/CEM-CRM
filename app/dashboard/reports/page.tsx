'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockDashboardStats, mockCustomers, mockTickets, mockFeedback } from '@/lib/mock-data';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Star, 
  Download,
  Calendar,
  Filter
} from 'lucide-react';

export default function ReportsPage() {
  const stats = mockDashboardStats;
  
  const monthlyGrowth = 15.2;
  const customerRetention = 94.5;
  const avgResolutionTime = 2.3;
  const satisfactionTrend = 8.1;

  const handleExportReport = (type: string) => {
    console.log(`Exporting ${type} report...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Analyze your customer relationships and business performance</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">Customer acquisition</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Retention</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{customerRetention}%</div>
            <p className="text-xs text-muted-foreground">12-month retention rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{avgResolutionTime} days</div>
            <p className="text-xs text-muted-foreground">Support tickets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Growth</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">+{satisfactionTrend}%</div>
            <p className="text-xs text-muted-foreground">CSAT improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sales Performance</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handleExportReport('sales')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Sales trend chart would be displayed here</p>
                <p className="text-sm">12-month revenue progression</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Customer Satisfaction</CardTitle>
            <Button variant="outline" size="sm" onClick={() => handleExportReport('satisfaction')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Star className="h-12 w-12 mx-auto mb-4" />
                <p>CSAT distribution chart would be displayed here</p>
                <p className="text-sm">Satisfaction score breakdown</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Growth Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Customers (Monthly)</span>
                <Badge variant="default">+{Math.floor(monthlyGrowth)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enterprise Segment</span>
                <Badge variant="secondary">
                  {mockCustomers.filter(c => c.segment === 'enterprise').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Small Business</span>
                <Badge variant="secondary">
                  {mockCustomers.filter(c => c.segment === 'small_business').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Individual</span>
                <Badge variant="secondary">
                  {mockCustomers.filter(c => c.segment === 'individual').length}
                </Badge>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={() => handleExportReport('customer-growth')}>
              <Download className="h-4 w-4 mr-2" />
              Export Customer Growth Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Open Tickets</span>
                <Badge variant="destructive">
                  {mockTickets.filter(t => t.status === 'open').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">In Progress</span>
                <Badge variant="default">
                  {mockTickets.filter(t => t.status === 'in_progress').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Resolved</span>
                <Badge variant="secondary">
                  {mockTickets.filter(t => t.status === 'closed').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg CSAT Score</span>
                <Badge variant="default">
                  {stats.avgSatisfactionScore}/5
                </Badge>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={() => handleExportReport('support-performance')}>
              <Download className="h-4 w-4 mr-2" />
              Export Support Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Feedback Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">CSAT Distribution</h4>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map(score => {
                  const count = mockFeedback.filter(f => f.type === 'csat' && Math.floor(f.score) === score).length;
                  const percentage = mockFeedback.length > 0 ? (count / mockFeedback.length) * 100 : 0;
                  return (
                    <div key={score} className="flex items-center space-x-2">
                      <span className="text-sm w-8">{score}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Feedback Categories</h4>
              <div className="space-y-2">
                {['Support', 'Product', 'Overall'].map(category => {
                  const count = mockFeedback.filter(f => f.category === category).length;
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm">{category}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Recent Feedback</h4>
              <div className="space-y-2">
                {mockFeedback.slice(0, 3).map(feedback => (
                  <div key={feedback.id} className="p-2 border rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{feedback.customerName}</span>
                      <Badge variant="outline">{feedback.score}/5</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {feedback.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}