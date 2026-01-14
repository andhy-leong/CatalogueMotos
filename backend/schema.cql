CREATE KEYSPACE IF NOT EXISTS moto_db WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };

USE moto_db;

/* Table Principale (Tri par défaut / ID) */
CREATE TABLE IF NOT EXISTS motos (
    id UUID PRIMARY KEY,
    prix_tri INT,
    bucket INT,
    nom TEXT, 
    nom_search TEXT,
    marque TEXT,
    marque_search TEXT,
    categorie TEXT,
    cylindree INT, 
    poids INT,
    prix MAP<TEXT, INT>, 
    prix_neuf INT, 
    prix_occasion INT,
    puissance MAP<TEXT, FLOAT>,
    puissance_dni_cv FLOAT,
    puissance_kw FLOAT,
    puissance_fiscale INT,
    annee INT,
    temps_0_100 FLOAT,
    vitesse_max INT,
    hauteur_selle INT, 
    longueur INT,
    elements_mecaniques TEXT,
    bridable_a2 BOOLEAN,
    conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, 
    nombre_rapports INT,
    suspension_avant text,
    suspension_arriere text,
    frein_avant text,
    frein_arriere text,
    moteur_nb_cylindres int,
    moteur_transmission text
);

/* Table triée par PRIX */
CREATE TABLE IF NOT EXISTS motos_by_prix (
    bucket INT, prix_tri INT, prix_neuf INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_occasion INT,puissance MAP<TEXT, FLOAT>, annee INT,
    temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    puissance_dni_cv float, puissance_kw float, puissance_fiscale int,
    PRIMARY KEY ((bucket), prix_tri, id)
) WITH CLUSTERING ORDER BY (prix_tri ASC, id ASC);

/* Table triée par ANNÉE */
CREATE TABLE IF NOT EXISTS motos_by_annee (
    bucket INT, prix_tri INT, annee INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, puissance MAP<TEXT, FLOAT>,
    temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    puissance_dni_cv float, puissance_kw float, puissance_fiscale int,
    PRIMARY KEY ((bucket), annee, id)
) WITH CLUSTERING ORDER BY (annee ASC, id ASC);

/* Table triée par VITESSE MAX */
CREATE TABLE IF NOT EXISTS motos_by_vitesse (
    bucket INT, prix_tri INT, vitesse_max INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, puissance MAP<TEXT, FLOAT>, annee INT,
    temps_0_100 FLOAT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    puissance_dni_cv float, puissance_kw float, puissance_fiscale int,
    PRIMARY KEY ((bucket), vitesse_max, id)
) WITH CLUSTERING ORDER BY (vitesse_max ASC, id ASC);

/* Table triée par 0 à 100 km/h */
CREATE TABLE IF NOT EXISTS motos_by_temps (
    bucket INT, prix_tri INT, temps_0_100 FLOAT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, puissance MAP<TEXT, FLOAT>, annee INT,
    vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    puissance_dni_cv float, puissance_kw float, puissance_fiscale int,
    PRIMARY KEY ((bucket), temps_0_100, id)
) WITH CLUSTERING ORDER BY (temps_0_100 ASC, id ASC);

/* Table triée par CONSOMMATION */
CREATE TABLE IF NOT EXISTS motos_by_conso (
    bucket INT, prix_tri INT, conso_carburant FLOAT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, puissance MAP<TEXT, FLOAT>, annee INT,
    temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    puissance_dni_cv float, puissance_kw float, puissance_fiscale int,
    PRIMARY KEY ((bucket), conso_carburant, id)
) WITH CLUSTERING ORDER BY (conso_carburant ASC, id ASC);

/* Table triée par RÉSERVOIR */
CREATE TABLE IF NOT EXISTS motos_by_reservoir (
    bucket INT, prix_tri INT, capacite_reservoir FLOAT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, puissance MAP<TEXT, FLOAT>, annee INT,
    temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    puissance_dni_cv float, puissance_kw float, puissance_fiscale int,
    PRIMARY KEY ((bucket), capacite_reservoir, id)
) WITH CLUSTERING ORDER BY (capacite_reservoir ASC, id ASC);


/* --- INDEX --- */
/* Il faut recréer les index sur CHAQUE table pour permettre le filtrage + tri */

/* Index pour motos_by_prix */
CREATE INDEX IF NOT EXISTS ON motos_by_prix (marque_search);
CREATE INDEX IF NOT EXISTS ON motos_by_prix (nom_search);
CREATE INDEX IF NOT EXISTS ON motos_by_prix (categorie);
CREATE INDEX IF NOT EXISTS ON motos_by_prix (bridable_a2);
CREATE INDEX IF NOT EXISTS ON motos_by_prix (type_carburant);
CREATE INDEX IF NOT EXISTS ON motos_by_prix (elements_mecaniques);

/* Index pour motos_by_annee */
CREATE INDEX IF NOT EXISTS ON motos_by_annee (marque_search);
CREATE INDEX IF NOT EXISTS ON motos_by_annee (nom_search);
CREATE INDEX IF NOT EXISTS ON motos_by_annee (categorie);
CREATE INDEX IF NOT EXISTS ON motos_by_annee (bridable_a2);
CREATE INDEX IF NOT EXISTS ON motos_by_annee (type_carburant);
CREATE INDEX IF NOT EXISTS ON motos_by_annee (elements_mecaniques);

/* Index pour motos_by_vitesse */
CREATE INDEX IF NOT EXISTS ON motos_by_vitesse (marque_search);
CREATE INDEX IF NOT EXISTS ON motos_by_vitesse (nom_search);
CREATE INDEX IF NOT EXISTS ON motos_by_vitesse (categorie);
CREATE INDEX IF NOT EXISTS ON motos_by_vitesse (bridable_a2);
CREATE INDEX IF NOT EXISTS ON motos_by_vitesse (type_carburant);
CREATE INDEX IF NOT EXISTS ON motos_by_vitesse (elements_mecaniques);
CREATE INDEX IF NOT EXISTS ON motos_by_vitesse (annee);

/* Index pour motos_by_temps */
CREATE INDEX IF NOT EXISTS ON motos_by_temps (marque_search);
CREATE INDEX IF NOT EXISTS ON motos_by_temps (nom_search);
CREATE INDEX IF NOT EXISTS ON motos_by_temps (categorie);
CREATE INDEX IF NOT EXISTS ON motos_by_temps (bridable_a2);
CREATE INDEX IF NOT EXISTS ON motos_by_temps (type_carburant);
CREATE INDEX IF NOT EXISTS ON motos_by_temps (elements_mecaniques);
CREATE INDEX IF NOT EXISTS ON motos_by_temps (annee);

/* Index pour motos_by_conso */
CREATE INDEX IF NOT EXISTS ON motos_by_conso (marque_search);
CREATE INDEX IF NOT EXISTS ON motos_by_conso (nom_search);
CREATE INDEX IF NOT EXISTS ON motos_by_conso (categorie);
CREATE INDEX IF NOT EXISTS ON motos_by_conso (bridable_a2);
CREATE INDEX IF NOT EXISTS ON motos_by_conso (type_carburant);
CREATE INDEX IF NOT EXISTS ON motos_by_conso (elements_mecaniques);
CREATE INDEX IF NOT EXISTS ON motos_by_conso (annee);

/* Index pour motos_by_reservoir */
CREATE INDEX IF NOT EXISTS ON motos_by_reservoir (marque_search);
CREATE INDEX IF NOT EXISTS ON motos_by_reservoir (nom_search);
CREATE INDEX IF NOT EXISTS ON motos_by_reservoir (categorie);
CREATE INDEX IF NOT EXISTS ON motos_by_reservoir (bridable_a2);
CREATE INDEX IF NOT EXISTS ON motos_by_reservoir (type_carburant);
CREATE INDEX IF NOT EXISTS ON motos_by_reservoir (elements_mecaniques);
CREATE INDEX IF NOT EXISTS ON motos_by_reservoir (annee);

/* Index sur la table principale (au cas où pas de tri) */
CREATE INDEX IF NOT EXISTS ON motos (marque_search);
CREATE INDEX IF NOT EXISTS ON motos (nom_search);
CREATE INDEX IF NOT EXISTS ON motos (categorie);
CREATE INDEX IF NOT EXISTS ON motos (type_carburant);
CREATE INDEX IF NOT EXISTS ON motos (bridable_a2);

/* --- TABLES DE TRI DÉCROISSANT (DESC) --- */

/* Prix Décroissant */
CREATE TABLE IF NOT EXISTS motos_by_prix_desc (
    bucket INT, prix_tri INT, prix_neuf INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_occasion INT, puissance MAP<TEXT, FLOAT>, annee INT,
    temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    puissance_dni_cv float, puissance_kw float, puissance_fiscale int,
    PRIMARY KEY ((bucket), prix_tri, id)
) WITH CLUSTERING ORDER BY (prix_tri DESC, id ASC); 

/* Année Décroissante */
CREATE TABLE IF NOT EXISTS motos_by_annee_desc (
    bucket INT, prix_tri INT, annee INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, puissance MAP<TEXT, FLOAT>,
    temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    puissance_dni_cv float, puissance_kw float, puissance_fiscale int,
    PRIMARY KEY ((bucket), annee, id)
) WITH CLUSTERING ORDER BY (annee DESC, id ASC);

/* Vitesse Décroissante */
CREATE TABLE IF NOT EXISTS motos_by_vitesse_desc (
    bucket INT, prix_tri INT, vitesse_max INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, puissance MAP<TEXT, FLOAT>, annee INT,
    temps_0_100 FLOAT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    puissance_dni_cv float, puissance_kw float, puissance_fiscale int,
    PRIMARY KEY ((bucket), vitesse_max, id)
) WITH CLUSTERING ORDER BY (vitesse_max DESC, id ASC);

/* 0-100 Décroissant */
CREATE TABLE IF NOT EXISTS motos_by_temps_desc (
    bucket INT, prix_tri INT, temps_0_100 FLOAT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, puissance MAP<TEXT, FLOAT>, annee INT,
    vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    puissance_dni_cv float, puissance_kw float, puissance_fiscale int,
    PRIMARY KEY ((bucket), temps_0_100, id)
) WITH CLUSTERING ORDER BY (temps_0_100 DESC, id ASC);

/* Conso Décroissante */
CREATE TABLE IF NOT EXISTS motos_by_conso_desc (
    bucket INT, prix_tri INT, conso_carburant FLOAT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, puissance MAP<TEXT, FLOAT>, annee INT,
    temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    puissance_dni_cv float, puissance_kw float, puissance_fiscale int,
    PRIMARY KEY ((bucket), conso_carburant, id)
) WITH CLUSTERING ORDER BY (conso_carburant DESC, id ASC);

/* Réservoir Décroissant */
CREATE TABLE IF NOT EXISTS motos_by_reservoir_desc (
    bucket INT, prix_tri INT, capacite_reservoir FLOAT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, puissance MAP<TEXT, FLOAT>, annee INT,
    temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    puissance_dni_cv float, puissance_kw float, puissance_fiscale int,
    PRIMARY KEY ((bucket), capacite_reservoir, id)
) WITH CLUSTERING ORDER BY (capacite_reservoir DESC, id ASC);


/* --- INDEX SECONDAIRES POUR LES TABLES DESC --- */
/* Indispensable pour pouvoir filtrer (Marque, A2...) sur ces nouvelles tables */

/* Index pour motos_by_prix_desc */
CREATE INDEX IF NOT EXISTS ON motos_by_prix_desc (marque_search);
CREATE INDEX IF NOT EXISTS ON motos_by_prix_desc (nom_search);
CREATE INDEX IF NOT EXISTS ON motos_by_prix_desc (categorie);
CREATE INDEX IF NOT EXISTS ON motos_by_prix_desc (bridable_a2);
CREATE INDEX IF NOT EXISTS ON motos_by_prix_desc (type_carburant);
CREATE INDEX IF NOT EXISTS ON motos_by_prix_desc (elements_mecaniques);

/* Index pour motos_by_annee_desc */
CREATE INDEX IF NOT EXISTS ON motos_by_annee_desc (marque_search);
CREATE INDEX IF NOT EXISTS ON motos_by_annee_desc (nom_search);
CREATE INDEX IF NOT EXISTS ON motos_by_annee_desc (categorie);
CREATE INDEX IF NOT EXISTS ON motos_by_annee_desc (bridable_a2);
CREATE INDEX IF NOT EXISTS ON motos_by_annee_desc (type_carburant);
CREATE INDEX IF NOT EXISTS ON motos_by_annee_desc (elements_mecaniques);

/* Index pour motos_by_vitesse_desc */
CREATE INDEX IF NOT EXISTS ON motos_by_vitesse_desc (marque_search);
CREATE INDEX IF NOT EXISTS ON motos_by_vitesse_desc (nom_search);
CREATE INDEX IF NOT EXISTS ON motos_by_vitesse_desc (categorie);
CREATE INDEX IF NOT EXISTS ON motos_by_vitesse_desc (bridable_a2);
CREATE INDEX IF NOT EXISTS ON motos_by_vitesse_desc (type_carburant);
CREATE INDEX IF NOT EXISTS ON motos_by_vitesse_desc (elements_mecaniques);
CREATE INDEX IF NOT EXISTS ON motos_by_vitesse_desc (annee);

/* Index pour motos_by_temps_desc */
CREATE INDEX IF NOT EXISTS ON motos_by_temps_desc (marque_search);
CREATE INDEX IF NOT EXISTS ON motos_by_temps_desc (nom_search);
CREATE INDEX IF NOT EXISTS ON motos_by_temps_desc (categorie);
CREATE INDEX IF NOT EXISTS ON motos_by_temps_desc (bridable_a2);
CREATE INDEX IF NOT EXISTS ON motos_by_temps_desc (type_carburant);
CREATE INDEX IF NOT EXISTS ON motos_by_temps_desc (elements_mecaniques);
CREATE INDEX IF NOT EXISTS ON motos_by_temps_desc (annee);

/* Index pour motos_by_conso_desc */
CREATE INDEX IF NOT EXISTS ON motos_by_conso_desc (marque_search);
CREATE INDEX IF NOT EXISTS ON motos_by_conso_desc (nom_search);
CREATE INDEX IF NOT EXISTS ON motos_by_conso_desc (categorie);
CREATE INDEX IF NOT EXISTS ON motos_by_conso_desc (bridable_a2);
CREATE INDEX IF NOT EXISTS ON motos_by_conso_desc (type_carburant);
CREATE INDEX IF NOT EXISTS ON motos_by_conso_desc (elements_mecaniques);
CREATE INDEX IF NOT EXISTS ON motos_by_conso_desc (annee);

/* Index pour motos_by_reservoir_desc */
CREATE INDEX IF NOT EXISTS ON motos_by_reservoir_desc (marque_search);
CREATE INDEX IF NOT EXISTS ON motos_by_reservoir_desc (nom_search);
CREATE INDEX IF NOT EXISTS ON motos_by_reservoir_desc (categorie);
CREATE INDEX IF NOT EXISTS ON motos_by_reservoir_desc (bridable_a2);
CREATE INDEX IF NOT EXISTS ON motos_by_reservoir_desc (type_carburant);
CREATE INDEX IF NOT EXISTS ON motos_by_reservoir_desc (elements_mecaniques);
CREATE INDEX IF NOT EXISTS ON motos_by_reservoir_desc (annee);

/* --- TRI PAR CYLINDREE */
CREATE TABLE IF NOT EXISTS motos_by_cylindree (
    bucket INT, cylindree INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, prix_tri INT,
    puissance MAP<TEXT, FLOAT>, puissance_dni_cv FLOAT, puissance_kw FLOAT, puissance_fiscale INT,
    annee INT, temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    PRIMARY KEY ((bucket), cylindree, id)
) WITH CLUSTERING ORDER BY (cylindree ASC, id ASC);

CREATE TABLE IF NOT EXISTS motos_by_cylindree_desc (
    bucket INT, cylindree INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, prix_tri INT,
    puissance MAP<TEXT, FLOAT>, puissance_dni_cv FLOAT, puissance_kw FLOAT, puissance_fiscale INT,
    annee INT, temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    PRIMARY KEY ((bucket), cylindree, id)
) WITH CLUSTERING ORDER BY (cylindree DESC, id ASC);

/* --- TRI PAR POIDS  */
CREATE TABLE IF NOT EXISTS motos_by_poids (
    bucket INT, poids INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, prix_tri INT,
    puissance MAP<TEXT, FLOAT>, puissance_dni_cv FLOAT, puissance_kw FLOAT, puissance_fiscale INT,
    annee INT, temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    PRIMARY KEY ((bucket), poids, id)
) WITH CLUSTERING ORDER BY (poids ASC, id ASC);

CREATE TABLE IF NOT EXISTS motos_by_poids_desc (
    bucket INT, poids INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, prix_tri INT,
    puissance MAP<TEXT, FLOAT>, puissance_dni_cv FLOAT, puissance_kw FLOAT, puissance_fiscale INT,
    annee INT, temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    PRIMARY KEY ((bucket), poids, id)
) WITH CLUSTERING ORDER BY (poids DESC, id ASC);

/* --- TRI PAR HAUTEUR DE SELLE --- */
CREATE TABLE IF NOT EXISTS motos_by_hauteur_selle (
    bucket INT, hauteur_selle INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, prix_tri INT,
    puissance MAP<TEXT, FLOAT>, puissance_dni_cv FLOAT, puissance_kw FLOAT, puissance_fiscale INT,
    annee INT, temps_0_100 FLOAT, vitesse_max INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    PRIMARY KEY ((bucket), hauteur_selle, id)
) WITH CLUSTERING ORDER BY (hauteur_selle ASC, id ASC);

CREATE TABLE IF NOT EXISTS motos_by_hauteur_selle_desc (
    bucket INT, hauteur_selle INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, prix_tri INT,
    puissance MAP<TEXT, FLOAT>, puissance_dni_cv FLOAT, puissance_kw FLOAT, puissance_fiscale INT,
    annee INT, temps_0_100 FLOAT, vitesse_max INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    PRIMARY KEY ((bucket), hauteur_selle, id)
) WITH CLUSTERING ORDER BY (hauteur_selle DESC, id ASC);

/* --- TRI PAR LONGUEUR --- */
CREATE TABLE IF NOT EXISTS motos_by_longueur (
    bucket INT, longueur INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, prix_tri INT,
    puissance MAP<TEXT, FLOAT>, puissance_dni_cv FLOAT, puissance_kw FLOAT, puissance_fiscale INT,
    annee INT, temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    PRIMARY KEY ((bucket), longueur, id)
) WITH CLUSTERING ORDER BY (longueur ASC, id ASC);

CREATE TABLE IF NOT EXISTS motos_by_longueur_desc (
    bucket INT, longueur INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, prix_tri INT,
    puissance MAP<TEXT, FLOAT>, puissance_dni_cv FLOAT, puissance_kw FLOAT, puissance_fiscale INT,
    annee INT, temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, nombre_rapports INT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    PRIMARY KEY ((bucket), longueur, id)
) WITH CLUSTERING ORDER BY (longueur DESC, id ASC);

/* --- TRI PAR NOMBRE DE RAPPORTS --- */
CREATE TABLE IF NOT EXISTS motos_by_nombre_rapports (
    bucket INT, nombre_rapports INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, prix_tri INT,
    puissance MAP<TEXT, FLOAT>, puissance_dni_cv FLOAT, puissance_kw FLOAT, puissance_fiscale INT,
    annee INT, temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    PRIMARY KEY ((bucket), nombre_rapports, id)
) WITH CLUSTERING ORDER BY (nombre_rapports ASC, id ASC);

CREATE TABLE IF NOT EXISTS motos_by_nombre_rapports_desc (
    bucket INT, nombre_rapports INT, id UUID,
    nom TEXT, nom_search TEXT, marque TEXT, marque_search TEXT, categorie TEXT,
    cylindree INT, poids INT, prix MAP<TEXT, INT>, prix_neuf INT, prix_occasion INT, prix_tri INT,
    puissance MAP<TEXT, FLOAT>, puissance_dni_cv FLOAT, puissance_kw FLOAT, puissance_fiscale INT,
    annee INT, temps_0_100 FLOAT, vitesse_max INT, hauteur_selle INT, longueur INT,
    elements_mecaniques TEXT, bridable_a2 BOOLEAN, conso_carburant FLOAT, capacite_reservoir FLOAT,
    type_carburant TEXT, suspension_avant text, suspension_arriere text, frein_avant text, frein_arriere text, moteur_nb_cylindres int, moteur_transmission text,
    PRIMARY KEY ((bucket), nombre_rapports, id)
) WITH CLUSTERING ORDER BY (nombre_rapports DESC, id ASC);

/* --- TRI PAR PUISSANCE DNI CV --- */
CREATE TABLE IF NOT EXISTS motos_by_puissance_dni_cv (
    bucket int,
    puissance_dni_cv float,
    id uuid,
    nom text,
    nom_search text,
    marque text,
    marque_search text,
    categorie text,
    cylindree int,
    poids int,
    prix map<text, int>,
    prix_neuf int,
    prix_occasion int,
    prix_tri int,
    puissance map<text, float>,
    puissance_kw float,
    puissance_fiscale int,
    annee int,
    temps_0_100 float,
    vitesse_max int,
    hauteur_selle int,
    longueur int,
    elements_mecaniques text,
    bridable_a2 boolean,
    conso_carburant float,
    capacite_reservoir float,
    type_carburant text,
    nombre_rapports int,
    suspension_avant text, 
    suspension_arriere text, 
    frein_avant text, 
    frein_arriere text, 
    moteur_nb_cylindres int, 
    moteur_transmission text, 
    PRIMARY KEY ((bucket), puissance_dni_cv, id)
);

CREATE TABLE IF NOT EXISTS motos_by_puissance_dni_cv_desc (
    bucket int,
    puissance_dni_cv float,
    id uuid,
    nom text,
    nom_search text,
    marque text,
    marque_search text,
    categorie text,
    cylindree int,
    poids int,
    prix map<text, int>,
    prix_neuf int,
    prix_occasion int,
    prix_tri int,
    puissance map<text, float>,
    puissance_kw float,
    puissance_fiscale int,
    annee int,
    temps_0_100 float,
    vitesse_max int,
    hauteur_selle int,
    longueur int,
    elements_mecaniques text,
    bridable_a2 boolean,
    conso_carburant float,
    capacite_reservoir float,
    type_carburant text,
    nombre_rapports int,
    suspension_avant text, 
    suspension_arriere text, 
    frein_avant text, 
    frein_arriere text, 
    moteur_nb_cylindres int, 
    moteur_transmission text, 
    PRIMARY KEY ((bucket), puissance_dni_cv, id)
) WITH CLUSTERING ORDER BY (puissance_dni_cv DESC, id ASC);

/* --- TRI PAR PUISSANCE KW --- */
CREATE TABLE IF NOT EXISTS motos_by_puissance_kw (
    bucket int,
    puissance_dni_cv float,
    id uuid,
    nom text,
    nom_search text,
    marque text,
    marque_search text,
    categorie text,
    cylindree int,
    poids int,
    prix map<text, int>,
    prix_neuf int,
    prix_occasion int,
    prix_tri int,
    puissance map<text, float>,
    puissance_kw float,
    puissance_fiscale int,
    annee int,
    temps_0_100 float,
    vitesse_max int,
    hauteur_selle int,
    longueur int,
    elements_mecaniques text,
    bridable_a2 boolean,
    conso_carburant float,
    capacite_reservoir float,
    type_carburant text,
    nombre_rapports int,
    suspension_avant text, 
    suspension_arriere text, 
    frein_avant text, 
    frein_arriere text, 
    moteur_nb_cylindres int, 
    moteur_transmission text, 
    PRIMARY KEY ((bucket), puissance_kw, id)
);

CREATE TABLE IF NOT EXISTS motos_by_puissance_kw_desc (
    bucket int,
    puissance_dni_cv float,
    id uuid,
    nom text,
    nom_search text,
    marque text,
    marque_search text,
    categorie text,
    cylindree int,
    poids int,
    prix map<text, int>,
    prix_neuf int,
    prix_occasion int,
    prix_tri int,
    puissance map<text, float>,
    puissance_kw float,
    puissance_fiscale int,
    annee int,
    temps_0_100 float,
    vitesse_max int,
    hauteur_selle int,
    longueur int,
    elements_mecaniques text,
    bridable_a2 boolean,
    conso_carburant float,
    capacite_reservoir float,
    type_carburant text,
    nombre_rapports int,
    suspension_avant text, 
    suspension_arriere text, 
    frein_avant text, 
    frein_arriere text, 
    moteur_nb_cylindres int, 
    moteur_transmission text, 
    PRIMARY KEY ((bucket), puissance_kw, id)
) WITH CLUSTERING ORDER BY (puissance_kw DESC, id ASC);

/* --- TRI PAR PUISSANCE FISCALE --- */
CREATE TABLE IF NOT EXISTS motos_by_puissance_fiscale (
    bucket int,
    puissance_dni_cv float,
    id uuid,
    nom text,
    nom_search text,
    marque text,
    marque_search text,
    categorie text,
    cylindree int,
    poids int,
    prix map<text, int>,
    prix_neuf int,
    prix_occasion int,
    prix_tri int,
    puissance map<text, float>,
    puissance_kw float,
    puissance_fiscale int,
    annee int,
    temps_0_100 float,
    vitesse_max int,
    hauteur_selle int,
    longueur int,
    elements_mecaniques text,
    bridable_a2 boolean,
    conso_carburant float,
    capacite_reservoir float,
    type_carburant text,
    nombre_rapports int,
    suspension_avant text, 
    suspension_arriere text, 
    frein_avant text, 
    frein_arriere text, 
    moteur_nb_cylindres int, 
    moteur_transmission text, 
    PRIMARY KEY ((bucket), puissance_fiscale, id)
);

CREATE TABLE IF NOT EXISTS motos_by_puissance_fiscale_desc (
    bucket int,
    puissance_dni_cv float,
    id uuid,
    nom text,
    nom_search text,
    marque text,
    marque_search text,
    categorie text,
    cylindree int,
    poids int,
    prix map<text, int>,
    prix_neuf int,
    prix_occasion int,
    prix_tri int,
    puissance map<text, float>,
    puissance_kw float,
    puissance_fiscale int,
    annee int,
    temps_0_100 float,
    vitesse_max int,
    hauteur_selle int,
    longueur int,
    elements_mecaniques text,
    bridable_a2 boolean,
    conso_carburant float,
    capacite_reservoir float,
    type_carburant text,
    nombre_rapports int,
    suspension_avant text, 
    suspension_arriere text, 
    frein_avant text, 
    frein_arriere text, 
    moteur_nb_cylindres int, 
    moteur_transmission text, 
    PRIMARY KEY ((bucket), puissance_fiscale, id)
) WITH CLUSTERING ORDER BY (puissance_fiscale DESC, id ASC);

 
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree (puissance_fiscale);
 
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree_desc (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree_desc (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree_desc (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree_desc (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree_desc (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree_desc (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree_desc (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_cylindree_desc (puissance_fiscale);
 
CREATE INDEX IF NOT EXISTS ON motos_by_poids (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_poids (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_poids (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_poids (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_poids (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_poids (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_poids (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_poids (puissance_fiscale);
 
CREATE INDEX IF NOT EXISTS ON motos_by_poids_desc (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_poids_desc (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_poids_desc (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_poids_desc (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_poids_desc (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_poids_desc (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_poids_desc (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_poids_desc (puissance_fiscale);
 
CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle (puissance_fiscale);

CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle_desc (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle_desc (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle_desc (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle_desc (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle_desc (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle_desc (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle_desc (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_hauteur_selle_desc (puissance_fiscale);

CREATE INDEX IF NOT EXISTS ON motos_by_longueur (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_longueur (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_longueur (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_longueur (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_longueur (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_longueur (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_longueur (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_longueur (puissance_fiscale);

CREATE INDEX IF NOT EXISTS ON motos_by_longueur_desc (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_longueur_desc (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_longueur_desc (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_longueur_desc (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_longueur_desc (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_longueur_desc (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_longueur_desc (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_longueur_desc (puissance_fiscale);
 
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports (puissance_fiscale);
 
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports_desc (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports_desc (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports_desc (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports_desc (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports_desc (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports_desc (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports_desc (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_nombre_rapports_desc (puissance_fiscale);
 
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv (puissance_fiscale);

CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv_desc (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv_desc (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv_desc (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv_desc (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv_desc (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv_desc (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv_desc (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_dni_cv_desc (puissance_fiscale);

CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw (puissance_fiscale);
 
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw_desc (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw_desc (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw_desc (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw_desc (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw_desc (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw_desc (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw_desc (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_kw_desc (puissance_fiscale);

CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale (puissance_fiscale);

CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale_desc (cylindree);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale_desc (poids);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale_desc (hauteur_selle);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale_desc (longueur);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale_desc (nombre_rapports);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale_desc (puissance_dni_cv);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale_desc (puissance_kw);
CREATE INDEX IF NOT EXISTS ON motos_by_puissance_fiscale_desc (puissance_fiscale);