function generateRandomPassword(length = 64) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

function insertPassword(password) {
  const activeElement = document.activeElement;
  
  if (activeElement && 
      (activeElement.tagName === 'INPUT' || 
       activeElement.tagName === 'TEXTAREA' ||
       activeElement.isContentEditable)) {
    
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      
      activeElement.value = activeElement.value.substring(0, start) + 
                           password + 
                           activeElement.value.substring(end);
      
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      activeElement.dispatchEvent(new Event('change', { bubbles: true }));
    } 
    else if (activeElement.isContentEditable) {
      document.execCommand('insertText', false, password);
    }
    
    navigator.clipboard.writeText(password).then(() => {
      showNotification("Password generated and copied to clipboard!");
    }).catch(() => {
      showNotification("Password generated!");
    });
    
    return true;
  }
  
  return false;
}

function showNotification(message) {
  const existingNotification = document.getElementById('password-generator-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.id = 'password-generator-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    animation: fadeInOut 3s ease-in-out;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(-20px); }
      10% { opacity: 1; transform: translateY(0); }
      90% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-20px); }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "generatePassword") {
    const password = generateRandomPassword();
    const success = insertPassword(password);
    
    if (!success) {
      showNotification("Please click on an input field first!");
    }
    
    sendResponse({ success: success });
  }
  return true;
});

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.key === 'P') {
    event.preventDefault();
    const password = generateRandomPassword();
    insertPassword(password);
  }
});