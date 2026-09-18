import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { aiService } from '../services/aiService';
import { Project, ProjectAnalysis } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Loader2, ArrowLeft, Sparkles, BrainCircuit, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const p = await projectService.getProject(id);
        setProject(p);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleAnalyze = async () => {
    if (!project) return;
    setAnalyzing(true);
    setAnalysisStage(1);
    
    // Simulate multi-stage loading for UX
    setTimeout(() => setAnalysisStage(2), 1000); // Understanding project...
    setTimeout(() => setAnalysisStage(3), 2000); // Analyzing capabilities...
    setTimeout(() => setAnalysisStage(4), 2800); // Finding complementary...
    
    try {
      const analysis = await aiService.analyzeProject(project);
      const updated = await projectService.saveAnalysis(project.id, analysis);
      if (updated) {
        setProject(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
      setAnalysisStage(0);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  
  if (!project) return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold font-serif">Project Not Found</h2>
      <Button onClick={() => navigate('/dashboard')} className="mt-4">Go to Dashboard</Button>
    </div>
  );

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 bg-white">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold font-serif text-stone-900">{project.name}</h1>
            <Badge variant="outline" className="bg-white">{project.stage}</Badge>
            <Badge variant="secondary">{project.domain}</Badge>
          </div>
          <p className="text-lg text-stone-600 max-w-2xl">{project.description}</p>
        </div>
        
        {!project.analysis && !analyzing && (
          <Button onClick={handleAnalyze} className="shrink-0 bg-stone-900 text-white hover:bg-stone-800">
            <BrainCircuit className="w-4 h-4 mr-2" /> Analyze Project
          </Button>
        )}
      </div>

      <AnimatePresence>
        {analyzing && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <Card className="border-primary-200 bg-primary-50/50 overflow-hidden">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                  <Sparkles className="w-6 h-6 text-primary-600 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-primary-900 font-serif">
                  {analysisStage === 1 && "Initializing Intelligence Engine..."}
                  {analysisStage === 2 && "Understanding project scope..."}
                  {analysisStage === 3 && "Analyzing current capabilities..."}
                  {analysisStage === 4 && "Identifying complementary gaps..."}
                </h3>
                <p className="text-primary-700">Please wait while GenZ Connectors analyzes your project context.</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Intelligence (if exists) */}
        {project.analysis ? (
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-stone-200 overflow-hidden shadow-sm">
              <div className="bg-stone-900 p-6 flex items-center gap-3">
                <BrainCircuit className="w-6 h-6 text-primary-400" />
                <h2 className="text-xl font-bold font-serif text-white tracking-wide">Project Intelligence</h2>
              </div>
              
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">AI Summary</h3>
                  <p className="text-stone-900 font-medium leading-relaxed">{project.analysis.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-stone-100">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" /> Current Strengths
                    </h3>
                    <ul className="space-y-3">
                      {project.analysis.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" /> Potential Gaps
                    </h3>
                    <div className="space-y-4">
                      {project.analysis.gaps.map(gap => (
                        <div key={gap.id} className="bg-red-50/50 border border-red-100 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-red-900 text-sm">{gap.capability}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              gap.priority === 'High' ? 'bg-red-200 text-red-800' : 
                              gap.priority === 'Medium' ? 'bg-orange-200 text-orange-800' : 'bg-stone-200 text-stone-800'
                            }`}>{gap.priority}</span>
                          </div>
                          <p className="text-xs text-red-800/80 leading-snug">{gap.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
                  <h3 className="text-sm font-bold text-primary-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Collaboration Opportunities
                  </h3>
                  <p className="text-sm text-primary-800 leading-relaxed mb-4">
                    {project.analysis.collaborationOpportunities}
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-primary-600/70 uppercase tracking-wider mb-2">Recommended Capabilities</p>
                    <div className="flex flex-wrap gap-2">
                      {project.analysis.recommendedCapabilities.map(c => (
                        <Badge key={c} variant="outline" className="bg-white border-primary-200 text-primary-800">{c}</Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full mt-2" asChild>
                    <Link to="/discover">
                      Find People for This Project <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>

              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="lg:col-span-2">
            <Card className="border-dashed border-2 border-stone-200 bg-stone-50/50">
              <CardContent className="p-12 text-center">
                <BrainCircuit className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-stone-900 mb-2">Intelligence Not Run</h3>
                <p className="text-stone-500 mb-6 max-w-md mx-auto">Analyze this project to identify structural gaps, map out required capabilities, and discover the right collaborators.</p>
                <Button onClick={handleAnalyze} disabled={analyzing}>Analyze Project Now</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Right Column: Raw Data */}
        <div className="space-y-6">
          <Card className="border-stone-200">
            <CardHeader className="pb-3 border-b border-stone-100">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-stone-500">Declared Data</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.length > 0 ? project.technologies.map(t => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  )) : <span className="text-sm text-stone-500">None specified</span>}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Current Capabilities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.currentCapabilities.length > 0 ? project.currentCapabilities.map(c => (
                    <Badge key={c} variant="outline" className="bg-white">{c}</Badge>
                  )) : <span className="text-sm text-stone-500">None specified</span>}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Declared Needs</h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.declaredNeeds.length > 0 ? project.declaredNeeds.map(n => (
                    <Badge key={n} variant="outline" className="bg-red-50 text-red-800 border-red-200">{n}</Badge>
                  )) : <span className="text-sm text-stone-500">None specified</span>}
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
