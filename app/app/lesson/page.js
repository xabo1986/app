'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Volume2, Loader2, Trophy, Flame } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LESSON_DATA = {
  butikk: [
    {
      type: 'intro',
      title: 'I butikken',
      text: 'I dag skal vi øve på vanlige uttrykk når du handler.'
    },
    {
      type: 'listen',
      title: 'Lytt og lær',
      swedish: 'Jag skulle vilja ha en kaffe, tack.',
      norwegian: 'Jeg vil gjerne ha en kaffe, takk.',
      explanation: 'Bruk "Jag skulle vilja ha..." når du bestiller noe.'
    },
    {
      type: 'quiz',
      question: 'Hvordan spør du om prisen på svensk?',
      audio: 'Hur mycket kostar det?',
      options: ['Hur mycket kostar det?', 'Hur många kostar det?', 'Vad kostar det?', 'Hur kostar det?'],
      correct: 0
    },
    {
      type: 'practice',
      title: 'Øv deg',
      swedish: 'Kan jag betala med kort?',
      norwegian: 'Kan jeg betale med kort?',
      explanation: 'Dette spørsmålet er veldig nyttig i alle butikker.'
    },
    {
      type: 'quiz',
      question: 'Hva betyr "Tack så mycket"?',
      options: ['Takk så mye', 'Vær så god', 'Hei', 'Ha det'],
      correct: 0
    }
  ],
  jobb: [
    {
      type: 'intro',
      title: 'På jobben',
      text: 'La oss øve på vanlige fraser du bruker på arbeidsplassen.'
    },
    {
      type: 'listen',
      title: 'Lytt og lær',
      swedish: 'Jag kan börja klockan åtta.',
      norwegian: 'Jeg kan begynne klokken åtte.',
      explanation: 'Bruk "klockan" for å si klokketid.'
    },
    {
      type: 'quiz',
      question: 'Hvordan ber du noen forklare igjen?',
      audio: 'Kan du förklara igen?',
      options: ['Kan du förklara igen?', 'Kan du förklara nu?', 'Kan du förklara mer?', 'Kan du hjälpa mig?'],
      correct: 0
    },
    {
      type: 'practice',
      title: 'Øv deg',
      swedish: 'Jag behöver hjälp med detta.',
      norwegian: 'Jeg trenger hjelp med dette.',
      explanation: '"Behöver" betyr "trenger" på svensk.'
    },
    {
      type: 'quiz',
      question: 'Hva betyr "möte" på norsk?',
      options: ['Møte', 'Mat', 'Mål', 'Morgen'],
      correct: 0
    }
  ]
};

export default function LessonPage() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [newStreak, setNewStreak] = useState(0);
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

      // If already completed today, redirect to dashboard
      if (progressData.completedToday) {
        router.push('/app');
        return;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'sv-SE';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Select lesson based on user's scenarios
  const selectedScenario = user?.scenarios?.[0] || 'butikk';
  const lessonSteps = LESSON_DATA[selectedScenario] || LESSON_DATA.butikk;
  const currentStepData = lessonSteps[currentStep];

  const handleNext = () => {
    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
    } else {
      completeLesson();
    }
  };

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setTimeout(() => {
      handleNext();
    }, 1500);
  };

  const completeLesson = async () => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xpEarned: 10 })
      });

      const data = await response.json();
      
      if (response.ok) {
        setEarnedXP(data.xpEarned);
        setNewStreak(data.streak);
        setCompleted(true);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (completed) {
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
        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <div className="mb-8">
            <Trophy className="h-20 w-20 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Gratulerer!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Du har fullført dagens leksjon
            </p>
          </div>
          <Card className="mb-8">
            <CardContent className="py-8">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-3xl font-bold">+{earnedXP} XP</p>
                  <p className="text-sm text-muted-foreground">Opptjent i dag</p>
                </div>
                <div>
                  <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-3xl font-bold">{newStreak} dager</p>
                  <p className="text-sm text-muted-foreground">Streak</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Fantastisk jobb! Kom tilbake i morgen for å fortsette å lære.
              </p>
              <Link href="/app">
                <Button size="lg" className="w-full">
                  Tilbake til dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">
            💡 Tips: Konsistens er nøkkelen! Fortsett å øve hver dag.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/app" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tilbake
          </Link>
          <div className="text-sm text-muted-foreground">
            Steg {currentStep + 1} av {lessonSteps.length}
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{currentStepData.title || currentStepData.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Intro step */}
            {currentStepData.type === 'intro' && (
              <div>
                <p className="text-lg mb-6">{currentStepData.text}</p>
                <Button onClick={handleNext} className="w-full">Fortsett</Button>
              </div>
            )}

            {/* Listen step */}
            {(currentStepData.type === 'listen' || currentStepData.type === 'practice') && (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => playAudio(currentStepData.swedish)}
                    className="rounded-full w-16 h-16 mb-4"
                  >
                    <Volume2 className="h-8 w-8" />
                  </Button>
                  <p className="text-xl font-medium mb-2">{currentStepData.swedish}</p>
                  <p className="text-muted-foreground">{currentStepData.norwegian}</p>
                </div>
                {currentStepData.explanation && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm">💡 {currentStepData.explanation}</p>
                  </div>
                )}
                <Button onClick={handleNext} className="w-full">Neste</Button>
              </div>
            )}

            {/* Quiz step */}
            {currentStepData.type === 'quiz' && (
              <div className="space-y-4">
                {currentStepData.audio && (
                  <div className="flex items-center justify-center py-6">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => playAudio(currentStepData.audio)}
                      className="rounded-full w-16 h-16"
                    >
                      <Volume2 className="h-8 w-8" />
                    </Button>
                  </div>
                )}
                <div className="space-y-3">
                  {currentStepData.options.map((option, index) => {
                    let variant = 'outline';
                    if (selectedAnswer !== null) {
                      if (index === currentStepData.correct) {
                        variant = 'default';
                      } else if (index === selectedAnswer) {
                        variant = 'destructive';
                      }
                    }

                    return (
                      <Button
                        key={index}
                        variant={variant}
                        className="w-full justify-start text-left h-auto py-4 px-6"
                        onClick={() => handleAnswer(index)}
                        disabled={selectedAnswer !== null}
                      >
                        {option}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}