const fs = require("fs");
const path = require("path");
const cassandra = require("cassandra-driver");
const { v4: uuidv4 } = require("uuid");

const authProvider = new cassandra.auth.PlainTextAuthProvider(
  process.env.CASSANDRA_USER || "admin",
  process.env.CASSANDRA_PASSWORD || "admin"
);

const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_HOST || "cassandra-db"],
  localDataCenter: "datacenter1",
  keyspace: "moto_db",
  authProvider: authProvider,
});

async function importData() {
  try {
    await client.connect();
    console.log("✅ Connecté à Cassandra");

    const filePath = path.join(__dirname, "moto.json");
    const allMotos = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Dé-duplication simple
    const uniqueMotos = new Map();
    allMotos.forEach((moto) => {
      const key = `${(moto.marque || "").trim()}-${(moto.nom || "").trim()}-${
        moto.annee || 0
      }`;
      if (!uniqueMotos.has(key)) uniqueMotos.set(key, moto);
    });
    const motosToImport = Array.from(uniqueMotos.values());

    const queries = [];

    motosToImport.forEach((moto) => {
      const id = uuidv4();
      const bucket = 1;

      const nomLower = moto.nom ? moto.nom.toLowerCase() : null;
      const marqueLower = moto.marque ? moto.marque.toLowerCase() : null;

      // Conversion JSON string pour la colonne générique
      const elementsMecaniquesStr = moto.elements_mecaniques
        ? typeof moto.elements_mecaniques === "object"
          ? JSON.stringify(moto.elements_mecaniques)
          : String(moto.elements_mecaniques)
        : null;

      // Nettoyage Maps Prix/Puissance
      let prixMapSanitized = null;
      if (moto.prix) {
        prixMapSanitized = {};
        for (const k in moto.prix) {
          const val = parseInt(moto.prix[k]);
          if (!isNaN(val)) prixMapSanitized[k] = val;
        }
        if (Object.keys(prixMapSanitized).length === 0) prixMapSanitized = null;
      }

      let puissanceMapSanitized = null;
      if (moto.puissance) {
        puissanceMapSanitized = {};
        for (const k in moto.puissance) {
          const val = parseFloat(moto.puissance[k]);
          if (!isNaN(val)) puissanceMapSanitized[k] = val;
        }
        if (Object.keys(puissanceMapSanitized).length === 0)
          puissanceMapSanitized = null;
      }

      // Valeurs de tri
      let prixNeuf =
        moto.prix && moto.prix.neuf && !isNaN(parseInt(moto.prix.neuf))
          ? parseInt(moto.prix.neuf)
          : null;
      let prixOccasion =
        moto.prix && moto.prix.occasion && !isNaN(parseInt(moto.prix.occasion))
          ? parseInt(moto.prix.occasion)
          : null;
      let prixTri = prixNeuf !== null ? prixNeuf : prixOccasion;

      const annee = moto.annee || 0;
      const vitesseMax =
        moto.vitesse_max && !isNaN(parseInt(moto.vitesse_max))
          ? parseInt(moto.vitesse_max)
          : null;
      const temps0a100 =
        moto.temps_0_100 && !isNaN(parseFloat(moto.temps_0_100))
          ? parseFloat(moto.temps_0_100)
          : null;
      const conso =
        moto.conso_carburant && !isNaN(parseFloat(moto.conso_carburant))
          ? parseFloat(moto.conso_carburant)
          : null;
      const reservoir =
        moto.capacite_reservoir && !isNaN(parseFloat(moto.capacite_reservoir))
          ? parseFloat(moto.capacite_reservoir)
          : null;
      const cylindree =
        moto.cylindree && !isNaN(parseInt(moto.cylindree))
          ? parseInt(moto.cylindree)
          : null;
      const poids =
        moto.poids && !isNaN(parseInt(moto.poids))
          ? parseInt(moto.poids)
          : null;
      const hauteurSelle =
        moto.hauteur_selle && !isNaN(parseInt(moto.hauteur_selle))
          ? parseInt(moto.hauteur_selle)
          : null;
      const longueur =
        moto.longueur && !isNaN(parseInt(moto.longueur))
          ? parseInt(moto.longueur)
          : null;
      const nbRapports =
        moto.nombre_rapports && !isNaN(parseInt(moto.nombre_rapports))
          ? parseInt(moto.nombre_rapports)
          : null;

      // Extraction détaillée Puissance & Mécanique
      const p_dni_cv =
        moto.puissance && moto.puissance.dni_cv
          ? parseFloat(moto.puissance.dni_cv)
          : null;
      const p_kw =
        moto.puissance && moto.puissance.kw
          ? parseFloat(moto.puissance.kw)
          : null;
      const p_fisc =
        moto.puissance && moto.puissance.fiscale
          ? parseInt(moto.puissance.fiscale)
          : null;

      let susp_av = null,
        susp_ar = null,
        frein_av = null,
        frein_ar = null,
        mot_cyl = null,
        mot_trans = null;
      if (moto.elements_mecaniques) {
        if (moto.elements_mecaniques.suspension) {
          susp_av = moto.elements_mecaniques.suspension.avant || null;
          susp_ar = moto.elements_mecaniques.suspension.arriere || null;
        }
        if (moto.elements_mecaniques.frein) {
          frein_av = moto.elements_mecaniques.frein.avant || null;
          frein_ar = moto.elements_mecaniques.frein.arriere || null;
        }
        if (moto.elements_mecaniques.moteur) {
          mot_cyl =
            parseInt(moto.elements_mecaniques.moteur.nb_cylindres) || null;
          mot_trans = moto.elements_mecaniques.moteur.transmission || null;
        }
      }

      const commonParams = [
        id,
        bucket,
        moto.nom || null,
        nomLower,
        moto.marque || null,
        marqueLower,
        moto.type || null,
        cylindree,
        poids,
        prixMapSanitized,
        prixNeuf,
        prixOccasion,
        prixTri,
        puissanceMapSanitized,
        annee,
        temps0a100,
        vitesseMax,
        hauteurSelle,
        longueur,
        elementsMecaniquesStr,
        moto.bridable_a2 || false,
        conso,
        reservoir,
        moto.type_carburant || null,
        nbRapports,
        susp_av,
        susp_ar,
        frein_av,
        frein_ar,
        mot_cyl,
        mot_trans,
        p_dni_cv,
        p_kw,
        p_fisc,
      ];

      const insertQueryBase = `(
            id, bucket, nom, nom_search, marque, marque_search, categorie, cylindree, poids, 
            prix, prix_neuf, prix_occasion, prix_tri, 
            puissance, annee, temps_0_100, vitesse_max, hauteur_selle, longueur, 
            elements_mecaniques, bridable_a2, conso_carburant, capacite_reservoir, type_carburant, nombre_rapports,
            suspension_avant, suspension_arriere, frein_avant, frein_arriere, moteur_nb_cylindres, moteur_transmission,
            puissance_dni_cv, puissance_kw, puissance_fiscale
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

      // Insertion Table Principale
      queries.push({
        query: `INSERT INTO motos ${insertQueryBase}`,
        params: commonParams,
      });

      // --- INSERTIONS DANS LES TABLES DE TRI (Seulement si la valeur existe) ---

      // Prix
      if (prixTri !== null) {
        queries.push({
          query: `INSERT INTO motos_by_prix ${insertQueryBase}`,
          params: commonParams,
        });
        queries.push({
          query: `INSERT INTO motos_by_prix_desc ${insertQueryBase}`,
          params: commonParams,
        });
      }

      // Année
      queries.push({
        query: `INSERT INTO motos_by_annee ${insertQueryBase}`,
        params: commonParams,
      });
      queries.push({
        query: `INSERT INTO motos_by_annee_desc ${insertQueryBase}`,
        params: commonParams,
      });

      // Vitesse
      if (vitesseMax !== null) {
        queries.push({
          query: `INSERT INTO motos_by_vitesse ${insertQueryBase}`,
          params: commonParams,
        });
        queries.push({
          query: `INSERT INTO motos_by_vitesse_desc ${insertQueryBase}`,
          params: commonParams,
        });
      }

      // 0-100
      if (temps0a100 !== null) {
        queries.push({
          query: `INSERT INTO motos_by_temps ${insertQueryBase}`,
          params: commonParams,
        });
        queries.push({
          query: `INSERT INTO motos_by_temps_desc ${insertQueryBase}`,
          params: commonParams,
        });
      }

      // Conso
      if (conso !== null) {
        queries.push({
          query: `INSERT INTO motos_by_conso ${insertQueryBase}`,
          params: commonParams,
        });
        queries.push({
          query: `INSERT INTO motos_by_conso_desc ${insertQueryBase}`,
          params: commonParams,
        });
      }

      // Réservoir
      if (reservoir !== null) {
        queries.push({
          query: `INSERT INTO motos_by_reservoir ${insertQueryBase}`,
          params: commonParams,
        });
        queries.push({
          query: `INSERT INTO motos_by_reservoir_desc ${insertQueryBase}`,
          params: commonParams,
        });
      }

      // Cylindrée
      if (cylindree !== null) {
        queries.push({
          query: `INSERT INTO motos_by_cylindree ${insertQueryBase}`,
          params: commonParams,
        });
        queries.push({
          query: `INSERT INTO motos_by_cylindree_desc ${insertQueryBase}`,
          params: commonParams,
        });
      }

      // Poids
      if (poids !== null) {
        queries.push({
          query: `INSERT INTO motos_by_poids ${insertQueryBase}`,
          params: commonParams,
        });
        queries.push({
          query: `INSERT INTO motos_by_poids_desc ${insertQueryBase}`,
          params: commonParams,
        });
      }

      // Hauteur Selle
      if (hauteurSelle !== null) {
        queries.push({
          query: `INSERT INTO motos_by_hauteur_selle ${insertQueryBase}`,
          params: commonParams,
        });
        queries.push({
          query: `INSERT INTO motos_by_hauteur_selle_desc ${insertQueryBase}`,
          params: commonParams,
        });
      }

      // Longueur
      if (longueur !== null) {
        queries.push({
          query: `INSERT INTO motos_by_longueur ${insertQueryBase}`,
          params: commonParams,
        });
        queries.push({
          query: `INSERT INTO motos_by_longueur_desc ${insertQueryBase}`,
          params: commonParams,
        });
      }

      // Nombre Rapports
      if (nbRapports !== null) {
        queries.push({
          query: `INSERT INTO motos_by_nombre_rapports ${insertQueryBase}`,
          params: commonParams,
        });
        queries.push({
          query: `INSERT INTO motos_by_nombre_rapports_desc ${insertQueryBase}`,
          params: commonParams,
        });
      }

      // Puissance DNI CV
      if (p_dni_cv !== null) {
        queries.push({
          query: `INSERT INTO motos_by_puissance_dni_cv ${insertQueryBase}`,
          params: commonParams,
        });
        queries.push({
          query: `INSERT INTO motos_by_puissance_dni_cv_desc ${insertQueryBase}`,
          params: commonParams,
        });
      }

      // Puissance kW
      if (p_kw !== null) {
        queries.push({
          query: `INSERT INTO motos_by_puissance_kw ${insertQueryBase}`,
          params: commonParams,
        });
        queries.push({
          query: `INSERT INTO motos_by_puissance_kw_desc ${insertQueryBase}`,
          params: commonParams,
        });
      }

      // Puissance Fiscale
      if (p_fisc !== null) {
        queries.push({
          query: `INSERT INTO motos_by_puissance_fiscale ${insertQueryBase}`,
          params: commonParams,
        });
        queries.push({
          query: `INSERT INTO motos_by_puissance_fiscale_desc ${insertQueryBase}`,
          params: commonParams,
        });
      }
    });

    console.log(`Préparation de ${queries.length} requêtes d'insertion...`);

    const chunkSize = 15;

    for (let i = 0; i < queries.length; i += chunkSize) {
      const chunk = queries.slice(i, i + chunkSize);
      try {
        await client.batch(chunk, { prepare: true });
      } catch (err) {
        console.error(`⚠️ Erreur sur un lot: ${err.message}`);
      }
      if (i % 500 === 0) console.log(`... ${i} / ${queries.length} traitées`);
    }

    console.log("✅ Importation terminée !");
  } catch (error) {
    console.error("❌ ERREUR FATALE :", error);
    process.exit(1);
  } finally {
    await client.shutdown();
  }
}

importData();
