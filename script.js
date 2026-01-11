(async function app() {
  let state = {
    data: {},
    competencesMap: {},
    deepLearningCompetencesMap: [],
    languagesMap: {},
    domElements: {}
  };

  async function initData() {
    try {
      const res = await fetch("./assets/data/data.json");
      const data = await res.json();
      
      state.data = data;

      // Création des Maps pour éviter les .find() lents dans les boucles
      state.competencesMap = data.competences.reduce((acc, item) => {
        acc[item.value] = item.name;
        return acc;
      }, {});

      state.languagesMap = data.languagesIcons.reduce((acc, item) => {
        acc[item.alt] = item;
        return acc;
      }, {});

      state.deepLearningCompetencesMap = data.deepLearningCompetences;

      return true;
    } catch (error) {
      console.error("Erreur chargement données:", error);
      return false;
    }
  }

  // 2. Génération HTML (Optimisée avec Array.map et join)
  function renderProjects(projets) {
    return projets.map(project => {
      const competenceDataSet = project.competences.join(" ");
      
      // Génération des pastilles (Pellets)
      // NOTE: On utilise des attributs data-tooltip pour gérer le survol en CSS (zéro JS requis au runtime)
      let bDeepLearning = false;
      const pelletsHTML = project.competences.map(comp => {
        // Test si les compétences contiennent une appronfondi dans la 3ème année
        if(state.deepLearningCompetencesMap.includes(comp)) {
          bDeepLearning = true;
        }

        const color = state.data.competencesCouleurs[comp];
        const name = state.competencesMap[comp];
        if (!color) return '';
        
        return `<div 
          class="pellet tooltip-target"
          style="background-color: ${color};"
          data-tooltip="${name}"
        ></div>`;
      }).join("");

      // Génération des icônes langages
      const iconsHTML = project.languages.map(lang => {
        const langData = state.languagesMap[lang];
        return langData ? `<img class="project-language-icon" src="${langData.src}" alt="${lang}" />` : '';
      }).join("");

      return `
        <div class="project-card" id="${bDeepLearning ? 'border-deep-learning' : ''}" data-competence="${competenceDataSet}">
          <div class="pellets-competences">${pelletsHTML}</div>
          ${bDeepLearning ? '<img class="star-corner" src="./assets/icons/color/stars.svg" alt="Stars" />' : ''}
          <div class="presentation-image-container">
            <img class="presentation-image" src="${project.image.src}" alt="${project.image.alt}" onclick="projectImage('${project.image.src}')"/>
          </div>
          <div class="project-description">
            <h1>${project.title}</h1>
            <p>${project.description}</p>
            <button class="read-more-btn" style="display: none;">Lire plus</button>
            <div class="footer-card">
              <div class="techno-container">${iconsHTML}</div>
              <p>${project.type}</p>
            </div>
          </div>
        </div>
      `;
    }).join(""); // On joint tout en une seule string
  }

  async function initUI() {
  // 3. Initialisation de l'interface
    const dataLoaded = await initData();
    if (!dataLoaded) return;

    const els = {
      projectsContainer: document.getElementById("projects-container"),
      selectCompetences: document.getElementById("select-competences"),
      navbar: document.querySelector(".navbar"),
      softSkillsContainers: [
        document.getElementById("first-part"),
        document.getElementById("second-part")
      ]
    };

    // Rendu des Projets (Une seule écriture dans le DOM)
    els.projectsContainer.innerHTML = renderProjects(state.data.projets);

    const cards = els.projectsContainer.querySelectorAll('.project-card');

    cards.forEach(card => {
      const textElem = card.querySelector('.project-card p');
      const btn = card.querySelector('.read-more-btn');

      setTimeout(() => {
        if (textElem.scrollHeight > (textElem.offsetHeight + 5)) {
          btn.style.display = 'block';
        }
      }, 200);

      btn.addEventListener('click', () => {
        const isExpanded = textElem.classList.toggle('expanded');
        btn.textContent = isExpanded ? 'Réduire' : 'Lire plus';
        card.style.height = isExpanded ? 'auto' : 'auto'; 
      });
    });

    // On cache les références aux cartes projets pour le filtrage futur
    const projectCards = Array.from(els.projectsContainer.getElementsByClassName('project-card'));

    // Rendu du Select
    const optionsHTML = state.data.competences.map(comp => 
      `<option value="${comp.value}" ${comp.bDefaut ? 'selected' : ''}>${comp.name}</option>`
    ).join("");
    els.selectCompetences.innerHTML = optionsHTML;

    // Filtrage (Event Listener)
    els.selectCompetences.addEventListener("change", (e) => {
      const selected = e.target.value;
      projectCards.forEach(card => {
        const match = selected === "toutes" || card.dataset.competence.includes(selected);
        card.style.display = match ? "block" : "none";
      });
    });

    // Rendu des Skills (Une seule écriture par conteneur)
    const skillsHTML = state.data.languagesIcons.map(skill => `
      <div class="card">
        <a href="${skill.href}" target="_blank" rel="noopener noreferrer">
          <img src="${skill.src}" alt="${skill.alt}" />
        </a>
      </div>
    `).join("");

    els.softSkillsContainers.forEach(container => {
      if(container) container.innerHTML += skillsHTML;
    });

    // Gestion du Scroll
    let isScrolling = false;
    window.addEventListener("scroll", () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            els.navbar.classList.remove("hidden");
          } else {
            els.navbar.classList.add("hidden");
          }
          isScrolling = false;
        });
        isScrolling = true;
      }
    });

    document.querySelector(".footer-content p").textContent = `© ${new Date().getFullYear()} Loris CARUHEL`;
  }
  initUI();

  function projectImage(src) {
    const modalImg = document.createElement('div');
    modalImg.classList.add('modal-image');
    modalImg.innerHTML = `
      <span class="close-btn">&times;</span>
      <img class="modal-content" src="" alt="Project Image"/>
    `;
    document.body.appendChild(modalImg);

    const imgElement = document.querySelector('.presentation-image');
    const modalContent = modalImg.querySelector('.modal-content');
    modalContent.src = src;
    modalContent.alt = imgElement.alt;

    const closeBtn = modalImg.querySelector('.close-btn');
    closeBtn.onclick = function() {
      modalImg.style.display = "none";
      document.body.removeChild(modalImg);
    }

    modalImg.onclick = function(event) {
      if (event.target === modalImg) {
        modalImg.style.display = "none";
        document.body.removeChild(modalImg);
      }
    }
  }
  window.projectImage = projectImage;
})();
