# Linear Top Issue

A Next.js application that helps you identify the most important issue to work on in your Linear workspace. Built with the philosophy of finding problems big enough to cancel your day for.

## What it does

Linear Top Issue analyzes your Linear workspace to find the single most important issue you should be working on. It follows a hierarchical approach:

1. **Finds the highest priority in-progress initiatives** in your workspace
2. **Identifies the highest priority projects** from those initiatives (or from your workspace if no initiatives exist)
3. **Determines the most important planned issues** within those projects based on priority and other factors

The result is displayed in a visual flow showing the initiative → project → issue hierarchy, helping you focus on what truly matters.

## Features

- 🔐 **Linear OAuth Integration** - Secure authentication with your Linear workspace
- 🎯 **Smart Issue Prioritization** - Algorithmic determination of your top issue
- 🎨 **Visual Hierarchy Display** - Clear visualization of initiative → project → issue flow
- 👤 **User Profile Integration** - Shows your avatar and workspace information
- 🔄 **Real-time Updates** - Always shows your current top issue
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Linear OAuth
- **Database**: Supabase (for session management)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager
- Linear workspace account
- Linear API credentials

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd linear-top-issue
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
LINEAR_CLIENT_ID=your_linear_client_id
LINEAR_CLIENT_SECRET=your_linear_client_secret
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:

```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Linear API Setup

1. Go to [Linear's Developer Settings](https://linear.app/settings/api)
2. Create a new OAuth application
3. Set the redirect URI to `http://localhost:3000/api/auth/linear/callback` (for development)
4. Copy the Client ID and Client Secret to your environment variables

## Usage

1. **Visit the site** - You'll see a welcome page with a demo video
2. **Connect your Linear workspace** - Click the "Connect Linear" button
3. **Authorize the application** - Grant access to your Linear workspace
4. **View your top issue** - The app will display your most important issue in a visual hierarchy

## How the Algorithm Works

The top issue is determined through a multi-step process:

1. **Initiative Analysis**: Searches for in-progress initiatives with the highest priority
2. **Project Selection**: From those initiatives, finds the highest priority projects
3. **Issue Prioritization**: Within those projects, identifies the most important planned issues based on:
   - Priority level
   - Customer ticket count
   - Assignment status
   - Other relevant factors

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes for Linear integration
│   ├── components/    # React components
│   ├── about/         # About page
│   └── layout.tsx     # Root layout
├── hooks/             # Custom React hooks
└── utils/             # Utility functions
```

## Contributing

This project was created by Marcus Smith. Contributions are welcome!

## License

Private project - not for public distribution.

## Links

- **Creator**: [@marcusmth](https://twitter.com/marcusmth)
- **Website**: [marcusmth.com](https://marcusmth.com)
- **Linear**: [linear.app](https://linear.app)
