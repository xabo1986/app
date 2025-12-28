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
  { id: 'butikk', label: 'Butikk' },
  { id: 'jobb', label: 'Jobb' },
  { id: 'telefon', label: 'Telefon' },
  { id: 'lege', label: 'Lege' }
];

const LEVELS = [
  { id: 'beginner', label: 'Nybegynner' },
  { id: 'intermediate', label: 'Middels' },
  { id: 'advanced', label: 'Avansert' }
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
        setMessage('Innstillinger lagret!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving:', error);
      setMessage('Noe gikk galt');
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
            Tilbake til dashboard
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Innstillinger</h1>

        {/* Profile Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>Administrer din personlige informasjon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Navn</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ditt navn"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Nivå</Label>
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
              <Label htmlFor="goal">Ditt mål med å lære svensk</Label>
              <Input
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="F.eks. 'Snakke bedre med kollegaer'"
              />
            </div>
          </CardContent>
        </Card>

        {/* Scenario Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Scenario-preferanser</CardTitle>
            <CardDescription>
              Velg hvilke situasjoner du vil fokusere på i leksjonene dine
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
                Med Basic-planen kan du velge opptil 2 scenarioer. Oppgrader til Pro for ubegrenset tilgang.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Billing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Abonnement</CardTitle>
            <CardDescription>Administrer ditt abonnement og betalinger</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">Nåværende plan</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {user?.plan === 'free' ? 'Basic (Gratis)' : 'Pro'}
                </p>
              </div>
              <Badge variant={user?.plan === 'pro' ? 'default' : 'secondary'}>
                {user?.plan === 'free' ? 'Gratis' : 'Pro'}
              </Badge>
            </div>
            {user?.plan === 'free' ? (
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Oppgrader til Pro
                </Button>
              </Link>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                <ExternalLink className="h-4 w-4 mr-2" />
                Administrer abonnement
              </Button>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {user?.plan === 'free' 
                ? 'Oppgrader til Pro for å få tilgang til alle scenarioer og funksjoner.'
                : 'Stripe-integrasjon krever konfigurering. Se .env-filen.'}
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
                Lagrer...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lagre endringer
              </>
            )}
          </Button>
          <Button onClick={handleLogout} variant="outline">
            Logg ut
          </Button>
        </div>
      </div>
    </div>
  );
}