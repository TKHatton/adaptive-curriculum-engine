# Adaptive Curriculum Engine

A professional web application that generates personalized instructor scripts and presentation slides from course content. The tool creates comprehensive materials that match the instructor's unique teaching style.

## 🚀 Features

- **Content Processing**: Upload course outlines, lesson plans, or text content
- **Document Support**: Process PDF, Word docs, and text files
- **Writing Style Analysis**: Generate content that matches your teaching voice
- **Comprehensive Script Generation**: Complete word-for-word teaching materials
- **Professional Slide Creation**: Matching slide decks with speaker notes
- **In-App Editing**: Modify generated content before downloading
- **Download Options**: Save as PDF (scripts) or PPTX (slides)

## 🛠️ Technology Stack

### Frontend
- React 18.2.0
- Minimalist design principles
- PDF and PPTX generation capabilities

### Backend
- Node.js with Express
- AI integration (OpenAI/GPT-4)
- Document processing
- File handling

## 📁 Project Structure

```
adaptive-curriculum-engine/
├── frontend/              # React application
│   ├── public/            # Static files
│   │   ├── index.html     # Main HTML file
│   │   └── favicon.ico    # App icon
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ContentInput.js    # Content upload/input
│   │   │   ├── WritingSamples.js  # Writing style input
│   │   │   ├── GenerationOptions.js # Generation options
│   │   │   ├── OutputDisplay.js   # Display generated content
│   │   │   └── FileUpload.js      # File upload component
│   │   ├── services/      # API communication
│   │   │   └── apiService.js
│   │   ├── styles/        # CSS styling
│   │   │   └── minimal.css
│   │   ├── App.js         # Main application component
│   │   └── index.js       # Entry point
│   └── package.json       # Frontend dependencies
├── backend/               # Node.js API
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   │   ├── contentController.js
│   │   │   ├── writingController.js
│   │   │   └── generationController.js
│   │   ├── services/      # Business logic
│   │   │   ├── aiService.js
│   │   │   ├── documentProcessor.js
│   │   │   └── outputGenerator.js
│   │   ├── middleware/    # Middleware functions
│   │   │   ├── fileHandler.js
│   │   │   └── errorHandler.js
│   │   ├── routes/        # API route definitions
│   │   │   └── index.js
│   │   └── server.js      # Server entry point
│   ├── uploads/           # Temporary file storage
│   │   ├── content/       # Processed content
│   │   ├── samples/       # Writing samples
│   │   ├── scripts/       # Generated scripts
│   │   └── slides/        # Generated slides
│   └── package.json       # Backend dependencies
└── deployment/            # Deployment configuration
    ├── netlify.toml       # Frontend deployment (Netlify)
    └── render.yaml        # Backend deployment (Render)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- OpenAI API key
- Netlify and Render accounts (for deployment)

### Local Development

#### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/adaptive-curriculum-engine.git
cd adaptive-curriculum-engine
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create an environment file:
```bash
cp .env.example .env
```

4. Open `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

5. Start the backend server:
```bash
npm run dev
```

The server will run on http://localhost:5000.

#### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The app will open in your browser at http://localhost:3000.

## 📋 User Guide

### 1. Upload Content
- Paste your course outline or lesson content
- Or upload PDF, Word, or text files
- Click "Process Content" to continue

### 2. Add Writing Samples (Optional)
- Provide writing samples to match your teaching style
- Add presentation requirements/tone preferences
- Click "Continue to Generation" when done

### 3. Choose Generation Options
- Select script options (length, style, elements)
- Set slide preferences (count, density, notes)
- Choose to generate script, slides, or both

### 4. View and Download
- Review generated materials
- Edit content if needed
- Download as PDF (scripts) or PPTX (slides)

## 🌐 Deployment

### Frontend Deployment (Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy using Netlify CLI or connect your GitHub repository to Netlify.

3. Set the following environment variables in Netlify:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

### Backend Deployment (Render)

1. Push your code to GitHub.

2. Create a new Web Service on Render, connecting to your repository.

3. Set environment variables:
```
NODE_ENV=production
OPENAI_API_KEY=your_api_key_here
FRONTEND_URL=https://your-frontend-url.netlify.app
```

4. Use the `render.yaml` configuration for automatic setup.

## 📦 Dependencies

### Frontend
- React
- Axios (API requests)
- pptxgenjs (PPTX generation)

### Backend
- Express
- multer (file uploads)
- OpenAI API
- pdf-lib (PDF processing)
- mammoth (Word document processing)
- pptxgenjs (server-side PPTX generation)
- pdfkit (PDF generation)

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions and support, please open an issue in the GitHub repository.