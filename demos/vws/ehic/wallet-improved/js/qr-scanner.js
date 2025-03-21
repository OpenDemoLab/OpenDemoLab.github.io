// qr-scanner.js - QR-code scanning functionaliteit
import { screenManager } from './navigation.js';
import { showEhicCardModal } from './modals/ehic-collect.js';
import { showEhicShareModal } from './modals/ehic-share.js';

// Globale html5QrCode instantie
let html5QrCode = null;

/**
 * Initialiseert de QR-scanner
 */
export function initQrScanner() {
  // Event listeners voor scanner scherm
  document.getElementById('scan-button').addEventListener('click', () => {
    startQrScan();
  });

  document.getElementById('close-scan-button').addEventListener('click', () => {
    stopQrScan();
  });
  
  // Luister naar berichten voor simulatie-modus (alleen voor testen)
  window.addEventListener("message", function(event) {
    if (event.data.action === "simulateScan" && event.data.qrData) {
      simulateQrScan(event.data.qrData);
    }
  });
}

/**
 * Start de QR-scanner
 */
export function startQrScan() {
  // Toon het juiste scannerscherm
  document.querySelector('.scan-container').style.display = 'none';
  document.getElementById('close-scan-button').style.display = 'block';
  document.getElementById('reader').style.display = 'block';

  // Maak een nieuwe scanner instantie als die er nog niet is
  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("reader");
  }

  // Start het scannen
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    onScanSuccess,
    onScanError
  );
}

/**
 * Stopt de QR-scanner
 */
export function stopQrScan() {
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

/**
 * Reset de QR-scanner
 */
export function resetQrScanner() {
  stopQrScan();
}

/**
 * Functie die wordt aangeroepen bij succesvolle QR-scan
 * @param {string} decodedText - De gescande tekst
 */
function onScanSuccess(decodedText) {
  console.log("QR code scanned: ", decodedText);

  // Controleer of de gescande tekst een API URL is
  const isApiUrl = decodedText.startsWith("http") && decodedText.includes("/api/data/");
  
  if (isApiUrl) {
    console.log("API URL detected. Fetching data...");
    fetchQrScandata(decodedText);
  } else {
    // Probeer de tekst als JSON te parsen
    try {
      const data = JSON.parse(decodedText);
      const timestamp = new Date().toLocaleString();
      processScannedData(data, timestamp);
      stopQrScan();
    } catch (error) {
      console.error("QR-code parse error: ", error);
    }
  }
}

/**
 * Functie die wordt aangeroepen bij QR-scan fout
 * @param {string} errorMessage - De foutmelding
 */
function onScanError(errorMessage) {
  console.error(`QR scan failed: ${errorMessage}`);
}

/**
 * Haalt QR-scan data op van een API URL
 * @param {string} apiUrl - De API URL
 */
function fetchQrScandata(apiUrl) {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      try {
        const timestamp = new Date().toLocaleString();
        processScannedData(data, timestamp);
        stopQrScan();
      } catch (error) {
        console.error("Error processing scan data: ", error);
      }
    })
    .catch(error => {
      console.error("Error fetching data: ", error);
    });
}

/**
 * Verwerkt gescande QR-code data
 * @param {Object} data - De gescande data
 * @param {string} timestamp - Tijdstempel van de scan
 */
function processScannedData(data, timestamp) {
  console.log("Processing scanned data: ", data, "Timestamp: ", timestamp);

  // Verwerk verifier QR-code (delen van gegevens)
  if (data.type === "verifier" && data.rdfcv) {
    console.log("RDFCV QR-code herkend.");
    
    // Bewaar de data als een globaal object voor later gebruik
    window.currentRdfcvData = data;

    // Controleer of het een EHIC-pas request is
    if (data.requestedCard === "EHIC pas") {
      console.log("EHIC pas request gedetecteerd in verifier flow.");
      // Gebruik dinamische import om de showEhicShareModal functie te laden
      import('./modals/ehic-share.js').then(module => {
        module.showEhicShareModal(data);
      });
    } else {
      // Voor andere types: gebruik de standaard RDFCV modal via dynamische import
      import('./modals/rdfcv.js').then(module => {
        module.showRdfcvModal(data);
      });
    }
  }
  // Verwerk issuer QR-code (toevoegen van credentials)
  else if (data.issuedBy && data.name) {
    console.log("Issuer QR-code herkend.");

    // Controleer of het een EHIC pas is
    if (data.name === "EHIC pas") {
      console.log("EHIC pas QR-code herkend.");
      import('./modals/ehic-collect.js').then(module => {
        module.showEhicCardModal(data);
      });
    } else {
      // Voor andere types: gebruik de standaard RDFCI modal via dynamische import
      import('./modals/rdfcv.js').then(module => {
        module.showRdfciModal(data);
      });
    }
  } else {
    console.log("Onbekende QR-code structuur.");
    // Toon een foutmelding aan de gebruiker
    alert("Onbekende QR-code structuur. Probeer een andere QR-code.");
    // Ga terug naar het wallet scherm
    screenManager.showScreen('wallet', true);
  }
}

/**
 * Simuleert een QR-code scan (alleen voor test doeleinden)
 * @param {string} decodedText - De gesimuleerde scan data
 */
function simulateQrScan(decodedText) {
  console.log("Simulating QR scan with:", decodedText);
  onScanSuccess(decodedText);
}