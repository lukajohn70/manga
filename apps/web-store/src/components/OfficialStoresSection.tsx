'use client';

import * as React from 'react';
import { motion } from 'motion/react';

export interface OfficialStoresSectionProps {
  onSelectBrand: (brand: string) => void;
}

const BRANDS = [
  { name: 'Apple', label: 'Apple', icon: 'fab fa-apple', isIcon: true },
  { name: 'Samsung', label: 'Samsung', textLogo: 'SAMSUNG' },
  { name: 'Sony', label: 'Sony Audio', textLogo: 'SONY', tracking: 'tracking-widest' },
  { name: 'Logitech', label: 'Logitech', textLogo: 'logi' },
  { name: 'DeLonghi', label: "De'Longhi", textLogo: "De'Longhi" },
  { name: 'MARKETSQUARE', label: 'Signature Line', textLogo: 'MARKETSQUARE', isFlagship: true },
];

export const OfficialStoresSection: React.FC<OfficialStoresSectionProps> = ({
  onSelectBrand,
}) => {
  return (
    <section className="py-14 sm:py-16 bg-[#FAF7F2] border-b border-[#EAE3D9]/80">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B5532E] mb-1.5">
              <i className="fas fa-certificate text-[11px]" />
              <span>Manufacturer Authorized</span>
            </div>
            <h2 className="apple-heading text-2xl sm:text-3xl font-bold text-[#1D1917] tracking-tight">
              Official Brand Stores
            </h2>
            <p className="apple-subhead text-sm text-[#78716C] mt-1 font-normal">
              Direct distribution with authentic manufacturer warranty coverage.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectBrand('')}
            className="text-xs font-semibold text-[#B5532E] hover:text-[#8F3B1F] flex items-center gap-1.5 bg-transparent border-0 cursor-pointer transition-colors"
          >
            <span>All Authorized Brands</span>
            <i className="fas fa-arrow-right text-[10px] opacity-75" />
          </button>
        </div>

        {/* Official Brands Strip with Spring Physics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {BRANDS.map((b) => (
            <motion.button
              key={b.name}
              type="button"
              onClick={() => onSelectBrand(b.name)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer apple-pressable transition-colors ${
                b.isFlagship
                  ? 'bg-white border-[#B5532E]/30 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#B5532E]/60'
                  : 'bg-white border-[#EAE3D9] shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#B5532E]/30 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)]'
              }`}
            >
              <div className="h-10 flex items-center justify-center mb-2">
                {b.isIcon ? (
                  <i className={`${b.icon} text-3xl text-[#1D1917]`} />
                ) : (
                  <span
                    className={`font-bold text-lg text-[#1D1917] ${
                      b.tracking || 'tracking-tight'
                    } ${b.isFlagship ? 'text-[#B5532E] text-sm' : ''}`}
                  >
                    {b.textLogo}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-[#1D1917] mt-1">{b.label}</span>
              <span className="text-[10px] text-[#4F6B3A] font-medium mt-1 flex items-center gap-1">
                <i className="fas fa-check-circle text-[9px]" />
                <span>{b.isFlagship ? 'Flagship' : 'Verified'}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
