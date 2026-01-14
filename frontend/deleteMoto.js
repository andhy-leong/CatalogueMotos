const API_PATH = "http://localhost:3001/api";

async function deleteMoto(motoId) {
  if (!motoId) {
    alert("❌ ID de moto invalide");
    return;
  }
  // Confirmation avant suppression
  if (!confirm("Êtes-vous sûr de vouloir supprimer cette moto ?")) {
    return;
  }
  try {
    const response = await fetch(`${API_PATH}/motos/${motoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Moto supprimée avec succès !");
      // Recharger la liste des motos
      fetchMotos();
    } else {
      console.log(response);
      alert("❌ Erreur : " + result.error);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Impossible de contacter le serveur.");
  }
}
