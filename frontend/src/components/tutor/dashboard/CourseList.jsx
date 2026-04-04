const COURSES = [
  {
    id: 1,
    title: "Mastering React & Framer Motion",
    students: "482",
    rating: "4.9",
    status: "Published",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    students: "0",
    rating: "85% Complete",
    status: "Draft",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop",
  },
];

export default function CourseList() {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-on-surface">My Courses</h3>
        <a className="text-sm font-bold text-primary hover:underline" href="#">View All</a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COURSES.map((course) => (
          <div 
            key={course.id} 
            className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-indigo-100 group"
          >
            <div className="h-40 overflow-hidden relative">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className={`absolute top-4 right-4 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                course.status === 'Published' 
                  ? 'bg-white/90 text-secondary' 
                  : 'bg-slate-900/10 text-on-surface-variant'
              }`}>
                {course.status}
              </div>
            </div>
            
            <div className="p-6">
              <h4 className="text-lg font-bold text-on-surface mb-2">{course.title}</h4>
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">person</span>
                  {course.students} Students
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    {course.status === 'Published' ? 'star' : 'schedule'}
                  </span>
                  {course.rating}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex-1 bg-surface-container-high py-2.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-primary hover:text-white transition-colors">
                  {course.status === 'Published' ? 'Edit Course' : 'Resume Editing'}
                </button>
                <button className="p-2.5 rounded-xl bg-surface-container-high text-on-surface-variant hover:bg-secondary-container transition-colors">
                  <span className="material-symbols-outlined text-xl">
                    {course.status === 'Published' ? 'analytics' : 'delete_outline'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton / Empty Space loader for aesthetic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 select-none pointer-events-none">
        <div className="bg-surface-container-high h-72 rounded-2xl animate-pulse"></div>
        <div className="bg-surface-container-high h-72 rounded-2xl animate-pulse"></div>
      </div>
    </div>
  );
}
