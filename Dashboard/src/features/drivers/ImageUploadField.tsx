import { useEffect, useMemo, useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  description: string;
  files: File[];
  maxFiles?: number;
  onChange: (files: File[]) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const ImageUploadField = ({
  label,
  description,
  files,
  maxFiles = 1,
  onChange,
}: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const validImages = Array.from(selectedFiles).filter(
      (file) => file.type.startsWith('image/') && file.size <= MAX_FILE_SIZE,
    );
    onChange([...files, ...validImages].slice(0, maxFiles));
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <div className="mb-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</label>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </div>

      <div className={`grid gap-3 ${maxFiles > 1 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1'}`}>
        {previews.map((preview, index) => (
          <div key={`${files[index].name}-${files[index].lastModified}`} className="relative h-32 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <img src={preview} alt={`${label} preview ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label={`Remove ${files[index].name}`}
              onClick={() => onChange(files.filter((_, fileIndex) => fileIndex !== index))}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/75 text-white hover:bg-rose-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {files.length < maxFiles ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-600"
          >
            <ImagePlus className="mb-2 h-6 w-6" />
            <span className="text-sm font-semibold">Choose image{maxFiles > 1 ? 's' : ''}</span>
            <span className="mt-1 text-[11px] text-slate-400">JPG or PNG, up to 5 MB</span>
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple={maxFiles > 1}
        onChange={(event) => handleFiles(event.target.files)}
        className="sr-only"
      />
    </div>
  );
};
