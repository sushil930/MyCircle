import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { ShieldCheck, MapPin, Heart, ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-cream font-sans selection:bg-brand-primary selection:text-white flex flex-col overflow-x-hidden">
      
      {/* Navigation (Transparent) */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 w-full">
         <div className="max-w-7xl mx-auto flex justify-between items-center">
           <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transition-transform group-hover:scale-105">
                <div className="w-5 h-5 bg-white rounded-full shadow-inner"></div>
              </div>
              <span className="text-2xl font-serif font-bold text-white tracking-tight drop-shadow-md">MyCircle</span>
           </div>
           
           <button
             onClick={() => navigate('/feed')}
             className="text-sm font-bold text-brand-dark bg-white px-6 py-3 rounded-full hover:bg-brand-sand transition-all shadow-lg hover:shadow-xl"
           >
             Sign In
           </button>
         </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img
             src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
             alt="Community members connecting around a table"
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-brand-dark/60 mix-blend-multiply"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-black/10"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
           <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-xl">
             Restoring the <span className="italic text-brand-accent">Village</span>.
           </h1>
           <p className="text-xl md:text-2xl text-brand-cream/90 font-light max-w-2xl mx-auto leading-relaxed">
             We are building the digital infrastructure for real-world connection.
           </p>
        </div>
      </header>

      {/* The Mission / Narrative */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="space-y-8 text-lg md:text-xl leading-relaxed text-brand-slate font-light">
          <p className="drop-cap font-serif text-brand-dark font-bold text-2xl">
            In an era of global connectivity, we’ve somehow lost touch with the people living right next door.
          </p>
          <p>
            We buy tools we use once, instead of borrowing them from a neighbor. We throw away items that someone down the street would cherish. We scroll through feeds of strangers while missing the opportunities for connection just over the fence.
          </p>
          <p>
            <strong className="text-brand-dark font-medium">MyCircle</strong> was born from a simple question: <em>What if we could trust our neighbors again?</em>
          </p>
          <p>
            We aren't just a marketplace. We are a return to a more human way of living. Where reputation matters more than anonymity, and where the value of a transaction isn't just measured in dollars, but in the strength of the community it builds.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white py-24 px-4 border-y border-brand-sand/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest uppercase text-brand-primary mb-3">Our DNA</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark">Built on three pillars.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: ShieldCheck,
                title: "Trust is our Currency",
                desc: "We believe accountability is the foundation of community. That's why every member of MyCircle is address-verified. No bots, no anonymity, just real neighbors."
              },
              {
                icon: MapPin,
                title: "Hyper-Local First",
                desc: "Sustainability starts with proximity. By focusing on a tight radius, we reduce carbon footprints and increase the likelihood of repeat, meaningful interactions."
              },
              {
                icon: Heart,
                title: "Human-Centric Design",
                desc: "We optimize for kindness, not just clicks. Our platform encourages bartering, gifting, and helping—reminding us that we have more to offer than just money."
              }
            ].map((value, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-brand-cream rounded-full flex items-center justify-center mb-6 text-brand-dark group-hover:bg-brand-primary group-hover:text-white transition-colors duration-500">
                  <value.icon size={32} />
                </div>
                <h4 className="text-2xl font-serif font-bold text-brand-dark mb-4">{value.title}</h4>
                <p className="text-brand-slate leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Culture Snippet */}
      <section className="py-24 px-4 bg-brand-dark text-white overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
         </div>

         <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
               <img 
                 src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop" 
                 alt="Diverse team meeting" 
                 className="rounded-3xl shadow-2xl border-4 border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500"
               />
            </div>
            <div className="md:w-1/2 space-y-6">
               <h2 className="text-4xl font-serif font-bold">Small Team, <br/><span className="text-brand-accent">Big Neighborhood.</span></h2>
               <p className="text-brand-sand/80 text-lg leading-relaxed font-light">
                 We are a small team of engineers, designers, and community organizers based in Maplewood. We built MyCircle because we wanted to use it ourselves.
               </p>
               <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                       <img key={i} src={`https://picsum.photos/seed/dev${i}/100/100`} className="w-10 h-10 rounded-full border-2 border-brand-dark" alt="Team member" />
                     ))}
                  </div>
                  <span className="text-sm font-medium text-brand-accent">Join our team &rarr;</span>
               </div>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center bg-brand-cream">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-6">
            Become a founding member of your local circle.
          </h2>
          <button 
            onClick={() => navigate('/feed')}
            className="inline-flex items-center gap-2 px-10 py-4 bg-brand-primary text-white rounded-full font-bold text-lg hover:bg-brand-dark transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Get Started <ArrowRight size={20} />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};