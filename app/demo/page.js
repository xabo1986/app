'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Volume2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const SCENARIOS = [
  { id: 'butikk', title: 'Shop', emoji: '🛒' },
  { id: 'jobb', title: 'Work', emoji: '💼' },
  { id: 'telefon', title: 'Phone', emoji: '📞' },
  { id: 'lege', title: 'Doctor', emoji: '🏥' }
];

const QUESTIONS = {
  butikk: [
    {
      type: 'multiple',
      question: 'What does "Jag skulle vilja ha..." mean?',
      audio: 'Jag skulle vilja ha en kaffe',
      options: ['I would like to have...', 'I like...', 'I need help', 'My name is...'],
      correct: 0
    },
    {
      type: 'listening',
      question: 'Listen to the phrase and choose the correct translation:',
      audio: 'Hur mycket kostar det?',
      options: ['How much does it cost?', 'What is your name?', 'Can I pay?', 'Where is the bathroom?'],
      correct: 0
    },
    {
      type: 'multiple',
      question: 'How do you say "Can I pay with card?" in Swedish?',
      audio: 'Kan jag betala med kort?',
      options: ['Kan jeg betala med kort?', 'Kan jag betala med kort?', 'Kan du betala med kort?', 'Kan vi betala med kort?'],
      correct: 1
    }
  ],
  jobb: [
    {
      type: 'multiple',
      question: 'What does "Jag kan börja klockan..." mean?',
      audio: 'Jag kan börja klockan åtta',
      options: ['I can start at...', 'I can finish at...', 'I can eat at...', 'I can meet at...'],
      correct: 0
    },
    {
      type: 'listening',
      question: 'Listen and choose the correct translation:',
      audio: 'Kan du förklara igen?',
      options: ['Can you explain again?', 'Can you help me?', 'Can you wait?', 'Can you come?'],
      correct: 0
    },
    {
      type: 'multiple',
      question: 'How do you ask for help in Swedish?',
      audio: 'Jag behöver hjälp med detta',
      options: ['Jag trenger hjelp', 'Jag behöver hjälp', 'Jag vil hjelp', 'Jag kan hjelp'],
      correct: 1
    }
  ],
  telefon: [
    {
      type: 'listening',
      question: 'Listen to the greeting and choose the correct translation:',
      audio: 'Hej, jag ringer angående mötet',
      options: ['Hello, I am calling about the meeting', 'Hello, I am coming to the meeting', 'Hello, I like the meeting', 'Hello, I need the meeting'],
      correct: 0
    },
    {
      type: 'multiple',
      question: 'How do you ask someone to repeat something in Swedish?',
      audio: 'Kan du upprepa det?',
      options: ['Kan du uppreppa det?', 'Kan du upprepa det?', 'Kan du upprepe det?', 'Kan jeg upprepa det?'],
      correct: 1
    },
    {
      type: 'multiple',
      question: 'What does "Tack, ha en bra dag" mean?',
      audio: 'Tack, ha en bra dag',
      options: ['Thanks, have a nice day', 'Hello, have a nice day', 'Thanks, see you', 'Hello, see you'],
      correct: 0
    }
  ],
  lege: [
    {
      type: 'multiple',
      question: 'How do you say "I have pain in..." in Swedish?',
      audio: 'Jag har ont i huvudet',
      options: ['Jag har ont', 'Jag har ondt', 'Jag er ont', 'Jag gör ont'],
      correct: 0
    },
    {
      type: 'listening',
      question: 'Listen and choose the correct translation:',
      audio: 'Det började i går',
      options: ['It started yesterday', 'It ended yesterday', 'It happened yesterday', 'It came yesterday'],
      correct: 0
    },
    {
      type: 'multiple',
      question: 'How do you ask if you need an appointment?',
      audio: 'Behöver jag en tid?',
      options: ['Do I need an appointment?', 'Behöver jag en tid?', 'Do I want an appointment?', 'Can I have an appointment?'],
      correct: 1
    }
  ]
};

export default function DemoPage() {
  const [step, setStep] = useState('select');
  const [scenario, setScenario] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleSelectScenario = (scenarioId) => {
    setScenario(scenarioId);
    setStep('lesson');
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
  };

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'sv-SE';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    const questions = QUESTIONS[scenario];
    const isCorrect = answerIndex === questions[currentQuestion].correct;
    
    setAnswers([...answers, { questionIndex: currentQuestion, answerIndex, isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setStep('results');
      }
    }, 1500);
  };

  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const totalQuestions = scenario ? QUESTIONS[scenario].length : 0;

  if (step === 'select') {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4 text-center">Try a Demo Lesson</h1>
          <p className="text-xl text-muted-foreground mb-12 text-center">
            Choose a scenario and get a taste of how the lessons work
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {SCENARIOS.map((s) => (
              <Card 
                key={s.id} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleSelectScenario(s.id)}
              >
                <CardHeader>
                  <div className="text-5xl mb-4">{s.emoji}</div>
                  <CardTitle>{s.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Demo</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'lesson') {
    const questions = QUESTIONS[scenario];
    const q = questions[currentQuestion];

    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <button 
              onClick={() => setStep('select')}
              className="inline-flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>{q.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {q.audio && (
                <div className="flex items-center justify-center py-8">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => playAudio(q.audio)}
                    className="rounded-full w-20 h-20"
                  >
                    <Volume2 className="h-8 w-8" />
                  </Button>
                </div>
              )}
              <div className="space-y-3">
                {q.options.map((option, index) => {
                  let variant = 'outline';
                  if (selectedAnswer !== null) {
                    if (index === q.correct) {
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
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <div className="mb-8">
            <CheckCircle2 className="h-20 w-20 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Great Job!</h1>
            <p className="text-xl text-muted-foreground">
              You got {correctAnswers} out of {totalQuestions} correct
            </p>
          </div>
          <Card className="mb-8">
            <CardContent className="py-8">
              <p className="text-lg mb-6">
                This was just a small taste! With SvenskPå3, you get new lessons every day, 
                tailored to your needs and goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Trial
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setStep('select')}
                  className="w-full sm:w-auto"
                >
                  Try Another Scenario
                </Button>
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">
            💡 Tip: Come back tomorrow to build your streak!
          </p>
        </div>
      </div>
    );
  }

  return null;
}