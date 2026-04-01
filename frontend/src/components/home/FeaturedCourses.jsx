import Link from "next/link";

const COURSES = [
  {
    id: 1,
    title: "UI/UX Design Fundamentals",
    instructor: "Sarah Jenkins",
    price: 149,
    rating: 4.9,
    reviews: "12.4k",
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1541462608141-ad4d1f995502?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Python for Data Science 2024",
    instructor: "Rahul Sharma",
    price: 199,
    rating: 4.8,
    reviews: "8.1k",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Social Media Mastery",
    instructor: "David Miller",
    price: 100,
    rating: 4.7,
    reviews: "5.2k",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Financial Literacy for Gen Z",
    instructor: "Dr. Anjali Rao",
    price: 120,
    rating: 4.9,
    reviews: "2.1k",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop",
  },
];

export default function FeaturedCourses() {
  return (
    <section className="py-32 bg-surface-container-low/50">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl space-y-6">
            <h2 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface">Featured Courses</h2>
            <p className="text-on-surface-variant text-xl font-medium">Pick up a new skill today from our top-rated collections. Affordable prices, high-quality content.</p>
          </div>
          <Link href="/courses" className="text-primary font-bold text-lg flex items-center gap-3 group px-6 py-3 bg-white rounded-2xl shadow-sm border border-surface-container-low hover:shadow-md transition-all">
            Explore all courses
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {COURSES.map((course) => (
            <div key={course.id} className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group border border-surface-container-low">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                {course.tag && (
                  <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest text-primary shadow-sm">
                    {course.tag}
                  </div>
                )}
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <h3 className="font-bold text-xl leading-tight text-on-surface group-hover:text-primary transition-colors h-12 overflow-hidden">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 text-amber-500">
                    <span className="material-symbols-outlined text-[18px] fill-1">star</span>
                    <span className="text-sm font-black text-on-surface-variant">{course.rating} ({course.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor}`} 
                    alt={course.instructor} 
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/5" 
                  />
                  <span className="text-sm text-on-surface-variant font-semibold">{course.instructor}</span>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-surface-container-low">
                  <span className="text-3xl font-black text-on-surface">₹{course.price}</span>
                  <button className="bg-primary/5 text-primary hover:bg-primary hover:text-on-primary p-3 rounded-2xl transition-all active:scale-90">
                    <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
