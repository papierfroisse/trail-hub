import { DEFAULT_GEAR_ITEMS } from "../data/grData";

const STORAGE_KEYS = {
  TRAILS: "trailhub_user_trails",
  CUSTOM_GR_PLANS: "trailhub_custom_gr_plans",
  EQUIPMENT: "trailhub_equipment_list",
  CHECKLISTS: "trailhub_checklists_data",
};

// Récupérer les trails de l'utilisateur
export function getSavedTrails() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRAILS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Erreur de chargement des trails", e);
    return [];
  }
}

// Sauvegarder les trails
export function saveTrails(trails) {
  try {
    localStorage.setItem(STORAGE_KEYS.TRAILS, JSON.stringify(trails));
  } catch (e) {
    console.error("Erreur de sauvegarde des trails", e);
  }
}

// Récupérer les itinéraires multi-GR personnalisés
export function getCustomGrPlans() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_GR_PLANS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Erreur de chargement des plans multi-GR", e);
    return [];
  }
}

// Sauvegarder les itinéraires multi-GR
export function saveCustomGrPlans(plans) {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_GR_PLANS, JSON.stringify(plans));
  } catch (e) {
    console.error("Erreur de sauvegarde des plans multi-GR", e);
  }
}

// Récupérer l'équipement
export function getEquipmentList() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
    return data ? JSON.parse(data) : DEFAULT_GEAR_ITEMS;
  } catch (e) {
    console.error("Erreur de chargement du matériel", e);
    return DEFAULT_GEAR_ITEMS;
  }
}

// Sauvegarder l'équipement
export function saveEquipmentList(items) {
  try {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(items));
  } catch (e) {
    console.error("Erreur de sauvegarde du matériel", e);
  }
}

// Export global des données JSON
export function exportAllDataJSON() {
  const exportObject = {
    app: "TrailHub",
    version: "1.0",
    exportedAt: new Date().toISOString(),
    trails: getSavedTrails(),
    customGrPlans: getCustomGrPlans(),
    equipment: getEquipmentList(),
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `TrailHub_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Import global des données JSON
export function importAllDataJSON(jsonText) {
  try {
    const data = JSON.parse(jsonText);
    if (data.trails) saveTrails(data.trails);
    if (data.customGrPlans) saveCustomGrPlans(data.customGrPlans);
    if (data.equipment) saveEquipmentList(data.equipment);
    return { success: true, message: "Données importées avec succès !" };
  } catch {
    return { success: false, message: "Fichier JSON invalide." };
  }
}
