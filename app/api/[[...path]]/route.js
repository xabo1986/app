import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const REQUIRED_ENV_VARS = ['MONGO_URL', 'JWT_SECRET'];
const DAILY_XP_PER_LESSON = 10;
const MAX_DAILY_LESSONS = 20;
const ALLOWED_SCENARIOS = ['butikk', 'jobb', 'telefon', 'lege', 'reise', 'mat', 'bolig', 'survival'];
const ALLOWED_LEVELS = ['beginner', 'intermediate', 'advanced'];

let cachedClient = null;
let cachedDb = null;

function assertEnvVars() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

async function connectToDatabase() {
  assertEnvVars();

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(process.env.MONGO_URL);
  const db = client.db();

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

function verifyToken(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function sanitizeDisplayName(name, fallback) {
  const candidate = (name || fallback || '').trim();
  return candidate.slice(0, 80) || fallback;
}

function validateProfilePayload(updates, userPlan) {
  const errors = [];
  const validated = {};

  if (updates.displayName !== undefined) {
    if (typeof updates.displayName !== 'string') {
      errors.push('displayName must be a string');
    } else {
      validated.displayName = sanitizeDisplayName(updates.displayName, '');
    }
  }

  if (updates.level !== undefined) {
    if (!ALLOWED_LEVELS.includes(updates.level)) {
      errors.push('Ugyldig nivå');
    } else {
      validated.level = updates.level;
    }
  }

  if (updates.goal !== undefined) {
    if (typeof updates.goal !== 'string') {
      errors.push('goal must be a string');
    } else if (updates.goal.length > 200) {
      errors.push('Målet må være under 200 tegn');
    } else {
      validated.goal = updates.goal.trim();
    }
  }

  if (updates.scenarios !== undefined) {
    if (!Array.isArray(updates.scenarios)) {
      errors.push('scenarios må være en liste');
    } else {
      const uniqueScenarios = Array.from(new Set(updates.scenarios));
      const invalidScenario = uniqueScenarios.find((s) => !ALLOWED_SCENARIOS.includes(s));

      if (invalidScenario) {
        errors.push('Ugyldig scenario valgt');
      } else {
        if (userPlan === 'free' && uniqueScenarios.length > 2) {
          errors.push('Basic-planen tillater maks 2 scenarioer');
        } else {
          validated.scenarios = uniqueScenarios;
        }
      }
    }
  }

  return { errors, validated };
}

// POST /api/auth/signup
async function handleSignup(request) {
  try {
    const { email, password, displayName } = await request.json();
    const normalizedEmail = (email || '').trim().toLowerCase();
    
    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: 'Email og passord er påkrevd' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Passordet må være minst 8 tegn' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    const existingUser = await db.collection('users').findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: 'E-post er allerede registrert' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const safeDisplayName = sanitizeDisplayName(displayName, normalizedEmail.split('@')[0]);
    
    const result = await db.collection('users').insertOne({
      email: normalizedEmail,
      password: hashedPassword,
      displayName: safeDisplayName,
      level: 'beginner',
      goal: '',
      scenarios: ['survival', 'butikk'],
      plan: 'free',
      createdAt: new Date()
    });

    const token = createToken(result.insertedId.toString());
    
    const response = NextResponse.json({ 
      success: true,
      user: {
        id: result.insertedId.toString(),
        email: normalizedEmail,
        displayName: safeDisplayName
      }
    });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });
    
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Noe gikk galt' }, { status: 500 });
  }
}

// POST /api/auth/signin
async function handleSignin(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email og passord er påkrevd' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Ugyldig e-post eller passord' }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: 'Ugyldig e-post eller passord' }, { status: 401 });
    }

    const token = createToken(user._id.toString());
    
    const response = NextResponse.json({ 
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName
      }
    });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });
    
    return response;
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json({ error: 'Noe gikk galt' }, { status: 500 });
  }
}

// GET /api/auth/me
async function handleGetMe(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Ikke autorisert' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    
    if (!user) {
      return NextResponse.json({ error: 'Bruker ikke funnet' }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
      level: user.level,
      goal: user.goal,
      scenarios: user.scenarios,
      plan: user.plan
    });
  } catch (error) {
    console.error('Get me error:', error);
    return NextResponse.json({ error: 'Noe gikk galt' }, { status: 500 });
  }
}

// POST /api/auth/logout
async function handleLogout() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('token');
  return response;
}

// GET /api/profile
async function handleGetProfile(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Ikke autorisert' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    
    if (!user) {
      return NextResponse.json({ error: 'Bruker ikke funnet' }, { status: 404 });
    }

    return NextResponse.json({
      displayName: user.displayName,
      level: user.level,
      goal: user.goal,
      scenarios: user.scenarios,
      plan: user.plan
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Noe gikk galt' }, { status: 500 });
  }
}

// PUT /api/profile
async function handleUpdateProfile(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Ikke autorisert' }, { status: 401 });
    }

    const updates = await request.json();
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return NextResponse.json({ error: 'Bruker ikke funnet' }, { status: 404 });
    }

    const { errors, validated } = validateProfilePayload(updates, user.plan);

    if (errors.length) {
      return NextResponse.json({ error: errors.join('. ') }, { status: 400 });
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: validated }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Noe gikk galt' }, { status: 500 });
  }
}

// GET /api/progress
async function handleGetProgress(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Ikke autorisert' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    // Get last 30 days of progress
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const progress = await db.collection('daily_progress')
      .find({ 
        userId: decoded.userId,
        date: { $gte: thirtyDaysAgo.toISOString().split('T')[0] }
      })
      .sort({ date: -1 })
      .toArray();

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    const todayProgress = progress.find(p => p.date === today);
    const yesterdayProgress = progress.find(p => p.date === yesterday);
    
    if (todayProgress?.completed) {
      currentStreak = todayProgress.streakAfter;
    } else if (yesterdayProgress?.completed) {
      currentStreak = yesterdayProgress.streakAfter;
    }

    const completedLessonsToday = todayProgress?.completionsCount || 0;

    // Calculate total XP
    const totalXP = progress.reduce((sum, p) => sum + (p.xpEarned || 0), 0);

    return NextResponse.json({
      progress,
      currentStreak,
      totalXP,
      completedToday: completedLessonsToday >= MAX_DAILY_LESSONS,
      completedLessonsToday,
      maxDailyLessons: MAX_DAILY_LESSONS
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json({ error: 'Noe gikk galt' }, { status: 500 });
  }
}

// POST /api/progress
async function handleCompleteLesson(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Ikke autorisert' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    const todayProgress = await db.collection('daily_progress').findOne({
      userId: decoded.userId,
      date: today
    });

    if (todayProgress?.completionsCount >= MAX_DAILY_LESSONS) {
      return NextResponse.json({ error: 'Dagens maks antall oppgaver er nådd' }, { status: 400 });
    }

    // Get yesterday's progress to calculate streak for first completion
    const yesterdayProgress = await db.collection('daily_progress').findOne({
      userId: decoded.userId,
      date: yesterday
    });

    const isFirstCompletionToday = !todayProgress;
    const currentCompletions = todayProgress?.completionsCount || 0;
    const newStreak = isFirstCompletionToday
      ? (yesterdayProgress?.completed ? (yesterdayProgress.streakAfter + 1) : 1)
      : todayProgress.streakAfter;

    const updatedProgress = {
      userId: decoded.userId,
      date: today,
      xpEarned: (todayProgress?.xpEarned || 0) + DAILY_XP_PER_LESSON,
      completed: true,
      streakAfter: newStreak,
      completionsCount: currentCompletions + 1,
      completedAt: new Date(),
      lastCompletionAt: new Date()
    };

    await db.collection('daily_progress').updateOne(
      { userId: decoded.userId, date: today },
      { $set: updatedProgress },
      { upsert: true }
    );

    return NextResponse.json({ 
      success: true,
      streak: newStreak,
      xpEarned: DAILY_XP_PER_LESSON,
      completionsCount: updatedProgress.completionsCount,
      maxDailyLessons: MAX_DAILY_LESSONS,
      totalXpToday: updatedProgress.xpEarned
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    return NextResponse.json({ error: 'Noe gikk galt' }, { status: 500 });
  }
}

// POST /api/contact
async function handleContact(request) {
  try {
    const { email, message } = await request.json();
    
    if (!email || !message) {
      return NextResponse.json({ error: 'E-post og melding er påkrevd' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    await db.collection('contact_messages').insertOne({
      email,
      message,
      createdAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Noe gikk galt' }, { status: 500 });
  }
}

// POST /api/stripe/checkout
async function handleStripeCheckout(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Ikke autorisert' }, { status: 401 });
    }

    const { priceId } = await request.json();
    
    // TODO: Implement Stripe checkout session
    // Requires: STRIPE_SECRET_KEY, STRIPE_PRICE_ID_BASIC, STRIPE_PRICE_ID_PRO
    // 
    // Example implementation:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const session = await stripe.checkout.sessions.create({
    //   customer_email: user.email,
    //   payment_method_types: ['card'],
    //   line_items: [{ price: priceId, quantity: 1 }],
    //   mode: 'subscription',
    //   success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app?success=true`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?canceled=true`,
    // });
    // return NextResponse.json({ url: session.url });

    return NextResponse.json({ 
      error: 'Stripe ikke konfigurert. Legg til STRIPE_SECRET_KEY i .env' 
    }, { status: 501 });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Noe gikk galt' }, { status: 500 });
  }
}

// POST /api/stripe/webhook
async function handleStripeWebhook(request) {
  try {
    // TODO: Implement Stripe webhook handler
    // Requires: STRIPE_WEBHOOK_SECRET
    //
    // Example implementation:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const sig = request.headers.get('stripe-signature');
    // const body = await request.text();
    // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    //
    // Handle events:
    // - customer.subscription.created
    // - customer.subscription.updated
    // - customer.subscription.deleted
    //
    // Update user plan in database

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}

export async function GET(request, { params }) {
  const path = params.path?.join('/') || '';
  
  if (path === 'auth/me') {
    return handleGetMe(request);
  }
  
  if (path === 'profile') {
    return handleGetProfile(request);
  }
  
  if (path === 'progress') {
    return handleGetProgress(request);
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(request, { params }) {
  const path = params.path?.join('/') || '';
  
  if (path === 'auth/signup') {
    return handleSignup(request);
  }
  
  if (path === 'auth/signin') {
    return handleSignin(request);
  }
  
  if (path === 'auth/logout') {
    return handleLogout();
  }
  
  if (path === 'progress') {
    return handleCompleteLesson(request);
  }
  
  if (path === 'contact') {
    return handleContact(request);
  }
  
  if (path === 'stripe/checkout') {
    return handleStripeCheckout(request);
  }
  
  if (path === 'stripe/webhook') {
    return handleStripeWebhook(request);
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(request, { params }) {
  const path = params.path?.join('/') || '';
  
  if (path === 'profile') {
    return handleUpdateProfile(request);
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
