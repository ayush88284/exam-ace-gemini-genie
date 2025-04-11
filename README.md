
# GAMA AI - AI-Powered Study Assistant

![GAMA AI](public/lovable-uploads/dc36c50d-109c-49d9-83fc-aba5ac3e5689.png)

## Overview

GAMA AI is an advanced learning platform designed to transform how students prepare for exams and understand complex study materials. Using artificial intelligence, GAMA AI analyzes your study materials to generate customized practice questions, provide interactive chat assistance, and help you master difficult concepts.

## Key Features

### Smart Content Analysis
- Upload PDFs, text documents, or paste content from your study materials
- Our AI engine processes your content to identify key concepts and learning objectives

### Custom Question Generation
- Create tailored practice questions based on your specific study materials
- Adjust the number and complexity of questions to match your learning needs
- Get detailed explanations with each answer to deepen your understanding

### Interactive AI Chat
- Ask follow-up questions about your study materials
- Get clarification on difficult concepts
- Have a conversation with an AI tutor that understands your specific content

### Personalized Learning Experience
- Track your progress and focus on areas that need improvement
- Save time by focusing your study efforts on what matters most
- Study more effectively with materials customized to your needs

## User Interface

Our redesigned UI features:
- Clean, modern interface with intuitive navigation
- Beautiful purple-blue gradient design
- Clear call-to-action buttons for quick access to main features
- Responsive design for all device sizes
- Dark mode by default for reduced eye strain during study sessions

## Enhanced AI Response Quality

GAMA AI now features improved response generation:
- More detailed and accurate answers
- Better formatting of question-answer pairs
- Enhanced educational value with explanations that target comprehension
- Improved parsing of complex academic content
- More natural conversational AI in chat mode

## Getting Started

### Installation

```sh
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd gama-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Usage

1. **Sign Up/Login**: Create an account or log in to access your personalized dashboard
2. **Upload Content**: Upload your study materials (PDF, document) or paste text directly
3. **Generate Questions**: Choose how many questions you want to create from your materials
4. **Study & Practice**: Review the generated questions and test your knowledge
5. **Chat for Clarity**: Use the AI chat feature to ask follow-up questions and deepen your understanding

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **State Management**: React Context API, TanStack Query
- **Authentication**: Supabase Auth
- **Backend**: Supabase Edge Functions
- **AI Integration**: Custom AI models for content analysis and generation

## Project Structure

```
src/
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── integrations/       # Third-party service integrations
├── lib/                # Utility functions and helpers
├── pages/              # Application pages
└── App.tsx             # Main application component
```

## Features in Detail

### Upload Section
Users can upload study materials through:
- PDF upload
- Document upload
- Direct text pasting
- URL import (coming soon)

### Question Generation
The AI analyzes uploaded content to create various question types:
- Multiple-choice questions
- Short-answer questions
- Concept-based questions
- Application questions

### AI Chat Interface
A conversational interface that allows users to:
- Ask specific questions about the content
- Request explanations of difficult concepts
- Get study tips based on the material
- Request additional questions on specific topics

## Team

GAMA AI was developed by:
- **G**ouri - Lead Developer
- **A**neri - UX Designer
- **M**eet - AI Engineer
- **A**yush - Product Manager

## Roadmap

Future development plans include:
- Flashcard generation and spaced repetition system
- Progress tracking and analytics dashboard
- Collaborative study sessions
- Mobile application
- Custom question templates
- Integration with learning management systems

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support or inquiries, please contact us at support@gama-ai.com
