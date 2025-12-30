'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Save, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SCENARIOS = [
  { id: 'butikk', label: 'Shopping' },
  { id: 'jobb', label: 'Work' },
  { id: 'telefon', label: 'Phone' },
  { id: 'lege', label: 'Doctor' },
  { id: 'reise', label: 'Travel' },
  { id: 'mat', label: 'Food' },
  { id: 'bolig', label: 'Housing' },
  { id: 'survival', label: 'Survival basics' }
];

const LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' }
];

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [level, setLevel] = useState('beginner');
  const [goal, setGoal] = useState('');
  const [scenarios, setScenarios] = useState([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/auth');
        return;
      }

      const userData = await response.json();
      setUser(userData);
      setDisplayName(userData.displayName || '');
      setLevel(userData.level || 'beginner');
      setGoal(userData.goal || '');
      setScenarios(userData.scenarios || []);
    } catch (error) {
      console.error('Error loading user:', error);
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          level,
          goal,
          scenarios
        })
      });

      if (response.ok) {
        setMessage('Settings saved!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving:', error);
      setMessage('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const toggleScenario = (scenarioId) => {
    if (scenarios.includes(scenarioId)) {
      setScenarios(scenarios.filter(s => s !== scenarioId));
    } else {
      setScenarios([...scenarios, scenarioId]);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/app" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to dashboard
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Profile Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <div className="flex gap-2">
                {LEVELS.map((l) => (
                  <Button
                    key={l.id}
                    variant={level === l.id ? 'default' : 'outline'}
                    onClick={() => setLevel(l.id)}
                  >
                    {l.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Your goal for learning Swedish</Label>
              <Input
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="E.g. 'Talk with colleagues more easily'"
              />
            </div>
          </CardContent>
        </Card>

        {/* Scenario Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Scenario preferences</CardTitle>
            <CardDescription>
              Choose the situations you want to focus on
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {SCENARIOS.map((scenario) => (
                <Badge
                  key={scenario.id}
                  variant={scenarios.includes(scenario.id) ? 'default' : 'outline'}
                  className="cursor-pointer text-sm py-2 px-4"
                  onClick={() => toggleScenario(scenario.id)}
                >
                  {scenario.label}
                </Badge>
              ))}
            </div>
            {user?.plan === 'free' && scenarios.length > 2 && (
              <p className="text-sm text-muted-foreground mt-4">
                On the Basic plan you can pick up to 2 scenarios. Upgrade to Pro for unlimited access.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Billing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your subscription and billing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">Current plan</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {user?.plan === 'free' ? 'Basic (Free)' : 'Pro'}
                </p>
              </div>
              <Badge variant={user?.plan === 'pro' ? 'default' : 'secondary'}>
                {user?.plan === 'free' ? 'Free' : 'Pro'}
              </Badge>
            </div>
            {user?.plan === 'free' ? (
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Upgrade to Pro
                </Button>
              </Link>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage subscription
              </Button>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {user?.plan === 'free' 
                ? 'Upgrade to Pro to unlock all scenarios and features.'
                : 'Stripe integration requires configuration. See the .env file.'}
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        {message && (
          <div className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
            {message}
          </div>
        )}
        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save changes
              </>
            )}
          </Button>
          <Button onClick={handleLogout} variant="outline">
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
