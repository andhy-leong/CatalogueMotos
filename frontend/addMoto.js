const structMoto = {
  Nom: "text",
  Marque: "text",
  Categorie: "text",
  Cylindree: "number",
  Poids: "number",
  Prix: {
    Neuve: "number",
    Occasion: "number",
  },
  Puissance: {
    DNI: "number",
    kW: "number",
    Fiscale: "number",
  },
  Annee: "number",
  Temps_0_100: "number",
  Vitesse_max: "number",
  Hauteur_selle: "number",
  Longueur: "number",
  Elements_mecaniques: {
    Suspension: ["avant", "arrière"],
    Freins: ["disque", "tambour"],
    Moteur: {
      Type: ["thermique", "électrique", "hybride"],
      Temps: ["2t", "4t"],
      Nombre_de_cylindres: "number",
    },
    Transmission: ["embrayage", "hydraulique"],
  },
  Bridable_A2: "boolean",
  Conso_carburant: "number",
  Capacite_reservoir: "number",
  Type_carburant: "text",
  Nombre_de_rapports: "number",
};

const API_PATH = "http://localhost:3001/api";
var form; //formulaire pour en récuperer les infos
const elemOblig = ["Nom", "Marque", "Cylindree", "Annee"];

function createFormFromStruct(obj, parent) {
  for (const [key, value] of Object.entries(obj)) {
    // Sous-objet : on crée un fieldset
    if (typeof value === "object" && !Array.isArray(value)) {
      const fieldset = document.createElement("fieldset");
      const legend = document.createElement("legend");
      legend.textContent = key;
      if (elemOblig.includes(key)) {
        legend.textContent += " *";
      }
      fieldset.appendChild(legend);
      createFormFromStruct(value, fieldset);
      parent.appendChild(fieldset);
    }
    // Liste d'options : on crée un select
    else if (Array.isArray(value)) {
      const label = document.createElement("label");
      label.textContent = key;
      if (elemOblig.includes(key)) {
        label.textContent += " *";
      }

      const select = document.createElement("select");
      select.name = key;

      value.forEach((opt) => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
      });

      parent.appendChild(label);
      parent.appendChild(select);
    }
    // Champ simple
    else {
      const label = document.createElement("label");
      label.textContent = key;
      if (elemOblig.includes(key)) {
        label.textContent += " *";
      }

      const input = document.createElement("input");
      input.type = value === "boolean" ? "checkbox" : value;
      input.name = key;

      parent.appendChild(label);
      parent.appendChild(input);
    }

    const br = document.createElement("br");
    parent.appendChild(br);
  }
}

async function sendFormulaire() {
  console.log("bouton cliqué");
  // On récupère les données du formulaire
  const formData = new FormData(form);
  let data = Object.fromEntries(formData);
  console.log(data);

  // Convertir certaines valeurs si nécessaire
  // (exemple : checkbox)
  if (data.Bridable_A2 !== undefined) {
    data.Bridable_A2 = form.querySelector('[name="Bridable_A2"]').checked;
  }

  const payload = {
    Nom: data.Nom,
    Marque: data.Marque,
    Categorie: data.Categorie,
    Cylindree: data.Cylindree,
    Poids: data.Poids,
    Prix: {
      Neuve: data.Neuve,
      Occasion: data.Occasion,
    },
    Puissance: {
      DNI: data.DNI,
      kW: data.kW,
      Fiscale: data.Fiscale,
    },
    Annee: data.Annee,
    Elements_mecaniques: {
      Suspension: data.Suspension,
      Freins: data.Freins,
      Moteur: {
        Type: data.Type,
        Temps: data.Temps,
        Nombre_de_cylindres: data.Nombre_de_cylindres,
      },
      Transmission: data.Transmission,
    },
    Bridable_A2: data.Bridable_A2,
    Conso_carburant: data.Conso_carburant,
    Type_carburant: data.Type_carburant,
    Nombre_de_rapports: data.Nombre_de_rapports,
  };

  // Envoi des données vers le backend
  try {
    const response = await fetch(API_PATH + "/motos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log("FETCH réussi");

    const result = await response.json();
    if (response.ok) {
      alert("✅ Moto ajoutée avec succès !");
      form.reset(); // vide le formulaire
      window.location.href = "index.html";
    } else {
      console.log(response);
      alert("❌ Erreur : " + result.error);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Impossible de contacter le serveur.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  form = document.getElementById("motoForm");
  form.innerHTML = "";
  createFormFromStruct(structMoto, form);
  console.log("✅ formulaire chargé");
});
