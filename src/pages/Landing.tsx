import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Network, Sparkles, Target, Zap, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Landing() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative px-6 py-24 md:py-32 lg:py-40 flex flex-col items-center justify-center text-center overflow-hidden"
      >
        {/* Glow Element */}
        <div 
          className="pointer-events-none absolute inset-0 hidden sm:block opacity-0 transition-opacity duration-500 hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(147, 51, 234, 0.06), transparent 40%)`
          }}
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/50 via-stone-50 to-stone-50"></div>
        
        <div className="max-w-4xl mx-auto space-y-8 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="group inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm text-primary-700 font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm hover:border-primary-300 hover:bg-primary-100/50 cursor-default"
          >
            <Sparkles className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
            Context-Aware AI for Meaningful Human Connections
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900 font-serif leading-tight">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="block"
            >
              Meet the people who can
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 bg-size-200 hover:bg-right transition-[background-position] duration-700"
            >
              move your idea forward.
            </motion.span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed"
          >
            Not just another social network. GenZ Connectors uses AI to understand your goals, analyze your gaps, and introduce you to the exact people who complement your skills.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button size="lg" className="w-full sm:w-auto rounded-full hover-lift hover-glow" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="group w-full sm:w-auto rounded-full transition-all duration-300 hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50" asChild>
              <Link to="/discover">
                Explore How It Works
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Concept Section */}
      <section className="py-24 bg-white border-y border-stone-100 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">The Power of Complementarity</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">We don't just match you with people who are similar. We match you with people who have what you lack, and who need what you have.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Intent-Driven", desc: "Tell us what you're trying to accomplish—building a startup, learning a skill, or finding a mentor. We adapt to your current goal.", colors: "bg-primary-100 text-primary-600" },
              { icon: Zap, title: "Gap Detection", desc: "Our AI analyzes your project stack and experience to identify exactly what capabilities are missing from your team.", colors: "bg-secondary-100 text-secondary-600" },
              { icon: Shield, title: "Private & Curated", desc: "No public spam. Connections are carefully suggested with contextual explanations of why you should meet.", colors: "bg-emerald-100 text-emerald-600" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-stone-50 border border-stone-100 space-y-4 hover:bg-white hover-lift cursor-default"
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${feature.colors}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold transition-colors group-hover:text-primary-700">{feature.title}</h3>
                <p className="text-stone-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-stone-900 text-white text-center px-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">Ready to find your missing piece?</h2>
        <Button size="lg" className="rounded-full bg-white text-stone-900 hover:bg-stone-100 hover-lift" asChild>
          <Link to="/signup">Join the Network</Link>
        </Button>
      </motion.section>
    </div>
  );
}
