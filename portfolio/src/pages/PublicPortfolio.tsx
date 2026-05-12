import React from 'react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { scrollToSection } from '../utils/scroll';
import { motion } from 'framer-motion';
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" as const }
};

export const PublicPortfolio: React.FC = () => {
  const { projects, profile, loading } = usePortfolioData();

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  const name = profile?.name || "CURATOR"
  const heroTitle = profile?.heroTitle || "Architecting Digital Excellence.";
  const heroDescription = profile?.heroDescription || "I specialize in building robust, scalable software systems and elegant user experiences.";
  const aboutTitle = profile?.aboutTitle || "The Philosophy";
  const aboutDescription = profile?.aboutDescription || "Driven by precision and innovation, I transform complex technical requirements into seamless digital products.";

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative px-6 md:px-12 py-32 md:py-56 max-w-7xl mx-auto overflow-hidden" id="home">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 rounded-full blur-[120px] -z-10 animate-slow-spin"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <p className="font-label text-xs md:text-sm uppercase tracking-[0.4em] text-primary font-bold mb-4">
              {name} <span className="opacity-50 mx-2">•</span> {profile?.role || "Software Engineer"}
            </p>
            <div className="flex items-center gap-6">
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 opacity-80 hover:opacity-100">
                  <GithubIcon className="w-5 h-5" />
                  <span className="text-[10px] font-label uppercase tracking-widest font-bold">GitHub</span>
                </a>
              )}
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 opacity-80 hover:opacity-100">
                  <LinkedinIcon className="w-5 h-5" />
                  <span className="text-[10px] font-label uppercase tracking-widest font-bold">LinkedIn</span>
                </a>
              )}
            </div>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl leading-[0.95] text-on-surface mb-12 font-display font-black tracking-tighter">
            {heroTitle.split(' ').map((word, i) => (
              <span key={i} className={i % 2 === 1 ? "text-primary italic font-serif font-light" : ""}>
                {word}{' '}
              </span>
            ))}
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-3xl text-on-surface-variant font-light max-w-2xl mb-16 leading-relaxed font-body"
          >
            {heroDescription}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap items-center gap-10"
          >
            <button 
              onClick={() => scrollToSection('projects')}
              className="bg-primary text-on-primary px-10 py-5 rounded-full text-xs font-label font-bold uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center gap-3 group cursor-pointer"
            >
              Explore Work
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Philosophy & Timeline Section */}
      <section className="px-6 md:px-12 py-40 bg-surface-container-low/50 relative overflow-hidden" id="about">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-start relative z-10">
          <div className="lg:col-span-7">
            <motion.div {...fadeInUp}>
              <h2 className="text-5xl md:text-6xl mb-12 font-display font-bold leading-tight">{aboutTitle}</h2>
              <div className="space-y-8 text-xl text-on-surface-variant leading-relaxed font-body font-light whitespace-pre-line border-l-4 border-primary/20 pl-8">
                <p>{aboutDescription}</p>
              </div>
            </motion.div>
            
            {/* Professional Journey Timeline */}
            {profile?.employment && profile.employment.length > 0 && (
              <div className="mt-32">
                <div className="flex items-center gap-6 mb-20">
                  <h3 className="text-2xl font-display font-bold">The Journey</h3>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-primary/30 to-transparent"></div>
                </div>
                
                <div className="relative">
                  {/* Continuous Timeline Line (Desktop & Mobile) */}
                  <div className="absolute left-[11px] md:left-[25%] top-2 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 via-outline-variant to-transparent -translate-x-1/2"></div>
                  
                  <div className="space-y-16">
                    {profile.employment.map((job, i) => (
                      <motion.div 
                        key={i} 
                        {...fadeInUp}
                        className="group relative flex flex-col md:flex-row gap-8 md:gap-16 pl-10 md:pl-0"
                      >
                        {/* Timeline Dot */}
                        <div className="absolute left-[11px] md:left-[25%] top-[9px] md:top-[38px] w-4 h-4 rounded-full bg-background border-[3px] border-primary group-hover:bg-primary group-hover:scale-[1.3] transition-all duration-500 ring-[8px] ring-background z-10 -translate-x-1/2"></div>
                        
                        {/* Date Section */}
                        <div className="md:w-1/4 shrink-0 md:text-right pt-1 md:pt-8 md:pr-12 relative z-10">
                          <span className="font-label text-sm font-black uppercase tracking-[0.3em] text-primary block mb-2 group-hover:text-primary transition-colors">
                            {job.startDate}
                          </span>
                          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60 block">
                            {job.endDate || 'Present'}
                          </span>
                        </div>
                        
                        {/* Content Section */}
                        <div className="md:w-3/4 bg-surface-container border border-outline-variant group-hover:border-primary/30 rounded-[2rem] p-8 md:p-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden shadow-lg group-hover:shadow-primary/5">
                          {/* Subtle background glow on hover */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          
                          <div className="relative z-10">
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-baseline mb-8 gap-4">
                              <h4 className="text-3xl font-bold font-display text-on-surface group-hover:text-primary transition-colors">{job.role}</h4>
                              <span className="text-xs font-label text-primary font-bold uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full inline-flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                {job.company}
                              </span>
                            </div>
                            
                            <p className="text-lg text-on-surface-variant leading-relaxed font-body mb-10 opacity-90">{job.description}</p>
                            
                            {job.relatedSkills && job.relatedSkills.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-6 border-t border-outline-variant/30">
                                {job.relatedSkills.map((skill, idx) => (
                                  <span key={idx} className="text-[10px] font-label px-4 py-2 rounded-full bg-surface-variant/30 text-on-surface-variant uppercase tracking-widest font-bold group-hover:text-primary transition-colors group-hover:bg-primary/5">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 sticky top-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-surface-container rounded-3xl overflow-hidden border border-outline-variant group shadow-2xl relative">
                {profile?.profilePicture ? (
                  <img src={profile.profilePicture} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-primary/20">
                    <span className="material-symbols-outlined text-9xl text-primary opacity-20">person</span>
                    <p className="font-display text-xl font-bold opacity-30 mt-4 tracking-widest uppercase">{name}</p>
                  </div>
                )}
                {/* Glass Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-background/30 backdrop-blur-md border border-white/10 rounded-2xl">
                  <p className="text-xs font-label uppercase tracking-widest text-primary font-bold mb-1">Status</p>
                  <p className="text-sm font-body italic">Available for innovative challenges.</p>
                </div>
              </div>
              
              {/* Skills Visualization */}
              {profile?.skills && profile.skills.length > 0 && (
                <div className="mt-16 space-y-10 p-8 bg-surface rounded-3xl border border-outline-variant shadow-lg">
                  <h3 className="text-xs font-label uppercase tracking-[0.4em] text-primary font-black mb-10">Technical Mastery</h3>
                  <div className="space-y-8">
                    {profile.skills.map((skill, i) => (
                      <div key={i} className="space-y-3 group">
                        <div className="flex justify-between items-baseline px-1">
                          <span className="text-sm font-bold tracking-tight group-hover:text-primary transition-colors">{skill.name}</span>
                          <span className="font-label text-[10px] text-on-surface-variant font-black">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 bg-outline-variant rounded-full overflow-hidden p-[1px]">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_10px_rgba(var(--color-primary),0.5)]" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="px-6 md:px-12 py-40 max-w-7xl mx-auto" id="projects">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-end mb-32 border-b border-outline-variant pb-12"
        >
          <div>
            <p className="text-xs font-label uppercase tracking-[0.4em] text-primary font-black mb-4">Portfolio</p>
            <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter">Curated Work</h2>
          </div>
          <p className="text-xl italic text-on-surface-variant font-serif md:max-w-xs text-right leading-relaxed opacity-60">A selection of engineering feats and architectural designs.</p>
        </motion.div>
        
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-surface-container h-[500px] rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-32">
            {projects.filter(p => p.status === 'Published').map((p, i) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i % 2 * 0.2 }}
                className="group relative"
              >
                <div className="aspect-[14/10] bg-surface-container rounded-[2rem] overflow-hidden mb-10 border border-outline-variant relative shadow-xl group-hover:shadow-2xl transition-all duration-700">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-surface-variant to-background opacity-40">
                      <span className="material-symbols-outlined text-8xl text-primary">{p.icon || 'view_in_ar'}</span>
                    </div>
                  )}
                  
                  {/* Glass Card Info Overlay */}
                  <div className="absolute inset-x-8 bottom-8 p-6 bg-background/40 backdrop-blur-xl border border-white/10 rounded-2xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-label uppercase tracking-widest text-primary font-black mb-1">Industry</p>
                      <p className="text-sm font-body font-bold">{p.category}</p>
                    </div>
                    <div className="flex gap-3">
                      {p.githubLink && (
                        <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-sm">code</span>
                        </a>
                      )}
                      {p.projectLink && (
                        <a href={p.projectLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-secondary text-on-secondary rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-sm">rocket_launch</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-4">
                  <h3 className="text-4xl mb-4 font-display font-bold group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="text-lg text-on-surface-variant font-body leading-relaxed mb-8 opacity-80">{p.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {p.relatedSkills?.map((skill, idx) => (
                      <span key={idx} className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant bg-surface-variant/50 px-4 py-1.5 rounded-full border border-outline-variant group-hover:border-primary/20 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Education & Achievements */}
      {profile?.education && profile.education.length > 0 && (
        <section className="px-6 md:px-12 py-40 bg-surface">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeInUp} className="text-center mb-24">
              <p className="text-xs font-label uppercase tracking-[0.4em] text-primary font-black mb-6">Foundation</p>
              <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter">Academic Merit</h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {profile.education.map((edu, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 bg-surface-container-low border border-outline-variant rounded-[2.5rem] hover:border-primary/40 transition-all hover:shadow-xl group"
                >
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">
                    <span className="material-symbols-outlined text-3xl">school</span>
                  </div>
                  <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-4 font-black">
                    {edu.startDate && edu.endDate ? `${edu.startDate} – ${edu.endDate}` : edu.year}
                  </p>
                  <h4 className="text-2xl font-display font-bold mb-4 leading-tight">{edu.degree}</h4>
                  <p className="font-body text-lg text-on-surface-variant mb-8">{edu.institution}</p>
                  
                  {edu.gpa && (
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-xl border border-primary/10 mb-8">
                      <span className="text-xs font-label uppercase tracking-widest text-primary font-black">GPA</span>
                      <span className="text-lg font-display font-black">{edu.gpa}</span>
                    </div>
                  )}

                  {edu.description && (
                    <p className="text-sm font-body text-on-surface-variant mb-8 italic leading-relaxed">
                      {edu.description}
                    </p>
                  )}

                  {edu.recognitions && edu.recognitions.length > 0 && (
                    <div className="space-y-4 border-t border-outline-variant pt-8">
                      {edu.recognitions.map((rec, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-on-surface font-body text-sm italic opacity-80">
                          <span className="material-symbols-outlined text-primary text-lg">verified</span>
                          {rec}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="px-6 md:px-12 py-40 max-w-7xl mx-auto" id="contact">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
          <div className="lg:col-span-5">
            <motion.div {...fadeInUp}>
              <p className="text-xs font-label uppercase tracking-[0.4em] text-primary font-black mb-6">Interaction</p>
              <h2 className="text-6xl md:text-7xl mb-10 font-display font-black tracking-tighter leading-none">Initiate <br/>Dialogue.</h2>
              <p className="text-xl text-on-surface-variant mb-16 font-body font-light leading-relaxed">Whether it's a technical query, a system design discussion, or a potential partnership, I am attentive to your vision.</p>
              
              <div className="space-y-10">
                <a href={`mailto:${profile?.email}`} className="flex items-center gap-8 group">
                  <div className="w-16 h-16 bg-surface-container-high border border-outline-variant text-primary rounded-3xl flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 shadow-soft">
                    <span className="material-symbols-outlined text-2xl">alternate_email</span>
                  </div>
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold mb-1">Message</p>
                    <p className="text-2xl font-bold font-display group-hover:text-primary transition-colors">{profile?.email || "email@example.com"}</p>
                  </div>
                </a>
                
                {profile?.phone && (
                  <div className="flex items-center gap-8 group">
                    <div className="w-16 h-16 bg-surface-container-high border border-outline-variant text-primary rounded-3xl flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 shadow-soft">
                      <span className="material-symbols-outlined text-2xl">call</span>
                    </div>
                    <div>
                      <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold mb-1">Voice</p>
                      <p className="text-2xl font-bold font-display group-hover:text-primary transition-colors">{profile.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-surface-container-low p-12 md:p-20 rounded-[3rem] border border-outline-variant shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <form className="space-y-12 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-3 group">
                    <label className="font-label text-[10px] uppercase tracking-[0.3em] font-black text-primary px-1">Identification</label>
                    <input className="w-full bg-transparent border-b-2 border-outline-variant outline-none py-4 focus:border-primary transition-all text-xl font-body group-focus-within:translate-x-2" placeholder="Your Name" type="text"/>
                  </div>
                  <div className="space-y-3 group">
                    <label className="font-label text-[10px] uppercase tracking-[0.3em] font-black text-primary px-1">Electronic Mail</label>
                    <input className="w-full bg-transparent border-b-2 border-outline-variant outline-none py-4 focus:border-primary transition-all text-xl font-body group-focus-within:translate-x-2" placeholder="email@address.com" type="email"/>
                  </div>
                </div>
                <div className="space-y-3 group">
                  <label className="font-label text-[10px] uppercase tracking-[0.3em] font-black text-primary px-1">Inquiry</label>
                  <textarea className="w-full bg-transparent border-b-2 border-outline-variant outline-none py-4 focus:border-primary transition-all text-xl min-h-[150px] font-body resize-none group-focus-within:translate-x-2" placeholder="What is your vision?"></textarea>
                </div>
                <button className="w-full bg-primary text-on-primary py-6 rounded-2xl font-label font-bold uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all text-xs" type="submit">Dispatch Inquiry</button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

