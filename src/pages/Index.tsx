import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TextInputArea from '@/components/TextInputArea';
import TypingSimulation from '@/components/TypingSimulation';
import AutomationStats from '@/components/AutomationStats';
import { Bot, Keyboard, Globe, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-automation.jpg';

const Index = () => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(50);

  const handleStartTyping = () => {
    setIsTyping(true);
  };

  const handleStopTyping = () => {
    setIsTyping(false);
  };

  const estimatedTime = inputText.length * typingSpeed;

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <Bot className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Form Automation Assistant</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
              Automate Your
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Form Filling</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Prepare and simulate text input for automated form filling. Perfect for browser automation tools and repetitive data entry tasks.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Keyboard className="h-4 w-4 text-primary" />
                <span>Realistic Typing Simulation</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 text-primary" />
                <span>Browser Compatible</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowRight className="h-4 w-4 text-primary" />
                <span>Easy Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="space-y-8">
          {/* Stats Row */}
          <AutomationStats 
            textLength={inputText.length}
            estimatedTime={estimatedTime}
            speed={typingSpeed}
          />

          {/* Main Interface */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">1</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">Input Your Text</h2>
              </div>
              
              <TextInputArea
                text={inputText}
                onTextChange={setInputText}
                onStartTyping={handleStartTyping}
                onStopTyping={handleStopTyping}
                onSpeedChange={setTypingSpeed}
                isTyping={isTyping}
              />
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">2</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">Preview Typing</h2>
              </div>
              
              <TypingSimulation
                text={inputText}
                isActive={isTyping}
                speed={typingSpeed}
              />
            </div>
          </div>

          {/* Integration Guide */}
          <Card className="p-8 bg-gradient-card border border-primary/20">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-foreground">Ready for Integration</h3>
                <p className="text-muted-foreground">
                  Use this tool with browser automation libraries and extensions
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Selenium & Puppeteer</h4>
                  <p className="text-sm text-muted-foreground">
                    Perfect for automated testing and web scraping scripts
                  </p>
                </div>
                
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Browser Extensions</h4>
                  <p className="text-sm text-muted-foreground">
                    Integrate with form-filling browser extensions
                  </p>
                </div>
                
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                    <Keyboard className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">RPA Tools</h4>
                  <p className="text-sm text-muted-foreground">
                    Compatible with robotic process automation platforms
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;