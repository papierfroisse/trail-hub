// Utilitaire de calculs de performance et logistique pour le Trail Running

/**
 * Calcul du Km-Effort
 * Formule classique : 1 km-effort = 1 km plat = 100m D+
 * @param {number} distanceKm 
 * @param {number} dPlusM 
 * @returns {number}
 */
export function calculateKmEffort(distanceKm, dPlusM) {
  if (!distanceKm) return 0;
  const kmEffort = distanceKm + (dPlusM / 100);
  return Math.round(kmEffort * 10) / 10;
}

/**
 * Calcul du temps estimé selon la règle de Naismith / Tronc-Allure
 * @param {number} distanceKm 
 * @param {number} dPlusM 
 * @param {number} flatPaceMinPerKm Allure moyenne à plat en min/km (ex: 6.0 pour 10 km/h)
 * @returns {{ hours: number, minutes: number, totalMinutes: number, formatted: string }}
 */
export function estimateDuration(distanceKm, dPlusM, flatPaceMinPerKm = 6.0) {
  if (!distanceKm) return { hours: 0, minutes: 0, totalMinutes: 0, formatted: "0h00" };

  // Temps à plat (min) + 1 min par 10m de D+ (soit +10 min par 100m D+)
  const flatTimeMin = distanceKm * flatPaceMinPerKm;
  const dPlusTimeMin = (dPlusM / 100) * 10;

  const totalMinutes = Math.round(flatTimeMin + dPlusTimeMin);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const formatted = `${hours}h${minutes < 10 ? '0' : ''}${minutes}`;

  return {
    hours,
    minutes,
    totalMinutes,
    formatted
  };
}

/**
 * Calculateur de besoins en Hydratation et Nutrition
 * Recommandations courantes en trail de montagne :
 * - Eau : 0.5L à 0.8L par heure
 * - Glucides : 40g à 60g par heure (jusqu'à 90g/h en ultra)
 * @param {number} durationHours 
 * @returns {{ waterLiters: number, carbsGrams: number, caloriesKcal: number }}
 */
export function calculateNutritionNeeds(durationHours) {
  if (!durationHours) return { waterLiters: 0, carbsGrams: 0, caloriesKcal: 0 };

  const waterLiters = Math.round(durationHours * 0.6 * 10) / 10;
  const carbsGrams = Math.round(durationHours * 50);
  const caloriesKcal = Math.round(durationHours * 450);

  return {
    waterLiters,
    carbsGrams,
    caloriesKcal
  };
}

/**
 * Calculateur de pourcentage de pente moyenne
 * @param {number} dPlusM 
 * @param {number} distanceMeters 
 * @returns {number} Pente en %
 */
export function calculateAverageSlopePercent(dPlusM, distanceMeters) {
  if (!distanceMeters || distanceMeters === 0) return 0;
  const percent = (dPlusM / distanceMeters) * 100;
  return Math.round(percent * 10) / 10;
}
