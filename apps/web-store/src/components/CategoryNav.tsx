'use client';

import * as React from 'react';

export interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const departments = [
    {
      id: 'computing',
      name: 'Phones & Computing',
      type: 'Hardware',
      icon: 'fa-laptop',
    },
    {
      id: 'electronics',
      name: 'Electronics & Audio',
      type: 'Consumer Tech',
      icon: 'fa-headphones',
    },
    {
      id: 'fashion',
      name: 'Fashion & Streetwear',
      type: 'Lifestyle',
      icon: 'fa-shirt',
    },
    {
      id: 'home',
      name: 'Home & Appliances',
      type: 'Living',
      icon: 'fa-couch',
    },
    {
      id: 'digital',
      name: 'Software & Digital Assets',
      type: 'Code & Design',
      icon: 'fa-code',
    },
  ];

  return (
    <section className="py-12 sm:py-14 bg-white border-b border-[#E7D5BC]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-[#2A2320]">Shop by Department</h2>
            <p className="text-sm text-[#8C8279] mt-1">Explore authentic physical goods and instant digital downloads.</p>
          </div>
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="text-xs font-bold text-[#B5532E] hover:text-[#8F3B1F] hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer"
          >
            <span>View All Categories</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {departments.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className={`group p-5 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center cursor-pointer ${
                  isSelected
                    ? 'bg-[#F6EDE0] border-[#B5532E] shadow-md ring-2 ring-[#B5532E]/20'
                    : 'bg-[#FAF6F0] hover:bg-white border-[#E7D5BC]/60 hover:border-[#B5532E]/40 shadow-2xs hover:shadow-xl'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl mb-3 shadow-2xs transition-colors duration-300 ${
                    isSelected
                      ? 'bg-[#B5532E] text-white'
                      : 'bg-white group-hover:bg-[#B5532E] text-[#B5532E] group-hover:text-white border border-[#E7D5BC]/60'
                  }`}
                >
                  <i className={`fas ${cat.icon}`}></i>
                </div>
                <h3 className={`text-sm font-bold transition-colors ${isSelected ? 'text-[#B5532E]' : 'text-[#2A2320] group-hover:text-[#B5532E]'}`}>
                  {cat.name}
                </h3>
                <span className="text-[11px] text-[#8C8279] mt-1 capitalize font-medium">
                  {cat.type} Department
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
