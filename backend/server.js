const express = require("express");
const cassandra = require("cassandra-driver");
const neo4j = require("neo4j-driver");
const cors = require("cors");
const motoFilters = require("./filter.js");
const app = express();
const port = 3000;

const { v4: uuidv4 } = require("uuid"); // génerer id

// --- Authentification ---
const authProvider = new cassandra.auth.PlainTextAuthProvider(
  process.env.CASSANDRA_USER || "admin",
  process.env.CASSANDRA_PASSWORD || "admin"
);

// --- Configuration Client ---
const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_HOST || "cassandra-db"],
  localDataCenter: "datacenter1",
  keyspace: "moto_db",
  authProvider: authProvider,
});

// --- Configuration neo4j ---
const neo4jDriver = neo4j.driver(
  "bolt://neo4j-db:7687",
  neo4j.auth.basic("neo4j", "neo4jpassword")
);

// Middlewares
app.use(express.json());
app.use(cors());

// ========================================
// CONFIGURATION : Liste de toutes les tables
// ========================================
const ALL_TABLES = [
  "motos",
  "motos_by_annee",
  "motos_by_annee_desc",
  "motos_by_prix",
  "motos_by_prix_desc",
  "motos_by_vitesse",
  "motos_by_vitesse_desc",
  "motos_by_temps",
  "motos_by_temps_desc",
  "motos_by_conso",
  "motos_by_conso_desc",
  "motos_by_reservoir",
  "motos_by_reservoir_desc",
  "motos_by_cylindree",
  "motos_by_cylindree_desc",
  "motos_by_poids",
  "motos_by_poids_desc",
  "motos_by_hauteur_selle",
  "motos_by_hauteur_selle_desc",
  "motos_by_longueur",
  "motos_by_longueur_desc",
  "motos_by_nombre_rapports",
  "motos_by_nombre_rapports_desc",
];

// --- ROUTES API ---
// supprimer une moto
// Remplace la route DELETE existante par celle-ci
app.delete("/api/motos/:id", async (req, res) => {
  const motoId = req.params.id;
  if (!motoId) return res.status(400).json({ error: "ID de moto manquant" });

  try {
    // Convertir l'ID en UUID Cassandra
    const uuid = cassandra.types.Uuid.fromString(motoId);

    // 1) Lire la moto dans la table principale pour récupérer les valeurs clustering
    const selectQuery = "SELECT * FROM motos WHERE id = ?";
    const selectResult = await client.execute(selectQuery, [uuid], {
      prepare: true,
    });

    if (selectResult.rowLength === 0) {
      return res.status(404).json({ error: "Moto introuvable" });
    }

    const moto = selectResult.rows[0];
    const bucket = moto.bucket ?? 1;
    const prix_tri = moto.prix_tri;
    const annee = moto.annee;
    const vitesse_max = moto.vitesse_max;
    const temps_0_100 = moto.temps_0_100;
    const conso = moto.conso_carburant;
    const reservoir = moto.capacite_reservoir;
    const cylindree = moto.cylindree;
    const poids = moto.poids;
    const hauteur_selle = moto.hauteur_selle;
    const longueur = moto.longueur;
    const nombre_rapports = moto.nombre_rapports;

    // 2) Construire les DELETE avec clés complètes (n'ajouter que si la valeur existe)
    const queries = [];

    // Table principale (id = PRIMARY KEY)
    queries.push({ query: "DELETE FROM motos WHERE id = ?", params: [uuid] });

    // motos_by_annee (PRIMARY KEY ((bucket), annee, id))
    if (annee !== undefined && annee !== null) {
      queries.push({
        query:
          "DELETE FROM motos_by_annee WHERE bucket = ? AND annee = ? AND id = ?",
        params: [bucket, annee, uuid],
      });
      queries.push({
        query:
          "DELETE FROM motos_by_annee_desc WHERE bucket = ? AND annee = ? AND id = ?",
        params: [bucket, annee, uuid],
      });
    }

    // motos_by_prix (PRIMARY KEY ((bucket), prix_tri, id))
    if (prix_tri !== undefined && prix_tri !== null) {
      queries.push({
        query:
          "DELETE FROM motos_by_prix WHERE bucket = ? AND prix_tri = ? AND id = ?",
        params: [bucket, prix_tri, uuid],
      });
      queries.push({
        query:
          "DELETE FROM motos_by_prix_desc WHERE bucket = ? AND prix_tri = ? AND id = ?",
        params: [bucket, prix_tri, uuid],
      });
    }

    // motos_by_vitesse
    if (vitesse_max !== undefined && vitesse_max !== null) {
      queries.push({
        query:
          "DELETE FROM motos_by_vitesse WHERE bucket = ? AND vitesse_max = ? AND id = ?",
        params: [bucket, vitesse_max, uuid],
      });
      queries.push({
        query:
          "DELETE FROM motos_by_vitesse_desc WHERE bucket = ? AND vitesse_max = ? AND id = ?",
        params: [bucket, vitesse_max, uuid],
      });
    }

    // motos_by_temps (0-100)
    if (temps_0_100 !== undefined && temps_0_100 !== null) {
      queries.push({
        query:
          "DELETE FROM motos_by_temps WHERE bucket = ? AND temps_0_100 = ? AND id = ?",
        params: [bucket, temps_0_100, uuid],
      });
      queries.push({
        query:
          "DELETE FROM motos_by_temps_desc WHERE bucket = ? AND temps_0_100 = ? AND id = ?",
        params: [bucket, temps_0_100, uuid],
      });
    }

    // motos_by_conso
    if (conso !== undefined && conso !== null) {
      queries.push({
        query:
          "DELETE FROM motos_by_conso WHERE bucket = ? AND conso_carburant = ? AND id = ?",
        params: [bucket, conso, uuid],
      });
      queries.push({
        query:
          "DELETE FROM motos_by_conso_desc WHERE bucket = ? AND conso_carburant = ? AND id = ?",
        params: [bucket, conso, uuid],
      });
    }

    // motos_by_reservoir
    if (reservoir !== undefined && reservoir !== null) {
      queries.push({
        query:
          "DELETE FROM motos_by_reservoir WHERE bucket = ? AND capacite_reservoir = ? AND id = ?",
        params: [bucket, reservoir, uuid],
      });
      queries.push({
        query:
          "DELETE FROM motos_by_reservoir_desc WHERE bucket = ? AND capacite_reservoir = ? AND id = ?",
        params: [bucket, reservoir, uuid],
      });
    }

    // motos_by_cylindree
    if (cylindree !== undefined && cylindree !== null) {
      queries.push({
        query:
          "DELETE FROM motos_by_cylindree WHERE bucket = ? AND cylindree = ? AND id = ?",
        params: [bucket, cylindree, uuid],
      });
      queries.push({
        query:
          "DELETE FROM motos_by_cylindree_desc WHERE bucket = ? AND cylindree = ? AND id = ?",
        params: [bucket, cylindree, uuid],
      });
    }

    // motos_by_poids
    if (poids !== undefined && poids !== null) {
      queries.push({
        query:
          "DELETE FROM motos_by_poids WHERE bucket = ? AND poids = ? AND id = ?",
        params: [bucket, poids, uuid],
      });
      queries.push({
        query:
          "DELETE FROM motos_by_poids_desc WHERE bucket = ? AND poids = ? AND id = ?",
        params: [bucket, poids, uuid],
      });
    }

    // motos_by_hauteur_selle
    if (hauteur_selle !== undefined && hauteur_selle !== null) {
      queries.push({
        query:
          "DELETE FROM motos_by_hauteur_selle WHERE bucket = ? AND hauteur_selle = ? AND id = ?",
        params: [bucket, hauteur_selle, uuid],
      });
      queries.push({
        query:
          "DELETE FROM motos_by_hauteur_selle_desc WHERE bucket = ? AND hauteur_selle = ? AND id = ?",
        params: [bucket, hauteur_selle, uuid],
      });
    }

    // motos_by_longueur
    if (longueur !== undefined && longueur !== null) {
      queries.push({
        query:
          "DELETE FROM motos_by_longueur WHERE bucket = ? AND longueur = ? AND id = ?",
        params: [bucket, longueur, uuid],
      });
      queries.push({
        query:
          "DELETE FROM motos_by_longueur_desc WHERE bucket = ? AND longueur = ? AND id = ?",
        params: [bucket, longueur, uuid],
      });
    }

    // motos_by_nombre_rapports
    if (nombre_rapports !== undefined && nombre_rapports !== null) {
      queries.push({
        query:
          "DELETE FROM motos_by_nombre_rapports WHERE bucket = ? AND nombre_rapports = ? AND id = ?",
        params: [bucket, nombre_rapports, uuid],
      });
      queries.push({
        query:
          "DELETE FROM motos_by_nombre_rapports_desc WHERE bucket = ? AND nombre_rapports = ? AND id = ?",
        params: [bucket, nombre_rapports, uuid],
      });
    }

    // 3) Exécuter le batch
    if (queries.length > 0) {
      await client.batch(queries, { prepare: true });
    }

    // 4) Supprimer la moto dans Neo4j si tu y stockes un noeud
    try {
      const neoSession = neo4jDriver.session();
      await neoSession.run("MATCH (m:Moto {id: $id}) DETACH DELETE m", {
        id: motoId,
      });
      await neoSession.close();
    } catch (neoErr) {
      console.warn(
        "Impossible de supprimer le noeud Neo4j (non bloquant) :",
        neoErr.message
      );
    }

    console.log(`Moto ${motoId} supprimée`);
    return res.status(200).json({ message: "Moto supprimée avec succès" });
  } catch (error) {
    console.error("Erreur Cassandra (DELETE):", error);
    return res.status(500).json({ error: error.message });
  }
});

// ajouter moto
app.post("/api/motos", async (req, res) => {
  const data = req.body;

  // Validation de base
  if (!data.Nom || !data.Marque || !data.Cylindree || !data.Annee) {
    return res.status(400).json({ error: "Remplissez les champs requis" });
  }

  // --- 1. Préparation des données ---
  const id = cassandra.types.Uuid.random();
  const bucket = 1;

  // Prix
  const prixNeuf = parseInt(data.Prix?.Neuve) || null;
  const prixOccasion = parseInt(data.Prix?.Occasion) || null;
  const prixTri =
    prixNeuf !== null ? prixNeuf : prixOccasion !== null ? prixOccasion : null;

  // Caractéristiques générales
  const annee = parseInt(data.Annee);
  const vitesseMax = parseInt(data.Vitesse_max) || null;
  const temps0a100 = parseFloat(data.Temps_0_100) || null;
  const conso = parseFloat(data.Conso_carburant) || null;
  const reservoir = parseFloat(data.Capacite_reservoir) || null;

  // Puissance
  const puissanceDni = parseFloat(data.Puissance?.DNI) || null;
  const puissanceKw = parseFloat(data.Puissance?.kW) || null;
  const puissanceFiscale = parseFloat(data.Puissance?.Fiscale) || null;

  const cylindree = parseInt(data.Cylindree);
  const poids = parseInt(data.Poids) || null;
  const hauteur_selle = parseInt(data.Hauteur_selle) || null;
  const longueur = parseInt(data.Longueur) || null;
  const nombre_rapports = parseInt(data.Nombre_de_rapports) || null;

  // --- 2. Extraction corrigée des Éléments Mécaniques ---
  // On récupère l'objet envoyé par le frontend (Attention aux Majuscules)
  const elems = data.Elements_mecaniques || {};
  const moteurInfo = elems.Moteur || {};

  // Adaptation : Le frontend envoie une valeur unique (string) pour Suspension/Freins
  // On la stocke dans la colonne 'avant' par défaut ou on adapte selon le besoin.
  const suspensionAvant = elems.Suspension || null;
  const suspensionArriere = null; // Donnée non fournie par le formulaire actuel

  const freinAvant = elems.Freins || null;
  const freinArriere = null; // Donnée non fournie par le formulaire actuel

  // Correction du chemin pour le moteur et la transmission
  const moteurNbCylindres = moteurInfo.Nombre_de_cylindres
    ? parseInt(moteurInfo.Nombre_de_cylindres)
    : null;
  const moteurTransmission = elems.Transmission || null; // 'Transmission' est à côté de 'Moteur', pas dedans

  const params = [
    id,
    bucket,
    data.Nom,
    data.Nom ? data.Nom.toLowerCase() : null,
    data.Marque,
    data.Marque ? data.Marque.toLowerCase() : null,
    data.Categorie || null,
    cylindree,
    poids,
    data.Prix
      ? {
          neuve: prixNeuf || 0,
          occasion: prixOccasion || 0,
        }
      : null,
    prixNeuf,
    prixOccasion,
    prixTri,
    data.Puissance
      ? {
          dni: parseFloat(data.Puissance.DNI) || 0,
          kw: parseFloat(data.Puissance.kW) || 0,
          fiscale: parseFloat(data.Puissance.Fiscale) || 0,
        }
      : null,
    puissanceDni,
    puissanceKw,
    puissanceFiscale,
    annee,
    temps0a100,
    vitesseMax,
    hauteur_selle,
    longueur,
    // On stocke aussi tout l'objet JSON brut pour référence
    data.Elements_mecaniques ? JSON.stringify(data.Elements_mecaniques) : null,
    data.Bridable_A2 === true || data.Bridable_A2 === "true",
    conso,
    reservoir,
    data.Type_carburant || null,
    nombre_rapports,
    // Nouvelles colonnes extraites
    suspensionAvant,
    suspensionArriere,
    freinAvant,
    freinArriere,
    moteurNbCylindres,
    moteurTransmission,
  ];

  // --- 3. Définition des colonnes ---
  // ATTENTION : Ces colonnes doivent exister dans VOS TABLES Cassandra
  const columns = `(
      id, bucket, nom, nom_search, marque, marque_search, categorie, cylindree, poids, 
      prix, prix_neuf, prix_occasion, prix_tri, 
      puissance, puissance_dni_cv, puissance_kw, puissance_fiscale,
      annee, temps_0_100, vitesse_max, hauteur_selle, longueur, 
      elements_mecaniques, bridable_a2, conso_carburant, capacite_reservoir, type_carburant, nombre_rapports,
      suspension_avant, suspension_arriere, frein_avant, frein_arriere, moteur_nb_cylindres, moteur_transmission
  )`;

  const placeholders = `(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const queries = [];

  // Insertion dans toutes les tables nécessaires
  queries.push({
    query: `INSERT INTO motos ${columns} VALUES ${placeholders}`,
    params: params,
  });
  queries.push({
    query: `INSERT INTO motos_by_annee ${columns} VALUES ${placeholders}`,
    params: params,
  });
  queries.push({
    query: `INSERT INTO motos_by_annee_desc ${columns} VALUES ${placeholders}`,
    params: params,
  });

  if (prixTri !== null) {
    queries.push({
      query: `INSERT INTO motos_by_prix ${columns} VALUES ${placeholders}`,
      params: params,
    });
    queries.push({
      query: `INSERT INTO motos_by_prix_desc ${columns} VALUES ${placeholders}`,
      params: params,
    });
  }
  if (vitesseMax !== null) {
    queries.push({
      query: `INSERT INTO motos_by_vitesse ${columns} VALUES ${placeholders}`,
      params: params,
    });
    queries.push({
      query: `INSERT INTO motos_by_vitesse_desc ${columns} VALUES ${placeholders}`,
      params: params,
    });
  }
  if (temps0a100 !== null) {
    queries.push({
      query: `INSERT INTO motos_by_temps ${columns} VALUES ${placeholders}`,
      params: params,
    });
    queries.push({
      query: `INSERT INTO motos_by_temps_desc ${columns} VALUES ${placeholders}`,
      params: params,
    });
  }
  if (conso !== null) {
    queries.push({
      query: `INSERT INTO motos_by_conso ${columns} VALUES ${placeholders}`,
      params: params,
    });
    queries.push({
      query: `INSERT INTO motos_by_conso_desc ${columns} VALUES ${placeholders}`,
      params: params,
    });
  }
  if (reservoir !== null) {
    queries.push({
      query: `INSERT INTO motos_by_reservoir ${columns} VALUES ${placeholders}`,
      params: params,
    });
    queries.push({
      query: `INSERT INTO motos_by_reservoir_desc ${columns} VALUES ${placeholders}`,
      params: params,
    });
  }
  // Ajoutez ici les autres tables si nécessaire (motos_by_cylindree, etc.)

  try {
    await client.batch(queries, { prepare: true });
    console.log("Moto ajoutée dans toutes les tables");
    res.status(201).json({ message: "Moto ajoutée avec succès" });
  } catch (error) {
    console.error("Erreur Cassandra (POST):", error);
    // Permet de voir l'erreur exacte dans la console (souvent "Undefined column name")
    res.status(500).json({ error: error.message });
  }
});

// Récupérer toutes les motos
app.get("/api/motos", async (req, res) => {
  try {
    const { query, params } = motoFilters.buildFilterQuery(req.query);

    console.log("Exécution CQL:", query, params);
    const result = await client.execute(query, params, { prepare: true });
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur de requête Cassandra (GET):", error);
    res
      .status(500)
      .send("Erreur du serveur lors de la récupération des données.");
  }
});

//Afficher le UUid d'une moto
app.get("/api/motos/id", async (req, res) => {
  const { UUid } = req.query;

  if (!UUid) {
    return res.status(400).json([]);
  }

  try {
    const query =
      "SELECT id FROM motos WHERE marque_search = ? ALLOW FILTERING";

    const result = await client.execute(query, [marque.toLowerCase()], {
      prepare: true,
    });

    res.json(nomsUniques);
  } catch (error) {
    console.error("Erreur lors de la récupération de l id:", error);
    res.status(500).send("Erreur serveur");
  }
});

//Afficher le nom des motos
app.get("/api/motos/noms", async (req, res) => {
  const { marque } = req.query;

  if (!marque) {
    return res.status(400).json([]);
  }

  try {
    const query =
      "SELECT nom FROM motos WHERE marque_search = ? ALLOW FILTERING";

    const result = await client.execute(query, [marque.toLowerCase()], {
      prepare: true,
    });
    const nomsUniques = [...new Set(result.rows.map((row) => row.nom))].sort();

    res.json(nomsUniques);
  } catch (error) {
    console.error("Erreur lors de la récupération des noms:", error);
    res.status(500).send("Erreur serveur");
  }
});

// Récupérer l'année min et année max de ma base de données
app.get("/api/motos/annees-bornes", async (req, res) => {
  try {
    const queryMin =
      "SELECT annee FROM motos_by_annee WHERE bucket = 1 LIMIT 1";
    const queryMax =
      "SELECT annee FROM motos_by_annee_desc WHERE bucket = 1 LIMIT 1";

    const [resultMin, resultMax] = await Promise.all([
      client.execute(queryMin, [], { prepare: true }),
      client.execute(queryMax, [], { prepare: true }),
    ]);

    const minAnnee = resultMin.rows.length > 0 ? resultMin.rows[0].annee : null;
    const maxAnnee = resultMax.rows.length > 0 ? resultMax.rows[0].annee : null;

    res.json({ min: minAnnee, max: maxAnnee });
  } catch (error) {
    console.error("Erreur récupération bornes années:", error);
    res.status(500).send("Erreur serveur");
  }
});

// --- DÉMARRAGE DU SERVEUR ---
async function startServer() {
  try {
    await client.connect();
    console.log("✅ Connecté à Cassandra (pour le serveur API)");

    app.listen(port, () => {
      console.log(`🚀 API Backend démarrée. En écoute sur le port ${port}.`);
    });
  } catch (error) {
    console.error(
      "❌ ERREUR FATALE: Impossible de se connecter à Cassandra pour démarrer le serveur.",
      error
    );
    process.exit(1);
  }
}

startServer();
