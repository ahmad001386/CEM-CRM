'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { 
  Settings, 
  Palette, 
  Bell, 
  Mail, 
  Shield, 
  Database,
  Upload
} from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });

  const [branding, setBranding] = useState({
    companyName: 'Your Company',
    primaryColor: '#00BCD4',
    secondaryColor: '#4CAF50',
    logo: null,
  });

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
  };

  const handleBrandingChange = (field: string, value: string) => {
    setBranding(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = () => {
    console.log('Settings saved:', { theme, notifications, branding });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences and configuration</p>
        </div>
        <Button onClick={handleSaveSettings}>
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={branding.companyName}
                onChange={(e) => handleBrandingChange('companyName', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex items-center space-x-4">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('light')}
                >
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('system')}
                >
                  System
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Time Zone</Label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option>UTC (Coordinated Universal Time)</option>
                <option>EST (Eastern Standard Time)</option>
                <option>PST (Pacific Standard Time)</option>
                <option>GMT (Greenwich Mean Time)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Branding</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Company Logo</Label>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                  className="w-12 h-10"
                />
                <Input
                  value={branding.primaryColor}
                  onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                  className="w-12 h-10"
                />
                <Input
                  value={branding.secondaryColor}
                  onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive browser push notifications
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={notifications.push}
                onCheckedChange={(checked) => handleNotificationChange('push', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via SMS
                </p>
              </div>
              <Switch
                id="sms-notifications"
                checked={notifications.sms}
                onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing-notifications">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive marketing and promotional emails
                </p>
              </div>
              <Switch
                id="marketing-notifications"
                checked={notifications.marketing}
                onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline" size="sm">
                Enable 2FA
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Session Management</Label>
              <p className="text-sm text-muted-foreground">
                Manage your active sessions
              </p>
              <Button variant="outline" size="sm">
                View Sessions
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Password</Label>
              <p className="text-sm text-muted-foreground">
                Change your account password
              </p>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Export Data</Label>
              <p className="text-sm text-muted-foreground">
                Download your data in various formats
              </p>
              <Button variant="outline" size="sm">
                Export All Data
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Import Data</Label>
              <p className="text-sm text-muted-foreground">
                Import data from CSV or other sources
              </p>
              <Button variant="outline" size="sm">
                Import Data
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Data Backup</Label>
              <p className="text-sm text-muted-foreground">
                Create and manage data backups
              </p>
              <Button variant="outline" size="sm">
                Create Backup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}