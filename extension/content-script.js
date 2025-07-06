// Content script that runs on all websites
class FormAutomationTyper {
  constructor() {
    this.isTyping = false;
    this.currentTimeout = null;
  }

  async typeText(text, speed = 50, targetSelector = null) {
    if (this.isTyping) {
      return { success: false, error: 'Already typing' };
    }

    // Find target input field
    let targetField = null;
    
    if (targetSelector) {
      targetField = document.querySelector(targetSelector);
    } else {
      // Auto-detect focused field or first text input
      targetField = document.activeElement;
      if (!this.isValidInputField(targetField)) {
        targetField = document.querySelector('input[type="text"], input[type="email"], input[type="search"], textarea');
      }
    }

    if (!targetField || !this.isValidInputField(targetField)) {
      return { success: false, error: 'No valid input field found' };
    }

    try {
      await this.simulateTyping(targetField, text, speed);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  isValidInputField(element) {
    if (!element) return false;
    
    const tagName = element.tagName.toLowerCase();
    const type = element.type?.toLowerCase();
    
    // Check for text inputs
    if (tagName === 'textarea') return true;
    if (tagName === 'input' && (!type || ['text', 'email', 'search', 'url', 'tel'].includes(type))) {
      return true;
    }
    
    // Check for contenteditable elements
    if (element.contentEditable === 'true') return true;
    
    return false;
  }

  async simulateTyping(field, text, speed) {
    this.isTyping = true;
    
    // Focus the field
    field.focus();
    
    // Clear existing content
    field.value = '';
    
    // Trigger input events for React/modern frameworks
    this.triggerEvent(field, 'focus');
    
    for (let i = 0; i < text.length; i++) {
      if (!this.isTyping) break; // Allow cancellation
      
      const char = text[i];
      
      // Add character
      if (field.tagName.toLowerCase() === 'textarea' || field.type !== 'password') {
        field.value += char;
      }
      
      // Trigger events
      this.triggerEvent(field, 'input');
      this.triggerEvent(field, 'keydown', { key: char });
      this.triggerEvent(field, 'keypress', { key: char });
      this.triggerEvent(field, 'keyup', { key: char });
      
      // Wait for next character
      await this.delay(speed + Math.random() * 20); // Add slight randomness
    }
    
    // Final events
    this.triggerEvent(field, 'change');
    this.triggerEvent(field, 'blur');
    
    this.isTyping = false;
  }

  triggerEvent(element, eventType, options = {}) {
    const event = new Event(eventType, {
      bubbles: true,
      cancelable: true,
      ...options
    });
    
    // Add key-specific properties for keyboard events
    if (['keydown', 'keypress', 'keyup'].includes(eventType) && options.key) {
      Object.defineProperty(event, 'key', { value: options.key });
      Object.defineProperty(event, 'code', { value: `Key${options.key.toUpperCase()}` });
    }
    
    element.dispatchEvent(event);
  }

  delay(ms) {
    return new Promise(resolve => {
      this.currentTimeout = setTimeout(resolve, ms);
    });
  }

  stopTyping() {
    this.isTyping = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }
}

// Initialize typer
const typer = new FormAutomationTyper();

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_TYPING') {
    typer.typeText(
      message.text,
      message.speed,
      message.targetSelector
    ).then(result => {
      sendResponse(result);
    });
    return true; // Keep message channel open for async response
  }
  
  if (message.type === 'STOP_TYPING') {
    typer.stopTyping();
    sendResponse({ success: true });
  }
});

// Visual indicator when extension is active
const indicator = document.createElement('div');
indicator.id = 'form-automation-indicator';
indicator.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  background: #10b981;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  z-index: 10000;
  display: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;
indicator.textContent = '🤖 Form Automation Ready';
document.body.appendChild(indicator);

// Show indicator briefly when page loads
setTimeout(() => {
  indicator.style.display = 'block';
  setTimeout(() => {
    indicator.style.display = 'none';
  }, 2000);
}, 1000);