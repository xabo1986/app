import textToSpeech from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';

// Simple in-memory cache to avoid repeated TTS calls for the same phrase
const audioCache = new Map();
const MAX_TEXT_LENGTH = 200;
const client = createClient();

function createClient() {
  // Supports GOOGLE_TTS_CREDENTIALS as base64 JSON or GOOGLE_APPLICATION_CREDENTIALS path/ADC
  const base64Creds = process.env.GOOGLE_TTS_CREDENTIALS;
  if (base64Creds) {
    const credentials = JSON.parse(Buffer.from(base64Creds, 'base64').toString('utf8'));
    return new textToSpeech.TextToSpeechClient({ credentials });
  }
  return new textToSpeech.TextToSpeechClient();
}

export async function POST(request) {
  try {
    const { text } = await request.json();
    const trimmed = (text || '').trim();

    if (!trimmed) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (trimmed.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: `Text too long (max ${MAX_TEXT_LENGTH} chars)` }, { status: 400 });
    }

    // Return cached audio if available
    if (audioCache.has(trimmed)) {
      return NextResponse.json({ audio: audioCache.get(trimmed) });
    }

    const requestBody = {
      input: { text: trimmed },
      voice: {
        languageCode: 'sv-SE',
        name: process.env.GOOGLE_TTS_VOICE || 'sv-SE-Neural2-A'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: Number(process.env.GOOGLE_TTS_RATE) || 0.92
      }
    };

    const [response] = await client.synthesizeSpeech(requestBody);
    const audio = response.audioContent?.toString('base64');

    if (!audio) {
      return NextResponse.json({ error: 'No audio returned from TTS' }, { status: 500 });
    }

    audioCache.set(trimmed, audio);
    return NextResponse.json({ audio });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json({ error: 'TTS failed' }, { status: 500 });
  }
}
