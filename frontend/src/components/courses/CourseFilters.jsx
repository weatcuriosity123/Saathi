export default function CourseFilters() {
  const CATEGORIES = [
    { name: "Development", defaultChecked: true },
    { name: "Design Systems", defaultChecked: false },
    { name: "Business Strategy", defaultChecked: false },
    { name: "Data Science", defaultChecked: false },
  ];

  const RATINGS = [
    { label: "4.0 & up", stars: 4 },
    { label: "3.0 & up", stars: 3 },
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-12">
      <div>
        <h3 className="font-headline font-extrabold text-lg mb-6 text-slate-900">Category</h3>
        <div className="space-y-4">
          {CATEGORIES.map((cat) => (
            <label key={cat.name} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                defaultChecked={cat.defaultChecked}
                className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all cursor-pointer" 
              />
              <span className={`text-[14px] ${cat.defaultChecked ? 'font-semibold text-primary' : 'font-medium text-slate-600'} group-hover:text-primary transition-colors`}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-headline font-extrabold text-lg mb-6 text-slate-900">Price Range</h3>
        <div className="space-y-5 px-1">
          <input 
            type="range" 
            min="100" 
            max="1000" 
            step="50" 
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" 
          />
          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>₹100</span>
            <span>₹1000</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-headline font-extrabold text-lg mb-6 text-slate-900">Rating</h3>
        <div className="space-y-4">
          {RATINGS.map((rating, idx) => (
            <label key={idx} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="rating" 
                className="w-5 h-5 border-slate-300 text-primary focus:ring-primary/20 transition-all cursor-pointer" 
              />
              <div className="flex items-center text-orange-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span 
                    key={i} 
                    className="material-symbols-outlined text-sm" 
                    style={i < rating.stars ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    star
                  </span>
                ))}
                <span className="text-[14px] font-medium text-slate-600 ml-2 group-hover:text-primary transition-colors">
                  {rating.label}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
