"use client";

// Category values must match backend enum exactly
const CATEGORIES = [
  { label: "Programming", value: "programming" },
  { label: "Design", value: "design" },
  { label: "Business", value: "business" },
  { label: "Marketing", value: "marketing" },
  { label: "Data Science", value: "data-science" },
  { label: "Personal Development", value: "personal-development" },
  { label: "Language", value: "language" },
  { label: "Other", value: "other" },
];

const LEVELS = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Top Rated", value: "rating" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

/**
 * CourseFilters
 * @param {{ filters: object, onFilterChange: (updates: object) => void }} props
 */
export default function CourseFilters({ filters = {}, onFilterChange }) {
  const toggle = (key, value) => {
    // If already selected → deselect (set to "")
    onFilterChange({ [key]: filters[key] === value ? "" : value });
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">

      {/* Sort */}
      <div>
        <h3 className="font-headline font-extrabold text-lg mb-4 text-slate-900">Sort By</h3>
        <select
          value={filters.sort || "newest"}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          className="w-full px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-medium text-on-surface bg-surface focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <h3 className="font-headline font-extrabold text-lg mb-4 text-slate-900">Category</h3>
        <div className="space-y-3">
          {CATEGORIES.map((cat) => {
            const active = filters.category === cat.value;
            return (
              <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggle("category", cat.value)}
                  className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                />
                <span
                  className={`text-[14px] transition-colors ${
                    active
                      ? "font-semibold text-primary"
                      : "font-medium text-slate-600 group-hover:text-primary"
                  }`}
                >
                  {cat.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Level */}
      <div>
        <h3 className="font-headline font-extrabold text-lg mb-4 text-slate-900">Level</h3>
        <div className="space-y-3">
          {LEVELS.map((lvl) => {
            const active = filters.level === lvl.value;
            return (
              <label key={lvl.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="level"
                  checked={active}
                  onChange={() => toggle("level", lvl.value)}
                  className="w-5 h-5 border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                />
                <span
                  className={`text-[14px] transition-colors ${
                    active
                      ? "font-semibold text-primary"
                      : "font-medium text-slate-600 group-hover:text-primary"
                  }`}
                >
                  {lvl.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-headline font-extrabold text-lg mb-4 text-slate-900">Price Range</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            min={0}
            value={filters.priceMin || ""}
            onChange={(e) => onFilterChange({ priceMin: e.target.value })}
            className="w-full px-3 py-2 border border-outline-variant rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-surface"
          />
          <span className="text-slate-400 font-bold">—</span>
          <input
            type="number"
            placeholder="Max"
            min={0}
            value={filters.priceMax || ""}
            onChange={(e) => onFilterChange({ priceMax: e.target.value })}
            className="w-full px-3 py-2 border border-outline-variant rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-surface"
          />
        </div>
        <p className="text-xs text-on-surface-variant mt-2">Enter ₹0 for free courses only</p>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-headline font-extrabold text-lg mb-4 text-slate-900">Min Rating</h3>
        <div className="space-y-3">
          {[4, 3].map((stars) => {
            const val = String(stars);
            const active = filters.rating === val;
            return (
              <label key={stars} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  checked={active}
                  onChange={() => toggle("rating", val)}
                  className="w-5 h-5 border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                />
                <div className="flex items-center gap-1 text-orange-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-sm"
                      style={i < stars ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      star
                    </span>
                  ))}
                  <span className="text-[13px] font-medium text-slate-600 ml-1 group-hover:text-primary transition-colors">
                    {stars}.0 & up
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Clear All */}
      {(filters.category || filters.level || filters.priceMin || filters.priceMax || filters.rating) && (
        <button
          onClick={() =>
            onFilterChange({ category: "", level: "", priceMin: "", priceMax: "", rating: "" })
          }
          className="w-full py-2.5 text-sm font-bold text-error border border-error/30 rounded-xl hover:bg-error/5 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </aside>
  );
}
