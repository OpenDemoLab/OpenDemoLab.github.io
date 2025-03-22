// welcome-screen.js - Gecorrigeerde versie
import { screenManager } from '../navigation.js';
import { createModal, createModalContent } from '../utils.js';

/**
 * Shows the welcome screen as a modal
 */
export function showWelcomeScreen() {
  // Create the modal container
  const welcomeModal = createModal({ id: 'welcome-modal' });
  welcomeModal.style.padding = '0';
  welcomeModal.style.background = "url('images/welcome-bg.png') center center no-repeat";
  welcomeModal.style.backgroundSize = "cover";
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'welcome-overlay';
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.backgroundColor = 'rgba(117, 108, 54, 0.4)';
  overlay.style.zIndex = '1';
  welcomeModal.appendChild(overlay);
  
  // Create content
  const content = document.createElement('div');
  content.className = 'welcome-content';
  content.style.position = 'relative';
  content.style.zIndex = '2';
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.alignItems = 'center';
  content.style.textAlign = 'center';
  content.style.flex = '1';
  content.style.height = '100vh';
  content.style.paddingTop = '40px';
  content.style.paddingBottom = '20px';
  content.style.color = '#ffffff';
  content.style.justifyContent = 'space-between';
  
  // Add title
  const title = document.createElement('h1');
  title.textContent = 'Jouw digitale portemonnee';
  title.style.margin = '0 0 1rem 0';
  title.style.fontSize = '2rem';
  content.appendChild(title);
  
  // Add subtext
  const subtext = document.createElement('p');
  subtext.className = 'welcome-subtext';
  subtext.innerHTML = 'makkelijk,<br>bij de hand,<br>veilig';
  subtext.style.fontSize = '1.2rem';
  subtext.style.lineHeight = '1.5';
  subtext.style.color = '#fff';
  content.appendChild(subtext);
  
  // Add button
  const button = document.createElement('a');
  button.id = 'next-welcome';
  button.className = 'welcome-button';
  button.textContent = 'Volgende';
  button.style.display = 'inline-block';
  button.style.backgroundColor = '#ffffff';
  button.style.color = '#685e0a';
  button.style.padding = '15px 20px';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.textDecoration = 'none';
  button.style.fontSize = '1rem';
  button.style.fontWeight = 'bold';
  button.style.marginBottom = '40px';
  content.appendChild(button);
  
  // Add content to modal
  welcomeModal.appendChild(content);
  
  // Add event listener to button
  button.addEventListener('click', () => {
    // Remove welcome screen
    document.body.removeChild(welcomeModal);
    
    // Show PIN login screen
    import('./pin-login.js').then(module => {
      module.showPinLoginScreen();
    });
  });
  
  // Add the modal to the body
  document.body.appendChild(welcomeModal);
}