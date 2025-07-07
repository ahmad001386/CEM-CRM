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

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'lead': return 'سرنخ';
      case 'qualified': return 'واجد شرایط';
      case 'proposal': return 'پیشنهاد';
      case 'negotiation': return 'مذاکره';
      case 'closed_won': return 'بسته شده - برنده';
      case 'closed_lost': return 'بسته شده - بازنده';
      default: return stage;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'lead': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'qualified': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'proposal': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200';
      case 'negotiation': return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200';
      case 'closed_won': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'closed_lost': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const wonValue = opportunities.filter(opp => opp.stage === 'closed_won').reduce((sum, opp) => sum + opp.value, 0);
  const winRate = opportunities.length > 0 ? (opportunities.filter(opp => opp.stage === 'closed_won').length / opportunities.length) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            پایپ‌لاین فروش
          </h1>
          <p className="text-muted-foreground font-vazir mt-2">پیگیری فرصت‌های فروش و پایپ‌لاین شما</p>
        </div>
        <Button className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 font-vazir">
          <Plus className="h-4 w-4 ml-2" />
          افزودن فرصت
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">کل پایپ‌لاین</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">{(totalValue / 1000).toLocaleString('fa-IR')}K تومان</div>
          </CardContent>
        </Card>
        <Card className="border-secondary/20 hover:border-secondary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">معاملات برنده</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">{(wonValue / 1000).toLocaleString('fa-IR')}K تومان</div>
          </CardContent>
        </Card>
        <Card className="border-accent/20 hover:border-accent/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">نرخ برد</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">%{winRate.toLocaleString('fa-IR', { maximumFractionDigits: 1 })}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">فرصت‌ها</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">{opportunities.length.toLocaleString('fa-IR')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Kanban */}
      <div className="grid gap-4 md:grid-cols-6">
        {Object.entries(groupedOpportunities).map(([stage, opps]) => (
          <Card key={stage} className="min-h-96 border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium flex items-center justify-between font-vazir">
                <span>{getStageLabel(stage)}</span>
                <Badge variant="secondary" className="font-vazir">{opps.length.toLocaleString('fa-IR')}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {opps.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="p-3 bg-white dark:bg-gray-800 border border-border/50 rounded-lg shadow-sm cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-300"
                >
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm font-vazir">{opportunity.title}</h4>
                    <p className="text-xs text-muted-foreground font-vazir">{opportunity.customerName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold font-vazir">{(opportunity.value / 1000).toLocaleString('fa-IR')}K تومان</span>
                      <span className="text-xs text-muted-foreground font-vazir">%{opportunity.probability.toLocaleString('fa-IR')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-vazir">
                        {new Date(opportunity.expectedCloseDate).toLocaleDateString('fa-IR')}
                      </span>
                      <span className="text-xs text-muted-foreground font-vazir">{opportunity.assignedTo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conversion Funnel */}
      <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="font-vazir">قیف فروش</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(groupedOpportunities).map(([stage, opps]) => {
              const percentage = opportunities.length > 0 ? (opps.length / opportunities.length) * 100 : 0;
              return (
                <div key={stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium font-vazir">{getStageLabel(stage)}</span>
                    <span className="text-sm text-muted-foreground font-vazir">{opps.length.toLocaleString('fa-IR')} فرصت</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary via-secondary to-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground font-vazir">
                    %{percentage.toLocaleString('fa-IR', { maximumFractionDigits: 1 })} از کل پایپ‌لاین
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