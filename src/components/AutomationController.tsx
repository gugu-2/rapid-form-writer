import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, Target, Play, Square, AlertCircle } from 'lucide-react';
import { extensionMessaging } from '@/utils/extensionMessaging';
import { useToast } from '@/components/ui/use-toast';

interface AutomationControllerProps {
  text: string;
  speed: number;
  isExtensionInstalled: boolean;
}

const AutomationController = ({ text, speed, isExtensionInstalled }: AutomationControllerProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [targetSelector, setTargetSelector] = useState('');
  const [lastResult, setLastResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStartTyping = async () => {
    if (!text.trim()) {
      toast({
        title: "No Text",
        description: "Please enter some text first",
        variant: "destructive"
      });
      return;
    }

    setIsTyping(true);
    setLastResult(null);

    try {
      const result = await extensionMessaging.startTyping(
        text, 
        speed, 
        targetSelector || undefined
      );

      if (result.success) {
        setLastResult('success');
        toast({
          title: "Typing Started",
          description: "Text is being typed on the current tab",
        });
      } else {
        setLastResult(result.error || 'Unknown error');
        toast({
          title: "Typing Failed",
          description: result.error || 'Could not start typing',
          variant: "destructive"
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Communication failed';
      setLastResult(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleStopTyping = async () => {
    await extensionMessaging.stopTyping();
    setIsTyping(false);
    toast({
      title: "Typing Stopped",
      description: "Automation has been cancelled",
    });
  };

  if (!isExtensionInstalled) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-card border border-primary/20">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Cross-Website Automation</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target-selector" className="text-sm font-medium">
              Target Field Selector (Optional)
            </Label>
            <Input
              id="target-selector"
              placeholder="e.g., #email, .search-input, [name='message']"
              value={targetSelector}
              onChange={(e) => setTargetSelector(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to auto-detect the active/focused input field
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={isTyping ? "destructive" : "success"}
              onClick={isTyping ? handleStopTyping : handleStartTyping}
              disabled={!text.trim()}
              className="flex-1"
            >
              {isTyping ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Typing
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Type on Current Tab
                </>
              )}
            </Button>
          </div>

          {lastResult && (
            <Alert className={lastResult === 'success' ? 'border-primary/20 bg-primary/5' : 'border-destructive/20 bg-destructive/5'}>
              {lastResult === 'success' ? (
                <Target className="h-4 w-4 text-primary" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <AlertDescription className={lastResult === 'success' ? 'text-primary' : 'text-destructive'}>
                {lastResult === 'success' 
                  ? 'Text typed successfully!' 
                  : `Error: ${lastResult}`
                }
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="text-xs text-muted-foreground bg-background/30 rounded-lg p-3">
          <p className="font-medium mb-1">How to use:</p>
          <ul className="space-y-1">
            <li>• Navigate to the target website in your current tab</li>
            <li>• Click on the form field you want to fill (or specify a selector)</li>
            <li>• Click "Type on Current Tab" to start automation</li>
            <li>• The extension will type your text realistically</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default AutomationController;