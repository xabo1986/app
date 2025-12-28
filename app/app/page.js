'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, TrendingUp, Play, Settings, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AppDashboard() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userRes, progressRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/progress')
      ]);

      if (!userRes.ok) {
        router.push('/auth');
        return;
      }

      const userData = await userRes.json();
      const progressData = await progressRes.json();

      setUser(userData);
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading data:', error);
      router.push('/auth');
    } finally {
      setLoading(false);
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

  const scenarioNames = {
    butikk: 'Butikk',
    jobb: 'Jobb',
    telefon: 'Telefon',
    lege: 'Lege'
  };

  // Calculate weekly progress (last 7 days)
  const last7Days = progress?.progress?.slice(0, 7) || [];
  const completedThisWeek = last7Days.filter(p => p.completed).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold">SvenskPå3</span>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/app/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hei, {user?.displayName}!</h1>
          <p className="text-muted-foreground">
            {progress?.completedToday 
              ? 'Flott! Du har fullført dagens leksjon. Kom tilbake i morgen!' 
              : 'Klar for dagens leksjon?'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{progress?.currentStreak || 0} dager</div>
              <p className="text-xs text-muted-foreground mt-1">
                {progress?.currentStreak > 0 ? 'Fortsett rekken!' : 'Start en ny streak i dag'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totalt XP</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{progress?.totalXP || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Fortsett å lære hver dag
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Denne uken</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedThisWeek}/7</div>
              <p className="text-xs text-muted-foreground mt-1">
                Leksjoner fullført denne uken
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Lesson */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dagens leksjon</CardTitle>
            <CardDescription>
              {progress?.completedToday 
                ? 'Du har fullført dagens leksjon! Bra jobbet!' 
                : 'Bruk bare 3 minutter og lær noe nytt i dag'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {progress?.completedToday ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-medium mb-2">Leksjon fullført!</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Du har tjent +10 XP i dag. Kom tilbake i morgen for å fortsette!
                </p>
                <Badge variant="secondary">Neste leksjon: i morgen</Badge>
              </div>
            ) : (
              <Link href="/app/lesson">
                <Button size="lg" className="w-full">
                  <Play className="h-5 w-5 mr-2" />
                  Start dagens leksjon
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Your Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle>Dine scenarioer</CardTitle>
            <CardDescription>
              Leksjonene dine tilpasses disse situasjonene
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {user?.scenarios?.map((scenario) => (
                <Badge key={scenario} variant="secondary" className="text-sm py-1.5 px-3">
                  {scenarioNames[scenario] || scenario}
                </Badge>
              )) || <p className="text-muted-foreground text-sm">Ingen scenarioer valgt ennå</p>}
            </div>
            <Link href="/app/settings">
              <Button variant="outline" size="sm">
                Tilpass scenarioer
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}