
import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full">
      <label 
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 
        ${disabled 
          ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-60' 
          : 'bg-white dark:bg-slate-900/20 border-blue-200 dark:border-pink-500/20 hover:bg-blue-50 dark:hover:bg-pink-500/10 hover:border-blue-400 dark:hover:border-neonPink dark:hover:neon-border-pink group'
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="p-5 bg-blue-100 dark:bg-pink-500/10 text-blue-600 dark:text-neonPink rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-inner">
            <Upload size={36} />
          </div>
          <p className="mb-2 text-xl font-black text-slate-700 dark:text-white uppercase tracking-tighter">Soltar Imagen</p>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">JPG, PNG, WEBP Soportados</p>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">
            <ImageIcon size={14} />
            <span>Listas • Menús • Facturas</span>
          </div>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
};
