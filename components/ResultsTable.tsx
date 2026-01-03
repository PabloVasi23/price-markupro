
import React, { useState, useEffect, useCallback } from 'react';
import { ProcessedProductItem } from '../types';
import { 
  ArrowRight, 
  Trash2, 
  Plus, 
  Edit2, 
  Eye, 
  EyeOff, 
  Check, 
  X,
  Database,
  Copy,
  ChevronRight
} from 'lucide-react';

interface ResultsTableProps {
  items: ProcessedProductItem[];
  currencySymbol: string;
  visibility: { baseCost: boolean; sellerPrice: boolean; suggestedPrice: boolean };
  onToggleVisibility: (column: string) => void;
  onUpdate: (id: string, updates: Partial<ProcessedProductItem>) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const ProductRow: React.FC<{
  item: ProcessedProductItem;
  currencySymbol: string;
  visibility: { baseCost: boolean; sellerPrice: boolean; suggestedPrice: boolean };
  onSave: (id: string, updates: Partial<ProcessedProductItem>) => void;
  onDelete: (id: string) => void;
}> = ({ item, currencySymbol, visibility, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editBrand, setEditBrand] = useState(item.brand || '');
  const [editPrice, setEditPrice] = useState(item.originalPrice);

  useEffect(() => {
    if (!isEditing) {
      setEditName(item.name);
      setEditBrand(item.brand || '');
      setEditPrice(item.originalPrice);
    }
  }, [item, isEditing]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    let parts = [`*${item.name.toUpperCase()}*`];
    if (item.brand) parts.push(`_${item.brand}_`);
    if (visibility.baseCost) parts.push(`Costo: ${item.currency}${item.calculatedCostLocal.toLocaleString()}`);
    if (visibility.sellerPrice) parts.push(`Venta: ${item.currency}${item.sellerPrice.toLocaleString()}`);
    if (visibility.suggestedPrice) parts.push(`Final: ${item.currency}${item.suggestedPrice.toLocaleString()}`);
    
    navigator.clipboard.writeText(parts.join('\n')).then(() => alert("Datos del producto copiados"));
  };

  const submitEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(item.id, { 
      name: editName, 
      brand: editBrand, 
      originalPrice: Number(editPrice) || 0 
    });
    setIsEditing(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  if (isEditing) {
    return (
      <tr className="bg-blue-50/50 dark:bg-cyan-500/10 animate-in fade-in duration-300">
        <td className="px-4 py-4 w-12 text-center">
          <div className="flex flex-col gap-2 items-center">
            <button 
              type="button"
              onClick={submitEdit} 
              className="text-white bg-green-600 dark:bg-neonLime dark:text-slate-950 p-2 rounded-lg hover:brightness-110 shadow-sm"
              title="Confirmar"
            >
              <Check size={16}/>
            </button>
            <button 
              type="button"
              onClick={handleCancelEdit} 
              className="text-slate-500 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
              title="Cancelar"
            >
              <X size={16}/>
            </button>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="space-y-2">
            <input 
              type="text" 
              value={editName} 
              onChange={e => setEditName(e.target.value)} 
              className="w-full bg-white dark:bg-black/40 dark:text-white border-2 border-blue-200 dark:border-cyan-500/30 rounded-lg px-3 py-2 font-bold text-sm focus:outline-none focus:border-blue-500 dark:focus:border-neonCyan" 
              placeholder="Nombre del producto"
            />
            <input 
              type="text" 
              value={editBrand} 
              onChange={e => setEditBrand(e.target.value)} 
              className="w-full bg-white dark:bg-black/40 dark:text-white border border-slate-200 dark:border-cyan-500/20 rounded-lg px-3 py-1 text-xs focus:outline-none focus:border-blue-500 dark:focus:border-neonCyan" 
              placeholder="Marca / Variante"
            />
          </div>
        </td>
        <td className="px-4 py-4 text-right">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] font-black uppercase text-blue-600 dark:text-neonCyan">Costo ($)</span>
            <input 
              type="number" 
              value={editPrice} 
              onChange={e => setEditPrice(parseFloat(e.target.value) || 0)} 
              className="w-28 bg-white dark:bg-black/40 dark:text-white border-2 border-blue-200 dark:border-cyan-500/30 rounded-lg px-3 py-2 text-right text-sm font-black focus:outline-none focus:border-blue-500 dark:focus:border-neonCyan" 
            />
          </div>
        </td>
        <td colSpan={3} className="px-4 py-4 text-center text-slate-300 dark:text-slate-600 italic text-[10px]">
          Modificando valores...
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-cyan-500/5 transition-colors border-b border-slate-100 dark:border-slate-800 group">
      <td className="px-4 py-4 text-center w-12">
        <button 
          type="button"
          onClick={handleEditClick} 
          className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-neonCyan hover:bg-blue-50 dark:hover:bg-cyan-500/10 p-2 rounded-lg transition-all"
          title="Editar Producto"
        >
          <Edit2 size={16}/>
        </button>
      </td>
      <td className="px-4 py-4">
        <div className="font-extrabold text-slate-900 dark:text-white text-[13px] uppercase truncate max-w-xs">{item.name}</div>
        {item.brand && <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium italic mt-0.5">{item.brand}</div>}
      </td>
      
      {visibility.baseCost && (
        <td className="px-4 py-4 text-right">
          <div className="text-slate-400 dark:text-slate-500 font-mono text-[11px] font-bold">{item.currency}{item.calculatedCostLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </td>
      )}
      
      {visibility.sellerPrice && (
        <td className="px-4 py-4 text-right bg-slate-50/50 dark:bg-slate-800/20">
          <div className="text-blue-600 dark:text-neonCyan font-mono text-[13px] font-black dark:neon-text-cyan">{currencySymbol}{item.sellerPrice.toLocaleString()}</div>
        </td>
      )}

      {visibility.suggestedPrice && (
        <td className="px-4 py-4 text-right bg-emerald-50/30 dark:bg-emerald-950/10">
          <div className="text-emerald-600 dark:text-neonLime font-mono text-[15px] font-black dark:neon-text-lime">{currencySymbol}{item.suggestedPrice.toLocaleString()}</div>
        </td>
      )}

      <td className="px-4 py-4 text-center w-24">
        <div className="flex items-center justify-center gap-2">
          <button 
            type="button"
            onClick={handleCopy} 
            className="p-2 text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-neonCyan hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-transparent shadow-sm"
            title="Copiar datos"
          >
            <Copy size={16}/>
          </button>
          <button 
            type="button"
            onClick={handleDeleteClick} 
            className="p-2 text-slate-400 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-transparent shadow-sm"
            title="Eliminar"
          >
            <Trash2 size={16}/>
          </button>
        </div>
      </td>
    </tr>
  );
};

export const ResultsTable: React.FC<ResultsTableProps> = ({ items, currencySymbol, visibility, onToggleVisibility, onUpdate, onDelete, onAdd }) => {
  const handleToggleClick = useCallback((column: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVisibility(column);
  }, [onToggleVisibility]);

  if (items.length === 0) return (
    <div className="bg-white dark:bg-slate-900/30 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-cyan-500/20 p-24 text-center animate-in fade-in duration-700">
      <div className="p-6 bg-slate-50 dark:bg-cyan-500/10 rounded-full w-fit mx-auto mb-6">
        <Database className="h-16 w-16 text-slate-200 dark:text-neonCyan/30" />
      </div>
      <h3 className="font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-3">Base de Datos Offline</h3>
      <p className="text-slate-300 dark:text-slate-700 text-xs mb-8 uppercase font-bold tracking-widest">El inventario actual está vacío</p>
      <button 
        type="button"
        onClick={onAdd} 
        className="px-10 py-4 bg-blue-600 dark:bg-neonCyan text-white dark:text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 shadow-xl dark:neon-border-cyan transition-all"
      >
        <Plus className="inline mr-2" size={16}/> Crear Registro
      </button>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-cyan-500/20 overflow-hidden animate-in slide-in-from-bottom-6 duration-700">
      <div className="px-10 py-8 bg-slate-50/50 dark:bg-black/20 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
         <div className="flex items-center gap-4">
           <h3 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-[0.2em]">Registros Activos</h3>
           <span className="bg-slate-900 dark:bg-neonCyan text-white dark:text-slate-950 px-4 py-1.5 rounded-full text-[11px] font-black shadow-lg">{items.length}</span>
         </div>
         <button 
           type="button"
           onClick={onAdd} 
           className="text-[10px] font-black text-white dark:text-slate-950 uppercase flex items-center gap-2 transition-all bg-blue-600 dark:bg-neonCyan px-6 py-3 rounded-2xl hover:scale-105 shadow-xl dark:neon-border-cyan"
         >
           <Plus size={18}/> Nuevo Ítem
         </button>
      </div>
      <div className="overflow-x-auto relative">
        <table className="w-full text-left border-collapse table-auto">
          <thead className="bg-slate-50/50 dark:bg-black/40 text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-6 py-6 w-12 text-center"></th>
              <th className="px-6 py-6 min-w-[240px]">Producto / Descripción</th>
              
              <th className={`px-6 py-6 text-right w-40 transition-all ${visibility.baseCost ? '' : 'opacity-20'}`}>
                <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                  Costo Base 
                  <button 
                    type="button"
                    onClick={(e) => handleToggleClick('baseCost', e)} 
                    className="hover:text-blue-500 dark:hover:text-neonCyan transition-all p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 active:scale-90"
                  >
                    {visibility.baseCost ? <Eye size={14}/> : <EyeOff size={14}/>}
                  </button>
                </div>
              </th>

              <th className={`px-6 py-6 text-right w-44 transition-all ${visibility.sellerPrice ? '' : 'opacity-20'}`}>
                <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                  Vendedor 
                  <button 
                    type="button"
                    onClick={(e) => handleToggleClick('sellerPrice', e)} 
                    className="hover:text-blue-500 dark:hover:text-neonCyan transition-all p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 active:scale-90"
                  >
                    {visibility.sellerPrice ? <Eye size={14}/> : <EyeOff size={14}/>}
                  </button>
                </div>
              </th>

              <th className={`px-6 py-6 text-right w-48 transition-all ${visibility.suggestedPrice ? '' : 'opacity-20'}`}>
                <div className="flex items-center justify-end gap-2 text-emerald-700 dark:text-neonLime whitespace-nowrap">
                  Sugerido 
                  <button 
                    type="button"
                    onClick={(e) => handleToggleClick('suggestedPrice', e)} 
                    className="hover:text-emerald-700 dark:hover:text-neonLime transition-all p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700 active:scale-90"
                  >
                    {visibility.suggestedPrice ? <Eye size={14}/> : <EyeOff size={14}/>}
                  </button>
                </div>
              </th>

              <th className="px-6 py-6 w-24 text-center">Gestión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {items.map(item => (
              <ProductRow 
                key={item.id} 
                item={item} 
                currencySymbol={currencySymbol} 
                visibility={visibility} 
                onSave={onUpdate} 
                onDelete={onDelete} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
