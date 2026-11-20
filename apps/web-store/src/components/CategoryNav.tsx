'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';

export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  type?: string;
  icon?: string;
  count?: number;
}

const DEFAULT_DEPARTMENTS: CategoryItem[] = [
  { id: 'computing', slug: 'computing', name: 'Phones & Computing', type: 'Hardware', icon: 'fa-laptop' },
  { id: 'electronics', slug: 'electronics', name: 'Electronics & Audio', type: 'Consumer Tech', icon: 'fa-headphones' },
  { id: 'fashion', slug: 'fashion', name: 'Fashion & Streetwear', type: 'Lifestyle', icon: 'fa-shirt' },
  { id: 'home', slug: 'home', name: 'Home & Living', type: 'Appliances', icon: 'fa-couch' },
  { id: 'digital', slug: 'digital', name: 'Digital Licenses', type: 'Software & UI', icon: 'fa-code' },
];

export interface CategoryNavProps {
  selectedCategory?: string;
  onSelectCategory?: (cat: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [departments, setDepartments] = useState<CategoryItem[]>(DEFAULT_DEPARTMENTS);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/categories')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.categories && data.categories.length > 0) {
          const typeMap: Record<string, string> = {
            computing: 'Hardware',
            electronics: 'Consumer Tech',
            fashion: 'Lifestyle',
            home: 'Appliances',
            digital: 'Software & UI',
          };
          const mapped: CategoryItem[] = data.categories.map((c: any) => ({
            id: c.slug || c.id,
            slug: c.slug || c.id,
            name: c.name,
            type: typeMap[c.slug] || 'Department',
            icon: c.icon || 'fa-tag',
            count: c.count,
          }));
          setDepartments(mapped);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-14 sm:py-16 bg-[#FAF7F2] border-b border-[#EAE3D9]/80">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="apple-heading text-2xl sm:text-3xl font-bold text-[#1D1917] tracking-tight">
              Shop by Department
            </h2>
            <p className="apple-subhead text-sm text-[#78716C] mt-1.5 font-normal">
              Curated hardware catalogs and instant production assets.
            </p>
          </div>
          <Link
            href="/shop"
            onClick={() => {
              if (onSelectCategory) onSelectCategory('all');
            }}
            className="text-xs font-semibold text-[#B5532E] hover:text-[#8F3B1F] flex items-center gap-1.5 transition-colors no-underline"
          >
            <span>All Categories</span>
            <i className="fas fa-arrow-right text-[10px] opacity-75" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {departments.map((cat) => {
            const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
            return (
              <motion.div
                key={cat.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.965 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                className="h-full"
              >
                <Link
                  href={`/shop?category=${cat.slug || cat.id}`}
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(cat.slug || cat.id);
                  }}
                  className={`group h-full p-5 rounded-2xl border flex flex-col items-center text-center cursor-pointer no-underline block apple-pressable transition-colors ${
                    isSelected
                      ? 'bg-white border-[#B5532E] shadow-sm ring-1 ring-[#B5532E]/30'
                      : 'bg-white hover:bg-white/90 border-[#EAE3D9] shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#B5532E]/40 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)]'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg mb-3.5 transition-colors ${
                      isSelected
                        ? 'bg-[#B5532E] text-white shadow-xs'
                        : 'bg-[#FAF7F2] text-[#B5532E] group-hover:bg-[#B5532E] group-hover:text-white border border-[#EAE3D9]/60'
                    }`}
                  >
                    <i className={`fas ${cat.icon}`} />
                  </div>
                  <h3
                    className={`text-sm font-semibold tracking-tight transition-colors ${
                      isSelected ? 'text-[#B5532E]' : 'text-[#1D1917] group-hover:text-[#B5532E]'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-[#78716C] mt-1 font-normal">
                    {cat.type}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
