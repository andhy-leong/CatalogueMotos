let currentMotos = [];
const API_URL = "http://localhost:3001/api/motos";

// Variables de garde pour ne remplir les filtres qu'une seule fois
let filtresPopulated = false;
let moteurFilterPopulated = false;
let typeFilterPopulated = false;

document.addEventListener("DOMContentLoaded", () => {
  const filterForm = document.getElementById("filter-form");
  const sortSelect = document.getElementById("sort-select");

  // Filtres dynamiques
  const moteurSelect = document.getElementById("moteur");
  const moteurtTypeGroup = document.getElementById("moteurt_type_group");
  const moteurtTypeSelect = document.getElementById("moteurt_type");

  // Recherche Marque -> Modèle
  const marqueInput = document.getElementById("marque");
  const nomSelect = document.getElementById("nom");
  const nomGroup = document.getElementById("nom-group");

  const anneeMinInput = document.getElementById("annee_min");
  const anneeMaxInput = document.getElementById("annee_max");

  // Chargement initial
  fetchMotos();
  fetchAnneeMoto();

  // Pour permettre à l'année min dêtre > année max
  if (anneeMinInput && anneeMaxInput) {
    anneeMinInput.addEventListener("change", () => {
      const minVal = parseInt(anneeMinInput.value);
      const maxVal = parseInt(anneeMaxInput.value);

      if (!isNaN(minVal) && !isNaN(maxVal) && minVal > maxVal) {
        anneeMaxInput.value = minVal;
      }
    });
    anneeMaxInput.addEventListener("change", () => {
      const minVal = parseInt(anneeMinInput.value);
      const maxVal = parseInt(anneeMaxInput.value);
      if (!isNaN(minVal) && !isNaN(maxVal) && maxVal < minVal) {
        anneeMinInput.value = maxVal;
      }
    });
  }

  // --- Fonction Helper : Récupérer TOUS les paramètres (Filtres + Tri) ---
  const getGlobalParams = () => {
    const formData = new FormData(filterForm);
    const params = new URLSearchParams();

    // Liste des filtres numériques min/max qui doivent être convertis
    const numericalFilters = [
      "annee_min",
      "annee_max",
      "prix_min",
      "prix_max",
      "vitesse_max_min",
      "vitesse_max_max",
      "temps_0_100_min",
      "temps_0_100_max",
      "conso_carburant_min",
      "conso_carburant_max",
      "capacite_reservoir_min",
      "capacite_reservoir_max",
      "cylindree_min",
      "cylindree_max",
      "poids_min",
      "poids_max",
      "hauteur_selle_min",
      "hauteur_selle_max",
      "longueur_min",
      "longueur_max",
      "nombre_rapports_min",
      "nombre_rapports_max",
      "puissance_dni_cv_min",
      "puissance_dni_cv_max",
      "puissance_kw_min",
      "puissance_kw_max",
      "puissance_fiscale_min",
      "puissance_fiscale_max",
    ];

    // 1. Ajouter les filtres du formulaire
    for (const [key, value] of formData.entries()) {
      const trimmedValue = String(value).trim();

      if (trimmedValue) {
        if (numericalFilters.includes(key)) {
          const numValue = parseFloat(trimmedValue);
          if (!isNaN(numValue)) {
            params.append(key, numValue);
          }
        } else {
          // Pour les champs texte (marque, selects des éléments mécaniques, etc.)
          params.append(key, trimmedValue);
        }
      }
    }

    // 2. Ajouter le tri
    if (sortSelect && sortSelect.value !== "default") {
      params.append("sort", sortSelect.value);
    }

    return params.toString();
  };

  // --- 1. Soumission du formulaire  ---
  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchMotos(`?${getGlobalParams()}`);
  });

  // --- 2. Réinitialisation  ---
  filterForm.addEventListener("reset", () => {
    moteurtTypeGroup.classList.add("hidden");
    moteurtTypeSelect.value = "";

    if (nomGroup) nomGroup.classList.add("hidden");
    if (nomSelect) nomSelect.innerHTML = '<option value="">Tous</option>';

    sortSelect.value = "default";
    setTimeout(() => fetchMotos(), 0); // timeout pour laisser le temps au form de se vider
  });

  // --- 3. Tri
  sortSelect.addEventListener("change", () => {
    fetchMotos(`?${getGlobalParams()}`);
  });

  // --- 4. Logique Type Moteur ---
  moteurSelect.addEventListener("change", () => {
    const value = moteurSelect.value;
    if (value === "Thermique" || value === "Hybride") {
      moteurtTypeGroup.classList.remove("hidden");
    } else {
      moteurtTypeGroup.classList.add("hidden");
      moteurtTypeSelect.value = "";
    }
  });

  // --- 5. Logique Marque -> Nom ---
  if (marqueInput) {
    marqueInput.addEventListener("change", async () => {
      const marque = marqueInput.value.trim();
      if (nomSelect) nomSelect.innerHTML = '<option value="">Tous</option>';

      if (marque) {
        try {
          const response = await fetch(
            `${API_URL}/noms?marque=${encodeURIComponent(marque)}`
          );
          if (response.ok) {
            const noms = await response.json();
            if (noms.length > 0) {
              noms.forEach((nom) => {
                const option = document.createElement("option");
                option.value = nom;
                option.textContent = nom;
                nomSelect.appendChild(option);
              });
              if (nomGroup) nomGroup.classList.remove("hidden");
            } else {
              if (nomGroup) nomGroup.classList.add("hidden");
            }
          }
        } catch (error) {
          console.error("Erreur récupération noms :", error);
        }
      } else {
        if (nomGroup) nomGroup.classList.add("hidden");
      }
    });
  }
});

async function fetchMotos(queryString = "") {
  const listElement = document.getElementById("motos-list");
  listElement.innerHTML = "<p>Chargement...</p>";

  try {
    const response = await fetch(`${API_URL}${queryString}`);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

    currentMotos = await response.json();

    // Remplissage initial des filtres
    if (queryString === "" && !filtresPopulated) {
      // Filtres existants
      populateFilter("moteur", "type_carburant", currentMotos);
      populateFilter("type", "categorie", currentMotos);
      populateFilter("suspension_avant", "suspension_avant", currentMotos);
      populateFilter("suspension_arriere", "suspension_arriere", currentMotos);
      populateFilter("frein_avant", "frein_avant", currentMotos);
      populateFilter("frein_arriere", "frein_arriere", currentMotos);
      populateFilter(
        "moteur_nb_cylindres",
        "moteur_nb_cylindres",
        currentMotos
      );
      populateFilter(
        "moteur_transmission",
        "moteur_transmission",
        currentMotos
      );

      filtresPopulated = true;
    }

    displayMotos();
  } catch (error) {
    console.error("Erreur fetch:", error);
    listElement.innerHTML = "<p>Impossible de charger les données.</p>";
  }
}

function populateFilter(selectId, dataField, motos) {
  const selectElement = document.getElementById(selectId);
  if (!selectElement) return;

  const uniqueValues = new Set();
  motos.forEach((moto) => {
    if (
      moto[dataField] !== null &&
      moto[dataField] !== undefined &&
      moto[dataField] !== ""
    ) {
      uniqueValues.add(moto[dataField]);
    }
  });

  Array.from(uniqueValues)
    .sort()
    .forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      selectElement.appendChild(option);
    });
}

function displayMotos() {
  const listElement = document.getElementById("motos-list");
  listElement.innerHTML = "";

  if (currentMotos.length === 0) {
    listElement.innerHTML = "<p>Aucune moto ne correspond aux critères.</p>";
    return;
  }

  currentMotos.forEach((moto) => {
    const motoElement = document.createElement("div");
    motoElement.className = "moto-item";

    // Logique d'affichage du prix
    let prixDisplay = "Non disponible";
    if (moto.prix_neuf) {
      prixDisplay = `${moto.prix_neuf} € (Neuf)`;
    } else if (moto.prix_occasion) {
      prixDisplay = `${moto.prix_occasion} € (Occasion)`;
    }

    motoElement.innerHTML = `
            <button onclick="deleteMoto('${moto.id}')">Supprimer</button>
            <h3>${moto.marque} ${moto.nom}</h3>
            <p><strong>Catégorie:</strong> ${moto.categorie || "--"}</p>
            <p><strong>Année:</strong> ${moto.annee || "--"}</p>
            <p><strong>Moteur:</strong> ${moto.type_carburant || "--"}</p>
            <p><strong>Prix :</strong> ${prixDisplay}</p>
            <p><strong>V-Max:</strong> ${moto.vitesse_max || "--"} km/h</p>
            <p><strong>0-100km/h:</strong> ${
              moto.temps_0_100 ? parseFloat(moto.temps_0_100).toFixed(2) : "--"
            } s</p>
        `;
    listElement.appendChild(motoElement);
  });
  console.log("test1");
}

// Fonction pour récupérer l'année max et l'année min de la base de doonnées afin de ne pas pouvoir les dépasser
async function fetchAnneeMoto() {
  try {
    const response = await fetch(`${API_URL}/annees-bornes`);

    if (!response.ok) return;

    const { min, max } = await response.json();

    const minInput = document.getElementById("annee_min");
    const maxInput = document.getElementById("annee_max");

    if (min !== null && max !== null) {
      if (minInput) {
        minInput.min = min;
        minInput.max = max;
        minInput.placeholder = `Min (${min})`;
      }
      if (maxInput) {
        maxInput.min = min;
        maxInput.max = max;
        maxInput.placeholder = `Max (${max})`;
      }
    }
  } catch (error) {
    console.error("Impossible de charger les bornes d'années", error);
  }
}
