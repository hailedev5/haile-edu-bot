
import React, { useState } from 'react';
import { BackIcon, XIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';
import { elements } from '../data/periodicTableData';
import type { PeriodicElement } from '../types';

const categoryColors: { [key: string]: string } = {
  "diatomic nonmetal": "bg-green-500/30 border-green-400/50 text-green-200",
  "noble gas": "bg-purple-500/30 border-purple-400/50 text-purple-200",
  "alkali metal": "bg-red-500/30 border-red-400/50 text-red-200",
  "alkaline earth metal": "bg-orange-500/30 border-orange-400/50 text-orange-200",
  "metalloid": "bg-yellow-500/30 border-yellow-400/50 text-yellow-200",
  "polyatomic nonmetal": "bg-green-600/30 border-green-500/50 text-green-300",
  "post-transition metal": "bg-blue-500/30 border-blue-400/50 text-blue-200",
  "transition metal": "bg-blue-300/30 border-blue-200/50 text-blue-100",
  "lanthanide": "bg-indigo-500/30 border-indigo-400/50 text-indigo-200",
  "actinide": "bg-pink-500/30 border-pink-400/50 text-pink-200",
  "unknown": "bg-gray-500/30 border-gray-400/50 text-gray-200",
};

const getCategoryColor = (category: string) => {
    const key = Object.keys(categoryColors).find(c => category.includes(c)) || "unknown";
    return categoryColors[key];
}

const ElementTile: React.FC<{ element: PeriodicElement; onSelect: (el: PeriodicElement) => void }> = ({ element, onSelect }) => {
  const colorClass = getCategoryColor(element.category);
  return (
    <button
      onClick={() => onSelect(element)}
      className={`p-1 rounded-md text-center border-b-2 hover:border-b-4 hover:-translate-y-px transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] ${colorClass}`}
      style={{ gridColumnStart: element.xpos, gridRowStart: element.ypos }}
      aria-label={element.name}
    >
      <div className="text-xs opacity-70">{element.number}</div>
      <div className="text-lg font-bold">{element.symbol}</div>
      <div className="text-xs truncate">{element.name}</div>
    </button>
  );
};

const ElementDetailModal: React.FC<{ element: PeriodicElement | null; onClose: () => void; t: (key: string) => string }> = ({ element, onClose, t }) => {
    if (!element) return null;
    const colorClass = getCategoryColor(element.category);
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in-scale" style={{animationDuration: '0.3s'}} onClick={onClose}>
            <div className="bg-[var(--background-secondary)] rounded-2xl shadow-lg w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
                <header className={`p-4 rounded-t-2xl flex justify-between items-center ${colorClass.split(' ')[0]}`}>
                    <div>
                        <h3 className="text-2xl font-bold">{element.name} ({element.symbol})</h3>
                        <p className="text-sm capitalize">{t(`category_${element.category.replace(/ /g, '_')}`)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-black/20">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>
                <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
                    <DetailRow label={t('atomicNumber')} value={element.number} />
                    <DetailRow label={t('atomicMass')} value={element.atomic_mass.toFixed(3)} />
                    <DetailRow label={t('electronConfiguration')} value={element.electron_configuration_semantic} />
                    <DetailRow label={t('meltingPoint')} value={element.melt ? `${element.melt} K` : 'N/A'} />
                    <DetailRow label={t('boilingPoint')} value={element.boil ? `${element.boil} K` : 'N/A'} />
                    <DetailRow label={t('density')} value={element.density ? `${element.density} g/L` : 'N/A'} />
                    <div>
                        <h4 className="font-semibold text-[var(--text-secondary)] text-sm mb-1">{t('summary')}</h4>
                        <p className="text-sm text-[var(--text-primary)]">{element.summary}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailRow: React.FC<{label: string, value: string | number}> = ({ label, value }) => (
    <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
        <span className="text-sm font-semibold text-[var(--text-secondary)]">{label}</span>
        <span className="text-sm font-medium text-[var(--text-primary)] text-right">{value}</span>
    </div>
);


const PeriodicTable: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedElement, setSelectedElement] = useState<PeriodicElement | null>(null);
  const { t } = useI18n();

  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)]">
      <header className="flex items-center p-4 border-b border-[var(--border-color)] max-w-md mx-auto w-full">
        <button onClick={onBack} className="p-2 mr-2">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">{t('periodicTableHeader')}</h1>
      </header>
      <main className="flex-1 overflow-auto p-2">
        <p className="text-center text-sm text-[var(--text-secondary)] mb-4">{t('periodicTableSubtitle')}</p>
        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', gridTemplateRows: 'repeat(10, minmax(0, 1fr))' }}>
          {elements.map((el) => (
            <ElementTile key={el.number} element={el} onSelect={setSelectedElement} />
          ))}
        </div>
        <div className="mt-4 p-2 max-w-4xl mx-auto">
            <h3 className="font-semibold text-center mb-2">{t('elementCategory')}</h3>
            <div className="flex flex-wrap justify-center gap-2">
                {Object.entries(categoryColors).filter(([key]) => key !== 'unknown').map(([category, colorClass]) => (
                    <div key={category} className="flex items-center gap-2 text-xs">
                        <div className={`w-3 h-3 rounded-sm ${colorClass.split(' ')[0]}`}></div>
                        <span className="capitalize">{t(`category_${category.replace(/ /g, '_')}`)}</span>
                    </div>
                ))}
            </div>
        </div>
      </main>
      <ElementDetailModal element={selectedElement} onClose={() => setSelectedElement(null)} t={t} />
    </div>
  );
};

export default PeriodicTable;
