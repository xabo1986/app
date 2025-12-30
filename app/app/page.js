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
    butikk: 'Shop',
    jobb: 'Work',
    telefon: 'Phone',
    lege: 'Doctor',
    reise: 'Travel',
    mat: 'Food',
    bolig: 'Housing',
    survival: 'Survival basics'
  };

  const lessonsCompletedToday = progress?.completedLessonsToday || 0;
  const maxDailyLessons = progress?.maxDailyLessons || 1;
  const lessonsRemaining = Math.max(0, maxDailyLessons - lessonsCompletedToday);
  const hasCompletedAllToday = lessonsRemaining === 0;

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
          <h1 className="text-3xl font-bold mb-2">Hi, {user?.displayName}!</h1>
          <p className="text-muted-foreground">
            {hasCompletedAllToday
              ? 'All tasks for today are done. See you tomorrow!'
              : `You have ${lessonsRemaining} of ${maxDailyLessons} tasks left today.`}
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{progress?.currentStreak || 0} days</div>
              <p className="text-xs text-muted-foreground mt-1">
                {progress?.currentStreak > 0 ? 'Keep it going!' : 'Start a new streak today'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total XP</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{progress?.totalXP || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Keep learning every day
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedThisWeek}/7</div>
              <p className="text-xs text-muted-foreground mt-1">
                Lessons completed this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{lessonsCompletedToday}/{maxDailyLessons}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Tasks today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Lesson */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Today's Lesson</CardTitle>
            <CardDescription>
              {hasCompletedAllToday 
                ? 'You have finished all of today’s tasks. Great job!' 
                : `Quick 3-minute session. ${lessonsRemaining} left today.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasCompletedAllToday ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-medium mb-2">Lesson Complete!</p>
                <p className="text-sm text-muted-foreground mb-4">
                  All tasks for today are complete. Come back tomorrow to continue!
                </p>
                <Badge variant="secondary">Next session: tomorrow</Badge>
              </div>
            ) : (
              <Link href="/app/lesson">
                <Button size="lg" className="w-full">
                  <Play className="h-5 w-5 mr-2" />
                  Start today’s task ({lessonsCompletedToday + 1}/{maxDailyLessons})
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Your Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle>Your Scenarios</CardTitle>
            <CardDescription>
              Your lessons are tailored to these situations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {user?.scenarios?.map((scenario) => (
                <Badge key={scenario} variant="secondary" className="text-sm py-1.5 px-3">
                  {scenarioNames[scenario] || scenario}
                </Badge>
              )) || <p className="text-muted-foreground text-sm">No scenarios selected yet</p>}
            </div>
            <Link href="/app/settings">
              <Button variant="outline" size="sm">
                Customize Scenarios
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
