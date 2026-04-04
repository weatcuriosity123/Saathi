const MODULES = [
  {
    id: 1,
    title: "Foundations of Neuro-Interfaces",
    lessons: 4,
    duration: "45 mins",
    isOpen: true,
    contents: [
      { id: 1, title: "Introduction to Neuralink & Competitors", time: "12:30", type: "video" },
      { id: 2, title: "Anatomy of the Visual Cortex", time: "15:45", type: "lock" },
    ],
  },
  {
    id: 2,
    title: "Cognitive Load Management",
    lessons: 6,
    duration: "1h 20m",
    isOpen: false,
  },
  {
    id: 3,
    title: "Prototyping for Thought-Based UI",
    lessons: 8,
    duration: "2h 15m",
    isOpen: false,
  },
];

export default function CourseCurriculum() {
  return (
    <section className="flex flex-col gap-8">
      <h2 className="font-headline text-3xl font-bold">Course Curriculum</h2>
      
      <div className="flex flex-col gap-4">
        {MODULES.map((module) => (
          <div 
            key={module.id} 
            className="border border-outline-variant/30 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className={`p-6 flex justify-between items-center cursor-pointer ${
              module.isOpen ? 'bg-surface-container-low/50' : ''
            }`}>
              <div className="flex items-center gap-4">
                <span className={`material-symbols-outlined ${
                  module.isOpen ? 'text-primary bg-primary/10 p-1.5' : 'text-on-surface-variant p-1.5'
                } rounded-lg`}>
                  {module.isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
                </span>
                <div>
                  <h3 className="font-bold text-lg">{`Module ${module.id}: ${module.title}`}</h3>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                    {`${module.lessons} Lessons • ${module.duration}`}
                  </p>
                </div>
              </div>
            </div>

            {module.isOpen && module.contents && (
              <div className="p-6 flex flex-col gap-6 bg-white border-t border-outline-variant/20">
                {module.contents.map((item) => (
                  <div key={item.id} className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-4">
                      {item.type === 'video' ? (
                        <span 
                          className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform" 
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          play_circle
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-on-surface-variant">lock</span>
                      )}
                      <span className={`text-on-surface text-sm font-medium transition-colors ${
                        item.type === 'video' ? 'group-hover:text-primary' : ''
                      }`}>
                        {item.title}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-on-surface-variant bg-surface-container rounded px-2 py-1">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
