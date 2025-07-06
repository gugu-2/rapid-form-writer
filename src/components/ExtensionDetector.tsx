import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';
import { extensionMessaging } from '@/utils/extensionMessaging';

const ExtensionDetector = () => {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkExtension();
  }, []);

  const checkExtension = async () => {
    setIsChecking(true);
    try {
      const installed = await extensionMessaging.checkExtensionInstalled();
      setIsInstalled(installed);
    } catch (error) {
      setIsInstalled(false);
    } finally {
      setIsChecking(false);
    }
  };

  const downloadExtension = () => {
    // Create a zip file with extension files for download
    const instructions = `
To install the Form Automation Assistant extension:

1. Download all extension files from the 'extension' folder
2. Open Brave browser and go to brave://extensions/
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked"
5. Select the extension folder
6. The extension will be installed and ready to use!

Extension files needed:
- manifest.json
- background.js
- content-script.js
- popup.html
    `;
    
    alert(instructions);
  };

  if (isChecking) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Checking for browser extension...
        </AlertDescription>
      </Alert>
    );
  }

  if (isInstalled) {
    return (
      <Alert className="border-primary/20 bg-primary/5">
        <CheckCircle className="h-4 w-4 text-primary" />
        <AlertDescription className="text-foreground">
          ✅ Browser extension is installed and ready for cross-website automation!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border border-yellow-500/20">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Browser Extension Required</h3>
            <p className="text-sm text-muted-foreground">
              To type text into form fields on other websites, you need to install our browser extension.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={downloadExtension}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Get Extension
          </Button>
          <Button 
            variant="ghost" 
            onClick={checkExtension}
            size="sm"
          >
            Recheck
          </Button>
        </div>

        <div className="text-xs text-muted-foreground bg-background/30 rounded-lg p-3">
          <p className="font-medium mb-1">Installation steps:</p>
          <ol className="space-y-1 list-decimal list-inside">
            <li>Click "Get Extension" and follow instructions</li>
            <li>Load the extension in Brave (brave://extensions/)</li>
            <li>Refresh this page to activate cross-website features</li>
          </ol>
        </div>
      </div>
    </Card>
  );
};

export default ExtensionDetector;