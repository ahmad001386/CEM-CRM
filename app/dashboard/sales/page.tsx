'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockOpportunities } from '@/lib/mock-data';
import { Opportunity } from '@/lib/types';
import { Plus, DollarSign, TrendingUp, Target, Calendar } from 'lucide-react';

export default function SalesPage() {
  const [opportunities] = useState<Opportunity[]>(mockOpportunities);

  const groupByStage = (opps: Opportunity[]) => {
    const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
    return stages.reduce((acc, stage) => {
      acc[stage] = opps.filter(opp => opp.stage === stage);
      return acc;
    }, {} as Record<string, Opportunity[]>);
  };

  const groupedOpportunities = groupByStage(opportunities);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'lead': return 'bg-gray-100 text-gray-800';
      case 'qualified': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed_won': return 'bg-green-100 text-green-800';
      case 'closed_lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const wonValue = opportunities.filter(opp => opp.stage === 'closed_won').reduce((sum, opp) => sum + opp.value, 0);
  const winRate = opportunities.length > 0 ? (opportunities.filter(opp => opp.stage === 'closed_won').length / opportunities.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Pipeline</h1>
          <p className="text-muted-foreground">Track your sales opportunities and pipeline</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Opportunity
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalValue / 1000).toFixed(0)}K</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(wonValue / 1000).toFixed(0)}K</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunities.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Kanban */}
      <div className="grid gap-4 md:grid-cols-6">
        {Object.entries(groupedOpportunities).map(([stage, opps]) => (
          <Card key={stage} className="min-h-96">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="capitalize">{stage.replace('_', ' ')}</span>
                <Badge variant="secondary">{opps.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {opps.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="p-3 bg-white border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{opportunity.title}</h4>
                    <p className="text-xs text-muted-foreground">{opportunity.customerName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">${(opportunity.value / 1000).toFixed(0)}K</span>
                      <span className="text-xs text-muted-foreground">{opportunity.probability}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground">{opportunity.assignedTo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(groupedOpportunities).map(([stage, opps]) => {
              const percentage = opportunities.length > 0 ? (opps.length / opportunities.length) * 100 : 0;
              return (
                <div key={stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{stage.replace('_', ' ')}</span>
                    <span className="text-sm text-muted-foreground">{opps.length} opportunities</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {percentage.toFixed(1)}% of total pipeline
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}