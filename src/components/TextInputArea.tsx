import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TextInputAreaProps {
  onTextChange: (text: string) => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
  onSpeedChange: (speed: number) => void;
  isTyping: boolean;
  text: string;
}

const TextInputArea = ({ 
  onTextChange, 
  onStartTyping, 
  onStopTyping, 
  onSpeedChange, 
  isTyping, 
  text 
}: TextInputAreaProps) => {
  const [speed, setSpeed] = useState([50]);
  const { toast } = useToast();

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value);
    onSpeedChange(value[0]);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Text Copied",
        description: "Text has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    onTextChange('');
    onStopTyping();
  };

  return (
    <Card className="p-6 bg-gradient-card border border-primary/20">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="input-text" className="text-base font-semibold">
            Input Text for Form Automation
          </Label>
          <Textarea
            id="input-text"
            placeholder="Enter the text you want to type into forms..."
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className="min-h-[120px] bg-background/50 border-primary/20 focus:border-primary/50 resize-none"
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Typing Speed</Label>
            <div className="px-3">
              <Slider
                value={speed}
                onValueChange={handleSpeedChange}
                max={200}
                min={10}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Slow (10ms)</span>
                <span>Current: {speed[0]}ms</span>
                <span>Fast (200ms)</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={isTyping ? "destructive" : "hero"}
              onClick={isTyping ? onStopTyping : onStartTyping}
              disabled={!text.trim()}
              className="flex-1"
            >
              {isTyping ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Stop Typing
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Typing Simulation
                </>
              )}
            </Button>
            
            <Button
              variant="automation"
              onClick={handleCopyText}
              disabled={!text.trim()}
            >
              <Copy className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!text.trim() && !isTyping}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-background/30 rounded-lg p-3">
          <p className="font-medium mb-1">How to use:</p>
          <ul className="space-y-1">
            <li>• Enter your text in the area above</li>
            <li>• Adjust typing speed with the slider</li>
            <li>• Click "Start Typing Simulation" to preview</li>
            <li>• Copy text to use with browser automation tools</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default TextInputArea;