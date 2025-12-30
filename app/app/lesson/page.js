'use client';

import { useEffect, useRef, useState } from 'react';
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
      text: 'Today we will practice useful phrases when you are shopping.'
    },
    {
      type: 'listen',
      title: 'Lytt og lær',
      swedish: 'Jag skulle vilja ha en kaffe, tack.',
      norwegian: 'I would like a coffee, please.',
      explanation: 'Use “Jag skulle vilja ha…” when ordering something politely.'
    },
    {
      type: 'quiz',
      question: 'How do you ask for the price in Swedish?',
      audio: 'Hur mycket kostar det?',
      options: ['Hur mycket kostar det?', 'Hur många kostar det?', 'Vad kostar det?', 'Hur kostar det?'],
      correct: 0
    },
    {
      type: 'practice',
      title: 'Øv deg',
      swedish: 'Kan jag betala med kort?',
      norwegian: 'Can I pay by card?',
      explanation: 'Handy question to confirm payment options.'
    },
    {
      type: 'quiz',
      question: 'What does “Tack så mycket” mean?',
      options: ['Thank you very much', 'Here you go', 'Hi', 'Goodbye'],
      correct: 0
    }
  ],
  jobb: [
    {
      type: 'intro',
      title: 'På jobben',
      text: 'Let’s practice common phrases you use at work.'
    },
    {
      type: 'listen',
      title: 'Lytt og lær',
      swedish: 'Jag kan börja klockan åtta.',
      norwegian: 'I can start at eight o’clock.',
      explanation: 'Use “klockan” to talk about clock time.'
    },
    {
      type: 'quiz',
      question: 'How do you ask someone to explain again?',
      audio: 'Kan du förklara igen?',
      options: ['Kan du förklara igen?', 'Kan du förklara nu?', 'Kan du förklara mer?', 'Kan du hjälpa mig?'],
      correct: 0
    },
    {
      type: 'practice',
      title: 'Øv deg',
      swedish: 'Jag behöver hjälp med detta.',
      norwegian: 'I need help with this.',
      explanation: '"Behöver" means "need" in Swedish.'
    },
    {
      type: 'quiz',
      question: 'What does “möte” mean in English?',
      options: ['Meeting', 'Food', 'Goal', 'Morning'],
      correct: 0
    }
  ],
  reise: [
    {
      type: 'intro',
      title: 'På reise',
      text: 'Phrases you need on buses, trains, and flights.'
    },
    {
      type: 'listen',
      title: 'Lytt og lær',
      swedish: 'Var går den här bussen?',
      norwegian: 'Where does this bus go?',
      explanation: 'Use this to double-check the route.'
    },
    {
      type: 'quiz',
      question: 'How do you ask when the train leaves?',
      audio: 'När går tåget?',
      options: ['När går tåget?', 'Var går tåget?', 'Hur går tåget?', 'Vem går tåget?'],
      correct: 0
    },
    {
      type: 'practice',
      title: 'Øv deg',
      swedish: 'Jag behöver köpa en biljett.',
      norwegian: 'I need to buy a ticket.',
      explanation: 'Useful at the ticket office.'
    },
    {
      type: 'quiz',
      question: 'What does “försenad” mean?',
      options: ['Delayed', 'Early', 'Fully booked', 'Free'],
      correct: 0
    }
  ],
  mat: [
    {
      type: 'intro',
      title: 'Mat og servering',
      text: 'Phrases for cafés and restaurants.'
    },
    {
      type: 'listen',
      title: 'Lytt og lær',
      swedish: 'Kan jag få menyn, tack?',
      norwegian: 'Can I have the menu, please?',
      explanation: 'Polite way to ask for the menu.'
    },
    {
      type: 'quiz',
      question: 'How do you ask for the bill?',
      options: ['Kan jag få notan?', 'Kan jag få stolen?', 'Kan jag få boken?', 'Kan jag få gaffeln?'],
      correct: 0
    },
    {
      type: 'practice',
      title: 'Øv deg',
      swedish: 'Jag är allergisk mot nötter.',
      norwegian: 'I am allergic to nuts.',
      explanation: 'Important to mention allergies.'
    },
    {
      type: 'quiz',
      question: 'What does “dricks” mean?',
      options: ['Tip', 'Drink', 'Plate', 'Bill'],
      correct: 0
    }
  ],
  bolig: [
    {
      type: 'intro',
      title: 'Bolig og utleie',
      text: 'Words and phrases when you are looking for housing.'
    },
    {
      type: 'listen',
      title: 'Lytt og lær',
      swedish: 'Finns det tvättmaskin i lägenheten?',
      norwegian: 'Is there a washing machine in the apartment?',
      explanation: 'Common question during a viewing.'
    },
    {
      type: 'quiz',
      question: 'How do you ask if electricity is included?',
      options: ['Ingår el i hyran?', 'Har du el?', 'Är el dyr?', 'Var är elen?'],
      correct: 0
    },
    {
      type: 'practice',
      title: 'Øv deg',
      swedish: 'Jag vill boka en visning.',
      norwegian: 'I would like to book a viewing.',
      explanation: 'Use this to set up a viewing time.'
    },
    {
      type: 'quiz',
      question: 'What does “hyra” mean?',
      options: ['Rent', 'House', 'Elevator', 'Garden'],
      correct: 0
    }
  ],
  survival: [
    {
      type: 'intro',
      title: 'Survival Basics',
      text: 'Essential phrases for greetings, directions, and quick help.'
    },
    {
      type: 'listen',
      title: 'Greetings',
      swedish: 'Hej! Hur mår du?',
      norwegian: 'Hi! How are you?',
      explanation: 'Standard friendly greeting.'
    },
    {
      type: 'quiz',
      question: 'How do you say “Thank you” in Swedish?',
      options: ['Tack', 'Varsågod', 'Hej', 'Snälla'],
      correct: 0
    },
    {
      type: 'listen',
      title: 'Getting help',
      swedish: 'Kan du hjälpa mig?',
      norwegian: 'Can you help me?',
      explanation: 'Use when you need assistance.'
    },
    {
      type: 'practice',
      title: 'Directions',
      swedish: 'Var är toaletten?',
      norwegian: 'Where is the restroom?',
      explanation: 'Useful in public places.'
    },
    {
      type: 'quiz',
      question: 'What does “ursäkta” mean?',
      options: ['Excuse me', 'Please', 'Thank you', 'Good night'],
      correct: 0
    },
    {
      type: 'listen',
      title: 'Numbers',
      swedish: 'Jag vill ha två kaffe, tack.',
      norwegian: 'I would like two coffees, please.',
      explanation: 'Practice counting in real requests.'
    },
    {
      type: 'practice',
      title: 'Emergency',
      swedish: 'Ring ambulans!',
      norwegian: 'Call an ambulance!',
      explanation: 'Emergency phrase to know by heart.'
    },
    {
      type: 'quiz',
      question: 'How do you ask “Do you speak English?”',
      options: ['Talar du engelska?', 'Är du engelska?', 'Var är engelska?', 'Har du engelska?'],
      correct: 0
    },
    {
      type: 'listen',
      title: 'Time',
      swedish: 'Vad är klockan?',
      norwegian: 'What time is it?',
      explanation: 'Use for quick time checks.'
    },
    {
      type: 'practice',
      title: 'Polite close',
      swedish: 'Trevlig dag!',
      norwegian: 'Have a nice day!',
      explanation: 'Great way to end a short interaction.'
    },
    {
      type: 'quiz',
      question: 'What does “jag förstår inte” mean?',
      options: ['I do not understand', 'I do not agree', 'I am not hungry', 'I will be late'],
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
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [maxDailyLessons, setMaxDailyLessons] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const audioCacheRef = useRef({});
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
      setLessonsCompleted(progressData.completedLessonsToday || 0);
      setMaxDailyLessons(progressData.maxDailyLessons || 1);

      if ((progressData.completedLessonsToday || 0) >= (progressData.maxDailyLessons || 1)) {
        setErrorMessage('You have already completed all tasks for today.');
        return;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (text) => {
    if (!text) return;

    // Play from cache if available
    const cached = audioCacheRef.current[text];
    if (cached) {
      cached.currentTime = 0;
      cached.play();
      return;
    }

    // Try Google Cloud TTS via API
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (res.ok) {
        const data = await res.json();
        const src = `data:audio/mpeg;base64,${data.audio}`;
        const audio = new Audio(src);
        audioCacheRef.current[text] = audio;
        audio.play();
        return;
      }
    } catch (err) {
      console.error('TTS fetch error', err);
    }

    // Fallback to browser TTS
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
        body: JSON.stringify({})
      });

      const data = await response.json();
      
      if (response.ok) {
        setEarnedXP(data.xpEarned);
        setNewStreak(data.streak);
        setLessonsCompleted(data.completionsCount || lessonsCompleted + 1);
        setMaxDailyLessons(data.maxDailyLessons || maxDailyLessons);
        setCompleted(true);
        setErrorMessage('');
      } else if (data?.error) {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      setErrorMessage('Something went wrong, please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const lessonsRemaining = Math.max(0, maxDailyLessons - lessonsCompleted);

  if (lessonsRemaining <= 0) {
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
        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <Card>
            <CardContent className="py-12">
              <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-3">All tasks for today are complete</h1>
              <p className="text-muted-foreground mb-6">
                Great job! Come back tomorrow for new sessions.
              </p>
              <Link href="/app">
                <Button size="lg" className="w-full">Back to dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (completed) {
    const remainingAfter = Math.max(0, maxDailyLessons - lessonsCompleted);

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
        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <div className="mb-8">
            <Trophy className="h-20 w-20 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Great job!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              You have completed today’s lesson
            </p>
          </div>
          <Card className="mb-8">
            <CardContent className="py-8">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-3xl font-bold">+{earnedXP} XP</p>
                  <p className="text-sm text-muted-foreground">Earned today</p>
                </div>
                <div>
                  <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-3xl font-bold">{newStreak} days</p>
                  <p className="text-sm text-muted-foreground">Streak</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                {remainingAfter > 0
                  ? `Nice! You have ${remainingAfter} tasks left today.`
                  : 'Fantastic! All tasks for today are complete.'}
              </p>
              <div className="flex flex-col gap-3">
                {remainingAfter > 0 && (
                  <Button size="lg" className="w-full" onClick={() => {
                    setCompleted(false);
                    setCurrentStep(0);
                    setSelectedAnswer(null);
                    setEarnedXP(0);
                  }}>
                    Start next task
                  </Button>
                )}
                <Link href="/app">
                  <Button size="lg" variant="outline" className="w-full">
                    Back to dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">
            💡 Tip: Consistency is key. Keep practicing every day.
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
              Back
            </Link>
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {lessonSteps.length}
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{currentStepData.title || currentStepData.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {errorMessage && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {errorMessage}
              </div>
            )}
            {/* Intro step */}
            {currentStepData.type === 'intro' && (
              <div>
                <p className="text-lg mb-6">{currentStepData.text}</p>
                <Button onClick={handleNext} className="w-full">Continue</Button>
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
                <Button onClick={handleNext} className="w-full">Next</Button>
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
