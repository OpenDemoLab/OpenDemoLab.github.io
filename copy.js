document.addEventListener("DOMContentLoaded", function() {
    // E-mailadres in stukjes
    const deel1 = "info";
    const deel2 = "@";
    const deel3 = "opendemolab.eu";
    const mailadres = deel1 + deel2 + deel3;

    // Vul de e-mail link in de HTML in
    const emailLink = document.getElementById("emailAddress");
    emailLink.textContent = mailadres;
    emailLink.href = "mailto:" + mailadres;

    // Haal de knop op met de juiste id
    const copyButton = document.getElementById("copyButton");

    // Voeg een event listener toe aan de knop
    copyButton.addEventListener("click", function() {
      navigator.clipboard.writeText(mailadres)
        .then(() => {
          console.log("E-mailadres gekopieerd: " + mailadres);
          // Wijzig de knop: achtergrond lichtgroen en tekstkleur wit, met de tekst "gekopieerd"
          copyButton.textContent = "gekopieerd";
          copyButton.style.backgroundColor = "lightgreen";
          copyButton.style.color = "white";
          // Reset na 2 seconden de knop naar de oorspronkelijke staat
          setTimeout(() => {
            copyButton.textContent = "Kopieer";
            copyButton.style.backgroundColor = "";
            copyButton.style.color = "";
          }, 2000);
        })
        .catch(err => console.error("Fout bij kopiëren:", err));
    });
  });