import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface TypingSimulationProps {
  text: string;
  isActive: boolean;
  speed?: number;
}

const TypingSimulation = ({ text, isActive, speed = 50 }: TypingSimulationProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setDisplayedText('');
      setCurrentIndex(0);
      return;
    }

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [isActive, currentIndex, text, speed]);

  useEffect(() => {
    if (isActive) {
      setCurrentIndex(0);
      setDisplayedText('');
    }
  }, [text, isActive]);

  return (
    <Card className="p-6 bg-gradient-card border border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-sm text-muted-foreground ml-2">Form Preview</span>
        </div>
        
        <div className="bg-background/50 rounded-lg p-4 border border-border">
          <label className="block text-sm font-medium text-foreground mb-2">
            Sample Form Field
          </label>
          <div className="relative">
            <input
              type="text"
              value={displayedText}
              readOnly
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Text will appear here..."
            />
            {isActive && currentIndex < text.length && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-primary animate-pulse"></span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary animate-pulse' : 'bg-muted'}`}></div>
          {isActive ? 'Typing simulation active' : 'Ready to simulate typing'}
        </div>
      </div>
    </Card>
  );
};

export default TypingSimulation;