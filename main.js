window.scrollTo(0, 0)

function createTypingEffect(text, elementOuEcrire, spd) {
    let i = 0;
    const speed = spd;

    function writeText() {
        const element = document.querySelector(elementOuEcrire);
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(writeText, speed);
        }
    }

    function checkScroll() {
        const textContainer = document.querySelector(elementOuEcrire);
        const rect = textContainer.getBoundingClientRect();
        const isTextVisible = rect.top <= window.innerHeight && rect.bottom >= 0;

        if (isTextVisible && i === 0) {
            writeText();
        }
    }

    window.addEventListener('load', function () {
        checkScroll();
    });

    window.addEventListener('scroll', function () {
        checkScroll();
    });
}

createTypingEffect("Expériences", '.experiences-heading', 100);
createTypingEffect("Loris Caruhel", '.mon_nom', 100);
createTypingEffect("Scolarité", '.scolarite-heading', 100);
createTypingEffect("Futur Développeur", '.moi-heading', 100);
createTypingEffect("Compétences", '.competences-heading', 100);

var all_comp = [
  {
    comp1: {
      Titre: "SAÉ 1.01 - Sudoku",
      Content : "Créer un sudoku en C."
    },
    comp2: {
      Titre: "SAÉ 1.02 - Résolveur de Sudoku",
      Content : "Créer un résolveur de sudoku en C."
    },
    comp3: {
      Titre: "SAÉ 1.03 - Installation d'un poste pour le développement",
      Content : "Convertisseur de commentaire d'un programme en doc, coder en php/bash."
    },
    comp4: {
      Titre: "SAÉ 1.04 - Création d'une base de données",
      Content : "Créer une base de donné en SQL."
    },
    comp5: {
      Titre: "SAÉ 1.05 - Site web",
      Content : "Créer un site web à l'aide des crititères d'un client."
    },
    comp6: {
      Titre: "SAÉ 1.06 - Découverte de l'environnement économique et écologique",
      Content : "Analyser complètement la RSE d'une entreprise en équipe."
    }
  }
]

export function addProject(projet) {
  let competence = all_comp[0][projet];

  let cardDiv = document.createElement('div');
  cardDiv.classList.add('card');

  let contentDiv = document.createElement('div');
  contentDiv.classList.add('content');

  let link = document.createElement('a');
  link.setAttribute('href', '#');

  let titleSpan = document.createElement('span');
  titleSpan.classList.add('title');
  titleSpan.textContent = competence.Titre;
  link.appendChild(titleSpan);

  let descParagraph = document.createElement('p');
  descParagraph.classList.add('desc');
  descParagraph.textContent = competence.Content;

  let actionLink = document.createElement('a');
  actionLink.setAttribute('href', '#');
  actionLink.classList.add('action');
  actionLink.textContent = 'Find out more';

  let arrowSpan = document.createElement('span');
  arrowSpan.setAttribute('aria-hidden', 'true');
  arrowSpan.textContent = '→';
  actionLink.appendChild(arrowSpan);
  contentDiv.appendChild(link);
  contentDiv.appendChild(descParagraph);
  contentDiv.appendChild(actionLink);
  cardDiv.appendChild(contentDiv);

  return cardDiv;
}
console.log(addProject('comp1'))

// Détecter l'OS car le fonc ne marche pas sous linux.
function detecterOS() {
  var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

  if (macPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
  } else if (/Android/.test(userAgent)) {
      os = 'Android';
  } else if (/Linux/.test(platform)) {
      os = 'Linux';
  }

  return os;
}

function afficherPopupSiLinux() {
    var os = detecterOS();
    if (os === 'Linux') {
        alert('Pour une meilleur experience de mon portfolio utiliser windows ou mac OS.');
    }
}

afficherPopupSiLinux();