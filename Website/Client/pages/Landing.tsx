import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { 
  ChevronRight, 
  ShieldCheck, 
  Heart, 
  RefreshCw, 
  ShoppingBag, 
  Hammer, 
  ArrowRight,
  Star,
  Users,
  CheckCircle2,
  BadgeCheck, 
  MapPin,
  CircleDot
} from 'lucide-react';

// Custom CSS for animations (replaces tailwindcss-animate dependencies)
const customStyles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slowZoom {
    0% { transform: scale(1); }
    100% { transform: scale(1.1); }
  }
  .animate-fade-up {
    animation: fadeUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    opacity: 0; /* Start hidden */
  }
  .animate-slow-zoom {
    animation: slowZoom 20s ease-in-out infinite alternate;
  }
  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
`;

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream font-sans selection:bg-brand-primary selection:text-white flex flex-col overflow-x-hidden">
      <style>{customStyles}</style>

      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md md:bg-white border-b border-brand-sand/50 py-4 shadow-sm' 
            : 'bg-transparent py-6'
        }`}
      >
         <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
           {/* Logo Section */}
           <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                scrolled ? 'bg-brand-dark text-white border-transparent shadow-md scale-95' : 'bg-white/10 backdrop-blur-md border-white/30 text-white shadow-inner hover:bg-white/20'
              }`}>
                <CircleDot size={26} strokeWidth={2.5} className={scrolled ? 'text-brand-accent' : 'text-white'} />
              </div>
              <div className="flex flex-col">
                <span className={`text-2xl font-serif font-bold tracking-tight leading-none transition-colors ${
                  scrolled ? 'text-brand-dark' : 'text-white drop-shadow-md'
                }`}>
                  MyCircle
                </span>
                <span className={`text-[10px] font-medium tracking-widest uppercase transition-colors ${
                   scrolled ? 'text-brand-primary' : 'text-white/80'
                }`}>
                  Neighborhood
                </span>
              </div>
           </div>
           
           <div className="flex items-center gap-8">
             <div className={`hidden md:flex gap-8 text-sm font-bold tracking-wide transition-colors ${
               scrolled ? 'text-brand-slate' : 'text-white/90'
             }`}>
               <button onClick={() => navigate('/about')} className="hover:text-brand-primary transition-colors hover:underline underline-offset-4 decoration-2 decoration-brand-primary/50">About Us</button>
               <button className="hover:text-brand-primary transition-colors hover:underline underline-offset-4 decoration-2 decoration-brand-primary/50">Trust & Safety</button>
             </div>
             
             {/* Sign In Button */}
             <button
               onClick={() => navigate('/signin')}
               className={`text-sm font-bold px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${
                 scrolled 
                   ? 'bg-brand-primary text-white hover:bg-brand-dark ring-2 ring-brand-primary/20' 
                   : 'bg-white text-brand-dark hover:bg-brand-cream ring-2 ring-white/20'
               }`}
             >
               Sign In
             </button>
           </div>
         </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-brand-dark/30 mix-blend-multiply z-10" />
           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-brand-cream z-10" />
           <img
             src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2940&auto=format&fit=crop" 
             alt="Diverse community group of friends"
             className="w-full h-full object-cover animate-slow-zoom" 
           />
        </div>

        <div className="relative z-20 max-w-5xl mx-auto text-center px-4 flex flex-col items-center pt-20">
           <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wider uppercase mb-8 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live in Maplewood & Surrounding Districts
           </div>
           
           <h1 className="animate-fade-up delay-100 text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-[1.1] tracking-tight drop-shadow-xl">
             Connect Locally.<br/>
             <span className="italic text-brand-accent font-light">Exchange Humanly.</span>
           </h1>
           
           <p className="animate-fade-up delay-200 text-lg md:text-2xl text-white/90 mb-10 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
             The premium neighborhood marketplace for people who value reputation over anonymity.
           </p>
           
           <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 w-full justify-center">
             <button
               onClick={() => navigate('/signup')}
               className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold text-lg hover:bg-[#1e4a36] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
             >
               Join Your Circle 
               <ChevronRight size={18} />
             </button>
             <button 
               onClick={() => navigate('/about')}
               className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all"
             >
               Our Philosophy
             </button>
           </div>
        </div>
      </header>

      {/* Philosophy / Modes Grid */}
      <section className="py-24 px-4 max-w-7xl mx-auto relative z-20 -mt-20">
        <div className="bg-white rounded-[3rem] shadow-xl p-8 md:p-12 border border-brand-sand/50">
          <div className="text-center mb-16">
            <h2 className="text-brand-primary font-bold tracking-[0.2em] uppercase text-xs mb-3">Reimagining Commerce</h2>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark">More ways to connect.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: ShoppingBag, 
                title: "Buy & Sell", 
                desc: "Curated goods from neighbors you trust. No shipping, just a walk down the street.",
              },
              { 
                icon: RefreshCw, 
                title: "Barter", 
                desc: "Swap your sourdough starter for fresh eggs. Value isn't always measured in dollars.",
              },
              { 
                icon: Hammer, 
                title: "Rent", 
                desc: "Why buy a power washer for one day a year? Rent it from a neighbor nearby.",
              },
              { 
                icon: Heart, 
                title: "Help", 
                desc: "Offer a helping hand or find support. From dog walking to moving boxes.",
              }
            ].map((item, idx) => (
              <div key={idx} className="group p-6 rounded-3xl bg-brand-cream/50 hover:bg-brand-cream border border-transparent hover:border-brand-sand transition-all duration-300">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 text-brand-primary">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-3">{item.title}</h3>
                <p className="text-brand-slate text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/30 text-brand-primary text-xs font-bold tracking-widest uppercase mb-6">
                <ShieldCheck size={14} /> Trust First Platform
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-dark leading-[1.1] mb-6">
                Stranger danger <br/> is <span className="text-brand-primary italic">so outdated.</span>
              </h2>
              <p className="text-brand-slate text-lg leading-relaxed font-light max-w-lg">
                We believe a marketplace without trust is just a chaotic bazaar. MyCircle uses rigorous address verification to ensure every member is a verified local resident.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                { title: "Verified Residency", desc: "Every member proves they live here via utility bill or postcard verification." },
                { title: "Reputation System", desc: "Profiles are tied to real reputations within the community." },
                { title: "Privacy Control", desc: "You control your radius. Share as much or as little location data as you like." }
              ].map((feat, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1 w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-dark">{feat.title}</h4>
                    <p className="text-brand-slate/80 text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full relative">
             <div className="absolute inset-0 bg-brand-accent/20 rounded-[2.5rem] transform rotate-3 scale-95 z-0" />
             <img 
               src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop" 
               alt="Neighbors talking" 
               className="relative z-10 w-full rounded-[2.5rem] shadow-2xl border-4 border-white object-cover aspect-[4/5]"
             />
             
             {/* Floating Stat Card */}
             <div className="absolute bottom-8 -left-8 z-20 bg-white p-6 rounded-3xl shadow-xl border border-brand-sand flex items-center gap-4 animate-fade-up delay-300">
               <div className="bg-green-100 p-3 rounded-2xl text-green-700">
                 <Users size={24} />
               </div>
               <div>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Neighbors</p>
                 <p className="text-2xl font-serif font-bold text-brand-dark">2,405</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Community Voices / Social Proof */}
      <section className="py-32 bg-brand-dark text-white relative overflow-hidden">
         {/* Background decoration */}
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-20 right-20 w-96 h-96 bg-brand-primary rounded-full blur-[100px]" />
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-brand-accent rounded-full blur-[80px]" />
         </div>

         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-brand-accent font-bold tracking-[0.2em] uppercase text-xs mb-4">From the Neighborhood</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold">Real stories, real neighbors.</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "I found a perfect vintage desk for my home office. The seller lived two streets over and even helped me carry it!",
                  author: "Sarah Jenkins",
                  role: "Maplewood • 3 years",
                  image: "https://picsum.photos/seed/user2/100/100"
                },
                {
                  quote: "Bartering my garden surplus for guitar lessons was the highlight of my summer. This app brings back the village feel.",
                  author: "David Lee",
                  role: "Maplewood • 12 years",
                  image: "https://picsum.photos/seed/user5/100/100"
                },
                {
                  quote: "As a single mom, knowing everyone is verified gives me peace of mind when buying or selling items.",
                  author: "Emily Rodriguez",
                  role: "Maplewood • 1 year",
                  image: "https://picsum.photos/seed/user4/100/100"
                }
              ].map((testimonial, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="text-brand-accent mb-6 flex gap-1">
                    {[...Array(5)].map((_, idx) => <Star key={idx} size={14} className="fill-current" />)}
                  </div>
                  <p className="text-brand-sand/90 text-lg leading-relaxed mb-8 font-light italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <img src={testimonial.image} alt={testimonial.author} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                    <div>
                      <div className="flex items-center gap-2">
                         <h4 className="font-bold text-white text-sm">{testimonial.author}</h4>
                         <BadgeCheck size={14} className="text-brand-primary" />
                      </div>
                      <p className="text-xs text-white/50 uppercase tracking-wide">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 px-4 text-center bg-brand-cream relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-brand-dark mb-8 leading-[1.1]">
            Ready to join your <br/><span className="text-brand-primary italic">local circle?</span>
          </h2>
          <p className="text-brand-slate text-xl font-light mb-12 leading-relaxed max-w-2xl mx-auto">
            Join thousands of neighbors who are trading, helping, and connecting every single day.
          </p>
          <button 
            onClick={() => navigate('/signup')}
            className="inline-flex items-center gap-3 px-12 py-6 bg-brand-dark text-white rounded-full font-bold text-lg hover:bg-brand-primary transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
          >
            Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};