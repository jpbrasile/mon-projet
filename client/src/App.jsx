/** @jsxImportSource https://esm.sh/react@18.2.0 */
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
import React, { useEffect, useState } from "https://esm.sh/react@18.2.0";
import { apiRequest } from "./api.js";

function App() {
  const [activeTab, setActiveTab] = useState("prospects");
  const [prospects, setProspects] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [taches, setTaches] = useState([]);
  const [emailHistory, setEmailHistory] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [filter, setFilter] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // États pour l'édition et la création
  const [editProspect, setEditProspect] = useState(null);
  const [newProspect, setNewProspect] = useState({
    nom: "",
    prenom: "",
    entreprise_id: "",
    email: "",
    telephone: "",
    fonction: "",
    notes: "",
  });
  // (Des états similaires sont à ajouter pour entreprises, taches, etc.)

  // Fonction de récupération des données depuis l'API (fonction Netlify)
  async function fetchData() {
    try {
      if (activeTab === "prospects") {
        const data = await apiRequest("/api/prospects");
        setProspects(data);
      }
      if (activeTab === "entreprises") {
        const data = await apiRequest("/api/entreprises");
        setEntreprises(data);
      }
      if (activeTab === "taches") {
        const data = await apiRequest("/api/taches");
        setTaches(data);
      }
      if (activeTab === "historique_emails") {
        const data = await apiRequest("/api/email_history");
        setEmailHistory(data);
      }
      if (activeTab === "historique_appels") {
        const data = await apiRequest("/api/call_history");
        setCallHistory(data);
      }
      if (activeTab === "historique_meetings") {
        const data = await apiRequest("/api/meetings");
        setMeetings(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Exemples de fonctions génériques pour gérer les formulaires
  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (endpoint, data, reset, editState, setEditState) => async (e) => {
    e.preventDefault();
    try {
      const method = editState ? "PUT" : "POST";
      // Si on est en mode modification, on ajoute l'ID dans l'URL
      const url = editState
        ? `${endpoint}/${editState.prospect_id}`
        : endpoint;
      await apiRequest(url, method, data);
      await fetchData();
      reset();
      if (setEditState) setEditState(null);
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      alert(`Erreur lors de la soumission : ${error.message}`);
    }
  };

  const handleDelete = (endpoint, id) => async () => {
    try {
      await apiRequest(`${endpoint}/${id}`, "DELETE");
      fetchData();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert(`Erreur lors de la suppression : ${error.message}`);
    }
  };

  // Rendu simplifié des onglets et des formulaires pour l'exemple
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Gestion de Prospects et Entreprises
      </h1>
      <div className="mb-4">
        <button
          onClick={() => setActiveTab("prospects")}
          className={`px-4 py-2 mr-2 ${
            activeTab === "prospects" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Prospects
        </button>
        <button
          onClick={() => setActiveTab("entreprises")}
          className={`px-4 py-2 mr-2 ${
            activeTab === "entreprises" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Entreprises
        </button>
        <button
          onClick={() => setActiveTab("taches")}
          className={`px-4 py-2 mr-2 ${
            activeTab === "taches" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Tâches
        </button>
        <button
          onClick={() => setActiveTab("historique_emails")}
          className={`px-4 py-2 mr-2 ${
            activeTab === "historique_emails"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Historique Emails
        </button>
        <button
          onClick={() => setActiveTab("historique_appels")}
          className={`px-4 py-2 mr-2 ${
            activeTab === "historique_appels"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Historique Appels
        </button>
        <button
          onClick={() => setActiveTab("historique_meetings")}
          className={`px-4 py-2 ${
            activeTab === "historique_meetings"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Historique Meetings
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Rechercher..."
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Exemple de rendu du formulaire des prospects */}
      {activeTab === "prospects" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Ajouter / Modifier un Prospect</h2>
          <form
            onSubmit={handleSubmit(
              "/api/prospects",
              editProspect || newProspect,
              () =>
                setNewProspect({
                  nom: "",
                  prenom: "",
                  entreprise_id: "",
                  email: "",
                  telephone: "",
                  fonction: "",
                  notes: "",
                }),
              editProspect,
              setEditProspect
            )}
            className="mb-4"
          >
            <input
              name="nom"
              placeholder="Nom"
              value={editProspect ? editProspect.nom : newProspect.nom}
              onChange={handleInputChange(editProspect ? setEditProspect : setNewProspect)}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              name="prenom"
              placeholder="Prénom"
              value={editProspect ? editProspect.prenom : newProspect.prenom}
              onChange={handleInputChange(editProspect ? setEditProspect : setNewProspect)}
              className="w-full p-2 border rounded mb-2"
            />
            {/* Ajoutez ici les autres champs (entreprise_id, email, etc.) */}
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editProspect ? "Mettre à jour" : "Ajouter"}
            </button>
            {editProspect && (
              <button
                type="button"
                onClick={() => setEditProspect(null)}
                className="w-full mt-2 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Annuler
              </button>
            )}
          </form>

          {/* Liste des prospects */}
          <ul>
            {prospects
              .filter((p) =>
                p.nom.toLowerCase().includes(filter.toLowerCase()) ||
                p.prenom.toLowerCase().includes(filter.toLowerCase()) ||
                p.email.toLowerCase().includes(filter.toLowerCase())
              )
              .map((p) => (
                <li key={p.prospect_id} className="mb-2 p-2 bg-gray-100 rounded">
                  {p.nom} {p.prenom} - {p.email}
                  <div className="mt-2">
                    <button
                      onClick={() => setEditProspect(p)}
                      className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={handleDelete("/api/prospects", p.prospect_id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Pour les autres onglets (entreprises, taches, etc.), répliquez la logique ci-dessus */}
    </div>
  );
}

function client() {
  createRoot(document.getElementById("root")).render(<App />);
}

if (typeof document !== "undefined") {
  client();
}