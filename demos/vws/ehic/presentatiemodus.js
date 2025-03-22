// presentatiemodus.js - Script voor de presentatiemodus

// DOM elementen
const iframeLeft = document.getElementById("iframeLeft");
const iframeRight = document.getElementById("iframeRight");
const iframeFlow = document.getElementById("iframeFlow");
const slidingPanel = document.getElementById("slidingPanel");
const panelTab = document.getElementById("panelTab");
const leftSlidingPanel = document.getElementById("leftSlidingPanel");
const leftPanelTab = document.getElementById("leftPanelTab");
const rightHintBalloon = document.getElementById("rightHintBalloon");
const leftHintBalloon = document.getElementById("leftHintBalloon");
const hintCloseButtons = document.querySelectorAll(".hint-close");

// Variabele voor het bijhouden van QR codes en actieve sectie
let qrCodesBySection = {};
let activeSection = null;

// Hint sluiten knoppen
hintCloseButtons.forEach(button => {
  button.addEventListener("click", function(e) {
    e.stopPropagation(); // Voorkom dat het panel opent
    const hintBalloon = this.closest('.hint-balloon');
    if (hintBalloon) {
      hintBalloon.classList.remove("show");
    }
  });
});

// Toggle voor sliding panels
panelTab.addEventListener("click", function() {
  slidingPanel.classList.toggle("open");
});

leftPanelTab.addEventListener("click", function() {
  leftSlidingPanel.classList.toggle("open");
});

// Haal het basispad uit de huidige URL
const currentPath = window.location.pathname;
const baseDir = currentPath.substring(0, currentPath.lastIndexOf('/'));

// Controleer of de website lokaal draait
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// Bepaal het domein voor online versie
const onlineDomain = "https://www.opendemolab.eu";

// Stel de juiste URL's in
const leftSrc = isLocal
    ? `${baseDir}/base/index.html`  // Relatief pad naar base/index.html
    : `${onlineDomain}${baseDir}/base/index.html`; // Online versie

const rightSrc = isLocal
    ? "/demos/vws/ehic/wallet-improved/index.html"  // Wallet demo blijft absoluut 
    : "https://www.opendemolab.eu/demos/vws/ehic/wallet/index.html"; // Online versie
    
const flowSrc = isLocal
    ? `${baseDir}/architecture/vc.html`  // Relatief pad naar architecture/vc.html
    : `${onlineDomain}${baseDir}/architecture/vc.html`; // Online versie

// Functie om de zichtbaarheid van de flow content bij te werken
function updateFlowVisibility(showFlow) {
  const flowPane = document.querySelector('.flow-pane');
  const flowHeader = document.querySelector('.flow-header');
  
  if (showFlow) {
    flowPane.style.display = 'flex';
    flowHeader.style.display = 'block';
    document.querySelector('.flow-header h4').textContent = "Interactieve Architectuurplaat";
    document.querySelector('.flow-header .step-info').textContent = 
      "Deze visualisatie toont hoe verifiable credentials van een authentieke bron via eDelivery naar een wallet worden getransporteerd.";
  } else {
    flowPane.style.display = 'none';
    flowHeader.style.display = 'block';
    document.querySelector('.flow-header h4').textContent = "Geen architectuurplaat beschikbaar";
    document.querySelector('.flow-header .step-info').textContent = 
      "Er is geen architectuurplaat beschikbaar voor deze stap van de demo.";
  }
} 

// Laad iframes direct bij het laden van de pagina
window.addEventListener("DOMContentLoaded", function() {
  // Listener vóór je de src zet, zodat je de load niet mist
  iframeLeft.addEventListener("load", handleLeftIframeLoad);
  iframeLeft.src = leftSrc;
  iframeRight.src = rightSrc;
  
  // Laad de flow iframe alvast, maar verberg de inhoud indien nodig
  iframeFlow.src = flowSrc;
  updateFlowVisibility(false); // Begin met niet-zichtbare flow content
});

// Functie om de linker iframe te verwerken na het laden
function handleLeftIframeLoad() {
    try {
        const leftDoc = iframeLeft.contentDocument || iframeLeft.contentWindow.document;
        
        // Initieel alle QR codes opslaan per sectie
        const allSections = leftDoc.querySelectorAll('section.step');
        qrCodesBySection = {}; // Reset de opslag
        
        // Voor elke sectie, sla de QR codes op
        allSections.forEach((section, sectionIndex) => {
            const sectionId = section.id; // bijvoorbeeld "step-1"
            const qrImages = section.querySelectorAll('img[src*="create-qr-code"]');
            
            if (qrImages.length > 0) {
                qrCodesBySection[sectionId] = [];
                
                qrImages.forEach((img, index) => {
                    const qrUrl = img.getAttribute("src") || "";
                    const paramMatch = qrUrl.match(/data=([^&]+)/);
                    if (!paramMatch) return;
                    
                    const rawData = decodeURIComponent(paramMatch[1]);
                    let jsonData;
                    try {
                        jsonData = JSON.parse(rawData);
                    } catch(e) {
                        console.warn("Kon de QR-data niet parsen:", rawData, e);
                        return;
                    }
                    
                    // Lees de alt-tekst; indien niet aanwezig -> fallback
                    const altText = img.getAttribute("alt") || `QR code in ${sectionId.replace("-", " ")} #${index + 1}`;
                    
                    qrCodesBySection[sectionId].push({
                        altText: altText,
                        jsonData: jsonData
                    });
                });
            }
        });
        
        // Functie om te controleren of een stap de VC Flow moet tonen
        function checkForFlowActivation(section) {
            // Controleer op data-attribute voor VC flow
            return section.hasAttribute('data-show-vc-flow');
        }
        
        // Functie om de actieve sectie bij te werken
        function updateActiveSection(sectionId, section) {
            // Sla actieve sectie op voor later gebruik
            activeSection = sectionId;
            
            // Controleer of deze stap de VC flow moet tonen
            const shouldShowFlow = checkForFlowActivation(section);
            
            // Werk zichtbaarheid van flow bij op basis van de stap
            updateFlowVisibility(shouldShowFlow);
        }
        
        // Monitor actieve sectie in de iframe
        function monitorActiveSection() {
            try {
                const activeSection = leftDoc.querySelector('section.step.active') || 
                                  leftDoc.querySelector('section.step[style*="display: block"]');
                
                if (activeSection) {
                    const activeSectionId = activeSection.id;
                    updateActiveSection(activeSectionId, activeSection);
                }
            } catch (err) {
                console.warn("Kon actieve sectie niet detecteren:", err);
            }
        }
        
        // Eerste keer uitvoeren
        monitorActiveSection();
        
        // Observer op de body van de linker iframe om veranderingen in actieve sectie te detecteren
        const bodyObserver = new MutationObserver(function(mutations) {
            monitorActiveSection();
        });
        
        // Start observeren van wijzigingen in de DOM
        bodyObserver.observe(leftDoc.body, { 
            childList: true, 
            subtree: true, 
            attributes: true, 
            attributeFilter: ['class', 'style'] 
        });
        
        // Luister naar klikken op de navigatieknoppen
        const navButtons = leftDoc.querySelectorAll('button.prev, button.next');
        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Kleine vertraging voor DOM updates
                setTimeout(monitorActiveSection, 100);
            });
        });
        
    } catch(err) {
        console.warn("Kan de DOM van iframeLeft niet benaderen (CORS?)", err);
    }
}

// Luisteren naar berichten van iframes
window.addEventListener("message", (event) => {
    console.log("Presentatiepagina ontving message:", event.data);
    
    // Wanneer de wallet vraagt om een QR-scan te simuleren
    if (event.data.action === "requestQRScan") {
        // Haal QR-codes op van het actieve scherm
        if (activeSection && qrCodesBySection[activeSection] && qrCodesBySection[activeSection].length > 0) {
            // Neem de eerste QR code 
            const firstQRCode = qrCodesBySection[activeSection][0];
            
            // Stuur deze terug naar de wallet iframe om te scannen
            iframeRight.contentWindow.postMessage({
                action: "simulateScan",
                qrData: JSON.stringify(firstQRCode.jsonData)
            }, "*");
            
            // Open het panel als het nog niet open is
            if (!slidingPanel.classList.contains("open")) {
                slidingPanel.classList.add("open");
            }
        } else {
            // Laat de gebruiker weten dat er geen QR codes beschikbaar zijn
            alert("Er zijn geen QR codes beschikbaar in deze stap van de presentatie.");
        }
    }
});