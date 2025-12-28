# SvenskPå3 - Praktisk svensk på 3 minutter om dagen

A production-ready Swedish micro-learning SaaS platform built with Next.js 14, MongoDB, and modern web technologies. Helps immigrants learn practical Swedish through 1-3 minute daily lessons.

## 🎯 Features

### Core Features
- **Personalized Onboarding**: Users select scenarios relevant to their daily life
- **Micro-lessons (1-3 min)**: Audio + text interactive lessons
- **Streak Tracking**: Daily progress without gamification pressure
- **Swedish TTS**: Built-in text-to-speech using Web Speech API
- **Progress Dashboard**: XP, streaks, and weekly statistics
- **Scenario-based Learning**: Butikk (Shop), Jobb (Work), Telefon (Phone), Lege (Doctor)

### Technical Features
- Next.js 14 App Router with TypeScript
- MongoDB with custom authentication
- Responsive Scandinavian minimal design
- shadcn/ui components
- Tailwind CSS styling
- JWT-based authentication
- Stripe integration (stubbed, ready to configure)

## 📁 Project Structure

```
/app/
├── app/
│   ├── page.js                    # Landing page
│   ├── demo/page.js               # Interactive demo
│   ├── auth/page.js               # Sign in/up
│   ├── app/
│   │   ├── page.js                # Dashboard (protected)
│   │   ├── lesson/page.js         # Daily lesson (protected)
│   │   └── settings/page.js       # User settings (protected)
│   ├── privacy/page.js            # Privacy policy
│   ├── terms/page.js              # Terms of service
│   ├── contact/page.js            # Contact form
│   ├── api/[[...path]]/route.js   # All API endpoints
│   ├── layout.js                  # Root layout
│   └── globals.css                # Global styles
├── components/ui/                  # shadcn/ui components
├── lib/utils.js                    # Utilities
├── .env                            # Environment variables
└── package.json                    # Dependencies

```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or remote connection
- Yarn package manager

### Installation

1. **Install dependencies:**
```bash
yarn install
```

2. **Configure environment variables:**

The `.env` file is already created with the following:

```env
MONGO_URL=mongodb://localhost:27017/svenskpa3
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Stripe Configuration (Add your keys here)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PRICE_ID_BASIC=price_basic_monthly
STRIPE_PRICE_ID_PRO=price_pro_monthly
```

**Important:** Change the `JWT_SECRET` to a secure random string in production!

3. **Start the development server:**
```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## 🗄️ Database Schema

### Collections

#### users
```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  password: String (hashed with bcrypt),
  displayName: String,
  level: String (beginner|intermediate|advanced),
  goal: String,
  scenarios: Array<String> (butikk|jobb|telefon|lege),
  plan: String (free|pro),
  createdAt: Date
}
```

#### daily_progress
```javascript
{
  _id: ObjectId,
  userId: String,
  date: String (YYYY-MM-DD),
  xpEarned: Number,
  completed: Boolean,
  streakAfter: Number,
  completedAt: Date
}
```

#### contact_messages
```javascript
{
  _id: ObjectId,
  email: String,
  message: String,
  createdAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile (displayName, level, goal, scenarios)

### Progress
- `GET /api/progress` - Get user's progress (last 30 days, streak, XP)
- `POST /api/progress` - Complete today's lesson

### Contact
- `POST /api/contact` - Submit contact form

### Stripe (Stubbed)
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks

## 💳 Stripe Integration

The Stripe integration is stubbed with clear TODO comments. To enable:

1. **Get Stripe credentials:**
   - Sign up at https://stripe.com
   - Get your API keys from the Dashboard
   - Create two Price objects (Basic and Pro plans)

2. **Update .env file** with your keys

3. **Install Stripe SDK:**
```bash
yarn add stripe
```

4. **Uncomment the implementation** in `/app/api/[[...path]]/route.js`:
   - Search for "TODO: Implement Stripe"
   - Follow the example code provided

5. **Set up webhook endpoint** in Stripe Dashboard:
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events: `customer.subscription.*`

## 🎨 Design System

### Scandinavian Minimal Aesthetic
- Lots of whitespace
- Calm typography
- Subtle borders and soft shadows
- No distracting animations
- Mobile-first responsive design

### Color Scheme
Uses CSS custom properties from shadcn/ui theme system:
- Primary actions and CTAs
- Muted backgrounds
- Semantic colors for success/error states

## 🌍 Content Language

- **UI/Marketing:** Norwegian (bokmål)
- **Lesson Content:** Swedish phrases with Norwegian translations
- **Code Comments:** English

## 🧪 Testing

### Manual Testing Checklist

**Public Pages:**
- [ ] Landing page loads and displays correctly
- [ ] Demo page scenario selection works
- [ ] Demo lesson audio (Swedish TTS) plays
- [ ] Demo quiz answers validation
- [ ] Contact form submission

**Authentication:**
- [ ] Sign up creates new user
- [ ] Sign in with correct credentials
- [ ] Sign in with wrong credentials shows error
- [ ] Protected pages redirect to /auth when not logged in

**App Features:**
- [ ] Dashboard shows user stats (streak, XP, weekly progress)
- [ ] "Start lesson" button works
- [ ] Lesson flow completes correctly
- [ ] Progress saved to database
- [ ] Streak calculation works correctly
- [ ] Settings page saves profile updates
- [ ] Scenario selection persists
- [ ] Logout works

### Test with cURL

**Sign up:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","displayName":"Test User"}'
```

**Sign in:**
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt
```

**Get profile:**
```bash
curl http://localhost:3000/api/auth/me -b cookies.txt
```

## 📱 Features by Plan

### Basic (Free)
- 3 minute daily lessons
- 2 scenarios (Butikk, Jobb)
- Streak tracking
- Basic statistics

### Pro (99 kr/month)
- Everything in Basic
- All 4 scenarios
- Unlimited scenario customization
- Advanced progress statistics
- Offline access

## 🚢 Deployment

### Vercel (Recommended)

1. **Push code to GitHub**

2. **Import to Vercel:**
   - Connect your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure environment variables** in Vercel dashboard:
   - Add all variables from `.env`
   - Make sure to use production MongoDB URL
   - Add production Stripe keys

4. **Deploy!**

### Environment Variables for Production
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/svenskpa3
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
JWT_SECRET=use-a-long-random-secure-string-here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_BASIC=price_...
STRIPE_PRICE_ID_PRO=price_...
```

## 🔒 Security Notes

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens stored in httpOnly cookies
- ✅ Environment variables for sensitive data
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Enable CORS only for your domain in production

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check if MongoDB is running: `sudo systemctl status mongodb`
- Verify MONGO_URL in .env
- Check MongoDB logs

### Authentication Issues
- Clear browser cookies
- Check JWT_SECRET is set
- Verify MongoDB connection

### Audio Not Playing
- Check browser supports Web Speech API
- Some browsers require HTTPS for speech synthesis
- Swedish (sv-SE) voice must be available in browser

## 📄 License

This project is provided as-is for educational and commercial use.

## 🤝 Support

For questions or issues:
- Use the Contact form at `/contact`
- Check the FAQ section on the landing page
- Review API error messages in browser console

## 🎯 Future Enhancements

Potential features to add:
- [ ] AI-powered explanations (OpenAI/Anthropic integration)
- [ ] Spaced repetition algorithm
- [ ] Voice recording for pronunciation practice
- [ ] Social features (study groups)
- [ ] Mobile apps (React Native)
- [ ] More scenarios and lesson variations
- [ ] Achievement badges
- [ ] Email reminders for streaks

---

**Built with ❤️ for Swedish learners in Norway**
