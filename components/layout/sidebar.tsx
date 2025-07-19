'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import {
  LayoutDashboard,
  Users,
  Contact,
  Ticket,
  MessageCircle,
  TrendingUp,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Building2,
  ChevronLeft,
  Activity,
  Calendar,
  Briefcase,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  // ————— CRM Core ————— 
  {
    title: 'داشبورد',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'مشتریان & مخاطبین',
    href: '#',
    icon: Users,
    children: [
      { title: 'مشتریان', href: '/dashboard/customers', icon: Users },
      { title: 'مخاطبین', href: '/dashboard/contacts', icon: Contact },
    ],
  },
  {
    title: 'همکاران & فعالیت‌ها',
    href: '#',
    icon: Activity,
    children: [
      { title: 'همکاران', href: '/dashboard/coworkers', icon: Target },
      { title: 'فعالیت‌ها', href: '/dashboard/activities', icon: Activity },
    ],
  },
  {
    title: 'تعاملات',
    href: '/dashboard/interactions',
    icon: MessageCircle,
    children: [
      { title: 'لیست تعاملات', href: '/dashboard/interactions', icon: Activity },
      { title: 'چت', href: '/dashboard/interactions/chat', icon: MessageCircle },
    ],
  },
  {
    title: 'مدیریت فروش',
    href: '#',
    icon: TrendingUp,
    children: [
      { title: 'فرصت‌های فروش', href: '/dashboard/sales/opportunities', icon: Ticket },
      { title: 'ثبت فروش', href: '/dashboard/sales', icon: TrendingUp },
    ],
  },

  // ————— CEM (تجربه مشتری) ————— 
  //{
  //title: 'CEM Overview',
  //href: '/dashboard/cem/overview',
  //icon: BarChart3,
  // },
  {
    title: 'بازخورد & امتیازدهی',
    href: '#',
    icon: MessageCircle,
    children: [
      { title: 'ثبت بازخورد', href: '/dashboard/feedback/new', icon: MessageCircle },
      { title: 'بازخوردها', href: '/dashboard/feedback', icon: MessageCircle },
      { title: 'نظرسنجی‌ها', href: '/dashboard/surveys', icon: ChevronRight },
      { title: 'CSAT', href: '/dashboard/csat', icon: ChevronRight },
      { title: 'NPS', href: '/dashboard/nps', icon: ChevronRight },
    ],
  },
  {
    title: 'تحلیل & بینش',
    href: '#',
    icon: BarChart3,
    children: [
      { title: 'تحلیل احساسات', href: '/dashboard/emotions', icon: Activity },
      { title: 'بینش‌های خودکار', href: '/dashboard/insights', icon: BarChart3 },
      { title: 'نقاط تماس', href: '/dashboard/touchpoints', icon: Target },
      { title: 'سلامت مشتری', href: '/dashboard/customer-health', icon: Activity },
      { title: 'هشدارها', href: '/dashboard/alerts', icon: Activity },
      { title: 'صدای مشتری (VOC)', href: '/dashboard/voice-of-customer', icon: MessageCircle },
    ],
  },

  // ————— سایر ————— 
  {
    title: 'پروژه‌ها',
    href: '/dashboard/projects',
    icon: Briefcase,
  },
  {
    title: 'تقویم',
    href: '/dashboard/calendar',
    icon: Calendar,
  },
  {
    title: 'گزارش‌ها',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
  {
    title: 'تنظیمات',
    href: '/dashboard/settings',
    icon: Settings,
    children: [
      { title: 'تنظیمات عمومی', href: '/dashboard/settings', icon: Settings },
      { title: 'تنظیمات CEM', href: '/dashboard/cem-settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => {
      // اگر آیتم در لیست باز شده‌ها باشد، آن را ببند
      if (prev.includes(title)) {
        return prev.filter(item => item !== title);
      }
      // در غیر این صورت، همه را ببند و فقط این یکی را باز کن
      return [title];
    });
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isActive = pathname === item.href;
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.title} className="animate-fade-in-up">
        <div
          className={cn(
            'flex items-center space-x-3 space-x-reverse rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 group relative overflow-hidden',
            level > 0 && 'mr-4',
            isActive
              ? 'bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 text-primary shadow-lg border border-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-primary/5 hover:via-secondary/5 hover:to-accent/5 hover:shadow-md',
            sidebarCollapsed && 'justify-center px-2',
            'before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:via-secondary/10 before:to-accent/10 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100'
          )}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-inherit hover:bg-transparent relative z-10"
              onClick={() => toggleExpanded(item.title)}
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <item.icon className={cn(
                  "h-5 w-5 transition-colors duration-300",
                  isActive ? "text-primary" : "group-hover:text-primary"
                )} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 font-vazir">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="mr-auto bg-accent/20 text-accent border-accent/30">
                        {item.badge}
                      </Badge>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                    ) : (
                      <ChevronRight className="h-4 w-4 transition-transform duration-300" />
                    )}
                  </>
                )}
              </div>
            </Button>
          ) : (
            <Link href={item.href} className="flex items-center space-x-3 space-x-reverse flex-1 relative z-10">
              <item.icon className={cn(
                "h-5 w-5 transition-colors duration-300",
                isActive ? "text-primary" : "group-hover:text-primary"
              )} />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 font-vazir">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="mr-auto bg-accent/20 text-accent border-accent/30">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )}
        </div>

        {hasChildren && isExpanded && !sidebarCollapsed && (
          <div className="mr-4 space-y-1 animate-slide-in-right">
            {item.children?.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40 backdrop-blur-sm"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-full bg-card/95 backdrop-blur-xl border-l border-border/50 transition-all duration-300 lg:relative lg:z-0 shadow-2xl',
          sidebarCollapsed ? 'w-16' : 'w-72'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold font-vazir bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                داشبورد مدیریت
              </h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="lg:hidden hover:bg-primary/10"
          >
            {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="space-y-2 p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map(item => renderNavItem(item))}
        </nav>

        {/* Collapse button for desktop */}
        <div className="hidden lg:block absolute bottom-4 left-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hover:bg-primary/10"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </>
  );
}