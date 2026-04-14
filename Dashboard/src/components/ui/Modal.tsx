import React from 'react';
import { cn } from '../../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from './dialog';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent 
        className={cn("bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border-0 p-0 sm:max-w-lg gap-0", className)}
        showCloseButton={false}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <DialogTitle className="text-lg font-semibold text-slate-800">{title}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
        
        {footer && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
