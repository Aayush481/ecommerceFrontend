'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, X, Search, Check, RotateCcw, ChevronRight } from 'lucide-react';

interface FilterSidebarClientProps {
  locale: 'it' | 'en';
  dict: any;
  materialsList: string[];
}

const categoriesList = [
  'handcraft-material',
  'kurtis',
  'onepiece',
  'summer-dresses',
  'indo-western',
  'ethnic-indian',
  'jewelry-oxidized',
  'jewelry-modern',
  'jewelry-handcuffs',
  'jewelry-bracelets',
  'jewelry-necklace',
  'jewelry-earrings',
  'handbags'
];

export const FilterSidebarClient: React.FC<FilterSidebarClientProps> = ({
  locale,
  dict,
  materialsList
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for mobile drawer views
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortDrawerOpen, setSortDrawerOpen] = useState(false);

  // Local filter states (synced with URL)
  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedMaterial, setSelectedMaterial] = useState(searchParams.get('material') || '');
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice') || '150'));
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'featured');

  // Sync state with URL when search params change (e.g. browser back button)
  useEffect(() => {
    setSearchVal(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedMaterial(searchParams.get('material') || '');
    setMaxPrice(Number(searchParams.get('maxPrice') || '150'));
    setSelectedSort(searchParams.get('sort') || 'featured');
  }, [searchParams]);

  // Count active filters
  const activeFiltersCount = [
    searchParams.get('category') ? 1 : 0,
    searchParams.get('material') ? 1 : 0,
    searchParams.get('search') ? 1 : 0,
    searchParams.get('maxPrice') && searchParams.get('maxPrice') !== '150' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Update query parameters in URL
  const applyFilters = (updates: {
    category?: string | null;
    material?: string | null;
    maxPrice?: number | null;
    search?: string | null;
    sort?: string | null;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    setSearchVal('');
    setSelectedCategory('');
    setSelectedMaterial('');
    setMaxPrice(150);
    
    // Clear all except sort
    const params = new URLSearchParams();
    const currentSort = searchParams.get('sort');
    if (currentSort) params.set('sort', currentSort);
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setFilterDrawerOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search: searchVal });
    setFilterDrawerOpen(false);
  };

  const handleSortChange = (sortType: string) => {
    setSelectedSort(sortType);
    applyFilters({ sort: sortType });
    setSortDrawerOpen(false);
  };

  // Shared Filters Form Content
  const renderFiltersContent = () => (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Search Input */}
      <div className="flex flex-col gap-2">
        <label className="font-sans text-xs font-semibold text-[#232B28]/70 uppercase tracking-wider">
          {locale === 'it' ? 'Cerca nel catalogo' : 'Search catalog'}
        </label>
        <form onSubmit={handleSearchSubmit} className="flex gap-2 relative">
          <input
            type="text"
            placeholder={dict.shop.search_placeholder}
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-white border border-[#232B28]/15 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#B35C37] transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#232B28]/50 hover:text-[#B35C37] transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Category List */}
      <div className="flex flex-col gap-2">
        <h3 className="font-serif text-base font-bold text-[#232B28] border-b border-[#232B28]/5 pb-2">
          {dict.shop.filter_category}
        </h3>
        <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto scrollbar-thin text-sm font-sans pr-1">
          <button
            onClick={() => {
              setSelectedCategory('');
              applyFilters({ category: '' });
              if (window.innerWidth < 1024) setFilterDrawerOpen(false);
            }}
            className={`flex items-center justify-between py-1.5 px-2 rounded-md transition-colors text-left cursor-pointer ${
              !selectedCategory
                ? 'bg-[#B35C37]/10 text-[#B35C37] font-bold'
                : 'text-[#232B28]/75 hover:bg-stone-50'
            }`}
          >
            <span>{dict.shop.all_categories}</span>
            {!selectedCategory && <Check size={14} />}
          </button>
          {categoriesList.map((cat) => {
            const catLabel = (dict.categories as any)[cat] || cat;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  applyFilters({ category: cat });
                  if (window.innerWidth < 1024) setFilterDrawerOpen(false);
                }}
                className={`flex items-center justify-between py-1.5 px-2 rounded-md transition-colors text-left cursor-pointer ${
                  isSelected
                    ? 'bg-[#B35C37]/10 text-[#B35C37] font-bold'
                    : 'text-[#232B28]/75 hover:bg-stone-50'
                }`}
              >
                <span>{catLabel}</span>
                {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Material List */}
      <div className="flex flex-col gap-2">
        <h3 className="font-serif text-base font-bold text-[#232B28] border-b border-[#232B28]/5 pb-2">
          {dict.shop.filter_material}
        </h3>
        <div className="flex flex-col gap-1.5 text-sm font-sans pr-1">
          <button
            onClick={() => {
              setSelectedMaterial('');
              applyFilters({ material: '' });
              if (window.innerWidth < 1024) setFilterDrawerOpen(false);
            }}
            className={`flex items-center justify-between py-1.5 px-2 rounded-md transition-colors text-left cursor-pointer ${
              !selectedMaterial
                ? 'bg-[#B35C37]/10 text-[#B35C37] font-bold'
                : 'text-[#232B28]/75 hover:bg-stone-50'
            }`}
          >
            <span>{dict.shop.all_materials}</span>
            {!selectedMaterial && <Check size={14} />}
          </button>
          {materialsList.map((mat) => {
            const isSelected = selectedMaterial === mat;
            return (
              <button
                key={mat}
                onClick={() => {
                  setSelectedMaterial(mat);
                  applyFilters({ material: mat });
                  if (window.innerWidth < 1024) setFilterDrawerOpen(false);
                }}
                className={`flex items-center justify-between py-1.5 px-2 rounded-md transition-colors text-left cursor-pointer ${
                  isSelected
                    ? 'bg-[#B35C37]/10 text-[#B35C37] font-bold'
                    : 'text-[#232B28]/75 hover:bg-stone-50'
                }`}
              >
                <span>{mat}</span>
                {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-[#232B28]/5 pb-2">
          <h3 className="font-serif text-base font-bold text-[#232B28]">
            {dict.shop.filter_price}
          </h3>
          <span className="font-sans text-sm font-bold text-[#B35C37]">
            €{maxPrice}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="range"
            min="20"
            max="150"
            step="5"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            onMouseUp={() => applyFilters({ maxPrice })}
            onTouchEnd={() => applyFilters({ maxPrice })}
            className="w-full accent-[#B35C37] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-sans font-semibold text-[#232B28]/40">
            <span>€20</span>
            <span>€150</span>
          </div>
        </div>
      </div>

      {/* Reset Filters Option */}
      {activeFiltersCount > 0 && (
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 w-full py-3 border border-[#B35C37] hover:bg-[#B35C37]/5 text-[#B35C37] font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
        >
          <RotateCcw size={14} />
          <span>{locale === 'it' ? 'Resetta Filtri' : 'Clear All Filters'}</span>
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* 1. Desktop Sidebar Container */}
      <aside className="hidden lg:flex flex-col gap-8 w-64 flex-shrink-0">
        {renderFiltersContent()}
      </aside>

      {/* 2. Mobile Floating Sticky Bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-45 bg-white/95 backdrop-blur-md border-t border-[#232B28]/10 py-3.5 px-4 flex gap-4 shadow-xl">
        {/* Sort Trigger Button */}
        <button
          onClick={() => setSortDrawerOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-50 border border-[#232B28]/10 hover:bg-[#232B28]/5 rounded-xl font-sans font-bold text-xs tracking-wider uppercase text-[#232B28] cursor-pointer"
        >
          <ArrowUpDown size={15} />
          <span>{locale === 'it' ? 'Ordina' : 'Sort By'}</span>
        </button>

        {/* Filter Trigger Button */}
        <button
          onClick={() => setFilterDrawerOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white rounded-xl font-sans font-bold text-xs tracking-wider uppercase shadow-md relative cursor-pointer"
        >
          <SlidersHorizontal size={15} />
          <span>{locale === 'it' ? 'Filtri' : 'Filters'}</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#232B28] text-[#FAF8F5] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* 3. Mobile Filter Drawer (Slide-up bottom sheet) */}
      {filterDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#232B28]/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-300">
          <div className="w-full bg-[#FAF8F5] rounded-t-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#232B28]/10 px-6 py-4.5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#B35C37]" />
                <h2 className="font-serif text-lg font-bold text-[#232B28]">
                  {locale === 'it' ? 'Filtri Catalogo' : 'Catalog Filters'}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleReset}
                    className="font-sans text-xs font-semibold text-[#B35C37] hover:underline cursor-pointer"
                  >
                    {locale === 'it' ? 'Resetta' : 'Reset'}
                  </button>
                )}
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1 hover:bg-[#232B28]/5 rounded-full text-[#232B28] cursor-pointer"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Filters Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
              {renderFiltersContent()}
            </div>

            {/* Sticky Drawer Apply Action */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#FAF8F5] border-t border-[#232B28]/10 p-4.5 flex gap-4">
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="w-full py-3.5 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-sans font-bold text-xs tracking-widest uppercase rounded-xl shadow-md cursor-pointer"
              >
                {locale === 'it' ? 'Applica Filtri' : 'Apply Filters'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Mobile Sort Drawer (Slide-up select sheet) */}
      {sortDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#232B28]/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-300">
          <div className="w-full bg-[#FAF8F5] rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#232B28]/10 px-6 py-4">
              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-[#B35C37]" />
                <h2 className="font-serif text-base font-bold text-[#232B28]">
                  {locale === 'it' ? 'Ordina per' : 'Sort By'}
                </h2>
              </div>
              <button
                onClick={() => setSortDrawerOpen(false)}
                className="p-1 hover:bg-[#232B28]/5 rounded-full text-[#232B28] cursor-pointer"
                aria-label="Close sort"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sort Choices List */}
            <div className="px-6 py-4 flex flex-col gap-1 text-sm font-sans pb-10">
              {[
                { type: 'featured', label: dict.shop.sort_featured },
                { type: 'price_asc', label: locale === 'it' ? 'Prezzo: Crescente' : 'Price: Low to High' },
                { type: 'price_desc', label: locale === 'it' ? 'Prezzo: Decrescente' : 'Price: High to Low' }
              ].map((choice) => {
                const isSelected = selectedSort === choice.type;
                return (
                  <button
                    key={choice.type}
                    onClick={() => handleSortChange(choice.type)}
                    className={`flex items-center justify-between py-4 px-3 border-b border-[#232B28]/5 hover:bg-stone-50 transition-colors text-left cursor-pointer w-full ${
                      isSelected ? 'text-[#B35C37] font-bold bg-[#B35C37]/5 rounded-lg' : 'text-[#232B28]/80'
                    }`}
                  >
                    <span>{choice.label}</span>
                    {isSelected && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
