// *** Global Variables ***
let html5QrCode = null;
let credentials = [];
let currentVerifierName = "";
let isSharingActionInProgress = false;


// *** RDFCI Modal Elementen ***
const rdfciModal = document.getElementById('rdfci-modal');
const rdfciAgreement = document.getElementById('rdfci-agreement');
const rdfciData = document.getElementById('rdfci-data');
const rdfciAcceptButton = document.getElementById('rdfci-accept-button');
const rdfciStopButton = document.getElementById('rdfci-stop-button');
const confirmPinIssuerBtn = document.getElementById('confirm-pin-issuer');
const pinConfirmationScreenIssuer = document.getElementById('pin-confirmation-screen-issuer');

// *** RDFCV Modal Elementen ***
const rdfcvModal = document.getElementById('rdfcv-modal');
const rdfcvReason = document.getElementById('rdfcv-reason');
const rdfcvDetailsContainer = document.getElementById('rdfcv-details-container');
const rdfcvAgreement = document.getElementById('rdfcv-agreement');
const rdfcvAcceptButton = document.getElementById('rdfcv-accept-button');
const rdfcvStopButton = document.getElementById('rdfcv-stop-button');


// *** Successcherm Elementen ***
const successScreen = document.getElementById('verifier-success-screen');
const successMessage = document.getElementById('success-message');
const verifierNameElement = document.getElementById('verifier-name');
const seeActivityBtn = document.getElementById('see-activity-btn');
const closeSuccessBtn = document.getElementById('close-success-btn');

// *** Menu Elementen ***
const menuScreen = document.getElementById('menu-screen');
const menuButton = document.querySelector('.menu-button');
const backMenuBtn = document.getElementById('back-menu-btn');
const activitiesNavbarItem = document.getElementById('activities-navbar-item');
const overviewNavbarItem = document.getElementById('overview-navbar-item');
const bottomNav = document.querySelector('.bottom-nav');
const machtigingNavbarItem = document.getElementById('machtigingen-navbar-item'); 
const machtigingSection = document.getElementById('machtiging-section');


const addCardScreen = document.getElementById('add-card-screen');


// *** Wallet Elementen ***
const walletGrid = document.getElementById('wallet-grid');
const detailsView = document.getElementById('details');
const detailsTitle = document.getElementById('details-title');
const detailsContent = document.getElementById('details-content');
const closeDetailsBtn = document.getElementById('close-details');
const deleteDetailsBtn = document.getElementById('delete-details');
const walletScreen = document.getElementById('wallet-screen');

// *** Activiteiten Elementen ***
const activitiesOption = document.getElementById('activities-option');
const activitiesSection = document.getElementById('activities-section');
const activitiesList = document.getElementById('activities-list');
const backActivitiesBtn = document.getElementById('back-activities-btn');
const activityScreen = document.getElementById('activities-section');


// Elementen current cards
const openCurrentCardsBtn = document.getElementById('open-current-cards');
const currentCardsSection = document.getElementById('current-cards');
const closeCurrentCardsBtn = document.getElementById('close-current-cards');



// Field mapping for display purposes
const fieldMapping = {
  gn: 'Voornaam',
  vl: 'Voorletter(s)',
  sn: 'Achternaam',
  bd: 'Geboortedatum',
  bsn: 'Burgerservicenummer (BSN)',
  omv: 'Organisatiemachtiging VOG',
  vog: 'Verklaring Omtrent Gedrag (VOG)',
  VOG: 'Verklaring Omtrent Gedrag (VOG)',
  nat: 'Nationaliteit',
  val: 'Geldigheid paspoort',
  ph: 'Foto',   
  issuedBy: 'Uitgegeven door',
  LEID: 'Organisatie nummer',
  Issued_Date: 'Uitgiftedatum',
  a: {
    '12t': 'Opslag: 12 maanden, gedeeld met derden: nee',
    '60t': 'Opslag: 60 maanden, gedeeld met derden: nee',
    'w': 'Bewaarplicht en datadeling met derden volgens wettelijke richtlijnen'
  }
};

// Card styles mapping
const cardStyles = {
  'persoonlijke data': {
    imagePath: '/demo/bdlogo.svg',
    iconColor: null,
    textColor: '#4A6C85'
  },
  'woonadres': {
    imagePath: '/demo/bdlogo.svg',
    iconColor: null,
    textColor: '#4A6C85'
  },
  'foto': {
    imagePath: '/demo/bdlogo.svg',
    iconColor: null,
    textColor: '#4A6C85'
  },
  'ehic pas': {
    imagePath: '/demo/ehic-icon.svg',
    iconColor: null,
    textColor: '#00847c'
  }
};

// *** Event Listeners for Navigation ***
document.addEventListener('DOMContentLoaded', function() {
  // Welcome to PIN screen
  document.getElementById('next-welcome').addEventListener('click', function() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('pin-inlog-screen').style.display = 'flex';
  });

  // PIN login to wallet screen
  document.getElementById('submit-pin').addEventListener('click', function() {
    document.getElementById('pin-inlog-screen').style.display = 'none';
    document.getElementById('wallet-screen').style.display = 'block';
    document.querySelector('.bottom-nav').style.display = 'flex'; // Show bottom nav after login
    
    // Load and display credentials
    loadCredentials();
    loadDefaultCredentials();
    saveCredentials();
    displayCredentials();
  });

  // Direct access to main screen with #main hash
  if (window.location.hash === '#main') {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('pin-inlog-screen').style.display = 'none';
    document.getElementById('wallet-screen').style.display = 'block';
    document.querySelector('.bottom-nav').style.display = 'flex';
    
    loadCredentials();
    loadDefaultCredentials();
    saveCredentials();
    displayCredentials();
  }
  
  // Overview navbar item click
  document.getElementById('overview-navbar-item').addEventListener('click', () => {
    document.getElementById('activities-section').style.display = 'none';
    document.getElementById('wallet-screen').style.display = 'block';
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.getElementById('overview-navbar-item').classList.add('active');
  });

  // Activities navbar item click
  document.getElementById('activities-navbar-item').addEventListener('click', () => {
    document.getElementById('wallet-screen').style.display = 'none';
    document.getElementById('activities-section').style.display = 'flex';
    
    showActivities();
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.getElementById('activities-navbar-item').classList.add('active');
  });

  // Open current cards (my digital proofs)
  document.getElementById('open-current-cards').addEventListener('click', function() {
    document.getElementById('current-cards').style.display = 'flex';
    document.getElementById('wallet-screen').style.display = 'none';
    document.querySelector('.bottom-nav').style.display = 'none';
    
    displayCredentials();
  });

  // Close current cards
  document.getElementById('close-current-cards').addEventListener('click', function() {
    document.getElementById('current-cards').style.display = 'none';
    document.getElementById('wallet-screen').style.display = 'block';
    document.querySelector('.bottom-nav').style.display = 'flex';
  });

  // Close details view
  document.getElementById('close-details').addEventListener('click', function() {
    document.getElementById('details').style.display = 'none';
    document.getElementById('current-cards').style.display = 'flex';
  });

  // Back button from activities
  document.getElementById('back-activities-btn').addEventListener('click', function() {
    document.getElementById('activities-section').style.display = 'none';
    document.getElementById('wallet-screen').style.display = 'block';
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.getElementById('overview-navbar-item').classList.add('active');
  });

  // QR scanning
  document.getElementById('qr-scan-button').addEventListener('click', () => {
    document.getElementById('wallet-screen').style.display = 'none';
    document.querySelector('.bottom-nav').style.display = 'none';
    document.getElementById('add-card-screen').style.display = 'flex';
    startQrScan();
  });

  document.getElementById('scan-button').addEventListener('click', () => {
    startQrScan();
  });

  document.getElementById('close-scan-button').addEventListener('click', () => {
    if (html5QrCode) {
      html5QrCode.stop().then(() => {
        document.getElementById('reader').style.display = 'none';
        document.getElementById('close-scan-button').style.display = 'none';
        document.querySelector('.scan-container').style.display = 'flex';
      }).catch(err => {
        console.error("Failed to stop scanning: ", err);
      });
    }
  });
  
  // RDFCV modal buttons
  document.getElementById('rdfcv-stop-button').addEventListener('click', () => {
    document.getElementById('rdfcv-modal').style.display = 'none';
    document.getElementById('add-card-screen').style.display = 'none';
    document.getElementById('wallet-screen').style.display = 'block';
    document.querySelector('.bottom-nav').style.display = 'flex';
    resetQrScanner();
  });

  document.getElementById('rdfcv-accept-button').addEventListener('click', () => {
    document.getElementById('rdfcv-modal').style.display = 'none';
    document.getElementById('pin-confirmation-screen-verifier').style.display = 'flex';
    resetPinInputs();
  });

  // Verifier success screen buttons
  document.getElementById('see-activity-btn').addEventListener('click', () => {
    document.getElementById('verifier-success-screen').style.display = 'none';
    document.getElementById('add-card-screen').style.display = 'none';
    document.getElementById('wallet-screen').style.display = 'none';
    document.querySelector('.bottom-nav').style.display = 'flex';
    document.getElementById('activities-section').style.display = 'block';
    
    showActivities();
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.getElementById('activities-navbar-item').classList.add('active');
  });

  document.getElementById('close-success-btn').addEventListener('click', () => {
    document.getElementById('verifier-success-screen').style.display = 'none';
    document.getElementById('add-card-screen').style.display = 'none';
    document.getElementById('wallet-screen').style.display = 'block';
    document.querySelector('.bottom-nav').style.display = 'flex';
    isSharingActionInProgress = false;
  });

  // Pin verification
  document.getElementById('confirm-pin-verifier').addEventListener('click', () => {
    const timestamp = new Date().toLocaleString();
    
    if (window.currentRdfcvData) {
      saveSharedData(window.currentRdfcvData, timestamp);
      goToVerifierSuccessScreen(window.currentRdfcvData);
    } else {
      console.error("No RDFCV data available to save.");
    }
    
    document.getElementById('pin-confirmation-screen-verifier').style.display = 'none';
    resetPinInputs();
  });

  // PIN input functionality - CORRECT VERSION with proper closure
  const pinInputs = document.querySelectorAll('.pin-box');
  pinInputs.forEach((box, index) => {
    box.addEventListener('input', (e) => {
      if (e.target.value.length === 1 && index < pinInputs.length - 1) {
        pinInputs[index + 1].focus();
      }
    });
  });
});


// Voeg de event listener toe voor het klikken op de overzicht-knop in de navbar
overviewNavbarItem.addEventListener('click', () => {
  // Verberg het activiteiten-scherm, machtiging-sectie en instellingen-sectie
  activitiesSection.style.display = 'none';
  document.getElementById('machtiging-section').style.display = 'none';
  instellingenSection.style.display = 'none'; // Verberg instellingen-sectie

  // Toon het wallet-overzichtsscherm
  document.getElementById('wallet-screen').style.display = 'block';

  // Zorg ervoor dat de andere navbar-items niet meer actief zijn
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  // Zet het overzicht-item actief in de navbar
  overviewNavbarItem.classList.add('active');
});

// Voeg de event listener toe voor het klikken op de activiteiten-knop in de navbar
activitiesNavbarItem.addEventListener('click', () => {
  // Verberg alle andere secties
  document.getElementById('wallet-screen').style.display = 'none';
  document.getElementById('machtiging-section').style.display = 'none'; // Verberg machtigingen-sectie
  instellingenSection.style.display = 'none'; // Verberg instellingen-sectie

  // Toon het activiteiten-scherm
  activitiesSection.style.display = 'flex';

  // Haal de activiteiten op en toon ze
  showActivities();

  // Zorg ervoor dat de andere navbar-items niet meer actief zijn
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  // Zet het activiteiten-item actief in de navbar
  activitiesNavbarItem.classList.add('active');
});

// *** Core Functions ***

// Function to load credentials from storage
function loadCredentials() {
  const storedCredentials = sessionStorage.getItem('credentials');
  if (storedCredentials) {
    credentials = JSON.parse(storedCredentials);
  }
}

// Function to save credentials to storage
function saveCredentials() {
  sessionStorage.setItem('credentials', JSON.stringify(credentials));
}

// Function to load default credentials
function loadDefaultCredentials() {
  const defaultCards = [
    {
      name: 'Persoonlijke data',
      issuedBy: 'Nederlandse overheid',
      isShareAction: false,
      data: {
        'Voornaam': 'Willeke Liselotte',
        'Voorletter(s)': 'W. L.',
        'Achternaam': 'De Bruijn',
        'Geboortedatum': '10-03-1980',
        'Geboorteplaats': 'Delft',
        'Geboorteland': 'Nederland',
        'Geslacht': 'Vrouw',
        'Burgerservicenummer (BSN)': '999999990',
        'Nationaliteit': 'Nederlands',
        'Geldigheid paspoort': '17 juli 2034',
        'Ouder dan 18': 'Ja'
      }
    },
    {
      name: 'Woonadres',
      issuedBy: 'Nederlandse overheid',
      isShareAction: false,
      data: {
        'Straat': 'Wilhelmina van Pruisenweg',
        'Huisnummer': '52',
        'Postcode': '2595 AN',
        'Woonplaats': 'Den Haag'
      }
    },
    {
      name: 'Foto',
      issuedBy: 'Nederlandse overheid',
      isShareAction: false,
      data: {
        'Foto': 'images/pasfoto.png',
        'Lengte': '1,70 m'
      }
    },
    
  ];

  defaultCards.forEach(defaultCard => {
    const index = credentials.findIndex(cred => cred.name === defaultCard.name);
    if (index !== -1) {
      credentials[index] = defaultCard;
    } else {
      credentials.push(defaultCard);
    }
  });
}

// Function to display credentials in the wallet
function displayCredentials() {
  const walletGrid = document.getElementById('wallet-grid');
  walletGrid.innerHTML = '';

  credentials.forEach((cred, index) => {
    if (cred.isShareAction || cred.isActivity) {
      return; // Skip share actions and activities
    }

    if (typeof cred.name !== 'string') {
      return;
    }

    // Special case for EHIC card
    if (cred.name.toLowerCase() === 'ehic pas') {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.backgroundImage = "url('../base/images/ehic-front.png')";
      card.style.backgroundSize = 'cover';
      card.style.backgroundPosition = 'center';

      card.addEventListener('click', () => showEhicDetails(cred, index));
      walletGrid.appendChild(card);
      return;
    }

    const card = document.createElement('div');
    card.className = 'card';

    // Get styles based on card name
    const nameLower = cred.name.toLowerCase();
    const styles = cardStyles[nameLower] || {
      iconClass: 'far fa-id-badge',
      iconColor: '#333',
      textColor: '#333'
    };

    // Define size and margins
    const iconSize = '30px';
    const textSize = '18px';
    const issuerTextSize = '14px';
    const iconMarginBottom = '10px';

    // Check if an image path is specified instead of an icon
    let iconHtml = '';
    if (styles.imagePath) {
      iconHtml = `<img src="${styles.imagePath}" alt="${cred.name} logo" style="width: ${iconSize}; height: ${iconSize}; margin-bottom: ${iconMarginBottom};">`;
    } else {
      iconHtml = `<i class="${styles.iconClass}" style="color: ${styles.iconColor}; font-size: ${iconSize}; margin-bottom: ${iconMarginBottom};"></i>`;
    }

    // Add issuer information
    let issuerText = '';
    const issuedByOnBehalf = cred.data?.["Uitgegeven namens"] || null;
    const issuedByDirect = cred.issuedBy || cred.data?.["Uitgegeven door"] || null;

    if (issuedByOnBehalf) {
      issuerText = `<p style="font-size: ${issuerTextSize}; color: #555; margin: 5px 0 0 0;">
        ${issuedByOnBehalf}
      </p>`;
    } else if (issuedByDirect) {
      issuerText = `<p style="font-size: ${issuerTextSize}; color: #555; margin: 5px 0 0 0;">
        ${issuedByDirect}
      </p>`;
    }

    // Add HTML for the card
    card.innerHTML = `
      ${iconHtml}
      <div class="card-text" style="font-size: ${textSize};">
        <h3 style="color: ${styles.textColor}; margin: 0;">${cred.name}</h3>
        ${issuerText}
      </div>
    `;

    // Add event listener for viewing card details
    card.addEventListener('click', () => showDetails(cred, index));

    // Add the card to the wallet grid
    walletGrid.appendChild(card);
  });
}

// Function to show EHIC card details
// function to show EHIC card details
function showEhicDetails(credential, index) {
  // Hide the wallet screen and navbar
  document.getElementById('wallet-screen').style.display = 'none';
  currentCardsSection.style.display = 'none';  
  bottomNav.style.display = 'none';

  // Create a custom details view for the EHIC card
  const detailsView = document.createElement('div');
  detailsView.id = 'ehic-details-view';
  detailsView.style.position = 'fixed';
  detailsView.style.top = '0';
  detailsView.style.left = '50%';
  detailsView.style.transform = 'translateX(-50%)';
  detailsView.style.width = '100%';
  detailsView.style.maxWidth = '400px';
  detailsView.style.height = '100%';
  detailsView.style.backgroundColor = 'white';
  detailsView.style.zIndex = '1000';
  detailsView.style.padding = '0px 20px 0px 15px';
  detailsView.style.boxSizing = 'border-box';
  detailsView.style.overflowY = 'auto';
  detailsView.style.display = 'flex';
  detailsView.style.flexDirection = 'column';

  // Create the header with back button
  const header = document.createElement('div');
  header.className = 'details-header';
  header.style.position = 'relative';
  header.style.marginBottom = '50px';

  const backButton = document.createElement('button');
  backButton.className = 'close-btn';
  backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
  backButton.style.background = 'none';
  backButton.style.border = 'none';
  backButton.style.fontSize = '24px';
  backButton.style.color = '#4a90e2';
  backButton.style.cursor = 'pointer';
  backButton.style.position = 'absolute';
  backButton.style.left = '0';
  backButton.style.top = '0';

  // Add event listener to the back button
  backButton.addEventListener('click', () => {
      document.body.removeChild(detailsView);
      currentCardsSection.style.display = 'flex';
  });

  header.appendChild(backButton);
  detailsView.appendChild(header);

  // Add title
  const title = document.createElement('h2');
  title.textContent = 'Europese zorgpas';
  title.style.textAlign = 'center';
  title.style.color = '#00847c';
  title.style.marginBottom = '15px';
  detailsView.appendChild(title);

  // Add issuer
  const issuer = document.createElement('p');
  issuer.innerHTML = `Uitgegeven door: <span style="font-weight: bold; color: #00847c;">${credential.issuedBy}</span>`;
  issuer.style.textAlign = 'center';
  issuer.style.color = '#555';
  issuer.style.marginBottom = '20px';
  issuer.style.fontSize = '14px';
  detailsView.appendChild(issuer);

  // Add divider
  const divider1 = document.createElement('div');
  divider1.className = 'divider';
  divider1.style.width = '100%';
  divider1.style.height = '1px';
  divider1.style.backgroundColor = 'lightgrey';
  divider1.style.margin = '10px 0';
  detailsView.appendChild(divider1);

  // Create the card container with flip functionality
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-flip-container';
  cardContainer.style.width = '100%';
  cardContainer.style.minHeight = '200px';
  cardContainer.style.perspective = '1000px';
  cardContainer.style.marginBottom = '20px';
  cardContainer.style.cursor = 'pointer';

  // Create the flip inner container
  const cardFlipInner = document.createElement('div');
  cardFlipInner.className = 'card-flip-inner';
  cardFlipInner.style.position = 'relative';
  cardFlipInner.style.width = '100%';
  cardFlipInner.style.height = '100%';
  cardFlipInner.style.textAlign = 'center';
  cardFlipInner.style.transition = 'transform 0.8s';
  cardFlipInner.style.transformStyle = 'preserve-3d';

  // Create the front of the card
  const cardFront = document.createElement('div');
  cardFront.className = 'card-front';
  cardFront.style.position = 'absolute';
  cardFront.style.width = '100%';
  cardFront.style.height = '100%';
  cardFront.style.backfaceVisibility = 'hidden';
  cardFront.style.border = 'none';
  cardFront.style.borderRadius = '10px';
  cardFront.style.padding = '10px';
  cardFront.style.boxSizing = 'border-box';
  cardFront.style.display = 'flex';
  cardFront.style.justifyContent = 'center';
  cardFront.style.alignItems = 'center';

  // Add the front image
  const frontImage = document.createElement('img');
  frontImage.src = '../base/images/ehic-front.png';
  frontImage.alt = 'EHIC Card Front';
  frontImage.style.maxWidth = '100%';
  frontImage.style.maxHeight = '100%';
  frontImage.style.borderRadius = '8px';
  cardFront.appendChild(frontImage);

  // Create the back of the card
  const cardBack = document.createElement('div');
  cardBack.className = 'card-back';
  cardBack.style.position = 'absolute';
  cardBack.style.width = '100%';
  cardBack.style.height = '100%';
  cardBack.style.backfaceVisibility = 'hidden';
  cardBack.style.transform = 'rotateY(180deg)';
  cardBack.style.border = 'none';
  cardBack.style.borderRadius = '10px';
  cardBack.style.padding = '10px';
  cardBack.style.boxSizing = 'border-box';
  cardBack.style.display = 'flex';
  cardBack.style.justifyContent = 'center';
  cardBack.style.alignItems = 'center';

  // Add the back image
  const backImage = document.createElement('img');
  backImage.src = '../base/images/ehic-back.png';
  backImage.alt = 'EHIC Card Back';
  backImage.style.maxWidth = '100%';
  backImage.style.maxHeight = '100%';
  backImage.style.borderRadius = '8px';
  cardBack.appendChild(backImage);

  // Add the front and back to the flip inner container
  cardFlipInner.appendChild(cardFront);
  cardFlipInner.appendChild(cardBack);
  cardContainer.appendChild(cardFlipInner);
  detailsView.appendChild(cardContainer);

  // Add click event to flip the card
  cardContainer.addEventListener('click', () => {
      if (cardFlipInner.style.transform === 'rotateY(180deg)') {
          cardFlipInner.style.transform = 'rotateY(0deg)';
      } else {
          cardFlipInner.style.transform = 'rotateY(180deg)';
      }
  });

  // Add instructions
  const flipInstruction = document.createElement('p');
  flipInstruction.textContent = 'Klik op de kaart om deze om te draaien';
  flipInstruction.style.textAlign = 'center';
  flipInstruction.style.color = '#777';
  flipInstruction.style.fontSize = '14px';
  flipInstruction.style.marginBottom = '20px';
  detailsView.appendChild(flipInstruction);

  // Add another divider
  const divider2 = document.createElement('div');
  divider2.className = 'divider';
  divider2.style.width = '100%';
  divider2.style.height = '1px';
  divider2.style.backgroundColor = 'lightgrey';
  divider2.style.margin = '10px 0';
  detailsView.appendChild(divider2);

  // Create an accordion for technical details
  const accordion = document.createElement('div');
  accordion.className = 'accordion';
  accordion.style.width = '100%';
  accordion.style.marginBottom = '20px';

  // Create the accordion button
  const accordionBtn = document.createElement('button');
  accordionBtn.className = 'accordion-btn';
  accordionBtn.textContent = 'Technische gegevens';
  accordionBtn.style.backgroundColor = '#eee';
  accordionBtn.style.color = '#444';
  accordionBtn.style.cursor = 'pointer';
  accordionBtn.style.padding = '12px';
  accordionBtn.style.width = '100%';
  accordionBtn.style.textAlign = 'left';
  accordionBtn.style.border = 'none';
  accordionBtn.style.outline = 'none';
  accordionBtn.style.fontSize = '16px';
  accordionBtn.style.transition = '0.4s';
  accordionBtn.style.borderRadius = '5px';
  accordionBtn.style.position = 'relative';

  // Add a plus/minus indicator
  const indicator = document.createElement('span');
  indicator.innerHTML = '+';
  indicator.style.position = 'absolute';
  indicator.style.right = '15px';
  indicator.style.fontSize = '20px';
  accordionBtn.appendChild(indicator);

  // Create the accordion panel
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.style.padding = '0 8px';
  panel.style.backgroundColor = '#f9f9f9';
  panel.style.maxHeight = '0';
  panel.style.overflow = 'hidden';
  panel.style.transition = 'max-height 0.2s ease-out';
  panel.style.borderRadius = '0 0 5px 5px';
  panel.style.width = '100%';
  panel.style.fontSize = 'small';

  // Add technical details content
  const details = document.createElement('div');
  details.style.padding = '10px 0';

  // Include all data fields, only exclude a few specific ones
  const excludedKeys = ['rdfci', 'isShareAction', 'actionTimestamp'];

  // Add all data fields to the technical details
  // First add the top-level properties (name, issuedBy, LEID)
  const addDetailRow = (key, value) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.marginBottom = '8px';
      row.style.flexWrap = 'wrap';

      const label = document.createElement('div');
      label.style.fontWeight = 'bold';
      label.style.width = '45%';
      label.style.padding = '0 5px 0 0';
      label.style.wordWrap = 'break-word';
      label.style.overflowWrap = 'break-word';
      label.textContent = key + ':';

      const valueElement = document.createElement('div');
      valueElement.style.width = '55%';
      valueElement.style.wordWrap = 'break-word';
      valueElement.style.overflowWrap = 'break-word';
      valueElement.textContent = value;

      row.appendChild(label);
      row.appendChild(valueElement);
      details.appendChild(row);
  };

  // Add top-level properties first
  if (credential.name) addDetailRow('name', credential.name);
  if (credential.issuedBy) addDetailRow('issuedBy', credential.issuedBy);
  if (credential.LEID) addDetailRow('LEID', credential.LEID);
  
  // Then add all data properties
  for (let key in credential.data) {
      if (!excludedKeys.includes(key)) {
          addDetailRow(key, credential.data[key]);
      }
  }

  panel.appendChild(details);

  // Add accordion toggle functionality
  accordionBtn.addEventListener('click', function() {
      this.classList.toggle('active');

      if (panel.style.maxHeight && panel.style.maxHeight !== '0px') {
          panel.style.maxHeight = '0';
          indicator.innerHTML = '+';
      } else {
          panel.style.maxHeight = panel.scrollHeight + 200 + 'px';
          indicator.innerHTML = '-';
      }
  });

  accordion.appendChild(accordionBtn);
  accordion.appendChild(panel);
  detailsView.appendChild(accordion);

  // Add the details view to the document body
  document.body.appendChild(detailsView);
}



// Function to show card details
function showDetails(credential, index) {
  document.getElementById('wallet-screen').style.display = 'none';
  document.getElementById('current-cards').style.display = 'none';
  document.querySelector('.bottom-nav').style.display = 'none';

  const detailsView = document.getElementById('details');
  detailsView.style.display = 'block';

  document.getElementById('details-title').textContent = credential.name;
  const detailsContent = document.getElementById('details-content');
  detailsContent.innerHTML = '';

  if (credential.name === 'Foto') {
    detailsContent.innerHTML += `<img src="${credential.data['Foto']}" alt="Pasfoto" style="width: 100%; max-width: 300px; height: auto; margin-bottom: 20px;">`;
    detailsContent.innerHTML += `<div class="details-row">
                                <div class="details-label">Lengte:</div>
                                <div class="details-value">${credential.data['Lengte']}</div>
                              </div>`;
  } else if (credential.data) {
    for (const key in credential.data) {
      if (credential.data.hasOwnProperty(key)) {
        detailsContent.innerHTML += `
          <div class="details-row">
            <div class="details-label">${key}:</div>
            <div class="details-value">${credential.data[key]}</div>
          </div>`;
      }
    }
  } else {
    detailsContent.innerHTML = '<p>Geen details beschikbaar.</p>';
  }

  // Set up the close button
  document.getElementById('close-details').onclick = () => {
    detailsView.style.display = 'none';
    document.getElementById('current-cards').style.display = 'flex';
  };

  // Set up delete button - only show for non-default cards
  const deleteBtn = document.getElementById('delete-details');
  if (credential.name !== 'Persoonlijke data' && credential.name !== 'Woonadres' && credential.name !== 'Foto') {
    deleteBtn.style.display = 'block';
    deleteBtn.onclick = () => {
      credentials.splice(index, 1);
      saveCredentials();
      displayCredentials();
      detailsView.style.display = 'none';
      document.getElementById('current-cards').style.display = 'flex';
    };
  } else {
    deleteBtn.style.display = 'none';
  }
}

// Function to convert date format
function convertToStandardDate(dateString) {
  if (!dateString) return '';
  let [datePart, timePart] = dateString.split(', ');
  let [day, month, year] = datePart.split('-').map(part => part.padStart(2, '0'));
  return `${year}-${month}-${day}T${timePart}`;
}

// Function to show activities
function showActivities() {
  const activitiesList = document.getElementById('activities-list');
  activitiesList.innerHTML = '';

  // Filter credentials for activities
  const filteredActivities = credentials.filter(cred => {
    if (!cred.actionTimestamp) return false;
    if (cred.isShareAction || cred.isActivity) return true;
    return false;
  });

  // Sort activities by date (most recent first)
  filteredActivities.sort((a, b) => {
    let dateA = Date.parse(convertToStandardDate(a.actionTimestamp));
    let dateB = Date.parse(convertToStandardDate(b.actionTimestamp));
    return dateB - dateA;
  });

  // Add activities to the list
  filteredActivities.forEach((cred) => {
    let activityItem = document.createElement('li');

    if (cred.isShareAction) {
      activityItem.innerHTML = `
        <strong style="color: #152A62;">${cred.name}</strong><br>
        <span style="color: #152A62;">Gegevens gedeeld</span><br>
        <span style="color: #152A62;">${cred.actionTimestamp}</span>
      `;
    } else if (cred.isActivity) {
      activityItem.innerHTML = `
        <strong style="color: #152A62;">Activiteit: ${cred.name}</strong><br>
        <span style="color: #152A62;">${cred.actionTimestamp}</span>
      `;
    }

    // Add a divider
    const divider = document.createElement('div');
    divider.className = 'activity-divider';

    activitiesList.appendChild(activityItem);
    activitiesList.appendChild(divider);
  });
}

// *** QR Scanner Functions ***




// Function to start QR scan
function startQrScan() {
  document.querySelector('.scan-container').style.display = 'none';
  document.getElementById('close-scan-button').style.display = 'block';
  document.getElementById('reader').style.display = 'block';

  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("reader");
  }

  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    onScanSuccess,
    onScanError
  );
}

// Event listener voor een post message in de presentatiemodus
window.addEventListener("message", function(event) {
  // event.data = object dat verstuurd is, bijvoorbeeld { action: 'simulateScan', qrData: '...' }
  if (event.data.action === "simulateScan" && event.data.qrData) {
    simulateQrScan(event.data.qrData);
  }
});

// Simulatie van QR-code scannen
// ------------
//
function simulateQrScan(decodedText) {
  console.log("Simulating QR scan with:", decodedText);
  // Hetzelfde gedrag als een geslaagde scan:
  onScanSuccess(decodedText);
}


// Function called on successful QR scan
function onScanSuccess(decodedText) {
  console.log("QR code scanned: ", decodedText);

  // Check if the scanned text is an API URL
  const isApiUrl = decodedText.startsWith("http") && decodedText.includes("/api/data/");
  
  if (isApiUrl) {
    console.log("API URL detected. Fetching data...");
    fetchQrScandata(decodedText);
  } else {
    // Try to parse the text as JSON
    try {
      const data = JSON.parse(decodedText);
      const timestamp = new Date().toLocaleString();
      processScannedData(data, timestamp);
      stopScannerAndResetUI();
    } catch (error) {
      console.error("QR-code parse error: ", error);
    }
  }
}

// Function called on QR scan error
function onScanError(errorMessage) {
  console.error(`QR scan failed: ${errorMessage}`);
}

// Function to stop the scanner and reset UI
function stopScannerAndResetUI() {
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      document.getElementById('reader').style.display = 'none';
      document.getElementById('close-scan-button').style.display = 'none';
      document.querySelector('.scan-container').style.display = 'flex';
    }).catch(err => {
      console.error("Failed to stop scanning: ", err);
    });
  }
}

// Function to fetch QR scan data from API
function fetchQrScandata(apiUrl) {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      try {
        const timestamp = new Date().toLocaleString();
        processScannedData(data, timestamp);
        stopScannerAndResetUI();
      } catch (error) {
        console.error("Error processing scan data: ", error);
      }
    })
    .catch(error => {
      console.error("Error fetching data: ", error);
    });
}

// Function to process scanned data
function processScannedData(data, timestamp) {
  console.log("Processing scanned data: ", data, "Timestamp: ", timestamp);

  // Verifier QR-code verwerking
  if (data.type === "verifier" && data.rdfcv) {
    console.log("RDFCV QR-code herkend.");
    window.currentRdfcvData = data;

    if (data.requestedCard === "EHIC pas") {
      console.log("EHIC pas request gedetecteerd in verifier flow.");
      populateEhicRdfcvModal(data);
    } else {
      populateRdfcvModal(data);
      rdfcvModal.style.display = 'flex';
    }

  // Issuer QR-code verwerking (incl. EHIC pas)
  } else if (data.issuedBy && data.name) {
    console.log("Issuer QR-code herkend.");

    if (data.name === "EHIC pas") {
      console.log("EHIC pas QR-code herkend.");
      populateEhicCardModal(data);
      return; // belangrijk om verdere verwerking te voorkomen
    }

    // Hier voeg je verdere issuer-logic toe voor andere kaarten indien nodig:
    populateRdfciModal(data);

  } else {
    console.log("Onbekende QR-code structuur.");
  }
}


// Function to reset QR scanner
function resetQrScanner() {
  console.log("Resetting QR scanner...");

  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      console.log("QR scanner stopped.");
    }).catch(err => {
      console.error("Failed to stop scanning: ", err);
    });
  }
  
  document.getElementById('reader').style.display = 'none';
  document.getElementById('close-scan-button').style.display = 'none';
  document.querySelector('.scan-container').style.display = 'flex';
}

// Function to reset PIN inputs
function resetPinInputs() {
  const pinInputs = document.querySelectorAll('.pin-box');
  pinInputs.forEach((input) => {
    input.value = '';
  });
}

// Function to populate RDFCV modal
function populateRdfcvModal(data) {
  // Fill the reason
  document.getElementById('rdfcv-reason').innerText = data.reason || 'Geen reden opgegeven.';

  // Add the name of the verifier to the question
  document.getElementById('rdfcv-question-text').innerText = `Wilt u onderstaande gegevens delen met ${data.requester}?`;

  // Process the requested data
  const detailsContainer = document.getElementById('rdfcv-details-container');
  detailsContainer.innerHTML = '';

  // Group fields and show them in cards
  let fieldsByCard = {};

  data.rdfcv.forEach((field) => {
    const fieldName = fieldMapping[field] || field;

    // Check if the field belongs to a card in credentials
    let matchingCard = credentials.find(cred => {
      return cred.data && cred.data.hasOwnProperty(fieldName);
    });

    if (!matchingCard) {
      matchingCard = credentials.find(cred => cred.name === fieldName);
    }

    if (matchingCard) {
      const cardName = matchingCard.name;

      if (!fieldsByCard[cardName]) {
        fieldsByCard[cardName] = { data: matchingCard.data, fields: [], showAllFields: false };
      }

      if (matchingCard.name === fieldName) {
        fieldsByCard[cardName].showAllFields = true;
      } else {
        fieldsByCard[cardName].fields.push(fieldName);
      }
    } else {
      console.warn(`Field or card '${fieldName}' not found in credentials.`);
    }
  });

  // Iterate over each card and create card elements
  Object.keys(fieldsByCard).forEach((cardName) => {
    const cardInfo = fieldsByCard[cardName];

    // Create card container
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    // Create card header
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    cardHeader.textContent = cardName;

    // Set header background color based on card name
    switch (cardName) {
      case 'Persoonlijke data':
        cardHeader.style.backgroundColor = '#B9E4E2';
        break;
      case 'Woonadres':
        cardHeader.style.backgroundColor = '#b9e4e2';
        break;
      default:
        cardHeader.style.backgroundColor = '#445580';
    }

    // Create card content container
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    // Add header and content to card container
    cardContainer.appendChild(cardHeader);
    cardContainer.appendChild(cardContent);

    // Create card title
    const cardTitleElement = document.createElement('div');
    cardTitleElement.className = 'card-title';
    cardTitleElement.textContent = cardName;
    cardContent.appendChild(cardTitleElement);

    // Create card details
    const cardDetails = document.createElement('div');
    cardDetails.className = 'card-details';

    if (cardInfo.showAllFields) {
      // Add all card details from cred.data
      for (let key in cardInfo.data) {
        if (cardInfo.data.hasOwnProperty(key)) {
          const detailRow = document.createElement('div');
          detailRow.className = 'detail-row';

          const labelDiv = document.createElement('div');
          labelDiv.className = 'label';
          labelDiv.textContent = `${key}:`;

          const valueDiv = document.createElement('div');
          valueDiv.className = 'value';

          const value = cardInfo.data[key];

          if (key === 'Foto') {
            // If the field is 'Foto', add the image
            const img = document.createElement('img');
            img.src = value;
            img.alt = 'Foto';
            img.style.width = '100%';
            valueDiv.appendChild(img);
          } else {
            // For other fields, show text value
            valueDiv.textContent = value || 'Niet beschikbaar';
          }

          detailRow.appendChild(labelDiv);
          detailRow.appendChild(valueDiv);
          cardDetails.appendChild(detailRow);
        }
      }
    } else {
      // Add only the specific requested fields
      cardInfo.fields.forEach(fieldName => {
        const value = cardInfo.data[fieldName];

        const detailRow = document.createElement('div');
        detailRow.className = 'detail-row';

        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.textContent = `${fieldName}:`;

        const valueDiv = document.createElement('div');
        valueDiv.className = 'value';
        
        if (fieldName === 'Foto') {
          // If the field is 'Foto', add the image
          const img = document.createElement('img');
          img.src = value;
          img.alt = 'Foto';
          img.style.width = '100%';
          valueDiv.appendChild(img);
        } else {
          // For other fields, show text value
          valueDiv.textContent = value || 'Niet beschikbaar';
        }

        detailRow.appendChild(labelDiv);
        detailRow.appendChild(valueDiv);
        cardDetails.appendChild(detailRow);
      });
    }

    cardContent.appendChild(cardDetails);
    detailsContainer.appendChild(cardContainer);
  });

  // Process agreement information
  if (data.a) {
    const agreementText = fieldMapping.a[data.a] || data.a;
    document.getElementById('rdfcv-agreement').innerText = agreementText;
  } else {
    document.getElementById('rdfcv-agreement').innerText = 'Geen overeenkomst gevonden.';
  }
}

// Functie om gegevens op te slaan in localStorage zonder een kaartje toe te voegen
function saveSharedData(data) {
  const timestamp = new Date().toLocaleString();
  credentials.push({
      name: data.requester || 'Onbekende partij',
      reason: data.reason || 'Geen reden opgegeven',
      sharedData: data.rdfcv.map(field => fieldMapping[field] || field),
      agreement: data.a ? data.a.split(', ').map(agreement => fieldMapping.a[agreement] || agreement) : [],
      actionTimestamp: timestamp,
      isShareAction: true // Markeer als deelactie
  });
  saveCredentials();
}


function populateEhicRdfcvModal(data) {
  console.log("Displaying EHIC card sharing modal with data:", data);
  
  // Zoek de EHIC kaart in de credentials
  const ehicCard = credentials.find(cred => cred.name === 'EHIC pas');
  if (!ehicCard) {
    console.error("EHIC kaart niet gevonden in credentials");
    // Gebruik de standaard RDFCV modal als fallback
    populateRdfcvModal({...data, requestedCard: ''});
    return;
  }
  
  // Verberg alle andere schermen
  addCardScreen.style.display = 'none';
  
  // Maak een custom modal voor EHIC card delen
  const ehic = document.createElement('div');
  ehic.id = 'ehic-share-modal';
  ehic.className = 'modal';
  
  // Maak het modal volledig schermvullend
  ehic.style.display = 'flex';
  ehic.style.position = 'fixed';
  ehic.style.top = '0';
  ehic.style.left = '0';
  ehic.style.width = '100%';
  ehic.style.height = '100%';
  ehic.style.backgroundColor = 'white';
  ehic.style.zIndex = '1000';
  ehic.style.flexDirection = 'column';
  ehic.style.alignItems = 'center';
  ehic.style.justifyContent = 'flex-start';
  ehic.style.padding = '0px';
  ehic.style.boxSizing = 'border-box';
  ehic.style.overflowY = 'auto';
  
  // Maak de modal inhoud
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.padding = '5px';
  modalContent.style.width = '100%';
  modalContent.style.maxWidth = '400px';
  modalContent.style.backgroundColor = 'white';
  modalContent.style.display = 'flex';
  modalContent.style.flexDirection = 'column';
  
  // Maak de titel voor de modal met de vraag
  const title = document.createElement('h3');
  title.textContent = "Wilt u onderstaande gegevens delen?";
  title.style.textAlign = 'center'; // Gecentreerd, zoals gevraagd
  title.style.color = '#000000'; // Zwarte tekst
  title.style.marginBottom = '15px';
  
  // Voeg een scheidingslijn toe
  const divider1 = document.createElement('div');
  divider1.className = 'divider';
  divider1.style.width = '100%';
  divider1.style.height = '1px';
  divider1.style.backgroundColor = 'lightgrey';
  divider1.style.margin = '10px 0';
  
  // Voeg title toe voor kaart sectie
  const cardTitle = document.createElement('p');
  cardTitle.innerHTML = '<strong>Europese zorgpas</strong>';
  cardTitle.style.textAlign = 'center'; // Gecentreerd, zoals gevraagd
  cardTitle.style.color = '#00847c';
  cardTitle.style.marginBottom = '10px';
  
  // Maak de container voor de flipbare kaart
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-flip-container';
  cardContainer.style.width = '100%';
  cardContainer.style.height = '200px';
  cardContainer.style.perspective = '1000px';
  cardContainer.style.marginBottom = '20px';
  cardContainer.style.cursor = 'pointer';
  
  // Maak de inner container voor de flipbare kaart
  const cardFlipInner = document.createElement('div');
  cardFlipInner.className = 'card-flip-inner';
  cardFlipInner.style.position = 'relative';
  cardFlipInner.style.width = '100%';
  cardFlipInner.style.height = '100%';
  cardFlipInner.style.textAlign = 'center';
  cardFlipInner.style.transition = 'transform 0.8s';
  cardFlipInner.style.transformStyle = 'preserve-3d';
  
  // Maak de voorkant van de kaart
  const cardFront = document.createElement('div');
  cardFront.className = 'card-front';
  cardFront.style.position = 'absolute';
  cardFront.style.width = '100%';
  cardFront.style.height = '100%';
  cardFront.style.backfaceVisibility = 'hidden';
  cardFront.style.border = 'none';
  cardFront.style.borderRadius = '10px';
  cardFront.style.padding = '10px';
  cardFront.style.boxSizing = 'border-box';
  cardFront.style.display = 'flex';
  cardFront.style.justifyContent = 'center';
  cardFront.style.alignItems = 'center';
  
  // Voeg de afbeelding voor de voorkant toe
  const frontImage = document.createElement('img');
  frontImage.src = '../base/images/ehic-front.png';
  frontImage.alt = 'EHIC Card Front';
  frontImage.style.maxWidth = '100%';
  frontImage.style.maxHeight = '100%';
  frontImage.style.borderRadius = '8px';
  cardFront.appendChild(frontImage);
  
  // Maak de achterkant van de kaart
  const cardBack = document.createElement('div');
  cardBack.className = 'card-back';
  cardBack.style.position = 'absolute';
  cardBack.style.width = '100%';
  cardBack.style.height = '100%';
  cardBack.style.backfaceVisibility = 'hidden';
  cardBack.style.transform = 'rotateY(180deg)';
  cardBack.style.border = 'none';
  cardBack.style.borderRadius = '10px';
  cardBack.style.padding = '10px';
  cardBack.style.boxSizing = 'border-box';
  cardBack.style.display = 'flex';
  cardBack.style.justifyContent = 'center';
  cardBack.style.alignItems = 'center';
  
  // Voeg de afbeelding voor de achterkant toe
  const backImage = document.createElement('img');
  backImage.src = '../base/images/ehic-back.png';
  backImage.alt = 'EHIC Card Back';
  backImage.style.maxWidth = '100%';
  backImage.style.maxHeight = '100%';
  backImage.style.borderRadius = '8px';
  cardBack.appendChild(backImage);
  
  // Voeg klikgebeurtenis toe om de kaart te draaien
  cardContainer.addEventListener('click', () => {
    if (cardFlipInner.style.transform === 'rotateY(180deg)') {
      cardFlipInner.style.transform = 'rotateY(0deg)';
    } else {
      cardFlipInner.style.transform = 'rotateY(180deg)';
    }
  });
  
  // Voeg instructies toe
  const flipInstruction = document.createElement('p');
  flipInstruction.textContent = 'Klik op de kaart om deze om te draaien';
  flipInstruction.style.textAlign = 'center';
  flipInstruction.style.color = '#777';
  flipInstruction.style.fontSize = '14px';
  flipInstruction.style.marginBottom = '20px';
  
  // Voeg een scheidingslijn toe
  const divider2 = document.createElement('div');
  divider2.className = 'divider';
  divider2.style.width = '100%';
  divider2.style.height = '1px';
  divider2.style.backgroundColor = 'lightgrey';
  divider2.style.margin = '10px 0';
  
  // Maak een accordion voor technische details
  const accordion = document.createElement('div');
  accordion.className = 'accordion';
  accordion.style.width = '100%';
  accordion.style.marginBottom = '20px';
  
  // Maak de accordion-knop
  const accordionBtn = document.createElement('button');
  accordionBtn.className = 'accordion-btn';
  accordionBtn.textContent = 'Technische gegevens';
  accordionBtn.style.backgroundColor = '#eee';
  accordionBtn.style.color = '#444';
  accordionBtn.style.cursor = 'pointer';
  accordionBtn.style.padding = '12px';
  accordionBtn.style.width = '100%';
  accordionBtn.style.textAlign = 'left';
  accordionBtn.style.border = 'none';
  accordionBtn.style.outline = 'none';
  accordionBtn.style.fontSize = '16px';
  accordionBtn.style.transition = '0.4s';
  accordionBtn.style.borderRadius = '5px';
  accordionBtn.style.position = 'relative';
  
  // Voeg een plus/min indicator toe
  const indicator = document.createElement('span');
  indicator.innerHTML = '+';
  indicator.style.position = 'absolute';
  indicator.style.right = '15px';
  indicator.style.fontSize = '20px';
  accordionBtn.appendChild(indicator);
  
  // Maak het accordion paneel
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.style.padding = '0 8px';
  panel.style.backgroundColor = '#f9f9f9';
  panel.style.maxHeight = '0';
  panel.style.overflow = 'hidden';
  panel.style.transition = 'max-height 0.2s ease-out';
  panel.style.borderRadius = '0 0 5px 5px';
  panel.style.width = '100%';
  
// Voeg technische details inhoud toe
const details = document.createElement('div');
details.style.padding = '10px 0';

// Maak een object met alle te tonen velden
const displayData = {
  'name': ehicCard.name || 'Niet beschikbaar',
  'issuedBy': ehicCard.issuedBy || 'Niet beschikbaar',
  'LEID': ehicCard.LEID || 'Niet beschikbaar'
};

// Voeg alle velden uit de data property toe
if (ehicCard.data) {
  for (let key in ehicCard.data) {
    displayData[key] = ehicCard.data[key];
  }
}

// Log voor debug doeleinden
console.log("DisplayData voor EHIC kaart:", displayData);

// Toon alle verzamelde velden
for (let key in displayData) {
  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.marginBottom = '8px';
  row.style.flexWrap = 'wrap';
  
  const label = document.createElement('div');
  label.style.fontWeight = 'bold';
  label.style.width = '45%';
  label.style.padding = '0 5px 0 0';
  label.style.wordWrap = 'break-word';
  label.style.overflowWrap = 'break-word';
  label.textContent = key + ':';
  
  const value = document.createElement('div');
  value.style.width = '55%';
  value.style.wordWrap = 'break-word';
  value.style.overflowWrap = 'break-word';
  value.textContent = displayData[key];
  
  row.appendChild(label);
  row.appendChild(value);
  details.appendChild(row);
}
  
  panel.appendChild(details);
  
  // Voeg accordion toggle functionaliteit toe
  accordionBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    
    if (panel.style.maxHeight && panel.style.maxHeight !== '0px') {
      panel.style.maxHeight = '0';
      indicator.innerHTML = '+';
    } else {
      panel.style.maxHeight = panel.scrollHeight + 200 + 'px';
      indicator.innerHTML = '-';
    }
  });
  
  // Voeg een scheidingslijn toe
  const divider3 = document.createElement('div');
  divider3.className = 'divider';
  divider3.style.width = '100%';
  divider3.style.height = '1px';
  divider3.style.backgroundColor = 'lightgrey';
  divider3.style.margin = '10px 0';
  
 // Vragende partij en reden (nu na technische details)
const dataContainer = document.createElement('div');
dataContainer.style.marginTop = '15px';
dataContainer.style.marginBottom = '15px';
dataContainer.style.color = '#000000'; // Zwarte kleur

// Rij voor vragende partij
const requesterRow = document.createElement('div');
requesterRow.style.display = 'flex';
requesterRow.style.alignItems = 'flex-start';
requesterRow.style.marginBottom = '5px';

const requesterLabel = document.createElement('div');
requesterLabel.innerHTML = '<strong>Vragende partij:</strong>';
requesterLabel.style.width = '150px'; // Vaste breedte voor labels
requesterLabel.style.color = '#000000';
requesterLabel.style.flexShrink = '0';

const requesterValue = document.createElement('div');
requesterValue.textContent = data.requester;
requesterValue.style.color = '#000000';

requesterRow.appendChild(requesterLabel);
requesterRow.appendChild(requesterValue);

// Rij voor reden
const reasonRow = document.createElement('div');
reasonRow.style.display = 'flex';
reasonRow.style.alignItems = 'flex-start';

const reasonLabel = document.createElement('div');
reasonLabel.innerHTML = '<strong>Reden:</strong>';
reasonLabel.style.width = '150px'; // Zelfde breedte als bovenstaande label
reasonLabel.style.color = '#000000';
reasonLabel.style.flexShrink = '0';

const reasonValue = document.createElement('div');
reasonValue.textContent = data.reason || 'Geen reden opgegeven';
reasonValue.style.color = '#000000';

reasonRow.appendChild(reasonLabel);
reasonRow.appendChild(reasonValue);

// Voeg beide rijen toe aan de dataContainer
dataContainer.appendChild(requesterRow);
dataContainer.appendChild(reasonRow);
  
  // Nog een scheidingslijn
  const divider4 = document.createElement('div');
  divider4.className = 'divider';
  divider4.style.width = '100%';
  divider4.style.height = '1px';
  divider4.style.backgroundColor = 'lightgrey';
  divider4.style.margin = '10px 0';
  
  // Overeenkomst sectie - nu in zwart
  const agreementTitle = document.createElement('p');
  agreementTitle.innerHTML = '<strong>Overeenkomst</strong>';
  agreementTitle.style.color = '#000000'; // Zwart in plaats van blauw
  
  const agreementText = document.createElement('p');
  if (data.a) {
    agreementText.textContent = fieldMapping.a[data.a] || data.a;
  } else {
    agreementText.textContent = 'Geen overeenkomst gevonden.';
  }
  agreementText.style.color = '#000000'; // Zwart in plaats van blauw
  agreementText.style.marginBottom = '20px';
  
  // Maak actieknoppen
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'space-between';
  buttonContainer.style.width = '100%';
  buttonContainer.style.marginTop = '20px';
  
  // Maak de annuleerknop
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Stoppen';
  cancelButton.className = 'stop-button';
  cancelButton.style.width = '48%';
  
  // Voeg klikgebeurtenis toe aan de annuleerknop
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(ehic);
    addCardScreen.style.display = 'none';
    walletScreen.style.display = 'block';
    bottomNav.style.display = 'flex';
    resetQrScanner();
  });
  
  // Maak de accepteerknop
  const acceptButton = document.createElement('button');
  acceptButton.textContent = 'Akkoord';
  acceptButton.className = 'share-button';
  acceptButton.style.width = '48%';
  
  // Voeg klikgebeurtenis toe aan de accepteerknop
  acceptButton.addEventListener('click', () => {
    document.body.removeChild(ehic);
    
    // Ga door naar pincode bevestiging
    goToPinConfirmationVerifier();
    
    // Event handler voor de pincode bevestiging
    confirmPinBtnVerifier.onclick = () => {
      const timestamp = new Date().toLocaleString();
      
      // Sla de EHIC delen actie op
      saveEhicSharedData(data, timestamp);
      
      // Ga naar het succes scherm
      goToEhicShareSuccessScreen(data.requester);
      
      pinConfirmationScreenVerifier.style.display = 'none';
      resetPinInputs();
    };
  });
  
  // Zet alle elementen in elkaar
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(acceptButton);
  
  cardFlipInner.appendChild(cardFront);
  cardFlipInner.appendChild(cardBack);
  
  cardContainer.appendChild(cardFlipInner);
  
  accordion.appendChild(accordionBtn);
  accordion.appendChild(panel);
  
  modalContent.appendChild(title);
  modalContent.appendChild(divider1);
  modalContent.appendChild(cardTitle);
  modalContent.appendChild(cardContainer);
  modalContent.appendChild(flipInstruction);
  modalContent.appendChild(divider2);
  modalContent.appendChild(accordion);
  modalContent.appendChild(divider3);
  modalContent.appendChild(dataContainer);
  modalContent.appendChild(divider4);
  modalContent.appendChild(agreementTitle);
  modalContent.appendChild(agreementText);
  modalContent.appendChild(buttonContainer);
  
  ehic.appendChild(modalContent);
  
  // Voeg de modal toe aan het document
  document.body.appendChild(ehic);
}

function saveEhicSharedData(data, timestamp) {
  credentials.push({
    name: data.requester || 'Onbekende partij',
    reason: data.reason || 'Geen reden opgegeven',
    sharedData: ["EHIC pas"],
    agreement: data.a ? (fieldMapping.a[data.a] || data.a) : 'Geen overeenkomst',
    actionTimestamp: timestamp,
    isShareAction: true
  });
  saveCredentials();
  console.log("EHIC delingsactie opgeslagen:", credentials);
}

function goToEhicShareSuccessScreen(verifierName) {
  // Maak een nieuw modal voor het succes scherm
  const ehicSuccess = document.createElement('div');
  ehicSuccess.id = 'ehic-share-success-screen';
  ehicSuccess.className = 'modal';
  
  // Maak het modal volledig schermvullend
  ehicSuccess.style.display = 'flex';
  ehicSuccess.style.position = 'fixed';
  ehicSuccess.style.top = '0';
  ehicSuccess.style.left = '0';
  ehicSuccess.style.width = '100%';
  ehicSuccess.style.height = '100%';
  ehicSuccess.style.backgroundColor = 'white';
  ehicSuccess.style.zIndex = '1000';
  ehicSuccess.style.flexDirection = 'column';
  ehicSuccess.style.alignItems = 'center';
  ehicSuccess.style.justifyContent = 'flex-start';
  ehicSuccess.style.padding = '0';
  ehicSuccess.style.boxSizing = 'border-box';
  ehicSuccess.style.overflowY = 'auto';
  
  // Maak de modal content container
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.backgroundColor = 'white';
  modalContent.style.padding = '5px';
  modalContent.style.width = '100%';
  modalContent.style.maxWidth = '400px';
  modalContent.style.display = 'flex';
  modalContent.style.flexDirection = 'column';
  modalContent.style.alignItems = 'center';
  modalContent.style.marginTop = '20px';
  
  // Succes titel
  const title = document.createElement('h2');
  title.textContent = 'Succes!';
  title.style.textAlign = 'center';
  title.style.color = '#152A62';
  title.style.marginBottom = '15px';
  
  // Scheidingslijn toevoegen
  const divider1 = document.createElement('div');
  divider1.className = 'divider';
  divider1.style.width = '100%';
  divider1.style.height = '1px';
  divider1.style.backgroundColor = 'lightgrey';
  divider1.style.margin = '10px 0 20px 0';
  
  // Container voor de tekst
  const textContainer = document.createElement('div');
  textContainer.style.textAlign = 'center';
  textContainer.style.marginBottom = '20px';
  textContainer.style.width = '100%';
  
  // Tekst over delen gegevens
  const shareText = document.createElement('p');
  shareText.textContent = `Je hebt de gegevens gedeeld met`;
  shareText.style.color = '#152A62';
  shareText.style.fontSize = '16px';
  shareText.style.marginBottom = '10px';
  
  // Verifier naam
  const verifierNameElement = document.createElement('p');
  verifierNameElement.innerHTML = `<strong>${verifierName}</strong>`;
  verifierNameElement.style.color = '#00847c';
  verifierNameElement.style.fontSize = '18px';
  verifierNameElement.style.marginBottom = '30px';
  
  // Scheidingslijn toevoegen
  const divider2 = document.createElement('div');
  divider2.className = 'divider';
  divider2.style.width = '100%';
  divider2.style.height = '1px';
  divider2.style.backgroundColor = 'lightgrey';
  divider2.style.margin = '0 0 30px 0';
  
  // Knoppen container
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'space-between';
  buttonContainer.style.width = '100%';
  buttonContainer.style.marginTop = '20px';
  
  // "Bekijk activiteit" knop
  const activityButton = document.createElement('button');
  activityButton.textContent = 'Zie Activiteit';
  activityButton.className = 'stop-button';
  activityButton.style.width = '48%';
  
  // Klikgebeurtenis voor activiteitenknop
  activityButton.addEventListener('click', () => {
    document.body.removeChild(ehicSuccess);
    activitiesSection.style.display = 'block';
    addCardScreen.style.display = 'none';
    walletScreen.style.display = 'none';
    bottomNav.style.display = 'flex';
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    activitiesNavbarItem.classList.add('active');
    
    showActivities(); // Update de activiteitenlijst
  });
  
  // Sluiten knop
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Sluiten';
  closeButton.className = 'share-button';
  closeButton.style.width = '48%';
  
  // Voeg click event toe aan de sluit knop
  closeButton.addEventListener('click', () => {
    document.body.removeChild(ehicSuccess);
    addCardScreen.style.display = 'none';
    walletScreen.style.display = 'block';
    bottomNav.style.display = 'flex';
  });
  
  // Voeg alle elementen samen
  buttonContainer.appendChild(activityButton);
  buttonContainer.appendChild(closeButton);
  
  textContainer.appendChild(shareText);
  textContainer.appendChild(verifierNameElement);
  
  modalContent.appendChild(title);
  modalContent.appendChild(divider1);
  modalContent.appendChild(textContainer);
  modalContent.appendChild(divider2);
  modalContent.appendChild(buttonContainer);
  
  ehicSuccess.appendChild(modalContent);
  
  // Voeg de modal toe aan het document
  document.body.appendChild(ehicSuccess);
}

// rdfci pinconfirmation - momenteel niet in gebruik in flow
confirmPinIssuerBtn.onclick = () => {
  const data = window.currentRdfciData;
  const timestamp = new Date().toLocaleString();
  console.log("Data in confirmPinIssuerBtn.onclick:", data);
  // Maak een nieuw object voor de gemapte data
  const mappedData = {};

  // Itereer over de keys in 'data' en map de veldnamen
  for (let key in data) {
    if (
      data.hasOwnProperty(key) &&
      key !== 'rdfci' &&
      key !== 'a' &&
      key !== 't' &&
      key !== 'name' &&
      key !== 'issuedBy' &&
      key !== 'reason' &&
      key !== 'verifier' &&
      key !== 'issuer' &&
      key !== 'type' &&
      key !== 'requester'
    ) {
      const fieldName = fieldMapping[key] || key;
      mappedData[fieldName] = data[key];
    }
  }
  console.log("Mapped data for credential:", mappedData);
  // Sla het kaartje op met de gemapte data
  credentials.push({
    name: data.name || 'Onbekend kaartje',
    issuedBy: data.issuedBy || 'Onbekende uitgever',
    actionTimestamp: timestamp,
    isShareAction: false,
    data: mappedData // Gebruik de gemapte data
  });

  saveCredentials();
  console.log("Credentials after adding new card:", credentials);
  // Toon het issuer success-scherm
  goToIssuerSuccessScreen(data.name, data.issuedBy);

  // Sluit het pincode bevestigingsscherm
  pinConfirmationScreenIssuer.style.display = 'none';

  // Reset de QR scanner als deze actief is
  resetQrScanner();
};



function goToIssuerSuccessScreen(cardName, issuedBy) {
  const successScreen = document.getElementById('rdfci-success-screen');
  const successDataElem = document.getElementById('rdfci-success-data');
  const successIssuedByElem = document.getElementById('rdfci-success-issuedBy');
  const successCard = document.getElementById('rdfci-success-card');

  // Map de cardName en issuedBy naar hun volledige waarden
  const mappedCardName = mapValue(cardName) || cardName;
  const mappedIssuedBy = mapValue(issuedBy) || issuedBy;

  // Stel de gemapte waarden in de DOM-elementen in
  successDataElem.innerText = mappedCardName;
  successIssuedByElem.innerText = mappedIssuedBy;

  console.log("Computed style of successScreen:", window.getComputedStyle(successScreen).display);

  console.log("After setting text:", 
              "rdfci-success-data =", successDataElem.innerText, 
              "rdfci-success-issuedBy =", successIssuedByElem.innerText);

  console.log("successCard element:", successCard);

  // Haal stijlen op basis van kaartnaam
  const nameLower = mappedCardName.toLowerCase();
  const styles = cardStyles[nameLower] || {
      iconClass: 'far fa-id-badge',
      iconColor: '#333',
      textColor: '#333'
  };

  // Definieer grootte en marges
  const iconSize = '30px';
  const textSize = '18px';
  const iconMarginBottom = '10px';

  // Voeg FA-icoon en tekst toe aan de kaart met dynamische kleur en inline styles
  successCard.innerHTML = `
      <i class="${styles.iconClass}" 
          style="color: ${styles.iconColor}; font-size: ${iconSize}; margin-bottom: ${iconMarginBottom};">
      </i>
      <div class="card-text" style="font-size: ${textSize};">
        <h3 style="color: ${styles.textColor};">${mappedCardName}</h3>
      </div>
  `;
  successCard.classList.add('card'); // Voeg de kaartstijl toe

  console.log("After updating success card innerHTML.");

  // Toon het successcreen
  successScreen.style.display = 'flex';
}


// Haal de nieuwe close-button op
const closeRdfciSuccessBtn = document.getElementById('close-rdfci-success-btn');

// Voeg event listener toe
closeRdfciSuccessBtn.addEventListener('click', () => {
  const successScreen = document.getElementById('rdfci-success-screen');
  successScreen.style.display = 'none';
  displayCredentials(); // Zorg dat het nieuwe kaartje wordt weergegeven

  addCardScreen.style.display = 'none';
  walletScreen.style.display = 'block';
  bottomNav.style.display = 'flex';
});



// function to handle the EHIC card specially


function populateEhicCardModal(data) {
  console.log("Displaying EHIC card with data:", data);

  // Hide add card screen
  addCardScreen.style.display = 'none';
  
  // Create a custom modal for EHIC card
  const ehic = document.createElement('div');
  ehic.id = 'ehic-card-modal';
  ehic.className = 'modal';
  
  // Maak het modal volledig schermvullend zoals andere modals
  ehic.style.display = 'flex';
  ehic.style.position = 'fixed';
  ehic.style.top = '0';
  ehic.style.left = '0';
  ehic.style.width = '100%';
  ehic.style.height = '100%';
  ehic.style.backgroundColor = 'white';
  ehic.style.zIndex = '1000';
  ehic.style.flexDirection = 'column';
  ehic.style.alignItems = 'center';
  ehic.style.justifyContent = 'flex-start';
  ehic.style.padding = '0px';
  ehic.style.boxSizing = 'border-box';
  ehic.style.overflowY = 'auto';
  
  // Create the modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.padding = '5px';
  modalContent.style.width = '100%';
  modalContent.style.maxWidth = '400px';
  modalContent.style.backgroundColor = 'white';
  modalContent.style.display = 'flex';
  modalContent.style.flexDirection = 'column';
  
  // Create a title for the modal
  const title = document.createElement('h2');
  title.textContent = 'Europese zorgpas';
  title.style.textAlign = 'center';
  title.style.color = '#00847c';
  title.style.marginBottom = '15px';
  
  // Create the issuer section
  const issuer = document.createElement('p');
  issuer.innerHTML = `Uitgegeven door: <span style="font-weight: bold; color: #00847c;">${data.issuedBy}</span>`;
  issuer.style.textAlign = 'center';
  issuer.style.color = '#555';
  issuer.style.marginBottom = '20px';
  issuer.style.fontSize = '14px';
  
  // Voeg een scheidingslijn toe
  const divider1 = document.createElement('div');
  divider1.className = 'divider';
  divider1.style.width = '100%';
  divider1.style.height = '1px';
  divider1.style.backgroundColor = 'lightgrey';
  divider1.style.margin = '10px 0';
  
  // Create the card container with flip functionality
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-flip-container';
  cardContainer.style.width = '100%';
  cardContainer.style.height = '200px';
  cardContainer.style.perspective = '1000px';
  cardContainer.style.marginBottom = '20px';
  cardContainer.style.cursor = 'pointer';
  
  // Create the flip inner container
  const cardFlipInner = document.createElement('div');
  cardFlipInner.className = 'card-flip-inner';
  cardFlipInner.style.position = 'relative';
  cardFlipInner.style.width = '100%';
  cardFlipInner.style.height = '100%';
  cardFlipInner.style.textAlign = 'center';
  cardFlipInner.style.transition = 'transform 0.8s';
  cardFlipInner.style.transformStyle = 'preserve-3d';
  
  // Create the front of the card
  const cardFront = document.createElement('div');
  cardFront.className = 'card-front';
  cardFront.style.position = 'absolute';
  cardFront.style.width = '100%';
  cardFront.style.height = '100%';
  cardFront.style.backfaceVisibility = 'hidden';
  cardFront.style.border = 'none';
  cardFront.style.borderRadius = '10px';
  cardFront.style.padding = '10px';
  cardFront.style.boxSizing = 'border-box';
  cardFront.style.display = 'flex';
  cardFront.style.justifyContent = 'center';
  cardFront.style.alignItems = 'center';
  
  // Add the front image
  const frontImage = document.createElement('img');
  frontImage.src = '../base/images/ehic-front.png';
  frontImage.alt = 'EHIC Card Front';
  frontImage.style.maxWidth = '100%';
  frontImage.style.maxHeight = '100%';
  frontImage.style.borderRadius = '8px';
  
  // Create the back of the card
  const cardBack = document.createElement('div');
  cardBack.className = 'card-back';
  cardBack.style.position = 'absolute';
  cardBack.style.width = '100%';
  cardBack.style.height = '100%';
  cardBack.style.backfaceVisibility = 'hidden';
  cardBack.style.transform = 'rotateY(180deg)';
  cardBack.style.border = 'none';
  cardBack.style.borderRadius = '10px';
  cardBack.style.padding = '10px';
  cardBack.style.boxSizing = 'border-box';
  cardBack.style.display = 'flex';
  cardBack.style.justifyContent = 'center';
  cardBack.style.alignItems = 'center';
  
  // Add the back image
  const backImage = document.createElement('img');
  backImage.src = '../base/images/ehic-back.png';
  backImage.alt = 'EHIC Card Back';
  backImage.style.maxWidth = '100%';
  backImage.style.maxHeight = '100%';
  backImage.style.borderRadius = '8px';
  
  // Add click event to flip the card
  cardContainer.addEventListener('click', () => {
    if (cardFlipInner.style.transform === 'rotateY(180deg)') {
      cardFlipInner.style.transform = 'rotateY(0deg)';
    } else {
      cardFlipInner.style.transform = 'rotateY(180deg)';
    }
  });
  
  // Create the "Kaart draaien" instruction
  const flipInstruction = document.createElement('p');
  flipInstruction.textContent = 'Klik op de kaart om deze om te draaien';
  flipInstruction.style.textAlign = 'center';
  flipInstruction.style.color = '#777';
  flipInstruction.style.fontSize = '14px';
  flipInstruction.style.marginBottom = '20px';
  
  // Voeg een scheidingslijn toe
  const divider2 = document.createElement('div');
  divider2.className = 'divider';
  divider2.style.width = '100%';
  divider2.style.height = '1px';
  divider2.style.backgroundColor = 'lightgrey';
  divider2.style.margin = '10px 0';
  
  // Create an accordion for technical details
  const accordion = document.createElement('div');
  accordion.className = 'accordion';
  accordion.style.width = '100%';
  accordion.style.marginBottom = '20px';
  
  // Create the accordion button
  const accordionBtn = document.createElement('button');
  accordionBtn.className = 'accordion-btn';
  accordionBtn.textContent = 'Technische gegevens';
  accordionBtn.style.backgroundColor = '#eee';
  accordionBtn.style.color = '#444';
  accordionBtn.style.cursor = 'pointer';
  accordionBtn.style.padding = '12px'; // Kleinere padding
  accordionBtn.style.width = '100%';
  accordionBtn.style.textAlign = 'left';
  accordionBtn.style.border = 'none';
  accordionBtn.style.outline = 'none';
  accordionBtn.style.fontSize = '16px';
  accordionBtn.style.transition = '0.4s';
  accordionBtn.style.borderRadius = '5px';
  accordionBtn.style.position = 'relative';
  
  // Add a plus/minus indicator
  const indicator = document.createElement('span');
  indicator.innerHTML = '+';
  indicator.style.position = 'absolute';
  indicator.style.right = '15px';
  indicator.style.fontSize = '20px';
  accordionBtn.appendChild(indicator);
  
  // Create the accordion panel
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.style.padding = '0 8px'; // Smallere padding
  panel.style.backgroundColor = '#f9f9f9';
  panel.style.maxHeight = '0';
  panel.style.overflow = 'hidden';
  panel.style.transition = 'max-height 0.2s ease-out';
  panel.style.borderRadius = '0 0 5px 5px';
  panel.style.width = '100%';
  
  // Add technical details content
  const details = document.createElement('div');
  details.style.padding = '10px 0'; // Kleinere padding
  
  // Exclude these keys from the display
  const excludedKeys = ['Issuer', 'name', 'rdfci'];
  
  // Add all data fields to the technical details
  for (let key in data) {
    if (!excludedKeys.includes(key)) {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.marginBottom = '8px';
      row.style.flexWrap = 'wrap'; // Zorgt dat elementen naar de volgende regel kunnen gaan
      
      const label = document.createElement('div');
      label.style.fontWeight = 'bold';
      label.style.width = '45%'; // Iets smaller om meer ruimte te geven voor de waarde
      label.style.padding = '0 5px 0 0'; // Kleinere padding
      label.style.wordWrap = 'break-word'; // Zorgt dat lange woorden afbreken
      label.style.overflowWrap = 'break-word';
      label.textContent = key + ':';
      
      const value = document.createElement('div');
      value.style.width = '55%'; // Iets breder om langere tekst te accommoderen
      value.style.wordWrap = 'break-word'; // Zorgt dat lange woorden afbreken
      value.style.overflowWrap = 'break-word';
      value.textContent = data[key];
      
      row.appendChild(label);
      row.appendChild(value);
      details.appendChild(row);
    }
  }
  
  panel.appendChild(details);
  
  // Add accordion toggle functionality
  accordionBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    
    if (panel.style.maxHeight && panel.style.maxHeight !== '0px') {
      panel.style.maxHeight = '0';
      indicator.innerHTML = '+';
    } else {
      panel.style.maxHeight = panel.scrollHeight + 200 + 'px'; // Extra ruimte voor lange inhoud
      indicator.innerHTML = '-';
    }
  });
  
  // Create action buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'space-between';
  buttonContainer.style.width = '100%';
  buttonContainer.style.marginTop = '20px';
  
  // Create the cancel button
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Annuleren';
  cancelButton.style.padding = '10px 20px';
  cancelButton.style.backgroundColor = '#f2f2f2';
  cancelButton.style.color = '#333';
  cancelButton.style.border = 'none';
  cancelButton.style.borderRadius = '5px';
  cancelButton.style.cursor = 'pointer';
  cancelButton.style.width = '48%';
  
  // Add cancel button click event
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(ehic);
    walletScreen.style.display = 'block';
    bottomNav.style.display = 'flex';
  });
  
  // Create the accept button
  const acceptButton = document.createElement('button');
  acceptButton.textContent = 'Opslaan';
  acceptButton.style.padding = '10px 20px';
  acceptButton.style.backgroundColor = '#2681cc';
  acceptButton.style.color = 'white';
  acceptButton.style.border = 'none';
  acceptButton.style.borderRadius = '5px';
  acceptButton.style.cursor = 'pointer';
  acceptButton.style.width = '48%';
  
  // Add accept button click event
  acceptButton.addEventListener('click', () => {
    const timestamp = new Date().toLocaleString();
    
    // Create a new credential for the EHIC card
    credentials.push({
      name: 'EHIC pas',
      issuedBy: data.issuedBy,              // VECOZO
      LEIDissuer: data.LEIDissuer,          // VECOZO's ID
      issuedOnBehalfOf: data.issuedOnBehalfOf, // Zorgverzekeraar 
      LEIDonBehalf: data.LEIDonBehalf,      // Zorgverzekeraar's ID
      actionTimestamp: timestamp,
      isShareAction: false,
      data: {
        'Naam': data['Name'],
        'Voornaam': data['Given name'],
        'Geboortedatum': data['Date of birth'],
        'Persoonlijk identificatienummer': data['Personal identification number'],
        'Identificatienummer instelling': data['Identification number of the institution'],
        'Kaartnummer': data['Identification number of the card'],
        'Vervaldatum': data['Expiry date'],
        'Attestation Trust Type': data['Attestation Trust Type'],
        'Uitgegeven door': data.issuedBy,
        'Organisatie nummer uitgever': data.LEIDissuer,
        'Uitgegeven namens': data.issuedOnBehalfOf,
        'Organisatie nummer namens': data.LEIDonBehalf
      }
    });
    
    saveCredentials();
    displayCredentials();
    
    // Remove the EHIC modal from document body
    document.body.removeChild(ehic);
    
    // Show success message using the new EHIC success screen
    goToEhicSuccessScreen('EHIC pas', data.issuedBy);
  });
  
  // Assemble all the elements
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(acceptButton);
  
  cardFront.appendChild(frontImage);
  cardBack.appendChild(backImage);
  
  cardFlipInner.appendChild(cardFront);
  cardFlipInner.appendChild(cardBack);
  
  cardContainer.appendChild(cardFlipInner);
  
  accordion.appendChild(accordionBtn);
  accordion.appendChild(panel);
  
  modalContent.appendChild(title);
  modalContent.appendChild(issuer);
  modalContent.appendChild(divider1);
  modalContent.appendChild(cardContainer);
  modalContent.appendChild(flipInstruction);
  modalContent.appendChild(divider2);
  modalContent.appendChild(accordion);
  modalContent.appendChild(buttonContainer);
  
  ehic.appendChild(modalContent);
  
  // Add the modal to the document
  document.body.appendChild(ehic);
}



// Functie om het EHIC succes scherm te tonen
function goToEhicSuccessScreen(cardName, issuedBy) {
  // Maak een nieuw modal voor het succes scherm
  const ehic = document.createElement('div');
  ehic.id = 'ehic-success-screen';
  ehic.className = 'modal';
  
  // Maak het modal volledig schermvullend
  ehic.style.display = 'flex';
  ehic.style.position = 'fixed';
  ehic.style.top = '0';
  ehic.style.left = '0';
  ehic.style.width = '100%';
  ehic.style.height = '100%';
  ehic.style.backgroundColor = 'white';
  ehic.style.zIndex = '1000';
  ehic.style.flexDirection = 'column';
  ehic.style.alignItems = 'center';
  ehic.style.justifyContent = 'flex-start';
  ehic.style.padding = '0';
  ehic.style.boxSizing = 'border-box';
  ehic.style.overflowY = 'auto';
  
  // Maak de modal content container
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.backgroundColor = 'white';
  modalContent.style.padding = '5px';
  modalContent.style.width = '100%';
  modalContent.style.maxWidth = '400px';
  modalContent.style.display = 'flex';
  modalContent.style.flexDirection = 'column';
  modalContent.style.alignItems = 'center';
  modalContent.style.marginTop = '20px';
  
  // Succes titel
  const title = document.createElement('h2');
  title.textContent = 'Succes!';
  title.style.textAlign = 'center';
  title.style.color = '#152A62';
  title.style.marginBottom = '15px';
  
  // Scheidingslijn toevoegen
  const divider1 = document.createElement('div');
  divider1.className = 'divider';
  divider1.style.width = '100%';
  divider1.style.height = '1px';
  divider1.style.backgroundColor = 'lightgrey';
  divider1.style.margin = '10px 0 20px 0';
  
  // Container voor de tekst
  const textContainer = document.createElement('div');
  textContainer.style.textAlign = 'center';
  textContainer.style.marginBottom = '20px';
  textContainer.style.width = '100%';
  
  // Tekst over kaart in het groen
  const cardText = document.createElement('p');
  cardText.innerHTML = '<strong>De Europese zorgverzekeringspas</strong>';
  cardText.style.color = '#00847c';
  cardText.style.fontSize = '16px';
  cardText.style.marginBottom = '10px';
  
  // Tekst "uitgegeven door" en de uitgever op één regel
  const issuedByContainer = document.createElement('p');
  issuedByContainer.innerHTML = `uitgegeven door <strong style="color: #00847c;">${issuedBy}</strong>`;
  issuedByContainer.style.color = '#152A62';
  issuedByContainer.style.fontSize = '16px';
  issuedByContainer.style.marginBottom = '10px';
  
  // Tekst over opgeslagen in wallet
  const savedText = document.createElement('p');
  savedText.textContent = 'is succesvol opgeslagen in je wallet.';
  savedText.style.color = '#152A62';
  savedText.style.fontSize = '16px';
  savedText.style.marginBottom = '30px';
  
  // Scheidingslijn toevoegen
  const divider2 = document.createElement('div');
  divider2.className = 'divider';
  divider2.style.width = '100%';
  divider2.style.height = '1px';
  divider2.style.backgroundColor = 'lightgrey';
  divider2.style.margin = '0 0 30px 0';
  
  // Sluiten knop
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Sluiten';
  closeButton.style.backgroundColor = '#2681cc';
  closeButton.style.color = 'white';
  closeButton.style.padding = '10px 20px';
  closeButton.style.borderRadius = '5px';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '16px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.width = '150px';
  closeButton.style.textAlign = 'center';
  closeButton.style.marginTop = '10px';
  
  // Voeg click event toe aan de sluit knop
  closeButton.addEventListener('click', () => {
    document.body.removeChild(ehic);
    addCardScreen.style.display = 'none';
    walletScreen.style.display = 'block';
    bottomNav.style.display = 'flex';
    displayCredentials(); // Update de weergegeven kaartjes
  });
  
  // Voeg alle elementen samen
  textContainer.appendChild(cardText);
  textContainer.appendChild(issuedByContainer);
  textContainer.appendChild(savedText);
  
  modalContent.appendChild(title);
  modalContent.appendChild(divider1);
  modalContent.appendChild(textContainer);
  modalContent.appendChild(divider2);
  modalContent.appendChild(closeButton);
  
  ehic.appendChild(modalContent);
  
  // Voeg de modal toe aan het document
  document.body.appendChild(ehic);
}


function populateEhicRdfcvModal(data) {
  console.log("Displaying EHIC card sharing modal with data:", data);
  
  // Zoek de EHIC kaart in de credentials
  const ehicCard = credentials.find(cred => cred.name === 'EHIC pas');
  if (!ehicCard) {
    console.error("EHIC kaart niet gevonden in credentials");
    // Gebruik de standaard RDFCV modal als fallback
    populateRdfcvModal({...data, requestedCard: ''});
    return;
  }
  
  // Verberg alle andere schermen
  addCardScreen.style.display = 'none';
  
  // Maak een custom modal voor EHIC card delen
  const ehic = document.createElement('div');
  ehic.id = 'ehic-share-modal';
  ehic.className = 'modal';
  
  // Maak het modal volledig schermvullend
  ehic.style.display = 'flex';
  ehic.style.position = 'fixed';
  ehic.style.top = '0';
  ehic.style.left = '0';
  ehic.style.width = '100%';
  ehic.style.height = '100%';
  ehic.style.backgroundColor = 'white';
  ehic.style.zIndex = '1000';
  ehic.style.flexDirection = 'column';
  ehic.style.alignItems = 'center';
  ehic.style.justifyContent = 'flex-start';
  ehic.style.padding = '0px';
  ehic.style.boxSizing = 'border-box';
  ehic.style.overflowY = 'auto';
  
  // Maak de modal inhoud
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.padding = '5px';
  modalContent.style.width = '100%';
  modalContent.style.maxWidth = '400px';
  modalContent.style.backgroundColor = 'white';
  modalContent.style.display = 'flex';
  modalContent.style.flexDirection = 'column';
  
  // Maak de titel voor de modal met de vraag
  const title = document.createElement('h3');
  title.textContent = "Wilt u onderstaande gegevens delen?";
  title.style.textAlign = 'center'; // Gecentreerd, zoals gevraagd
  title.style.color = '#000000'; // Zwarte tekst
  title.style.marginBottom = '15px';
  
  // Voeg een scheidingslijn toe
  const divider1 = document.createElement('div');
  divider1.className = 'divider';
  divider1.style.width = '100%';
  divider1.style.height = '1px';
  divider1.style.backgroundColor = 'lightgrey';
  divider1.style.margin = '10px 0';
  
  // Voeg title toe voor kaart sectie
  const cardTitle = document.createElement('p');
  cardTitle.innerHTML = '<strong>Europese zorgpas</strong>';
  cardTitle.style.textAlign = 'center'; // Gecentreerd, zoals gevraagd
  cardTitle.style.color = '#00847c';
  cardTitle.style.marginBottom = '10px';
  
  // Maak de container voor de flipbare kaart
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-flip-container';
  cardContainer.style.width = '100%';
  cardContainer.style.height = '200px';
  cardContainer.style.perspective = '1000px';
  cardContainer.style.marginBottom = '20px';
  cardContainer.style.cursor = 'pointer';
  
  // Maak de inner container voor de flipbare kaart
  const cardFlipInner = document.createElement('div');
  cardFlipInner.className = 'card-flip-inner';
  cardFlipInner.style.position = 'relative';
  cardFlipInner.style.width = '100%';
  cardFlipInner.style.height = '100%';
  cardFlipInner.style.textAlign = 'center';
  cardFlipInner.style.transition = 'transform 0.8s';
  cardFlipInner.style.transformStyle = 'preserve-3d';
  
  // Maak de voorkant van de kaart
  const cardFront = document.createElement('div');
  cardFront.className = 'card-front';
  cardFront.style.position = 'absolute';
  cardFront.style.width = '100%';
  cardFront.style.height = '100%';
  cardFront.style.backfaceVisibility = 'hidden';
  cardFront.style.border = 'none';
  cardFront.style.borderRadius = '10px';
  cardFront.style.padding = '10px';
  cardFront.style.boxSizing = 'border-box';
  cardFront.style.display = 'flex';
  cardFront.style.justifyContent = 'center';
  cardFront.style.alignItems = 'center';
  
  // Voeg de afbeelding voor de voorkant toe
  const frontImage = document.createElement('img');
  frontImage.src = '../base/images/ehic-front.png';
  frontImage.alt = 'EHIC Card Front';
  frontImage.style.maxWidth = '100%';
  frontImage.style.maxHeight = '100%';
  frontImage.style.borderRadius = '8px';
  cardFront.appendChild(frontImage);
  
  // Maak de achterkant van de kaart
  const cardBack = document.createElement('div');
  cardBack.className = 'card-back';
  cardBack.style.position = 'absolute';
  cardBack.style.width = '100%';
  cardBack.style.height = '100%';
  cardBack.style.backfaceVisibility = 'hidden';
  cardBack.style.transform = 'rotateY(180deg)';
  cardBack.style.border = 'none';
  cardBack.style.borderRadius = '10px';
  cardBack.style.padding = '10px';
  cardBack.style.boxSizing = 'border-box';
  cardBack.style.display = 'flex';
  cardBack.style.justifyContent = 'center';
  cardBack.style.alignItems = 'center';
  
  // Voeg de afbeelding voor de achterkant toe
  const backImage = document.createElement('img');
  backImage.src = '../base/images/ehic-back.png';
  backImage.alt = 'EHIC Card Back';
  backImage.style.maxWidth = '100%';
  backImage.style.maxHeight = '100%';
  backImage.style.borderRadius = '8px';
  cardBack.appendChild(backImage);
  
  // Voeg klikgebeurtenis toe om de kaart te draaien
  cardContainer.addEventListener('click', () => {
    if (cardFlipInner.style.transform === 'rotateY(180deg)') {
      cardFlipInner.style.transform = 'rotateY(0deg)';
    } else {
      cardFlipInner.style.transform = 'rotateY(180deg)';
    }
  });
  
  // Voeg instructies toe
  const flipInstruction = document.createElement('p');
  flipInstruction.textContent = 'Klik op de kaart om deze om te draaien';
  flipInstruction.style.textAlign = 'center';
  flipInstruction.style.color = '#777';
  flipInstruction.style.fontSize = '14px';
  flipInstruction.style.marginBottom = '20px';
  
  // Voeg een scheidingslijn toe
  const divider2 = document.createElement('div');
  divider2.className = 'divider';
  divider2.style.width = '100%';
  divider2.style.height = '1px';
  divider2.style.backgroundColor = 'lightgrey';
  divider2.style.margin = '10px 0';
  
  // Maak een accordion voor technische details
  const accordion = document.createElement('div');
  accordion.className = 'accordion';
  accordion.style.width = '100%';
  accordion.style.marginBottom = '20px';
  
  // Maak de accordion-knop
  const accordionBtn = document.createElement('button');
  accordionBtn.className = 'accordion-btn';
  accordionBtn.textContent = 'Technische gegevens';
  accordionBtn.style.backgroundColor = '#eee';
  accordionBtn.style.color = '#444';
  accordionBtn.style.cursor = 'pointer';
  accordionBtn.style.padding = '12px';
  accordionBtn.style.width = '100%';
  accordionBtn.style.textAlign = 'left';
  accordionBtn.style.border = 'none';
  accordionBtn.style.outline = 'none';
  accordionBtn.style.fontSize = '16px';
  accordionBtn.style.transition = '0.4s';
  accordionBtn.style.borderRadius = '5px';
  accordionBtn.style.position = 'relative';
  
  // Voeg een plus/min indicator toe
  const indicator = document.createElement('span');
  indicator.innerHTML = '+';
  indicator.style.position = 'absolute';
  indicator.style.right = '15px';
  indicator.style.fontSize = '20px';
  accordionBtn.appendChild(indicator);
  
  // Maak het accordion paneel
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.style.padding = '0 8px';
  panel.style.backgroundColor = '#f9f9f9';
  panel.style.maxHeight = '0';
  panel.style.overflow = 'hidden';
  panel.style.transition = 'max-height 0.2s ease-out';
  panel.style.borderRadius = '0 0 5px 5px';
  panel.style.width = '100%';
  
// Voeg technische details inhoud toe
const details = document.createElement('div');
details.style.padding = '10px 0';

// Maak een object met alle te tonen velden
const displayData = {
  'name': ehicCard.name || 'Niet beschikbaar',
  'issuedBy': ehicCard.issuedBy || 'Niet beschikbaar',
  'LEID': ehicCard.LEID || 'Niet beschikbaar'
};

// Voeg alle velden uit de data property toe
if (ehicCard.data) {
  for (let key in ehicCard.data) {
    displayData[key] = ehicCard.data[key];
  }
}

// Log voor debug doeleinden
console.log("DisplayData voor EHIC kaart:", displayData);

// Toon alle verzamelde velden
for (let key in displayData) {
  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.marginBottom = '8px';
  row.style.flexWrap = 'wrap';
  
  const label = document.createElement('div');
  label.style.fontWeight = 'bold';
  label.style.width = '45%';
  label.style.padding = '0 5px 0 0';
  label.style.wordWrap = 'break-word';
  label.style.overflowWrap = 'break-word';
  label.textContent = key + ':';
  
  const value = document.createElement('div');
  value.style.width = '55%';
  value.style.wordWrap = 'break-word';
  value.style.overflowWrap = 'break-word';
  value.textContent = displayData[key];
  
  row.appendChild(label);
  row.appendChild(value);
  details.appendChild(row);
}
  
  panel.appendChild(details);
  
  // Voeg accordion toggle functionaliteit toe
  accordionBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    
    if (panel.style.maxHeight && panel.style.maxHeight !== '0px') {
      panel.style.maxHeight = '0';
      indicator.innerHTML = '+';
    } else {
      panel.style.maxHeight = panel.scrollHeight + 200 + 'px';
      indicator.innerHTML = '-';
    }
  });
  
  // Voeg een scheidingslijn toe
  const divider3 = document.createElement('div');
  divider3.className = 'divider';
  divider3.style.width = '100%';
  divider3.style.height = '1px';
  divider3.style.backgroundColor = 'lightgrey';
  divider3.style.margin = '10px 0';
  
 // Vragende partij en reden (nu na technische details)
const dataContainer = document.createElement('div');
dataContainer.style.marginTop = '15px';
dataContainer.style.marginBottom = '15px';
dataContainer.style.color = '#000000'; // Zwarte kleur

// Rij voor vragende partij
const requesterRow = document.createElement('div');
requesterRow.style.display = 'flex';
requesterRow.style.alignItems = 'flex-start';
requesterRow.style.marginBottom = '5px';

const requesterLabel = document.createElement('div');
requesterLabel.innerHTML = '<strong>Vragende partij:</strong>';
requesterLabel.style.width = '150px'; // Vaste breedte voor labels
requesterLabel.style.color = '#000000';
requesterLabel.style.flexShrink = '0';

const requesterValue = document.createElement('div');
requesterValue.textContent = data.requester;
requesterValue.style.color = '#000000';

requesterRow.appendChild(requesterLabel);
requesterRow.appendChild(requesterValue);

// Rij voor reden
const reasonRow = document.createElement('div');
reasonRow.style.display = 'flex';
reasonRow.style.alignItems = 'flex-start';

const reasonLabel = document.createElement('div');
reasonLabel.innerHTML = '<strong>Reden:</strong>';
reasonLabel.style.width = '150px'; // Zelfde breedte als bovenstaande label
reasonLabel.style.color = '#000000';
reasonLabel.style.flexShrink = '0';

const reasonValue = document.createElement('div');
reasonValue.textContent = data.reason || 'Geen reden opgegeven';
reasonValue.style.color = '#000000';

reasonRow.appendChild(reasonLabel);
reasonRow.appendChild(reasonValue);

// Voeg beide rijen toe aan de dataContainer
dataContainer.appendChild(requesterRow);
dataContainer.appendChild(reasonRow);
  
  // Nog een scheidingslijn
  const divider4 = document.createElement('div');
  divider4.className = 'divider';
  divider4.style.width = '100%';
  divider4.style.height = '1px';
  divider4.style.backgroundColor = 'lightgrey';
  divider4.style.margin = '10px 0';
  
  // Overeenkomst sectie - nu in zwart
  const agreementTitle = document.createElement('p');
  agreementTitle.innerHTML = '<strong>Overeenkomst</strong>';
  agreementTitle.style.color = '#000000'; // Zwart in plaats van blauw
  
  const agreementText = document.createElement('p');
  if (data.a) {
    agreementText.textContent = fieldMapping.a[data.a] || data.a;
  } else {
    agreementText.textContent = 'Geen overeenkomst gevonden.';
  }
  agreementText.style.color = '#000000'; // Zwart in plaats van blauw
  agreementText.style.marginBottom = '20px';
  
  // Maak actieknoppen
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'space-between';
  buttonContainer.style.width = '100%';
  buttonContainer.style.marginTop = '20px';
  
  // Maak de annuleerknop
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Stoppen';
  cancelButton.className = 'stop-button';
  cancelButton.style.width = '48%';
  
  // Voeg klikgebeurtenis toe aan de annuleerknop
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(ehic);
    addCardScreen.style.display = 'none';
    walletScreen.style.display = 'block';
    bottomNav.style.display = 'flex';
    resetQrScanner();
  });
  
  // Maak de accepteerknop
  const acceptButton = document.createElement('button');
  acceptButton.textContent = 'Akkoord';
  acceptButton.className = 'share-button';
  acceptButton.style.width = '48%';
  
  // Voeg klikgebeurtenis toe aan de accepteerknop
  acceptButton.addEventListener('click', () => {
    document.body.removeChild(ehic);
    
    // Ga door naar pincode bevestiging
    goToPinConfirmationVerifier();
    
    // Event handler voor de pincode bevestiging
    confirmPinBtnVerifier.onclick = () => {
      const timestamp = new Date().toLocaleString();
      
      // Sla de EHIC delen actie op
      saveEhicSharedData(data, timestamp);
      
      // Ga naar het succes scherm
      goToEhicShareSuccessScreen(data.requester);
      
      pinConfirmationScreenVerifier.style.display = 'none';
      resetPinInputs();
    };
  });
  
  // Zet alle elementen in elkaar
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(acceptButton);
  
  cardFlipInner.appendChild(cardFront);
  cardFlipInner.appendChild(cardBack);
  
  cardContainer.appendChild(cardFlipInner);
  
  accordion.appendChild(accordionBtn);
  accordion.appendChild(panel);
  
  modalContent.appendChild(title);
  modalContent.appendChild(divider1);
  modalContent.appendChild(cardTitle);
  modalContent.appendChild(cardContainer);
  modalContent.appendChild(flipInstruction);
  modalContent.appendChild(divider2);
  modalContent.appendChild(accordion);
  modalContent.appendChild(divider3);
  modalContent.appendChild(dataContainer);
  modalContent.appendChild(divider4);
  modalContent.appendChild(agreementTitle);
  modalContent.appendChild(agreementText);
  modalContent.appendChild(buttonContainer);
  
  ehic.appendChild(modalContent);
  
  // Voeg de modal toe aan het document
  document.body.appendChild(ehic);
}

function saveEhicSharedData(data, timestamp) {
  credentials.push({
    name: data.requester || 'Onbekende partij',
    reason: data.reason || 'Geen reden opgegeven',
    sharedData: ["EHIC pas"],
    agreement: data.a ? (fieldMapping.a[data.a] || data.a) : 'Geen overeenkomst',
    actionTimestamp: timestamp,
    isShareAction: true
  });
  saveCredentials();
  console.log("EHIC delingsactie opgeslagen:", credentials);
}

function goToEhicShareSuccessScreen(verifierName) {
  // Maak een nieuw modal voor het succes scherm
  const ehicSuccess = document.createElement('div');
  ehicSuccess.id = 'ehic-share-success-screen';
  ehicSuccess.className = 'modal';
  
  // Maak het modal volledig schermvullend
  ehicSuccess.style.display = 'flex';
  ehicSuccess.style.position = 'fixed';
  ehicSuccess.style.top = '0';
  ehicSuccess.style.left = '0';
  ehicSuccess.style.width = '100%';
  ehicSuccess.style.height = '100%';
  ehicSuccess.style.backgroundColor = 'white';
  ehicSuccess.style.zIndex = '1000';
  ehicSuccess.style.flexDirection = 'column';
  ehicSuccess.style.alignItems = 'center';
  ehicSuccess.style.justifyContent = 'flex-start';
  ehicSuccess.style.padding = '0';
  ehicSuccess.style.boxSizing = 'border-box';
  ehicSuccess.style.overflowY = 'auto';
  
  // Maak de modal content container
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.backgroundColor = 'white';
  modalContent.style.padding = '5px';
  modalContent.style.width = '100%';
  modalContent.style.maxWidth = '400px';
  modalContent.style.display = 'flex';
  modalContent.style.flexDirection = 'column';
  modalContent.style.alignItems = 'center';
  modalContent.style.marginTop = '20px';
  
  // Succes titel
  const title = document.createElement('h2');
  title.textContent = 'Succes!';
  title.style.textAlign = 'center';
  title.style.color = '#152A62';
  title.style.marginBottom = '15px';
  
  // Scheidingslijn toevoegen
  const divider1 = document.createElement('div');
  divider1.className = 'divider';
  divider1.style.width = '100%';
  divider1.style.height = '1px';
  divider1.style.backgroundColor = 'lightgrey';
  divider1.style.margin = '10px 0 20px 0';
  
  // Container voor de tekst
  const textContainer = document.createElement('div');
  textContainer.style.textAlign = 'center';
  textContainer.style.marginBottom = '20px';
  textContainer.style.width = '100%';
  
  // Tekst over delen gegevens
  const shareText = document.createElement('p');
  shareText.textContent = `Je hebt de gegevens gedeeld met`;
  shareText.style.color = '#152A62';
  shareText.style.fontSize = '16px';
  shareText.style.marginBottom = '10px';
  
  // Verifier naam
  const verifierNameElement = document.createElement('p');
  verifierNameElement.innerHTML = `<strong>${verifierName}</strong>`;
  verifierNameElement.style.color = '#00847c';
  verifierNameElement.style.fontSize = '18px';
  verifierNameElement.style.marginBottom = '30px';
  
  // Scheidingslijn toevoegen
  const divider2 = document.createElement('div');
  divider2.className = 'divider';
  divider2.style.width = '100%';
  divider2.style.height = '1px';
  divider2.style.backgroundColor = 'lightgrey';
  divider2.style.margin = '0 0 30px 0';
  
  // Knoppen container
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'space-between';
  buttonContainer.style.width = '100%';
  buttonContainer.style.marginTop = '20px';
  
  // "Bekijk activiteit" knop
  const activityButton = document.createElement('button');
  activityButton.textContent = 'Zie Activiteit';
  activityButton.className = 'stop-button';
  activityButton.style.width = '48%';
  
  // Klikgebeurtenis voor activiteitenknop
  activityButton.addEventListener('click', () => {
    document.body.removeChild(ehicSuccess);
    activitiesSection.style.display = 'block';
    addCardScreen.style.display = 'none';
    walletScreen.style.display = 'none';
    bottomNav.style.display = 'flex';
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    activitiesNavbarItem.classList.add('active');
    
    showActivities(); // Update de activiteitenlijst
  });
  
  // Sluiten knop
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Sluiten';
  closeButton.className = 'share-button';
  closeButton.style.width = '48%';
  
  // Voeg click event toe aan de sluit knop
  closeButton.addEventListener('click', () => {
    document.body.removeChild(ehicSuccess);
    addCardScreen.style.display = 'none';
    walletScreen.style.display = 'block';
    bottomNav.style.display = 'flex';
  });
  
  // Voeg alle elementen samen
  buttonContainer.appendChild(activityButton);
  buttonContainer.appendChild(closeButton);
  
  textContainer.appendChild(shareText);
  textContainer.appendChild(verifierNameElement);
  
  modalContent.appendChild(title);
  modalContent.appendChild(divider1);
  modalContent.appendChild(textContainer);
  modalContent.appendChild(divider2);
  modalContent.appendChild(buttonContainer);
  
  ehicSuccess.appendChild(modalContent);
  
  // Voeg de modal toe aan het document
  document.body.appendChild(ehicSuccess);
}



// ===============================
// ======== RDFCV ================
// ===============================


// RDFCV vraagscherm vullen
function populateRdfcvModal(data) {
  // Vul de reden
  document.getElementById('rdfcv-reason').innerText = data.reason || 'Geen reden opgegeven.';

  // Voeg de naam van de verifier toe aan de vraag
  document.getElementById('rdfcv-question-text').innerText = `Wilt u onderstaande gegevens delen met ${data.requester}?`;

  // Verwerk de gevraagde gegevens
  const detailsContainer = document.getElementById('rdfcv-details-container');
  detailsContainer.innerHTML = ''; // Leeg de container

  // Groepeer de velden en toon ze in kaartjes
  let fieldsByCard = {};

  data.rdfcv.forEach((field) => {
    const fieldName = fieldMapping[field] || field; // Gebruik field mapping

    console.log(`Mapping field '${field}' to '${fieldName}'`);

    // Zoek of het veld hoort bij een kaartje in credentials
    let matchingCard = credentials.find(cred => {
      // Zoek in cred.data of het veld bestaat
      return cred.data && cred.data.hasOwnProperty(fieldName);
    });

    if (!matchingCard) {
      console.warn(`Veld of kaartje '${fieldName}' niet gevonden in the credentials.`);
      // Als niet gevonden, controleer of er een kaartje is waarvan de naam overeenkomt met fieldName
      matchingCard = credentials.find(cred => cred.name === fieldName);
    }

    if (matchingCard) {
      console.log(`Found matching card for '${fieldName}':`, matchingCard); 
      const cardName = matchingCard.name;

      if (!fieldsByCard[cardName]) {
        fieldsByCard[cardName] = { data: matchingCard.data, fields: [], showAllFields: false };
      }

      if (matchingCard.name === fieldName) {
        // Als het veld overeenkomt met de kaartnaam, tonen we alle details
        fieldsByCard[cardName].showAllFields = true;
      } else {
        // Voeg het specifieke veld toe
        fieldsByCard[cardName].fields.push(fieldName);
      }
    } else {
      console.warn(`Veld of kaartje '${fieldName}' niet gevonden in de credentials.`);
    }
  });

  // Itereer over elk kaartje en maak de kaart elementen aan
  Object.keys(fieldsByCard).forEach((cardName) => {
    const cardInfo = fieldsByCard[cardName];

    // Maak kaart container aan
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    // Maak kaart header aan
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';

    // Stel de achtergrondkleur in op basis van de kaartnaam
    switch (cardName) {
      case 'Persoonlijke data':
        cardHeader.style.backgroundColor = '#B9E4E2';
        break;
      case 'Woonadres':
        cardHeader.style.backgroundColor = '#b9e4e2';
        break;
      case 'Verklaring Omtrent Gedrag (VOG)':
        cardHeader.style.backgroundColor = '#b9e4e2';
        break;
        case 'Diploma Verpleegkunde':
        cardHeader.style.backgroundColor = '#0061A6';
        break;
      default:
        cardHeader.style.backgroundColor = '#445580'; // Default kleur
    }

    // Maak kaart content container aan
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';

    // Voeg de header en content toe aan de kaartcontainer
    cardContainer.appendChild(cardHeader);
    cardContainer.appendChild(cardContent);

    // Maak kaart titel aan
    const cardTitleElement = document.createElement('div');
    cardTitleElement.className = 'card-title';
    cardTitleElement.textContent = cardName;
    cardContent.appendChild(cardTitleElement);

    // Maak kaart details aan
    const cardDetails = document.createElement('div');
    cardDetails.className = 'card-details';

    if (cardInfo.showAllFields) {
      // Voeg alle details van het kaartje toe uit cred.data
      for (let key in cardInfo.data) {
        if (cardInfo.data.hasOwnProperty(key)) {
          const detailRow = document.createElement('div');
          detailRow.className = 'detail-row'; // Class for styling

          const labelDiv = document.createElement('div');
          labelDiv.className = 'label';
          labelDiv.textContent = `${key}:`;

          const valueDiv = document.createElement('div');
          valueDiv.className = 'value';

          const value = cardInfo.data[key]; // Definieer 'value' hier

          if (key === 'Foto') {
            // Als het veld 'Foto' is, voeg dan de afbeelding toe
            const img = document.createElement('img');
            img.src = value;
            img.alt = 'Foto';
            img.style.width = '100%'; // Pas de grootte naar wens aan
            valueDiv.appendChild(img);
          } else {
            // Voor andere velden, toon de tekstwaarde
            valueDiv.textContent = value || 'Niet beschikbaar';
          }

          // Voeg label en waarde toe aan de rij
          detailRow.appendChild(labelDiv);
          detailRow.appendChild(valueDiv);

          // Voeg de rij toe aan de kaartdetails
          cardDetails.appendChild(detailRow);
        }
      }
    } else {
      // Voeg alleen de specifieke gevraagde velden toe
      cardInfo.fields.forEach(fieldName => {
        const value = cardInfo.data[fieldName];

        const detailRow = document.createElement('div');
        detailRow.className = 'detail-row';

        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.textContent = `${fieldName}:`;

        const valueDiv = document.createElement('div');
        valueDiv.className = 'value';
        if (fieldName === 'Foto') {
          // Als het veld 'Foto' is, voeg dan de afbeelding toe
          const img = document.createElement('img');
          img.src = value;
          img.alt = 'Foto';
          img.style.width = '100%'; // Pas de grootte naar wens aan
          valueDiv.appendChild(img);
        } else {
          // Voor andere velden, toon de tekstwaarde
          valueDiv.textContent = value || 'Niet beschikbaar';
        }

        // Voeg label en waarde toe aan de rij
        detailRow.appendChild(labelDiv);
        detailRow.appendChild(valueDiv);

        // Voeg de rij toe aan de kaartdetails
        cardDetails.appendChild(detailRow);
      });
    }

    // Voeg de kaart details toe aan de kaart content
    cardContent.appendChild(cardDetails);

    // Voeg de kaart toe aan de container
    detailsContainer.appendChild(cardContainer);
  });

  // Agreement verwerken
  if (data.a) {
    console.log('Data.a:', data.a);  // Controleer de waarde van data.a
    console.log('Mapped value:', fieldMapping.a[data.a]);  // Controleer de gemapte waarde
    const agreementText = fieldMapping.a[data.a] || data.a;
    document.getElementById('rdfcv-agreement').innerText = agreementText;
  } else {
    document.getElementById('rdfcv-agreement').innerText = 'Geen overeenkomst gevonden.';
  }
}


rdfcvAcceptButton.onclick = () => {
  const timestamp = new Date().toLocaleString();

  // Verwijder eerdere event handler om duplicatie te voorkomen
  confirmPinBtnVerifier.onclick = null;

  // Toon eerst het pincode-bevestigingsscherm
  goToPinConfirmationVerifier();

  confirmPinBtnVerifier.onclick = () => {
    if (window.currentRdfcvData) {
      saveSharedData(window.currentRdfcvData, timestamp);
      goToVerifierSuccessScreen(window.currentRdfcvData);
    } else {
      console.error("Geen RDFCV data beschikbaar om op te slaan.");
    }
    pinConfirmationScreenVerifier.style.display = 'none';
    resetPinInputs();
  };

  rdfcvModal.style.display = 'none';
};

rdfcvStopButton.onclick = () => {
  rdfcvModal.style.display = 'none';
  addCardScreen.style.display = 'none';
  walletScreen.style.display = 'block';
  bottomNav.style.display = 'flex';
  resetQrScanner();
};




// Functie om het pincode bevestigingsscherm verifier te tonen
function goToPinConfirmationVerifier() {
  console.log("Navigating to pin confirmation screen...");
  rdfcvModal.style.display = 'none'; // Verberg de vraagmodal
  pinConfirmationScreenVerifier.style.display = 'flex'; // Toon verifier pin bevestigingsscherm
  resetPinInputs(); // Reset pincode-invoervelden
}

// Functie voor het succes-scherm na delen met verifier
function goToVerifierSuccessScreen(data) {
  successScreen.style.display = 'flex';
  successMessage.textContent = "Succes!";
  verifierNameElement.textContent = data.requester || 'Onbekende partij'; // Voeg hier data.requester toe

  // Logging wanneer het succes-scherm wordt weergegeven
  console.log("Succes-scherm geopend voor verifier:", data.requester || 'Onbekende partij');

  // "Zie Activiteit" knop
  seeActivityBtn.onclick = function() {
      console.log("Zie Activiteit knop ingedrukt. Wallet-scherm verbergen, activiteiten-scherm tonen.");

      successScreen.style.display = 'none'; // Verberg het succes-scherm
      addCardScreen.style.display = 'none'; // Verberg het add-card scherm
      walletScreen.style.display = 'none';  // Verberg het wallet-scherm
      bottomNav.style.display = 'flex'; // Toon de navbar onderaan opnieuw
      activityScreen.style.display = 'block'; // Toon het activiteiten-scherm
      showActivities(); // Toon de activiteitenlijst

      // Navigatiebalk correct instellen
      document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active')); 
      document.querySelector('.nav-item:nth-child(2)').classList.add('active'); // Activeer het activiteiten-item

      console.log("Wallet-scherm verborgen, activiteiten-scherm getoond.");
  };

  // "Sluiten" knop
  closeSuccessBtn.onclick = function() {
      console.log("Sluiten knop ingedrukt. Terug naar het wallet-scherm.");

      successScreen.style.display = 'none'; // Verberg het succes-scherm
      addCardScreen.style.display = 'none'; // Verberg het add-card scherm
      bottomNav.style.display = 'flex'; // Toon de navbar onderaan opnieuw
      walletScreen.style.display = 'block'; // Terug naar het wallet-scherm
      resetPinInputs(); // Reset de pincode-invoer

      // Reset de status van de deelactie
      isSharingActionInProgress = false;

      console.log("Succes-scherm verborgen, wallet-scherm getoond, deelactie gereset.");
  };
}


