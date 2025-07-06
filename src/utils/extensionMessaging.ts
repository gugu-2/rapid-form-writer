// Extension communication utilities

const EXTENSION_ID = 'form-automation-assistant';

export interface TypingRequest {
  type: 'START_TYPING';
  text: string;
  speed: number;
  targetSelector?: string;
}

export interface TypingResponse {
  success: boolean;
  error?: string;
}

export class ExtensionMessaging {
  private static instance: ExtensionMessaging;
  
  static getInstance(): ExtensionMessaging {
    if (!ExtensionMessaging.instance) {
      ExtensionMessaging.instance = new ExtensionMessaging();
    }
    return ExtensionMessaging.instance;
  }

  async checkExtensionInstalled(): Promise<boolean> {
    try {
      // Try to send a message to the extension
      const response = await this.sendMessage({ type: 'EXTENSION_CHECK' });
      return response?.installed === true;
    } catch (error) {
      console.log('Extension not installed:', error);
      return false;
    }
  }

  async startTyping(text: string, speed: number, targetSelector?: string): Promise<TypingResponse> {
    try {
      const response = await this.sendMessage({
        type: 'START_TYPING',
        text,
        speed,
        targetSelector
      });
      
      return response || { success: false, error: 'No response from extension' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Communication failed' 
      };
    }
  }

  async stopTyping(): Promise<boolean> {
    try {
      await this.sendMessage({ type: 'STOP_TYPING' });
      return true;
    } catch (error) {
      console.error('Failed to stop typing:', error);
      return false;
    }
  }

  private async sendMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // Try different extension communication methods
      
      // Method 1: Direct extension messaging (if available)
      if (typeof window !== 'undefined' && (window as any).chrome && (window as any).chrome.runtime) {
        try {
          const chrome = (window as any).chrome;
          chrome.runtime.sendMessage(EXTENSION_ID, message, (response: any) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(response);
            }
          });
          return;
        } catch (error) {
          // Fall through to next method
        }
      }

      // Method 2: Custom event messaging (fallback)
      const messageId = `msg_${Date.now()}_${Math.random()}`;
      
      const responseHandler = (event: CustomEvent) => {
        if (event.detail.messageId === messageId) {
          window.removeEventListener('extension-response', responseHandler as EventListener);
          resolve(event.detail.response);
        }
      };

      window.addEventListener('extension-response', responseHandler as EventListener);
      
      // Dispatch message to content script
      window.dispatchEvent(new CustomEvent('extension-message', {
        detail: { ...message, messageId }
      }));

      // Timeout after 5 seconds
      setTimeout(() => {
        window.removeEventListener('extension-response', responseHandler as EventListener);
        reject(new Error('Extension communication timeout'));
      }, 5000);
    });
  }
}

export const extensionMessaging = ExtensionMessaging.getInstance();