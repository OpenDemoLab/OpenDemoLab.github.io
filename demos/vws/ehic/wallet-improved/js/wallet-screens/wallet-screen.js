// wallet-screen.js - Creates and manages the main wallet screen
import { screenManager } from '../navigation.js';
import { displayCredentials } from '../credentials.js';

/**
 * Creates and initializes the main wallet screen
 */
export function createWalletScreen() {
  // Create the main wallet container if it doesn't exist
  let walletScreen = document.getElementById('wallet-screen');
  
  if (!walletScreen) {
    walletScreen = document.createElement('section');
    walletScreen.id = 'wallet-screen';
    walletScreen.style.display = 'none';
    walletScreen.style.padding = '15px';
    walletScreen.style.paddingBottom = '80px';
    
    // Append to body
    document.body.appendChild(walletScreen);
  } else {
    // Clear existing content to avoid duplication
    walletScreen.innerHTML = '';
  }
  
  // Create wallet header
  const walletHeader = document.createElement('section');
  walletHeader.id = 'wallet-header';
  walletHeader.className = 'header-screen';
  
  // Create header title
  const headerTitle = document.createElement('h3');
  headerTitle.textContent = 'Mijn overzicht';
  
  // Create title divider
  const titleDivider = document.createElement('div');
  titleDivider.className = 'title-divider';
  
  // Add header elements to the header
  walletHeader.appendChild(headerTitle);
  walletHeader.appendChild(titleDivider);
  
  // Create top button container
  const topButtonContainer = document.createElement('div');
  topButtonContainer.className = 'top-button-container-start-screen';
  topButtonContainer.style.justifyContent = 'center'; // Center the container content
  
  // Create QR scan button
  const qrScanBtn = document.createElement('a');
  qrScanBtn.id = 'qr-scan-button';
  qrScanBtn.className = 'catalogue-btn';
  
  const qrScanBtnCircle = document.createElement('div');
  qrScanBtnCircle.className = 'circle-btn';
  qrScanBtnCircle.style.width = '70px'; // Make the button larger
  qrScanBtnCircle.style.height = '70px'; // Make the button larger
  
  const qrScanIcon = document.createElement('i');
  qrScanIcon.className = 'fa fa-qrcode';
  qrScanIcon.style.fontSize = '30px'; // Make the icon larger
  qrScanBtnCircle.appendChild(qrScanIcon);
  
  const qrScanText = document.createElement('span');
  qrScanText.className = 'qr-scan-button-text';
  qrScanText.textContent = 'QR-scan';
  qrScanText.style.fontSize = '16px'; // Make the text slightly larger
  
  qrScanBtn.appendChild(qrScanBtnCircle);
  qrScanBtn.appendChild(qrScanText);
  
  // Add button to top container
  topButtonContainer.appendChild(qrScanBtn);
  
  // Add top button container to header
  walletHeader.appendChild(topButtonContainer);
  
  // Create clickable sections container
  const clickableSectionsContainer = document.createElement('div');
  clickableSectionsContainer.className = 'background-clickable-sections';
  
  // Create digital proofs button
  const digitalProofsButton = document.createElement('div');
  digitalProofsButton.id = 'open-current-cards';
  digitalProofsButton.className = 'clickable-section';
  
  const digitalProofsIcon = document.createElement('i');
  digitalProofsIcon.className = 'fa-regular fa-credit-card';
  
  const digitalProofsTitle = document.createElement('h3');
  digitalProofsTitle.textContent = 'Mijn digitale bewijzen';
  
  digitalProofsButton.appendChild(digitalProofsIcon);
  digitalProofsButton.appendChild(digitalProofsTitle);
  
  // Add digital proofs button to clickable sections
  clickableSectionsContainer.appendChild(digitalProofsButton);
  
  // Add clickable sections to header
  walletHeader.appendChild(clickableSectionsContainer);
  
  // Add wallet header to wallet screen
  walletScreen.appendChild(walletHeader);
  
  // Setup event listeners
  setupWalletEventListeners();
}

/**
 * Sets up event listeners for the wallet screen
 */
function setupWalletEventListeners() {
  // Mijn digitale bewijzen button
  const openCurrentCardsBtn = document.getElementById('open-current-cards');
  if (openCurrentCardsBtn) {
    // Remove existing listeners
    const newOpenCurrentCardsBtn = openCurrentCardsBtn.cloneNode(true);
    if (openCurrentCardsBtn.parentNode) {
      openCurrentCardsBtn.parentNode.replaceChild(newOpenCurrentCardsBtn, openCurrentCardsBtn);
    }
    
    // Add new listener
    newOpenCurrentCardsBtn.addEventListener('click', function() {
      screenManager.showScreen('current-cards', false);
      displayCredentials();
    });
  }
  
  // QR scan button
  const qrScanBtn = document.getElementById('qr-scan-button');
  if (qrScanBtn) {
    // Remove existing listeners
    const newQrScanBtn = qrScanBtn.cloneNode(true);
    if (qrScanBtn.parentNode) {
      qrScanBtn.parentNode.replaceChild(newQrScanBtn, qrScanBtn);
    }
    
    // Add new listener
    newQrScanBtn.addEventListener('click', () => {
      screenManager.showScreen('add-card', false);
      import('../qr-scanner.js').then(module => {
        module.startQrScan();
      });
    });
  }
}

/**
 * Shows the wallet screen and initializes its content
 */
export function showWalletScreen(showNavBar = true) {
  // Create/refresh the wallet screen
  createWalletScreen();
  
  // Show the wallet screen
  screenManager.showScreen('wallet', showNavBar);
  
  // Display credentials
  displayCredentials();
}