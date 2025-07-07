'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockOpportunities } from '@/lib/mock-data';
import { Opportunity } from '@/lib/types';
import { Plus, TrendingUp, DollarSign, Target, Calendar } from 'lucide-react';

export default function OpportunitiesPage() {
  const [opportunities] = useState<Opportunity[]>(mockOpportunities);

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
      case 'lead': return 'secondary';
      case 'qualified': return 'default';
      case 'proposal': return 'default';
      case 'negotiation': return 'default';
      case 'closed_won': return 'default';
      case 'closed_lost': return 'destructive';
      default: return 'secondary';
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'عنوان فرصت',
      sortable: true,
      render: (value: string, row: Opportunity) => (
        <div>
          <p className="font-medium font-vazir">{value}</p>
          <p className="text-sm text-muted-foreground font-vazir">{row.customerName}</p>
        </div>
      ),
    },
    {
      key: 'value',
      label: 'ارزش',
      sortable: true,
      render: (value: number) => (
        <span className="font-vazir font-medium">{(value / 1000).toLocaleString('fa-IR')}K تومان</span>
      ),
    },
    {
      key: 'stage',
      label: 'مرحله',
      sortable: true,
      render: (value: string) => (
        <Badge variant={getStageColor(value)} className="font-vazir">
          {getStageLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'probability',
      label: 'احتمال',
      sortable: true,
      render: (value: number) => (
        <span className="font-vazir">%{value.toLocaleString('fa-IR')}</span>
      ),
    },
    {
      key: 'expectedCloseDate',
      label: 'تاریخ بسته شدن',
      sortable: true,
      render: (value: string) => (
        <span className="font-vazir">{new Date(value).toLocaleDateString('fa-IR')}</span>
      ),
    },
    {
      key: 'assignedTo',
      label: 'تخصیص یافته به',
      sortable: true,
      render: (value: string) => (
        <span className="font-vazir">{value}</span>
      ),
    },
  ];

  const handleEditOpportunity = (opportunity: Opportunity) => {
    console.log('ویرایش فرصت:', opportunity);
  };

  const handleDeleteOpportunity = (opportunity: Opportunity) => {
    console.log('حذف فرصت:', opportunity);
  };

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const wonValue = opportunities.filter(opp => opp.stage === 'closed_won').reduce((sum, opp) => sum + opp.value, 0);
  const activeOpportunities = opportunities.filter(opp => !opp.stage.includes('closed'));
  const avgProbability = activeOpportunities.length > 0 
    ? activeOpportunities.reduce((sum, opp) => sum + opp.probability, 0) / activeOpportunities.length 
    : 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            فرصت‌های فروش
          </h1>
          <p className="text-muted-foreground font-vazir mt-2">مدیریت و پیگیری همه فرصت‌های فروش</p>
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
            <CardTitle className="text-sm font-medium font-vazir">کل ارزش</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">{(totalValue / 1000).toLocaleString('fa-IR')}K تومان</div>
          </CardContent>
        </Card>
        <Card className="border-secondary/20 hover:border-secondary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">ارزش برنده</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">{(wonValue / 1000).toLocaleString('fa-IR')}K تومان</div>
          </CardContent>
        </Card>
        <Card className="border-accent/20 hover:border-accent/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">میانگین احتمال</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">%{avgProbability.toLocaleString('fa-IR', { maximumFractionDigits: 1 })}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-vazir">فرصت‌های فعال</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-vazir">{activeOpportunities.length.toLocaleString('fa-IR')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities Table */}
      <Card className="border-border/50 hover:border-primary/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="font-vazir">همه فرصت‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={opportunities}
            columns={columns}
            onEdit={handleEditOpportunity}
            onDelete={handleDeleteOpportunity}
          />
        </CardContent>
      </Card>
    </div>
  );
}