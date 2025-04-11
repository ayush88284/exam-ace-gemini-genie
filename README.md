
# GAMA AI - Your Smart Exam Companion

![GAMA AI Logo](public/gama-logo.svg)

GAMA AI is a cutting-edge web platform designed to help students transform their study materials into focused, high-yield exam preparation content using artificial intelligence.

## 🚀 Features

- **Smart Question Generation**: Upload study materials and get AI-generated exam questions and answers
- **Multiple Content Formats**: Support for documents (PDF, DOCX, TXT), text input, and web links
- **Interactive AI Chat**: Discuss and explore your study materials with our AI assistant
- **User Authentication**: Secure user accounts with email/password login
- **Responsive Design**: Optimized experience across desktop, tablet, and mobile devices
- **Dark/Light Mode**: Choose your preferred visual theme for comfortable studying

## 🛠️ Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: Shadcn UI component library
- **Animations**: Framer Motion
- **Authentication**: Supabase Auth
- **Backend**: Supabase Edge Functions with OpenAI integration
- **Routing**: React Router Dom

## 🔧 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account 
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/gama-ai.git
cd gama-ai
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Configure environment variables
Create a `.env` file in the root directory with the following content:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Deploy Supabase Edge Functions
```bash
supabase functions deploy --project-ref your-project-ref
```

## 💡 Usage

1. **Sign Up/Log In**: Create an account or log in to access all features
2. **Upload Material**: Upload PDFs, documents, or paste text from your study materials
3. **Generate Questions**: Click "Generate Questions" to create exam-style questions and answers
4. **Chat with AI**: Ask follow-up questions about the material to deepen your understanding
5. **Save & Review**: Bookmark important questions for later review

## 📱 App Structure

- `/src`: Source code
  - `/components`: Reusable UI components
  - `/pages`: Main application pages
  - `/hooks`: Custom React hooks
  - `/integrations`: Third-party integrations (Supabase)
  - `/lib`: Utility functions and helpers
- `/public`: Static assets
- `/supabase`: Supabase edge functions and configurations

## 🧩 Key Components

- **Upload Interface**: Drag-and-drop file uploading with preview and processing
- **Question Generation**: AI-powered question and answer creation with customizable settings
- **Chat Interface**: Interactive conversation with context-aware AI assistant
- **Authentication System**: Secure user authentication with email verification
- **Dashboard**: User's personal space for managing study materials and saved content

## 🔐 Security

- Row-Level Security (RLS) policies protect user data
- Secure authentication with email verification
- Protected routes ensure authorized access to user content

## 🎨 Design & User Experience

- Modern glassmorphism style with gradient accents
- Micro-interactions and animations for engaging experience
- Mobile-first responsive design
- Consistent theme across all components
- Accessible interface with keyboard navigation and screen reader support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

For any questions or feedback, please reach out to [your-email@example.com](mailto:your-email@example.com).

---

Created with ❤️ by The GAMA AI Team
