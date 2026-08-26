'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PDFExportButton: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    // Confetti explosion
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Launch window print after a brief delay for rendering
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 450);
  };

  return (
    <Button
      variant="emerald"
      size="sm"
      className="h-9 px-4 font-bold text-xs gap-1.5 shadow-lg shadow-emerald-500/10 transition-all font-mono"
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <Check className="h-4 w-4" />
          <span>Printing Document...</span>
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 text-emerald-300" />
          <span>Print / Export PDF</span>
        </>
      )}
    </Button>
  );
};
export default PDFExportButton;
