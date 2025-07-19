import {
  Customer,
  Contact,
  Ticket,
  Interaction,
  Opportunity,
  Feedback,
  User,
  DashboardStats,
  Activity,
  Note,
  Task,
  Target,
  Product,
  Deal,
  Alert,
  UserActivityStat,
  CalendarEvent
} from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'علی جعفری',
    email: 'ali.jafari@company.com',
    role: 'مدیر',
    status: 'online',
  },
  {
    id: '2',
    name: 'مهندس کریمی',
    email: '1@gmail.com',
    password: '1',
    role: 'کارشناس فروش',
    status: 'online',
  },
  {
    id: '3',
    name: 'حسن محمدی',
    email: 'hassan.mohammadi@company.com',
    role: 'مدیر فروش',
    status: 'away',
  },
  {
    id: '4',
    name: 'رسول کریمیی',
    email: 'zahra.karimi@company.com',
    role: 'agent',
    avatar: 'ر.ک',
    lastActive: '2024-01-20T13:20:00Z',
    status: 'active',
    team: 'فروش',
  },
];

export const mockContacts: Contact[] = [
  {
    id: '4',
    name: 'زهرا حسینی',
    email: 'zahra.hosseini@gmail.com',
    role: 'مشتری',
    status: 'online',
  },
  {
    id: '5',
    name: 'محمد رضایی',
    email: 'mohammad.rezaei@yahoo.com',
    role: 'مشتری',
    status: 'offline',
  },
  {
    id: '6',
    name: 'فاطمه کریمی',
    email: 'fatemeh.karimi@gmail.com',
    role: 'مشتری',
    status: 'away',
  }
];

export const mockTargets: Target[] = [
  {
    id: '1',
    userId: '2',
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    salesCount: 20,
    salesAmount: 500000000,
    callCount: 100,
    dealCount: 15,
    currentSalesCount: 12,
    currentSalesAmount: 280000000,
    currentCallCount: 65,
    currentDealCount: 8,
  },
  {
    id: '2',
    userId: '4',
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    salesCount: 15,
    salesAmount: 300000000,
    callCount: 80,
    dealCount: 10,
    currentSalesCount: 9,
    currentSalesAmount: 180000000,
    currentCallCount: 52,
    currentDealCount: 6,
  },
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'call',
    customerId: '1',
    customerName: 'شرکت آکمه',
    title: 'تماس پیگیری پیشنهاد',
    description: 'بحث در مورد جزئیات پیشنهاد ارسالی و پاسخ به سوالات',
    startTime: '2024-01-20T10:00:00Z',
    endTime: '2024-01-20T10:30:00Z',
    duration: 30,
    performedBy: 'مریم احمدی',
    outcome: 'successful',
    createdAt: '2024-01-20T10:30:00Z',
  },
  {
    id: '2',
    type: 'meeting',
    customerId: '2',
    customerName: 'راه‌حل‌های فناوری پارس',
    title: 'جلسه ارائه محصول',
    description: 'ارائه دمو محصول و بحث در مورد نیازهای مشتری',
    startTime: '2024-01-20T14:00:00Z',
    endTime: '2024-01-20T15:30:00Z',
    duration: 90,
    performedBy: 'علی جعفری',
    outcome: 'follow_up_needed',
    createdAt: '2024-01-20T15:30:00Z',
  },
];

export const mockNotes: Note[] = [
  {
    id: '1',
    customerId: '1',
    title: 'نیازهای فنی مشتری',
    content: 'مشتری به دنبال راه‌حلی برای مدیریت ۵۰۰ کاربر همزمان است. نیاز به پشتیبانی ۲۴/۷ دارد.',
    category: 'customer_need',
    tags: ['فنی', 'پشتیبانی', 'مقیاس‌پذیری'],
    createdBy: 'مریم احمدی',
    createdAt: '2024-01-20T09:00:00Z',
    isPrivate: false,
  },
  {
    id: '2',
    customerId: '2',
    title: 'اعتراض قیمت',
    content: 'مشتری قیمت را بالا می‌داند. پیشنهاد تخفیف ۱۰٪ برای خرید سالانه.',
    category: 'objection',
    tags: ['قیمت', 'تخفیف', 'مذاکره'],
    createdBy: 'علی جعفری',
    createdAt: '2024-01-19T16:00:00Z',
    isPrivate: false,
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'پیگیری پیشنهاد شرکت آکمه',
    description: 'تماس برای دریافت بازخورد پیشنهاد ارسالی',
    assignedTo: '2',
    assignedBy: '1',
    customerId: '1',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-21T10:00:00Z',
    createdAt: '2024-01-20T09:00:00Z',
    category: 'follow_up',
  },
  {
    id: '2',
    title: 'آماده‌سازی ارائه برای پارس تک',
    description: 'تهیه اسلایدهای ارائه محصول',
    assignedTo: '2',
    assignedBy: '3',
    customerId: '2',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2024-01-22T14:00:00Z',
    createdAt: '2024-01-19T11:00:00Z',
    category: 'proposal',
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'پکیج CRM پایه',
    category: 'نرم‌افزار',
    basePrice: 50000000,
    description: 'سیستم مدیریت روابط مشتریان برای کسب‌وکارهای کوچک',
    specifications: 'تا ۱۰۰ مخاطب، پشتیبانی ایمیل، گزارش‌گیری پایه',
    isActive: true,
    inventory: 999,
  },
  {
    id: '2',
    name: 'پکیج CRM حرفه‌ای',
    category: 'نرم‌افزار',
    basePrice: 150000000,
    description: 'سیستم مدیریت روابط مشتریان برای شرکت‌های متوسط',
    specifications: 'تا ۱۰۰۰ مخاطب، پشتیبانی تلفنی، گزارش‌گیری پیشرفته، API',
    isActive: true,
    inventory: 999,
  },
];

export const mockDeals: Deal[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'شرکت آکمه',
    title: 'پیاده‌سازی سیستم CRM',
    products: [
      {
        productId: '2',
        productName: 'پکیج CRM حرفه‌ای',
        quantity: 1,
        unitPrice: 150000000,
        discount: 10,
        totalPrice: 135000000,
      }
    ],
    totalValue: 135000000,
    stage: 'proposal_sent',
    probability: 75,
    expectedCloseDate: '2024-02-15',
    assignedTo: '2',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    notes: [],
    activities: [],
  },
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'معامله در خطر',
    message: 'معامله شرکت آکمه ۳ روز است پاسخی دریافت نکرده',
    priority: 'high',
    createdAt: '2024-01-20T09:00:00Z',
    isRead: false,
    actionUrl: '/dashboard/customers/1',
  },
  {
    id: '2',
    type: 'info',
    title: 'تسک جدید',
    message: 'تسک پیگیری برای شما تعریف شده است',
    priority: 'medium',
    createdAt: '2024-01-20T10:00:00Z',
    isRead: false,
    actionUrl: '/dashboard/tasks',
  },
];

export const mockUserActivity: UserActivityStat[] = [
  {
    userId: '2',
    userName: 'مریم احمدی',
    callsToday: 8,
    meetingsToday: 2,
    dealsActive: 5,
    targetProgress: 65,
    lastActivity: '2024-01-20T15:30:00Z',
  },
  {
    userId: '4',
    userName: 'زهرا کریمی',
    callsToday: 6,
    meetingsToday: 1,
    dealsActive: 3,
    targetProgress: 52,
    lastActivity: '2024-01-20T13:20:00Z',
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'جلسه با شرکت آکمه',
    description: 'بحث نهایی پیشنهاد',
    startDate: '2024-01-21T10:00:00Z',
    endDate: '2024-01-21T11:00:00Z',
    type: 'meeting',
    customerId: '1',
    customerName: 'شرکت آکمه',
    assignedTo: '2',
    status: 'scheduled',
    location: 'دفتر مرکزی',
  },
  {
    id: '2',
    title: 'تماس پیگیری',
    description: 'پیگیری پیشنهاد ارسالی',
    startDate: '2024-01-21T14:00:00Z',
    endDate: '2024-01-21T14:30:00Z',
    type: 'call',
    customerId: '2',
    customerName: 'راه‌حل‌های فناوری پارس',
    assignedTo: '4',
    status: 'scheduled',
  },
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'شرکت آکمه',
    email: 'contact@acme.com',
    phone: '۰۲۱-۱۲۳۴۵۶۷۸',
    status: 'follow_up',
    segment: 'enterprise',
    createdAt: '2024-01-15T10:00:00Z',
    lastInteraction: '2024-01-20T14:30:00Z',
    totalTickets: 12,
    satisfactionScore: 4.5,
    assignedTo: '2',
    potentialValue: 135000000,
    priority: 'high',
    tags: ['VIP', 'سازمانی', 'فناوری'],
    projects: ['پیاده‌سازی CRM', 'آموزش کاربران'],
    salesPipeline: {
      currentStage: 'proposal_sent',
      stageEntryDate: '2024-01-18T10:00:00Z',
      dealValue: 135000000,
      successProbability: 75,
      owner: 'مریم احمدی',
      activities: [],
      notes: [],
      stageHistory: [
        { stage: 'new_lead', entryDate: '2024-01-15T10:00:00Z', exitDate: '2024-01-16T14:00:00Z' },
        { stage: 'contacted', entryDate: '2024-01-16T14:00:00Z', exitDate: '2024-01-17T16:00:00Z' },
        { stage: 'needs_analysis', entryDate: '2024-01-17T16:00:00Z', exitDate: '2024-01-18T10:00:00Z' },
        { stage: 'proposal_sent', entryDate: '2024-01-18T10:00:00Z', exitDate: null },
      ],
      productSelected: true,
      contactMade: true,
      purchased: false,
      nextAction: 'پیگیری پیشنهاد ارسالی',
      lastContactDate: '2024-01-20T14:30:00Z',
      contactAttempts: 3,
    },
  },
  {
    id: '2',
    name: 'راه‌حل‌های فناوری پارس',
    email: 'info@parstech.com',
    phone: '۰۲۱-۹۸۷۶۵۴۳۲',
    status: 'active',
    segment: 'small_business',
    createdAt: '2024-01-10T09:00:00Z',
    lastInteraction: '2024-01-18T16:45:00Z',
    totalTickets: 8,
    satisfactionScore: 4.2,
    assignedTo: '4',
    potentialValue: 75000000,
    priority: 'medium',
    tags: ['کسب‌وکار کوچک', 'فناوری'],
    projects: ['مشاوره CRM'],
    salesPipeline: {
      currentStage: 'needs_analysis',
      stageEntryDate: '2024-01-16T09:00:00Z',
      dealValue: 75000000,
      successProbability: 60,
      owner: 'زهرا کریمی',
      activities: [],
      notes: [],
    },
  },
  {
    id: '3',
    name: 'شرکت جهانی سپهر',
    email: 'support@sepehr.com',
    phone: '۰۲۱-۴۵۶۷۸۹۰۱',
    status: 'active',
    segment: 'enterprise',
    createdAt: '2024-01-05T11:00:00Z',
    lastInteraction: '2024-01-19T10:15:00Z',
    totalTickets: 15,
    satisfactionScore: 4.8,
    assignedTo: '2',
    potentialValue: 200000000,
    priority: 'high',
    tags: ['VIP', 'سازمانی', 'بین‌المللی'],
    projects: ['CRM سازمانی', 'یکپارچه‌سازی'],
    salesPipeline: {
      currentStage: 'negotiation',
      stageEntryDate: '2024-01-19T10:00:00Z',
      dealValue: 200000000,
      successProbability: 85,
      owner: 'مریم احمدی',
      activities: [],
      notes: [],
    },
  },
];

export const mockTickets: Ticket[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'شرکت آکمه',
    subject: 'مشکل ورود به سیستم',
    priority: 'high',
    status: 'open',
    assignedTo: 'علی جعفری',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
    description: 'کاربران با مشکل ورود به پورتال مواجه هستند',
    category: 'فنی',
  },
];

export const mockInteractions: Interaction[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'شرکت آکمه',
    type: 'email',
    subject: 'پیگیری پیاده‌سازی',
    description: 'بحث در مورد زمان‌بندی و الزامات پیاده‌سازی',
    date: '2024-01-20T14:30:00Z',
    outcome: 'مثبت',
  },
];

export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'شرکت آکمه',
    title: 'تمدید لایسنس سازمانی',
    value: 150000,
    stage: 'proposal',
    probability: 80,
    expectedCloseDate: '2024-03-15',
    assignedTo: 'علی جعفری',
    createdAt: '2024-01-15T10:00:00Z',
    notes: 'تمدید سالانه با امکان گسترش',
  },
];

export const mockFeedback: Feedback[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'شرکت آکمه',
    type: 'complaint',
    score: 2.0,
    comment: 'زمان پاسخگویی تیم پشتیبانی بسیار طولانی است',
    createdAt: '1402/04/15',
    category: 'پشتیبانی',
    title: 'مشکل در پشتیبانی',
    product: 'محصول الف',
    channel: 'email',
    priority: 'high',
    status: 'pending',
    description: 'زمان پاسخگویی تیم پشتیبانی بسیار طولانی است'
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'راه‌حل‌های فناوری پارس',
    type: 'suggestion',
    score: 4.0,
    comment: 'اضافه کردن قابلیت جدید برای بهبود عملکرد',
    createdAt: '1402/04/14',
    category: 'محصول',
    title: 'پیشنهاد برای بهبود محصول',
    product: 'محصول ب',
    channel: 'website',
    priority: 'medium',
    status: 'inProgress',
    description: 'اضافه کردن قابلیت جدید برای بهبود عملکرد'
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'شرکت جهانی سپهر',
    type: 'praise',
    score: 5.0,
    comment: 'کیفیت محصول عالی بود و با نیازهای ما کاملاً مطابقت داشت',
    createdAt: '1402/04/13',
    category: 'کیفیت',
    title: 'تشکر از کیفیت محصول',
    product: 'محصول ج',
    channel: 'phone',
    priority: 'low',
    status: 'completed',
    description: 'کیفیت محصول عالی بود و با نیازهای ما کاملاً مطابقت داشت'
  },
];

export const mockDashboardStats: DashboardStats = {
  totalCustomers: 156,
  activeCustomers: 142,
  openTickets: 23,
  avgSatisfactionScore: 4.3,
  npsScore: 68,
  totalOpportunities: 45,
  monthlyRevenue: 2450000000,
  ticketResolutionTime: 2.5,
  totalSales: 1850000000,
  userActivity: mockUserActivity,
  importantLeads: mockCustomers.filter(c => c.priority === 'high'),
  alerts: mockAlerts,
};

export const mockInsightsData = [
  {
    id: '1',
    title: "افزایش شکایات در مورد سرعت پاسخگویی",
    description: "در ماه گذشته، تعداد شکایات مربوط به زمان پاسخگویی 25% افزایش یافته است.",
    impact: "high",
    category: "Support",
    status: "new",
    source: "تحلیل بازخوردها",
    date: "1402/04/15",
    suggestion: "پیشنهاد می‌شود تیم پشتیبانی تقویت شود"
  },
  {
    id: '2',
    title: "رضایت بالا از ویژگی جدید",
    description: "کاربران از قابلیت جدید گزارش‌گیری رضایت 85% داشته‌اند",
    impact: "medium",
    category: "Product",
    status: "in_progress",
    source: "نظرسنجی محصول",
    date: "1402/04/10",
    suggestion: "توسعه ویژگی‌های مشابه در سایر بخش‌ها"
  },
];



export const mockSurveys = [
  {
    id: '1',
    title: 'نظرسنجی رضایت مشتری - بهار 1402',
    type: 'CSAT',
    status: 'active',
    responses: 245,
    created: '1402/01/15',
    questions: [
      {
        id: '1',
        type: 'rating',
        question: 'از کیفیت خدمات ما چقدر راضی هستید؟',
        required: true
      },
      {
        id: '2',
        type: 'text',
        question: 'پیشنهادات شما برای بهبود خدمات چیست؟',
        required: false
      }
    ]
  },
  {
    id: '2',
    title: 'نظرسنجی محصول جدید',
    type: 'Product',
    status: 'draft',
    responses: 0,
    created: '1402/01/14',
    questions: []
  },
  {
    id: '3',
    title: 'نظرسنجی رضایت کارکنان',
    type: 'Employee',
    status: 'completed',
    responses: 89,
    created: '1402/01/10',
    questions: []
  },
];



export const mockVOCData = [
  {
    id: '1',
    type: "request",
    title: "درخواست افزودن قابلیت اکسپورت گروهی",
    description: "مشتریان نیاز به امکان اکسپورت دسته‌ای گزارش‌ها دارند",
    status: "open",
    priority: "high",
    source: "بازخورد مستقیم",
    department: "محصول",
    date: "1402/04/15",
    frequency: 12
  },
  {
    id: '2',
    type: "complaint",
    title: "کندی سیستم در ساعات پیک",
    description: "گزارش‌های متعدد از کندی سیستم در ساعات شلوغی",
    status: "in_review",
    priority: "high",
    source: "تیکت پشتیبانی",
    department: "فنی",
    date: "1402/04/14",
    frequency: 8
  },
];




export const mockChartData = {
  salesTrend: {
    labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
    datasets: [
      {
        label: 'درآمد',
        data: [1200000000, 1350000000, 1150000000, 1450000000, 1600000000, 1750000000, 1900000000, 2100000000, 2250000000, 2400000000, 2350000000, 2450000000],
        borderColor: '#00BCD4',
        backgroundColor: 'rgba(0, 188, 212, 0.1)',
        tension: 0.4,
      },
    ],
  },
  customerSatisfaction: {
    labels: ['بسیار راضی', 'راضی', 'خنثی', 'ناراضی', 'بسیار ناراضی'],
    datasets: [
      {
        data: [45, 35, 12, 6, 2],
        backgroundColor: ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'],
        borderWidth: 0,
      },
    ],
  },
  teamPerformance: {
    labels: ['پشتیبانی', 'فروش', 'موفقیت', 'مهندسی'],
    datasets: [
      {
        label: 'تیکت‌های حل شده',
        data: [85, 72, 68, 45],
        backgroundColor: '#00BCD4',
        borderRadius: 8,
      },
    ],
  },
};

// CSAT Data
export const mockCSATData = {
  overview: {
    current: 4.3,
    previous: 4.1,
    target: 4.5,
    responses: 1247,
    distribution: {
      5: 434,
      4: 456,
      3: 234,
      2: 78,
      1: 45
    } as { [key in 1 | 2 | 3 | 4 | 5]: number }
  },
  byChannel: [
    { channel: 'ایمیل', score: 4.5, responses: 456 },
    { channel: 'تلفن', score: 4.2, responses: 334 },
    { channel: 'چت', score: 4.1, responses: 267 },
    { channel: 'حضوری', score: 4.6, responses: 190 }
  ],
  byDepartment: [
    { department: 'پشتیبانی', score: 4.4, responses: 567 },
    { department: 'فروش', score: 4.2, responses: 345 },
    { department: 'فنی', score: 4.1, responses: 235 },
    { department: 'مالی', score: 4.3, responses: 100 }
  ],
  trends: [
    { month: 'فروردین', score: 4.0 },
    { month: 'اردیبهشت', score: 4.1 },
    { month: 'خرداد', score: 4.2 },
    { month: 'تیر', score: 4.3 },
    { month: 'مرداد', score: 4.3 },
    { month: 'شهریور', score: 4.3 }
  ],
  recentResponses: [
    {
      id: '1',
      customerName: 'احمد محمدی',
      score: 5,
      comment: 'خدمات بسیار عالی و پشتیبانی سریع',
      date: '1403/04/15',
      channel: 'ایمیل',
      department: 'پشتیبانی'
    },
    {
      id: '2',
      customerName: 'فاطمه رضایی',
      score: 4,
      comment: 'کیفیت محصول خوب است اما زمان تحویل طولانی بود',
      date: '1403/04/14',
      channel: 'تلفن',
      department: 'فروش'
    },
    {
      id: '3',
      customerName: 'علی کریمی',
      score: 3,
      comment: 'خدمات متوسط، امکان بهبود وجود دارد',
      date: '1403/04/13',
      channel: 'چت',
      department: 'فنی'
    },
    {
      id: '4',
      customerName: 'مریم احمدی',
      score: 5,
      comment: 'کاملاً راضی از خدمات ارائه شده',
      date: '1403/04/12',
      channel: 'حضوری',
      department: 'پشتیبانی'
    },
    {
      id: '5',
      customerName: 'حسن موسوی',
      score: 2,
      comment: 'زمان پاسخگویی بسیار طولانی بود',
      date: '1403/04/11',
      channel: 'ایمیل',
      department: 'پشتیبانی'
    }
  ]
};

// NPS Data
export const mockNPSData = {
  overview: {
    current: 42,
    previous: 38,
    target: 50,
    responses: 856,
    distribution: {
      detractors: 156, // 0-6
      passives: 234,   // 7-8
      promoters: 466   // 9-10
    }
  },
  byProduct: [
    { product: 'پکیج CRM حرفه‌ای', score: 48, responses: 345 },
    { product: 'پکیج CRM پایه', score: 36, responses: 267 },
    { product: 'پشتیبانی تلفنی', score: 44, responses: 144 },
    { product: 'آموزش آنلاین', score: 52, responses: 100 }
  ],
  byChannel: [
    { channel: 'ایمیل', score: 45, responses: 298 },
    { channel: 'تلفن', score: 38, responses: 234 },
    { channel: 'چت', score: 42, responses: 189 },
    { channel: 'حضوری', score: 48, responses: 135 }
  ],
  trends: [
    { month: 'فروردین', score: 35 },
    { month: 'اردیبهشت', score: 37 },
    { month: 'خرداد', score: 40 },
    { month: 'تیر', score: 42 },
    { month: 'مرداد', score: 43 },
    { month: 'شهریور', score: 42 }
  ],
  recentFeedback: [
    {
      id: '1',
      customerName: 'شرکت آکمه',
      score: 9,
      type: 'promoter',
      comment: 'محصول فوق‌العاده است و به دوستان هم پیشنهاد می‌دهم',
      date: '1403/04/15',
      channel: 'ایمیل'
    },
    {
      id: '2',
      customerName: 'راه‌حل‌های فناوری پارس',
      score: 6,
      type: 'detractor',
      comment: 'نسبت به رقبا ویژگی‌های کمتری دارد',
      date: '1403/04/14',
      channel: 'تلفن'
    },
    {
      id: '3',
      customerName: 'شرکت جهانی سپهر',
      score: 8,
      type: 'passive',
      comment: 'محصول خوبی است اما قابلیت‌های بیشتری انتظار داشتم',
      date: '1403/04/13',
      channel: 'چت'
    },
    {
      id: '4',
      customerName: 'تجارت الکترونیک نوین',
      score: 10,
      type: 'promoter',
      comment: 'عالی! حتماً به همه پیشنهاد می‌کنم',
      date: '1403/04/12',
      channel: 'حضوری'
    },
    {
      id: '5',
      customerName: 'صنعت پیشرو',
      score: 7,
      type: 'passive',
      comment: 'خدمات قابل قبولی دارید',
      date: '1403/04/11',
      channel: 'ایمیل'
    }
  ]
};

// Customer Health Data
export const mockCustomerHealthData = {
  overallHealth: {
    score: 78,
    trend: '+3',
    components: {
      usage: 85,
      csat: 76,
      nps: 72,
      tickets: 80,
    }
  },
  customers: [
    {
      id: 1,
      name: 'شرکت آکمه',
      healthScore: 92,
      status: 'green' as 'green' | 'yellow' | 'red',
      lastInteraction: '1403/04/15',
      segments: ['Enterprise', 'Tech'],
      metrics: {
        usage: 95,
        csat: 90,
        nps: 85,
        tickets: 95
      }
    },
    {
      id: 2,
      name: 'راه‌حل‌های فناوری پارس',
      healthScore: 65,
      status: 'yellow' as 'green' | 'yellow' | 'red',
      lastInteraction: '1403/04/10',
      segments: ['SMB', 'Retail'],
      metrics: {
        usage: 60,
        csat: 70,
        nps: 65,
        tickets: 65
      }
    },
    {
      id: 3,
      name: 'شرکت جهانی سپهر',
      healthScore: 45,
      status: 'red' as 'green' | 'yellow' | 'red',
      lastInteraction: '1403/04/01',
      segments: ['SMB', 'Manufacturing'],
      metrics: {
        usage: 40,
        csat: 50,
        nps: 45,
        tickets: 45
      }
    }
  ]
};

// Touchpoints Data
export const mockTouchpointsData = {
  summary: {
    total: 248,
    byChannel: {
      email: 89,
      phone: 76,
      chat: 45,
      inPerson: 38
    }
  },
  touchpoints: [
    {
      id: 1,
      customerName: 'شرکت آکمه',
      type: 'support' as 'support' | 'sales' | 'feedback',
      channel: 'email' as 'email' | 'phone' | 'chat' | 'inPerson',
      date: '1403/04/15',
      score: 4.5,
      agent: 'علی محمدی',
      description: 'درخواست راهنمایی برای نصب نسخه جدید',
      status: 'completed' as 'completed' | 'in_progress' | 'scheduled'
    },
    {
      id: 2,
      customerName: 'راه‌حل‌های فناوری پارس',
      type: 'sales' as 'support' | 'sales' | 'feedback',
      channel: 'phone' as 'email' | 'phone' | 'chat' | 'inPerson',
      date: '1403/04/14',
      score: 4.0,
      agent: 'مریم احمدی',
      description: 'جلسه معرفی محصول جدید',
      status: 'scheduled' as 'completed' | 'in_progress' | 'scheduled'
    },
    {
      id: 3,
      customerName: 'شرکت جهانی سپهر',
      type: 'feedback' as 'support' | 'sales' | 'feedback',
      channel: 'chat' as 'email' | 'phone' | 'chat' | 'inPerson',
      date: '1403/04/14',
      score: 3.5,
      agent: 'رضا کریمی',
      description: 'دریافت بازخورد در مورد ویژگی جدید',
      status: 'in_progress' as 'completed' | 'in_progress' | 'scheduled'
    }
  ]
};

// Emotions Data
export const mockEmotionsData = {
  summary: {
    positive: 68,
    neutral: 22,
    negative: 10,
    totalAnalyzed: 1543
  },
  wordCloud: [
    { word: 'عالی', count: 234, sentiment: 'positive' as 'positive' | 'neutral' | 'negative' },
    { word: 'مفید', count: 198, sentiment: 'positive' as 'positive' | 'neutral' | 'negative' },
    { word: 'آسان', count: 167, sentiment: 'positive' as 'positive' | 'neutral' | 'negative' },
    { word: 'کند', count: 89, sentiment: 'negative' as 'positive' | 'neutral' | 'negative' },
    { word: 'پیچیده', count: 76, sentiment: 'negative' as 'positive' | 'neutral' | 'negative' },
    { word: 'مناسب', count: 145, sentiment: 'positive' as 'positive' | 'neutral' | 'negative' },
    { word: 'کامل', count: 123, sentiment: 'positive' as 'positive' | 'neutral' | 'negative' },
    { word: 'متوسط', count: 98, sentiment: 'neutral' as 'positive' | 'neutral' | 'negative' },
    { word: 'سریع', count: 167, sentiment: 'positive' as 'positive' | 'neutral' | 'negative' },
    { word: 'مشکل', count: 87, sentiment: 'negative' as 'positive' | 'neutral' | 'negative' }
  ],
  trends: [
    { date: '1403/04/01', positive: 65, neutral: 25, negative: 10 },
    { date: '1403/04/02', positive: 70, neutral: 20, negative: 10 },
    { date: '1403/04/03', positive: 68, neutral: 22, negative: 10 },
    { date: '1403/04/04', positive: 72, neutral: 18, negative: 10 },
    { date: '1403/04/05', positive: 68, neutral: 22, negative: 10 }
  ],
  categories: [
    { name: 'پشتیبانی', positive: 75, neutral: 15, negative: 10 },
    { name: 'محصول', positive: 60, neutral: 30, negative: 10 },
    { name: 'فروش', positive: 70, neutral: 20, negative: 10 },
    { name: 'عمومی', positive: 65, neutral: 25, negative: 10 }
  ],
  feedbacks: [
    {
      id: '1',
      text: 'محصول شما فوق‌العاده است و واقعاً کارم را راحت کرده',
      sentiment: 'positive' as 'positive' | 'neutral' | 'negative',
      score: 0.92,
      date: '1403/04/15',
      channel: 'ایمیل',
      customer: 'احمد محمدی'
    },
    {
      id: '2',
      text: 'خدمات پشتیبانی خوب است اما سرعت پاسخگویی قابل بهبود است',
      sentiment: 'neutral' as 'positive' | 'neutral' | 'negative',
      score: 0.45,
      date: '1403/04/14',
      channel: 'چت',
      customer: 'فاطمه رضایی'
    },
    {
      id: '3',
      text: 'کیفیت محصول پایین است و مشکلات زیادی دارد',
      sentiment: 'negative' as 'positive' | 'neutral' | 'negative',
      score: 0.15,
      date: '1403/04/13',
      channel: 'تلفن',
      customer: 'علی کریمی'
    },
    {
      id: '4',
      text: 'عالی! دقیقاً همان چیزی بود که نیاز داشتم',
      sentiment: 'positive' as 'positive' | 'neutral' | 'negative',
      score: 0.95,
      date: '1403/04/12',
      channel: 'حضوری',
      customer: 'مریم احمدی'
    },
    {
      id: '5',
      text: 'قیمت نسبت به کیفیت مناسب نیست',
      sentiment: 'negative' as 'positive' | 'neutral' | 'negative',
      score: 0.25,
      date: '1403/04/11',
      channel: 'ایمیل',
      customer: 'حسن موسوی'
    }
  ]
};

// Voice of Customer Data
export const mockVoiceOfCustomerData = {
  totalFeedback: 2456,
  categories: [
    { name: 'محصول', count: 856, sentiment: 'positive' },
    { name: 'پشتیبانی', count: 643, sentiment: 'positive' },
    { name: 'قیمت', count: 445, sentiment: 'neutral' },
    { name: 'رابط کاربری', count: 334, sentiment: 'negative' },
    { name: 'عملکرد', count: 178, sentiment: 'positive' }
  ],
  keywords: [
    { word: 'عالی', count: 234, sentiment: 'positive' },
    { word: 'مفید', count: 198, sentiment: 'positive' },
    { word: 'آسان', count: 167, sentiment: 'positive' },
    { word: 'کند', count: 89, sentiment: 'negative' },
    { word: 'پیچیده', count: 76, sentiment: 'negative' }
  ],
  recentFeedback: [
    {
      id: 1,
      customer: 'شرکت آکمه',
      message: 'محصول بسیار خوبی است و تیم پشتیبانی عالی کار می‌کند',
      sentiment: 'positive' as 'positive' | 'neutral' | 'negative',
      date: '1403/04/15',
      category: 'محصول'
    },
    {
      id: 2,
      customer: 'پارس تک',
      message: 'رابط کاربری کمی پیچیده است و نیاز به بهبود دارد',
      sentiment: 'negative' as 'positive' | 'neutral' | 'negative',
      date: '1403/04/14',
      category: 'رابط کاربری'
    }
  ]
};

// Projects Data
export const mockProjects = [
  {
    id: '1',
    name: 'پیاده‌سازی سیستم CRM',
    description: 'پیاده‌سازی و راه‌اندازی سیستم مدیریت روابط مشتریان برای شرکت آکمه',
    customerId: '1',
    customerName: 'شرکت آکمه',
    status: 'in_progress' as 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold',
    priority: 'high' as 'low' | 'medium' | 'high',
    progress: 65,
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    budget: 135000000,
    spent: 85000000,
    team: ['2', '4'],
    manager: '2',
    tags: ['CRM', 'Implementation'],
    tasks: 15,
    completedTasks: 8,
    milestones: [
      { name: 'نصب سیستم', completed: true, date: '2024-01-30' },
      { name: 'پیکربندی', completed: true, date: '2024-02-15' },
      { name: 'آموزش کاربران', completed: false, date: '2024-02-28' },
      { name: 'راه‌اندازی نهایی', completed: false, date: '2024-03-15' }
    ]
  },
  {
    id: '2',
    name: 'مشاوره CRM',
    description: 'ارائه خدمات مشاوره‌ای برای بهینه‌سازی فرآیندهای CRM',
    customerId: '2',
    customerName: 'راه‌حل‌های فناوری پارس',
    status: 'planning' as 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold',
    priority: 'medium' as 'low' | 'medium' | 'high',
    progress: 25,
    startDate: '2024-02-01',
    endDate: '2024-04-01',
    budget: 75000000,
    spent: 15000000,
    team: ['4'],
    manager: '4',
    tags: ['Consulting', 'Optimization'],
    tasks: 8,
    completedTasks: 2,
    milestones: [
      { name: 'تحلیل وضعیت فعلی', completed: true, date: '2024-02-15' },
      { name: 'طراحی فرآیند', completed: false, date: '2024-03-01' },
      { name: 'پیاده‌سازی', completed: false, date: '2024-03-20' },
      { name: 'تست و بهینه‌سازی', completed: false, date: '2024-04-01' }
    ]
  },
  {
    id: '3',
    name: 'CRM سازمانی',
    description: 'پیاده‌سازی CRM سازمانی با قابلیت‌های پیشرفته',
    customerId: '3',
    customerName: 'شرکت جهانی سپهر',
    status: 'review' as 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold',
    priority: 'high' as 'low' | 'medium' | 'high',
    progress: 90,
    startDate: '2023-10-01',
    endDate: '2024-01-31',
    budget: 200000000,
    spent: 185000000,
    team: ['2', '3', '4'],
    manager: '2',
    tags: ['Enterprise', 'CRM'],
    tasks: 25,
    completedTasks: 22,
    milestones: [
      { name: 'تحلیل نیازمندی‌ها', completed: true, date: '2023-11-01' },
      { name: 'طراحی سیستم', completed: true, date: '2023-12-01' },
      { name: 'توسعه و پیاده‌سازی', completed: true, date: '2024-01-15' },
      { name: 'تست نهایی و تحویل', completed: false, date: '2024-01-31' }
    ]
  }
];

// Surveys Data
export const mockSurveysData = [
  {
    id: '1',
    title: 'نظرسنجی رضایت مشتریان',
    description: 'بررسی میزان رضایت مشتریان از محصولات و خدمات',
    status: 'active' as 'active' | 'draft' | 'completed',
    type: 'csat' as 'csat' | 'nps' | 'custom',
    createdAt: '1403/03/15',
    responses: 234,
    targetResponses: 500,
    questions: [
      {
        id: '1',
        text: 'چقدر از خدمات ما راضی هستید؟',
        type: 'rating' as 'rating' | 'text' | 'multiple_choice',
        required: true
      },
      {
        id: '2',
        text: 'نظر شما در مورد کیفیت محصول چیست؟',
        type: 'text' as 'rating' | 'text' | 'multiple_choice',
        required: false
      }
    ]
  },
  {
    id: '2',
    title: 'نظرسنجی NPS',
    description: 'بررسی میزان وفاداری مشتریان',
    status: 'completed' as 'active' | 'draft' | 'completed',
    type: 'nps' as 'csat' | 'nps' | 'custom',
    createdAt: '1403/02/20',
    responses: 856,
    targetResponses: 1000,
    questions: [
      {
        id: '1',
        text: 'چقدر احتمال دارد که ما را به دیگران توصیه کنید؟',
        type: 'rating' as 'rating' | 'text' | 'multiple_choice',
        required: true
      }
    ]
  }
];