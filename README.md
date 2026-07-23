# s4skillup - Career Guidance & Interview Prep

A comprehensive career guidance and interview preparation platform for tech professionals in India. Built with React, Vite, TypeScript, and Supabase.

## 🌟 Features

- **Role Discovery**: Explore 37+ tech roles with detailed career paths
- **Company Intelligence**: Access 70+ companies with hiring data and insights
- **ATS Resume Templates**: Ready-made resume structures for students and freshers
- **Interview Preparation**: 96+ real interview questions by company and difficulty
- **Salary Benchmarks**: View percentile-based salary data by role and company
- **Success Stories**: Learn from real hiring experiences and career trajectories
- **Personalized Learning**: Get tailored learning resources for your target role
- **Career Chat**: AI-powered assistance for resume tips, interview prep, and salary negotiation
- **Real-time Analytics**: Track your learning progress and career journey

## 🚀 Live Demo

**Coming Soon**: www.s4skillup.com

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19.2.4, Vite 6.2.0, TypeScript 5.8.2 |
| **Styling** | Tailwind CSS, Motion |
| **Database** | Supabase PostgreSQL 17.6.1 |
| **Authentication** | Supabase Auth with RLS |
| **APIs** | @supabase/supabase-js, Google GenAI |
| **Analytics** | PostHog (optional) |
| **Error Tracking** | Sentry (optional) |
| **Email** | Resend |

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Supabase account

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/s4skillup.git
cd s4skillup
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VITE_ENVIRONMENT=development
```

4. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 🏗️ Project Structure

```
s4skillup/
├── src/
│   ├── components/         # React components (15+ views)
│   ├── context/           # Global state management
│   ├── services/          # Database & external API services
│   ├── App.tsx            # Main app component
│   └── index.tsx          # React entry point
├── dist/                  # Production build output
├── public/                # Static assets
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── vercel.json            # Vercel deployment config
└── package.json           # Project dependencies
```

## 🗄️ Database Schema

The application uses 20+ PostgreSQL tables:

| Table | Purpose | Records |
|-------|---------|---------|
| users | User profiles & progress | — |
| companies | Company data & hiring info | 72 |
| roles | Tech roles & skill requirements | 37 |
| interview_questions | Interview prep questions | 96+ |
| interview_rounds | Company interview process | 30+ |
| salary_benchmarks | Salary data by role/company | 45 |
| success_stories | Anonymous hiring stories | 17+ |
| learning_resources | Courses, tutorials, books | — |
| analytics_events | User behavior tracking | — |

All tables have Row-Level Security (RLS) policies enabled for data protection.

## 📊 Data Overview

- **72 Companies**: Across IT services, product, startups (TCS, Infosys, Google, Amazon, etc.)
- **37 Roles**: From Fresher to Senior levels (Full-stack, Backend, DevOps, etc.)
- **96 Interview Questions**: Real questions from company hiring processes
- **45 Salary Benchmarks**: Percentile data with bonus info
- **17 Success Stories**: Real hiring journeys with outcomes

## 🎯 Key Components

### Views
- **LandingView**: Application onboarding
- **LevelSelectView**: Career level selection
- **RoleHubView**: Role discovery and exploration
- **CompanyDiscoveryView**: Find companies and opportunities
- **CompanyProfileView**: Detailed company insights, interview process, salaries
- **InterviewPrepView**: Interview questions by company
- **GuideView**: Learning resources and guides
- **ChatView**: AI career assistant
- **ProfileHubView**: User profile and progress
- **SuccessStoriesView**: Real hiring experiences

### Core Services
- **supabase.ts**: Database queries and CRUD operations (30+ functions)
- **analytics.ts**: Event tracking and analytics
- **sentry.ts**: Error tracking and monitoring
- **email.ts**: Transactional email service

## 🔐 Security

- ✅ **Row-Level Security (RLS)**: All tables protected with database policies
- ✅ **Environment Variables**: Secrets never committed to git
- ✅ **Supabase Auth**: Secure authentication with JWT tokens
- ✅ **Type Safety**: Full TypeScript for runtime error prevention
- ✅ **Error Tracking**: Sentry integration for production monitoring

## 📈 Available Scripts

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000

# Production
npm run build            # Build for production to dist/
npm run preview          # Preview production build locally
npm start               # Start production preview server

# Linting (optional)
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "chore: deploy s4skillup to production"
git push origin main
```

2. **Connect to Vercel**
   - Visit https://vercel.com/dashboard
   - Import your GitHub repository
   - Add environment variables
   - Deploy automatically

3. **Configure Domain**
   - Add custom domain (www.s4skillup.com)
   - Update DNS records with CNAME to Vercel

### Local Production Build

```bash
npm run build
npm run preview
```

## 📚 API Reference

### Companies
```typescript
// Get all companies
const { data, error } = await getCompanies(category?, hiringStatus?, limit, offset);

// Get company details
const { data, error } = await supabase
  .from('companies')
  .select('*')
  .eq('id', companyId);
```

### Interview Questions
```typescript
// Get interview questions
const { data, error } = await getInterviewQuestions(roleId?, difficulty?, companyId?, limit, offset);
```

### Salary Benchmarks
```typescript
// Get salary data
const { data, error } = await getSalaryBenchmarks(companyId, roleId?, level?);
```

See [src/services/supabase.ts](src/services/supabase.ts) for complete API documentation.

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -r node_modules dist
npm install
npm run build
```

### Environment Variable Issues
```bash
# Verify env variables are loaded
npm run dev

# Check in browser console
console.log(import.meta.env.VITE_SUPABASE_URL)
```

### Database Connection
- Verify Supabase project is active
- Check VITE_SUPABASE_URL and keys are correct
- Ensure RLS policies allow your queries
- Check Supabase logs: https://supabase.com/dashboard

## 📝 Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=              # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=         # Supabase anonymous key
VITE_SUPABASE_SERVICE_ROLE_KEY= # Service role key (backend only)

# Optional: Analytics & Monitoring
VITE_POSTHOG_API_KEY=           # PostHog analytics key
VITE_POSTHOG_API_HOST=          # PostHog API host
VITE_SENTRY_DSN=                # Sentry error tracking
VITE_ENVIRONMENT=               # Environment (development/production)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Developer**: Gurughanandan
- **Built with**: React, TypeScript, Supabase

## 📞 Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check existing documentation
- Review Supabase docs: https://supabase.com/docs

## 🎉 Acknowledgments

- Built with [React](https://react.dev/)
- Database by [Supabase](https://supabase.com/)
- UI powered by [Tailwind CSS](https://tailwindcss.com/)
- Build tool: [Vite](https://vitejs.dev/)
- Analytics: [PostHog](https://posthog.com/)
- Error tracking: [Sentry](https://sentry.io/)

---

**Status**: 🟢 Production Ready

**Deploy**: www.s4skillup.com (via Vercel)

**Last Updated**: May 5, 2026
