export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  segment: 'enterprise' | 'small_business' | 'individual';
  createdAt: string;
  lastInteraction?: string;
  totalTickets: number;
  satisfactionScore?: number;
}

export interface Contact {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  notes?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  category: string;
}

export interface Interaction {
  id: string;
  customerId: string;
  customerName: string;
  type: 'email' | 'phone' | 'chat' | 'meeting';
  subject: string;
  description: string;
  date: string;
  duration?: number;
  outcome?: string;
}

export interface Opportunity {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  createdAt: string;
  notes?: string;
}

export interface Feedback {
  id: string;
  customerId: string;
  customerName: string;
  type: 'csat' | 'nps' | 'ces';
  score: number;
  comment?: string;
  createdAt: string;
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'manager';
  avatar?: string;
  lastActive: string;
  status: 'active' | 'inactive';
  team?: string;
}

export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  openTickets: number;
  avgSatisfactionScore: number;
  npsScore: number;
  totalOpportunities: number;
  monthlyRevenue: number;
  ticketResolutionTime: number;
}