'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockInteractions } from '@/lib/mock-data';
import { Interaction } from '@/lib/types';
import { Plus, MessageCircle, Phone, Mail, Calendar } from 'lucide-react';

export default function InteractionsPage() {
  const [interactions] = useState<Interaction[]>(mockInteractions);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'phone': return Phone;
      case 'meeting': return Calendar;
      default: return MessageCircle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value: string) => {
        const Icon = getTypeIcon(value);
        return (
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4" />
            <Badge className={getTypeColor(value)}>{value}</Badge>
          </div>
        );
      },
    },
    {
      key: 'subject',
      label: 'Subject',
      sortable: true,
      render: (value: string, row: Interaction) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-sm text-muted-foreground">{row.customerName}</p>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      sortable: true,
      render: (value: number) => value ? `${value} min` : 'N/A',
    },
    {
      key: 'outcome',
      label: 'Outcome',
      render: (value: string) => (
        <Badge variant={value === 'Positive' ? 'default' : 'secondary'}>
          {value || 'N/A'}
        </Badge>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const handleEditInteraction = (interaction: Interaction) => {
    console.log('Edit interaction:', interaction);
  };

  const handleDeleteInteraction = (interaction: Interaction) => {
    console.log('Delete interaction:', interaction);
  };

  const emailInteractions = interactions.filter(i => i.type === 'email');
  const phoneInteractions = interactions.filter(i => i.type === 'phone');
  const meetingInteractions = interactions.filter(i => i.type === 'meeting');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Interactions</h1>
          <p className="text-muted-foreground">Track all customer communications and touchpoints</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Log Interaction
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interactions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailInteractions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{phoneInteractions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meetingInteractions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Interactions Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interactions.map((interaction) => {
              const Icon = getTypeIcon(interaction.type);
              return (
                <div key={interaction.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className={`p-2 rounded-full ${getTypeColor(interaction.type)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{interaction.subject}</h4>
                      <span className="text-sm text-muted-foreground">
                        {new Date(interaction.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{interaction.customerName}</p>
                    <p className="text-sm mt-2">{interaction.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      {interaction.duration && (
                        <span className="text-xs text-muted-foreground">
                          Duration: {interaction.duration} min
                        </span>
                      )}
                      {interaction.outcome && (
                        <Badge variant="secondary" className="text-xs">
                          {interaction.outcome}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Interactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={interactions}
            columns={columns}
            onEdit={handleEditInteraction}
            onDelete={handleDeleteInteraction}
          />
        </CardContent>
      </Card>
    </div>
  );
}