
import React from 'react';
import { SavedList } from '../types';
import { Trash2, RotateCcw, Calendar, Package, ArrowLeft, AlertTriangle } from 'lucide-react';

interface SavedListsViewProps {
  lists: SavedList[];
  onRestore: (list: SavedList) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  onDeleteAll?: () => void;
}

export const SavedListsView: React.FC<SavedListsViewProps> = ({ lists, onRestore, onDelete, onBack, onDeleteAll }) => {
  const handleDeleteAll = () => {
    if (confirm("🚨 ¿BORRAR TODO EL HISTORIAL? Esta acción eliminará permanentemente todas las listas guardadas.")) {
      onDeleteAll?.();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <button onClick={onBack} className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-neonCyan font-black uppercase text-xs tracking-[0.2em] transition-all group w-fit">
          <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-transparent dark:border-cyan-500/20 group-hover:scale-110 transition-transform">
            <ArrowLeft size={20}/>
          </div>
          Volver al Centro
        </button>
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white">Historial <span className="text-blue-600 dark:text-neonCyan dark:neon-text-cyan">Sincronizado</span></h2>
          {lists.length > 0 && (
            <button 
              onClick={handleDeleteAll}
              className="px-4 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black uppercase text-[9px] tracking-widest flex items-center gap-2"
              title="Borrar todo el historial"
            >
              <Trash2 size={14}/> Borrar Todo
            </button>
          )}
        </div>
      </div>

      {lists.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/30 backdrop-blur-md rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-200 dark:border-cyan-500/20">
          <div className="p-6 bg-slate-50 dark:bg-cyan-500/10 rounded-full w-fit mx-auto mb-6">
            <Calendar className="h-14 w-14 text-slate-200 dark:text-neonCyan/20" />
          </div>
          <p className="font-black uppercase text-slate-400 dark:text-slate-600 text-sm tracking-[0.3em]">No se han generado registros</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {lists.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((list) => (
            <div key={list.id} className="bg-white dark:bg-slate-900/40 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-sm dark:shadow-none border border-slate-100 dark:border-cyan-500/10 flex flex-col sm:flex-row sm:items-center justify-between hover:border-blue-200 dark:hover:border-neonCyan hover:scale-[1.01] transition-all group gap-6">
              <div className="space-y-3">
                <h3 className="font-black uppercase text-slate-900 dark:text-white text-lg tracking-tight">{list.name || 'Registro sin Identificar'}</h3>
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg"><Calendar size={14} className="text-blue-500 dark:text-neonCyan"/> {new Date(list.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg"><Package size={14} className="text-pink-500 dark:text-neonPink"/> {list.items.length} Ítems</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onRestore(list)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-50 dark:bg-cyan-500/10 text-blue-600 dark:text-neonCyan rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 dark:hover:bg-neonCyan hover:text-white dark:hover:text-slate-950 transition-all dark:neon-border-cyan shadow-sm"
                >
                  <RotateCcw size={16}/> Restaurar
                </button>
                <button 
                  onClick={() => {
                    if(confirm("¿Eliminar esta lista?")) onDelete(list.id);
                  }}
                  className="p-3.5 text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-2xl transition-all"
                  title="Borrar registro"
                >
                  <Trash2 size={20}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
