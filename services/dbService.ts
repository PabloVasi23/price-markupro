
import { ProductItem, SavedList, ImportSummary } from "../types";

const DB_KEYS = {
  PRODUCTS: 'pm_master_products',
  LISTS: 'pm_saved_lists',
  SETTINGS: 'priceMarkupSettings'
};

/**
 * Generador de ID robusto compatible con todos los navegadores
 */
export const generateId = () => {
  try {
    return crypto.randomUUID();
  } catch (e) {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }
};

/**
 * Normalización avanzada para deduplicación
 */
export const normalizeString = (str: string) => {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
    .replace(/[^a-z0-9]/g, "");     // Solo alfanumérico
};

const getProductKey = (name: string, brand: string) => {
  return `${normalizeString(name)}|${normalizeString(brand)}`;
};

export const dbService = {
  getMasterProducts: (): ProductItem[] => {
    try {
      const data = localStorage.getItem(DB_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error leyendo productos:", e);
      return [];
    }
  },

  saveMasterProducts: (products: ProductItem[]) => {
    try {
      localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error("Error guardando productos (posible cuota excedida):", e);
      alert("Error: No se pudo guardar. Es posible que el almacenamiento esté lleno.");
    }
  },

  upsertProducts: (newItems: Omit<ProductItem, 'id'>[]): { updatedMaster: ProductItem[], summary: ImportSummary } => {
    const current = dbService.getMasterProducts();
    const updated = [...current];
    const now = new Date().toISOString();
    
    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    newItems.forEach(newItem => {
      const key = getProductKey(newItem.name, newItem.brand || '');
      const existingIdx = updated.findIndex(p => getProductKey(p.name, p.brand || '') === key);

      if (existingIdx > -1) {
        const existing = updated[existingIdx];
        if (newItem.originalPrice > existing.originalPrice || newItem.lastUpdated > existing.lastUpdated) {
          updated[existingIdx] = {
            ...existing,
            ...newItem,
            id: existing.id,
            lastUpdated: now
          };
          updatedCount++;
        } else {
          skippedCount++;
        }
      } else {
        updated.push({
          ...newItem,
          id: generateId(),
          lastUpdated: now
        } as ProductItem);
        addedCount++;
      }
    });

    dbService.saveMasterProducts(updated);
    
    return {
      updatedMaster: updated,
      summary: {
        added: addedCount,
        updated: updatedCount,
        skipped: skippedCount,
        total: newItems.length
      }
    };
  },

  deleteProduct: (id: string) => {
    const current = dbService.getMasterProducts();
    const filtered = current.filter(p => p.id !== id);
    dbService.saveMasterProducts(filtered);
    return filtered;
  },

  getSavedLists: (): SavedList[] => {
    try {
      const data = localStorage.getItem(DB_KEYS.LISTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveList: (list: SavedList) => {
    try {
      const current = dbService.getSavedLists();
      const existingIdx = current.findIndex(l => l.id === list.id);
      if (existingIdx > -1) {
        current[existingIdx] = list;
      } else {
        current.push(list);
      }
      localStorage.setItem(DB_KEYS.LISTS, JSON.stringify(current));
      return current;
    } catch (e) {
      console.error("Error guardando historial:", e);
      alert("Error al guardar en el historial. Intenta borrar listas viejas para liberar espacio.");
      return dbService.getSavedLists();
    }
  },

  deleteList: (id: string) => {
    const current = dbService.getSavedLists();
    const filtered = current.filter(l => l.id !== id);
    localStorage.setItem(DB_KEYS.LISTS, JSON.stringify(filtered));
    return filtered;
  },

  clearAllData: () => {
    localStorage.removeItem(DB_KEYS.PRODUCTS);
  }
};
