'use client';

import * as React from 'react';

export interface OfficialStoresSectionProps {
  onSelectBrand: (brand: string) => void;
}

export const OfficialStoresSection: React.FC<OfficialStoresSectionProps> = ({
  onSelectBrand,
}) => {
  return (
    <section className="py-14 sm:py-16 bg-white border-b border-[#E7D5BC]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B5532E] mb-1">
              <i className="fas fa-circle-check"></i> Verified Official Stores
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-[#2A2320]">MARKETSQUARE Mall</h2>
            <p className="text-sm text-[#8C8279]">100% Authentic products directly from manufacturer-authorized distributors.</p>
          </div>
          <button
            type="button"
            onClick={() => onSelectBrand('')}
            className="text-xs font-bold text-[#B5532E] hover:text-[#8F3B1F] hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer"
          >
            <span>Explore All Brands</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        {/* Official Brands Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <button
            type="button"
            onClick={() => onSelectBrand('Apple')}
            className="p-6 rounded-2xl bg-[#FAF6F0] hover:bg-white border border-[#E7D5BC]/80 hover:border-[#B5532E]/40 shadow-2xs hover:shadow-lg transition-all text-center flex flex-col items-center justify-center group cursor-pointer"
          >
            <i className="fab fa-apple text-3xl text-[#2A2320] group-hover:text-[#B5532E] transition-colors mb-2"></i>
            <span className="text-xs font-bold text-[#2A2320]">Apple</span>
            <span className="text-[10px] text-[#4F6B3A] font-semibold mt-0.5">
              <i className="fas fa-check-circle text-[9px]"></i> Official
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectBrand('Samsung')}
            className="p-6 rounded-2xl bg-[#FAF6F0] hover:bg-white border border-[#E7D5BC]/80 hover:border-[#B5532E]/40 shadow-2xs hover:shadow-lg transition-all text-center flex flex-col items-center justify-center group cursor-pointer"
          >
            <span className="font-display font-black text-xl text-[#2A2320] group-hover:text-[#B5532E] transition-colors mb-2">
              SAMSUNG
            </span>
            <span className="text-xs font-bold text-[#2A2320]">Samsung</span>
            <span className="text-[10px] text-[#4F6B3A] font-semibold mt-0.5">
              <i className="fas fa-check-circle text-[9px]"></i> Official
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectBrand('Sony')}
            className="p-6 rounded-2xl bg-[#FAF6F0] hover:bg-white border border-[#E7D5BC]/80 hover:border-[#B5532E]/40 shadow-2xs hover:shadow-lg transition-all text-center flex flex-col items-center justify-center group cursor-pointer"
          >
            <span className="font-display font-black text-xl tracking-widest text-[#2A2320] group-hover:text-[#B5532E] transition-colors mb-2">
              SONY
            </span>
            <span className="text-xs font-bold text-[#2A2320]">Sony Audio</span>
            <span className="text-[10px] text-[#4F6B3A] font-semibold mt-0.5">
              <i className="fas fa-check-circle text-[9px]"></i> Official
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectBrand('Logitech')}
            className="p-6 rounded-2xl bg-[#FAF6F0] hover:bg-white border border-[#E7D5BC]/80 hover:border-[#B5532E]/40 shadow-2xs hover:shadow-lg transition-all text-center flex flex-col items-center justify-center group cursor-pointer"
          >
            <span className="font-display font-black text-xl text-[#2A2320] group-hover:text-[#B5532E] transition-colors mb-2">
              logi
            </span>
            <span className="text-xs font-bold text-[#2A2320]">Logitech</span>
            <span className="text-[10px] text-[#4F6B3A] font-semibold mt-0.5">
              <i className="fas fa-check-circle text-[9px]"></i> Official
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectBrand('DeLonghi')}
            className="p-6 rounded-2xl bg-[#FAF6F0] hover:bg-white border border-[#E7D5BC]/80 hover:border-[#B5532E]/40 shadow-2xs hover:shadow-lg transition-all text-center flex flex-col items-center justify-center group cursor-pointer"
          >
            <span className="font-display font-black text-lg text-[#2A2320] group-hover:text-[#B5532E] transition-colors mb-2">
              De'Longhi
            </span>
            <span className="text-xs font-bold text-[#2A2320]">De'Longhi</span>
            <span className="text-[10px] text-[#4F6B3A] font-semibold mt-0.5">
              <i className="fas fa-check-circle text-[9px]"></i> Official
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectBrand('MARKETSQUARE')}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#B5532E]/10 to-[#D9A441]/10 hover:bg-white border border-[#B5532E]/30 shadow-2xs hover:shadow-lg transition-all text-center flex flex-col items-center justify-center group cursor-pointer"
          >
            <span className="font-display font-black text-sm text-[#B5532E] mb-2 tracking-tight">
              MARKETSQUARE
            </span>
            <span className="text-xs font-bold text-[#2A2320]">Signature Line</span>
            <span className="text-[10px] text-[#B5532E] font-semibold mt-0.5">
              <i className="fas fa-star text-[9px] text-[#D9A441]"></i> Flagship
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
