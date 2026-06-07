// --- METODY POMOCNICZE ---

/**
 * Pobiera wartość zmiennej CSS z dokumentu lub zwraca wartość domyślną.
 * @param {string} cssVar Nazwa zmiennej CSS (np. '--neon-green')
 * @param {string} fallback Kolor zapasowy (np. '#39ff14')
 * @returns {string} Kolor w formacie hex lub rgb
 */
export function varColor(cssVar, fallback) {
    const computed = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    return computed || fallback;
}
