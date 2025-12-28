'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Volume2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const SCENARIOS = [
  { id: 'butikk', title: 'Butikk', emoji: '🛒' },
  { id: 'jobb', title: 'Jobb', emoji: '💼' },
  { id: 'telefon', title: 'Telefon', emoji: '📞' },
  { id: 'lege', title: 'Lege', emoji: '🏥' }
];

const QUESTIONS = {
  butikk: [
    {
      type: 'multiple',
      question: 'Hva betyr "Jag skulle vilja ha..."?',
      audio: 'Jag skulle vilja ha en kaffe',
      options: ['Jeg vil gjerne ha...', 'Jeg liker...', 'Jeg trenger hjelp', 'Jeg heter...'],
      correct: 0
    },
    {
      type: 'listening',
      question: 'Hør på uttrykket og velg riktig oversettelse:',
      audio: 'Hur mycket kostar det?',
      options: ['Hvor mye koster det?', 'Hva heter du?', 'Kan jeg betale?', 'Hvor er toalettet?'],
      correct: 0
    },
    {
      type: 'multiple',
      question: 'Hvordan sier du "Kan jeg betale med kort?" på svensk?',
      audio: 'Kan jag betala med kort?',
      options: ['Kan jeg betala med kort?', 'Kan jag betala med kort?', 'Kan du betala med kort?', 'Kan vi betala med kort?'],
      correct: 1
    }
  ],
  jobb: [
    {
      type: 'multiple',
      question: 'Hva betyr "Jag kan börja klockan..."?',
      audio: 'Jag kan börja klockan åtta',
      options: ['Jeg kan begynne klokken...', 'Jeg kan slutte klokken...', 'Jeg kan spise klokken...', 'Jeg kan møte klokken...'],
      correct: 0
    },
    {
      type: 'listening',
      question: 'Hør og velg riktig oversettelse:',
      audio: 'Kan du förklara igen?',
      options: ['Kan du forklare igjen?', 'Kan du hjelpe meg?', 'Kan du vente?', 'Kan du komme?'],
      correct: 0
    },
    {
      type: 'multiple',
      question: 'Hvordan ber du om hjelp på svensk?',
      audio: 'Jag behöver hjälp med detta',
      options: ['Jag trenger hjælp', 'Jag behöver hjälp', 'Jag vil hjælp', 'Jag kan hjælp'],
      correct: 1
    }
  ],
  telefon: [
    {
      type: 'listening',
      question: 'Hør på hilsenen og velg riktig oversettelse:',
      audio: 'Hej, jag ringer angående mötet',
      options: ['Hei, jeg ringer angående møtet', 'Hei, jeg kommer til møtet', 'Hei, jeg liker møtet', 'Hei, jeg trenger møtet'],
      correct: 0
    },
    {
      type: 'multiple',
      question: 'Hvordan ber du noen gjenta noe på svensk?',
      audio: 'Kan du upprepa det?',
      options: ['Kan du uppreppa det?', 'Kan du upprepa det?', 'Kan du upprepe det?', 'Kan jeg upprepa det?'],
      correct: 1
    },
    {
      type: 'multiple',
      question: 'Hva betyr "Tack, ha en bra dag"?',
      audio: 'Tack, ha en bra dag',
      options: ['Takk, ha en fin dag', 'Hei, ha en fin dag', 'Takk, vi ses', 'Hei, vi ses'],
      correct: 0
    }
  ],
  lege: [
    {
      type: 'multiple',
      question: 'Hvordan sier du "Jeg har vondt i..." på svensk?',
      audio: 'Jag har ont i huvudet',
      options: ['Jag har ont', 'Jag har ondt', 'Jag er ont', 'Jag gör ont'],
      correct: 0
    },
    {
      type: 'listening',
      question: 'Hør og velg riktig oversettelse:',
      audio: 'Det började i går',
      options: ['Det begynte i går', 'Det sluttet i går', 'Det skjedde i går', 'Det kom i går'],
      correct: 0
    },
    {
      type: 'multiple',
      question: 'Hvordan spør du om du trenger en time?',
      audio: 'Behöver jag en tid?',
      options: ['Trenger jeg en tid?', 'Behöver jag en tid?', 'Vil jeg en tid?', 'Kan jeg en tid?'],
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
              Tilbake
            </Link>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4 text-center">Prøv en demoleksjon</h1>
          <p className="text-xl text-muted-foreground mb-12 text-center">
            Velg et scenario og få en smakebit på hvordan leksjonene fungerer
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
                  <Button className="w-full">Start demo</Button>
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
              Tilbake
            </button>
            <div className="text-sm text-muted-foreground">
              Spørsmål {currentQuestion + 1} av {questions.length}
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
              Tilbake til forsiden
            </Link>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <div className="mb-8">
            <CheckCircle2 className="h-20 w-20 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Bra jobbet!</h1>
            <p className="text-xl text-muted-foreground">
              Du fikk {correctAnswers} av {totalQuestions} riktige
            </p>
          </div>
          <Card className="mb-8">
            <CardContent className="py-8">
              <p className="text-lg mb-6">
                Dette var bare en liten smakebit! Med SvenskPå3 får du nye leksjoner hver dag, 
                tilpasset dine behov og mål.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start gratis prøve
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setStep('select')}
                  className="w-full sm:w-auto"
                >
                  Prøv et annet scenario
                </Button>
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">
            💡 Tips: Kom tilbake i morgen for å bygge opp streak-en din!
          </p>
        </div>
      </div>
    );
  }

  return null;
}