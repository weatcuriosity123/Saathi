const REVIEWS = [
  {
    id: 1,
    name: "Marcus Sterling",
    role: "Product Designer at Apple",
    initials: "MS",
    stars: 5,
    text: '"This course is ahead of its time. Dr. Thorne breaks down complex neurobiology into actionable design principles. Absolutely worth every penny for any designer looking at the next 10 years."',
  },
  {
    id: 2,
    name: "Lena Huang",
    role: "Senior Engineer",
    initials: "LH",
    stars: 5,
    text: '"The practical modules in section 3 were incredible. Actually building a thought-responsive prototype was a game changer for my portfolio."',
  },
];

export default function CourseReviews() {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <h2 className="font-headline text-3xl font-bold">Student Reviews</h2>
        <button className="text-primary font-bold text-sm hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REVIEWS.map((review) => (
          <div 
            key={review.id} 
            className="bg-white p-8 rounded-2xl flex flex-col gap-5 shadow-sm border border-outline-variant/10"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                  {review.initials}
                </div>
                <div>
                  <p className="font-bold text-sm text-on-surface">{review.name}</p>
                  <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider">{review.role}</p>
                </div>
              </div>
              <div className="flex text-tertiary">
                {Array.from({ length: review.stars }).map((_, i) => (
                  <span 
                    key={i} 
                    className="material-symbols-outlined text-xs" 
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-on-surface-variant italic leading-relaxed">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
