// pin-login.js - Creates and manages PIN login screen as a modal
import { screenManager } from '../navigation.js';
import { loadCredentials, displayCredentials } from '../credentials.js';
import { createModal, createModalContent } from '../utils.js';

/**
 * Shows the PIN login screen as a modal
 */
export function showPinLoginScreen() {
  // Create the modal container
  const pinModal = createModal({ id: 'pin-login-modal' });
  
  // Create the content similar to current PIN login screen
  const modalContent = createModalContent();
  modalContent.style.padding = '20px';
  modalContent.style.display = 'flex';
  modalContent.style.flexDirection = 'column';
  modalContent.style.alignItems = 'center';
  modalContent.style.justifyContent = 'flex-start';
  
  // Add title
  const title = document.createElement('h2');
  title.textContent = 'Voer je toegangscode in';
  title.style.textAlign = 'center';
  title.style.marginBottom = '20px';
  modalContent.appendChild(title);
  
  // Create PIN input container
  const pinInputContainer = document.createElement('div');
  pinInputContainer.className = 'pin-input';
  
  // Create 6 PIN boxes
  for (let i = 0; i < 6; i++) {
    const pinInput = document.createElement('input');
    pinInput.type = 'password';
    pinInput.maxLength = 1;
    pinInput.className = 'pin-box';
    pinInput.inputMode = 'numeric';
    pinInput.pattern = '[0-9]*';
    
    // Add event listener for input to go to next box
    pinInput.addEventListener('input', (e) => {
      if (e.target.value.length === 1 && i < 5) {
        pinInputContainer.children[i + 1].focus();
      }
    });
    
    // Add event listener for arrow keys
    pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && i < 5) {
        pinInputContainer.children[i + 1].focus();
      } else if (e.key === 'ArrowLeft' && i > 0) {
        pinInputContainer.children[i - 1].focus();
      }
    });
    
    pinInputContainer.appendChild(pinInput);
  }
  
  modalContent.appendChild(pinInputContainer);
  
  // Add help text
  const helpText = document.createElement('p');
  helpText.textContent = 'Vanwege demonstratiedoeleinden is 6 maal een 0 of ontgrendelen zonder invoer ook mogelijk';
  helpText.style.textAlign = 'center';
  helpText.style.marginBottom = '20px';
  modalContent.appendChild(helpText);
  
  // Add unlock button
  const unlockButton = document.createElement('button');
  unlockButton.id = 'submit-pin';
  unlockButton.textContent = 'Ontgrendelen';
  unlockButton.addEventListener('click', () => {
    // Remove PIN modal
    document.body.removeChild(pinModal);
    
    // Load credentials and show wallet screen
    loadCredentials();
    
    // Show the wallet screen
    screenManager.showScreen('wallet', true);
    displayCredentials();
  });
  
  modalContent.appendChild(unlockButton);
  
  // Add modal content to modal
  pinModal.appendChild(modalContent);
  
  // Add the modal to the body
  document.body.appendChild(pinModal);
}