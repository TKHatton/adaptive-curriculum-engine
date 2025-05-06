import React, { useState } from 'react';
import ContentInput from './components/ContentInput';
import WritingSamples from './components/WritingSamples';
import GenerationOptions from './components/GenerationOptions';
import OutputDisplay from './components/OutputDisplay';
import './styles/minimal.css';

function App() {
  const [step, setStep] = useState(1);
  const [contentData, setContentData] = useState(null);
  const [writingSamples, setWritingSamples] = useState([]);
  const [writingProfile, setWritingProfile] = useState(null);
  const [generateScript, setGenerateScript] = useState(false);
  const [generateSlides, setGenerateSlides] = useState(false);
  const [outputs, setOutputs] = useState({
    script: null,
    slides: null
  });

  // Process content and move to next step
  const handleContentComplete = (data) => {
    setContentData(data);
    setStep(2);
  };

  // Save writing samples and profile
  const handleWritingSamplesUpdate = async (samples) => {
    setWritingSamples(samples);
    
    // If samples provided, create a writing profile
    if (samples.length > 0) {
      try {
        const response = await fetch('/api/writing/samples', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ samples })
        });
        
        if (response.ok) {
          const data = await response.json();
          setWritingProfile(data);
        }
      } catch (error) {
        console.error('Error saving writing samples:', error);
      }
    }
  };

  // Handle generation results
  const handleGenerationComplete = (generatedContent) => {
    setOutputs({
      script: generatedContent.script || null,
      slides: generatedContent.slides || null
    });
    setStep(4);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">Adaptive Curriculum Engine</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {step === 1 && (
            <ContentInput 
              onComplete={handleContentComplete}
            />
          )}

          {step === 2 && (
            <WritingSamples
              samples={writingSamples}
              onUpdate={handleWritingSamplesUpdate}
              onContinue={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <GenerationOptions
            contentData={contentData}
            writingProfile={writingProfile}
            onGenerate={handleGenerationComplete}
            generateScript={generateScript}
            setGenerateScript={setGenerateScript}
            generateSlides={generateSlides}
            setGenerateSlides={setGenerateSlides}
          />

          {step === 4 && (
            <OutputDisplay
              outputs={outputs}
              onBack={() => setStep(3)}
              onRegenerate={() => setStep(3)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;