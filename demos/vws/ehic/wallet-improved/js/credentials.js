// credentials.js - Beheer van credentials (kaarten) in de wallet
import { screenManager } from './navigation.js';
import { fieldMapping, cardStyles } from './utils.js';

// De collectie van credentials
export let credentials = [];

/**
 * Laadt credentials uit de sessionstorage
 */
export function loadCredentials() {
  const storedCredentials = sessionStorage.getItem('credentials');
  if (storedCredentials) {
    credentials = JSON.parse(storedCredentials);
  }
  
  // Laad standaard credentials als dat nog niet is gebeurd
  loadDefaultCredentials();
  
  // Sla de credentials op (voor het geval standaard credentials zijn toegevoegd)
  saveCredentials();
}

/**
 * Slaat credentials op in sessionstorage
 */
export function saveCredentials() {
  sessionStorage.setItem('credentials', JSON.stringify(credentials));
}

/**
 * Laadt de standaard credentials (persoonlijke data, woonadres, etc.)
 */
export function loadDefaultCredentials() {
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

  // Controleer voor elke standaard kaart of deze al bestaat, anders toevoegen
  defaultCards.forEach(defaultCard => {
    const index = credentials.findIndex(cred => cred.name === defaultCard.name);
    if (index !== -1) {
      credentials[index] = defaultCard;
    } else {
      credentials.push(defaultCard);
    }
  });
}

/**
 * Toont credentials in de wallet interface
 */
export function displayCredentials() {
  const walletGrid = document.getElementById('wallet-grid');
  walletGrid.innerHTML = '';

  credentials.forEach((cred, index) => {
    // Sla deelacties en activiteiten over
    if (cred.isShareAction || cred.isActivity) {
      return;
    }

    if (typeof cred.name !== 'string') {
      return;
    }

    // Speciale afhandeling voor EHIC pas
    if (cred.name.toLowerCase() === 'ehic pas') {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.backgroundImage = "url('../base/images/ehic-front.png')";
      card.style.backgroundSize = 'cover';
      card.style.backgroundPosition = 'center';

      card.addEventListener('click', () => {
        // Import EHIC modal module via dynamische import
        import('./modals/ehic-collect.js').then(module => {
          module.showEhicDetails(cred, index);
        });
      });
      
      walletGrid.appendChild(card);
      return;
    }

    // Standaard kaarten
    const card = document.createElement('div');
    card.className = 'card';

    // Haal stijlen op basis van kaartnaam
    const nameLower = cred.name.toLowerCase();
    const styles = cardStyles[nameLower] || {
      iconClass: 'far fa-id-badge',
      iconColor: '#333',
      textColor: '#333'
    };

    // Definieer grootte en marges
    const iconSize = '30px';
    const textSize = '18px';
    const issuerTextSize = '14px';
    const iconMarginBottom = '10px';

    // Controleer of een afbeeldingspad is opgegeven
    let iconHtml = '';
    if (styles.imagePath) {
      iconHtml = `<img src="${styles.imagePath}" alt="${cred.name} logo" style="width: ${iconSize}; height: ${iconSize}; margin-bottom: ${iconMarginBottom};">`;
    } else {
      iconHtml = `<i class="${styles.iconClass}" style="color: ${styles.iconColor}; font-size: ${iconSize}; margin-bottom: ${iconMarginBottom};"></i>`;
    }

    // Voeg uitgever-informatie toe
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

    // Voeg HTML toe voor de kaart
    card.innerHTML = `
      ${iconHtml}
      <div class="card-text" style="font-size: ${textSize};">
        <h3 style="color: ${styles.textColor}; margin: 0;">${cred.name}</h3>
        ${issuerText}
      </div>
    `;

    // Voeg event listener toe om kaartdetails te bekijken
    card.addEventListener('click', () => screenManager.showDetails(cred, index));

    // Voeg de kaart toe aan het wallet grid
    walletGrid.appendChild(card);
  });
}

/**
 * Voegt een credential toe aan de wallet
 * @param {Object} credential - Het credential object om toe te voegen
 */
export function addCredential(credential) {
  credentials.push(credential);
  saveCredentials();
}

/**
 * Verwijdert een credential uit de wallet
 * @param {number} index - De index van het credential om te verwijderen
 */
export function removeCredential(index) {
  credentials.splice(index, 1);
  saveCredentials();
}

/**
 * Zoekt een credential op naam
 * @param {string} name - De naam van het credential
 * @returns {Object|null} - Het gevonden credential of null
 */
export function findCredentialByName(name) {
  return credentials.find(cred => cred.name === name) || null;
}

/**
 * Voegt een deel-actie toe aan de activiteitengeschiedenis
 * @param {Object} data - Data van de gedeelde credentials
 * @param {string} timestamp - Tijdstip van delen
 */
export function saveSharedData(data, timestamp = new Date().toLocaleString()) {
  credentials.push({
    name: data.requester || 'Onbekende partij',
    reason: data.reason || 'Geen reden opgegeven',
    sharedData: data.rdfcv ? data.rdfcv.map(field => fieldMapping[field] || field) : [],
    agreement: data.a ? (fieldMapping.a[data.a] || data.a) : 'Geen overeenkomst',
    actionTimestamp: timestamp,
    isShareAction: true
  });
  
  saveCredentials();
}