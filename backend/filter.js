function buildFilterQuery(requestBody) {
  const sortParam = requestBody.sort || "default";

  const sortStrategy = {
    prix_asc: { table: "motos_by_prix" },
    prix_desc: { table: "motos_by_prix_desc" },

    annee_asc: { table: "motos_by_annee" },
    annee_desc: { table: "motos_by_annee_desc" },

    vitesse_max_asc: { table: "motos_by_vitesse" },
    vitesse_max_desc: { table: "motos_by_vitesse_desc" },

    temps_0_100_asc: { table: "motos_by_temps" },
    temps_0_100_desc: { table: "motos_by_temps_desc" },

    conso_carburant_asc: { table: "motos_by_conso" },
    conso_carburant_desc: { table: "motos_by_conso_desc" },

    capacite_reservoir_asc: { table: "motos_by_reservoir" },
    capacite_reservoir_desc: { table: "motos_by_reservoir_desc" },

    cylindree_asc: { table: "motos_by_cylindree" },
    cylindree_desc: { table: "motos_by_cylindree_desc" },

    poids_asc: { table: "motos_by_poids" },
    poids_desc: { table: "motos_by_poids_desc" },

    hauteur_selle_asc: { table: "motos_by_hauteur_selle" },
    hauteur_selle_desc: { table: "motos_by_hauteur_selle_desc" },

    longueur_asc: { table: "motos_by_longueur" },
    longueur_desc: { table: "motos_by_longueur_desc" },

    nombre_rapports_asc: { table: "motos_by_nombre_rapports" },
    nombre_rapports_desc: { table: "motos_by_nombre_rapports_desc" },

    puissance_dni_cv_asc: { table: "motos_by_puissance_dni_cv" },
    puissance_dni_cv_desc: { table: "motos_by_puissance_dni_cv_desc" },

    puissance_kw_asc: { table: "motos_by_puissance_kw" },
    puissance_kw_desc: { table: "motos_by_puissance_kw_desc" },

    puissance_fiscale_asc: { table: "motos_by_puissance_fiscale" },
    puissance_fiscale_desc: { table: "motos_by_puissance_fiscale_desc" },

    default: { table: "motos_by_annee" },
  };

  const strategy = sortStrategy[sortParam] || sortStrategy["default"];
  const table = strategy.table;

  const filterMap = {
    marque: { column: "marque_search", operator: "=", type: "string" },
    nom: { column: "nom_search", operator: "=", type: "string" },
    type: { column: "categorie", operator: "=", type: "string" },
    bridable_a2: { column: "bridable_a2", operator: "=", type: "boolean" },
    moteur: { column: "type_carburant", operator: "=", type: "string" },

    annee_min: { column: "annee", operator: ">=", type: "int" },
    annee_max: { column: "annee", operator: "<=", type: "int" },
    prix_min: { column: "prix_tri", operator: ">=", type: "int" },
    prix_max: { column: "prix_tri", operator: "<=", type: "int" },
    vitesse_max_min: { column: "vitesse_max", operator: ">=", type: "int" },
    vitesse_max_max: { column: "vitesse_max", operator: "<=", type: "int" },
    temps_0_100_min: { column: "temps_0_100", operator: ">=", type: "float" },
    temps_0_100_max: { column: "temps_0_100", operator: "<=", type: "float" },
    conso_carburant_min: {
      column: "conso_carburant",
      operator: ">=",
      type: "float",
    },
    conso_carburant_max: {
      column: "conso_carburant",
      operator: "<=",
      type: "float",
    },
    capacite_reservoir_min: {
      column: "capacite_reservoir",
      operator: ">=",
      type: "float",
    },
    capacite_reservoir_max: {
      column: "capacite_reservoir",
      operator: "<=",
      type: "float",
    },

    cylindree_min: { column: "cylindree", operator: ">=", type: "int" },
    cylindree_max: { column: "cylindree", operator: "<=", type: "int" },
    poids_min: { column: "poids", operator: ">=", type: "int" },
    poids_max: { column: "poids", operator: "<=", type: "int" },
    hauteur_selle_min: { column: "hauteur_selle", operator: ">=", type: "int" },
    hauteur_selle_max: { column: "hauteur_selle", operator: "<=", type: "int" },
    longueur_min: { column: "longueur", operator: ">=", type: "int" },
    longueur_max: { column: "longueur", operator: "<=", type: "int" },
    nombre_rapports_min: {
      column: "nombre_rapports",
      operator: ">=",
      type: "int",
    },
    nombre_rapports_max: {
      column: "nombre_rapports",
      operator: "<=",
      type: "int",
    },

    // NOUVELLES COLONNES — plus de JSON LIKE
    suspension_avant: {
      column: "suspension_avant",
      operator: "=",
      type: "string",
    },
    suspension_arriere: {
      column: "suspension_arriere",
      operator: "=",
      type: "string",
    },
    frein_avant: { column: "frein_avant", operator: "=", type: "string" },
    frein_arriere: { column: "frein_arriere", operator: "=", type: "string" },
    moteur_nb_cylindres: {
      column: "moteur_nb_cylindres",
      operator: "=",
      type: "int",
    },
    moteur_transmission: {
      column: "moteur_transmission",
      operator: "=",
      type: "string",
    },

    puissance_dni_cv_min: {
      column: "puissance_dni_cv",
      operator: ">=",
      type: "float",
    },
    puissance_dni_cv_max: {
      column: "puissance_dni_cv",
      operator: "<=",
      type: "float",
    },
    puissance_kw_min: { column: "puissance_kw", operator: ">=", type: "float" },
    puissance_kw_max: { column: "puissance_kw", operator: "<=", type: "float" },
    puissance_fiscale_min: {
      column: "puissance_fiscale",
      operator: ">=",
      type: "int",
    },
    puissance_fiscale_max: {
      column: "puissance_fiscale",
      operator: "<=",
      type: "int",
    },
  };

  const queryClauses = [`bucket = 1`];
  const params = [];

  for (const key in requestBody) {
    if (key === "sort" || !requestBody[key]) continue;

    const filter = filterMap[key];
    if (!filter) continue;

    let value = requestBody[key];

    if (filter.type === "string") {
      value = String(value).trim();
      if (key === "marque" || key === "nom") {
        value = value.toLowerCase();
      }
    }
    if (filter.type === "boolean") {
      value = value === "true" || value === "1";
    }
    if (filter.type === "int") {
      value = parseInt(value, 10);
      if (isNaN(value)) continue;
    }
    if (filter.type === "float") {
      value = parseFloat(value);
      if (isNaN(value)) continue;
    }

    queryClauses.push(`${filter.column} ${filter.operator} ?`);
    params.push(value);
  }

  const query = `SELECT * FROM ${table} WHERE ${queryClauses.join(
    " AND "
  )} ALLOW FILTERING`;

  return { query, params };
}

module.exports = { buildFilterQuery };
