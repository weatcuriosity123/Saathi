const COURSES = [
  {
    id: 1,
    title: "Mastering Modern Fullstack with React & Node",
    category: "Web Development",
    rating: "4.9",
    description: "Build production-ready applications with the modern MERN ecosystem and TypeScript.",
    instructor: "Arjun Sharma",
    instructorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun%20Sharma",
    price: "149",
    image: "https://images.unsplash.com/photo-1541462608141-ad4d1f995502?q=80&w=800&auto=format&fit=crop",
    badge: "Bestseller",
  },
  {
    id: 2,
    title: "Visual Storytelling & Design Systems",
    category: "Design",
    rating: "4.8",
    description: "Master the craft of building scalable design systems and engaging visual narratives.",
    instructor: "Priya Verma",
    instructorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya%20Verma",
    price: "199",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
    badge: "New",
  },
  {
    id: 3,
    title: "Data-Driven Marketing & Growth",
    category: "Business",
    rating: "4.7",
    description: "Scale your products using advanced analytics and consumer behavioral psychology.",
    instructor: "Rohan Malhotra",
    instructorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan%20Malhotra",
    price: "120",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Ethical Hacking & Network Security",
    category: "IT & Software",
    rating: "4.9",
    description: "Learn to protect digital infrastructure from evolving global cyber threats.",
    instructor: "Sanjay Kapur",
    instructorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjay%20Kapur",
    price: "175",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Python for Data Analysis & AI",
    category: "Data Science",
    rating: "4.6",
    description: "Master NumPy, Pandas, and Scikit-learn for building intelligent data models.",
    instructor: "Ananya Ghosh",
    instructorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya%20Ghosh",
    price: "110",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Digital Illustration: From Sketch to Final",
    category: "Creative Arts",
    rating: "5.0",
    description: "A professional masterclass in digital painting techniques using Procreate.",
    instructor: "Vikram Singh",
    instructorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram%20Singh",
    price: "185",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop",
    badge: "Bestseller",
  },
];

export default function CourseGrid() {
  return (
    <section className="flex-1">
      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-4 mb-12">
        <div>
          <h1 className="font-headline text-4xl font-black tracking-tight text-slate-900">Explore Courses</h1>
          <p className="text-slate-500 mt-2 font-medium">48 premium courses curated for your career path.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer hover:text-primary transition-colors">
          <span>Sort by: <span className="text-primary">Popularity</span></span>
          <span className="material-symbols-outlined text-[18px]">expand_more</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {COURSES.map((course) => (
          <div key={course.id} className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-soft hover:shadow-ambient flex flex-col border border-outline-variant">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 bg-surface-container" 
              />
              {course.badge && (
                <div className={`absolute top-4 left-4 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm ${
                  course.badge === 'Bestseller' ? 'bg-emerald-500' : 'bg-primary'
                }`}>
                  {course.badge}
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-extrabold text-primary tracking-widest uppercase truncate">{course.category}</span>
                <div className="flex items-center text-tertiary">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-xs font-bold ml-1 text-slate-900">{course.rating}</span>
                </div>
              </div>

              <h3 className="font-headline font-extrabold text-[18px] leading-snug mb-3 text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                {course.title}
              </h3>
              
              <p className="text-[13px] text-on-surface-variant mb-6 line-clamp-2 leading-relaxed">
                {course.description}
              </p>

              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-7 h-7 rounded-full bg-slate-100 overflow-hidden ring-2 ring-white">
                    <img 
                      src={course.instructorImage} 
                      alt={course.instructor} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{course.instructor}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <span className="text-2xl font-black text-slate-900 font-headline tracking-tight">₹{course.price}</span>
                  <button className="material-symbols-outlined text-outline hover:text-primary transition-colors p-1">
                    bookmark
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 flex justify-center items-center gap-2">
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 hover:text-primary hover:border-primary/30 transition-all">
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/20">1</button>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all">2</button>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all">3</button>
        <span className="px-3 text-slate-400 font-bold">...</span>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all">12</button>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 hover:text-primary hover:border-primary/30 transition-all">
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      </div>
    </section>
  );
}
