import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { recommendationService } from '../services/recommendationService';
import { Recommendation } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Loader2, Sparkles, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Discover() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const recs = await recommendationService.getRecommendations();
        setRecommendations(recs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="flex h-[calc(100vh-4rem)] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-serif text-stone-900">Discover</h1>
          <p className="mt-2 text-stone-600">Curated connections based on your projects, gaps, and capabilities.</p>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <Card className="border-dashed border-2 border-stone-200 bg-stone-50/50">
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-bold text-stone-900 mb-2">No recommendations found</h3>
            <p className="text-stone-500 mb-6 max-w-md mx-auto">Create more projects or update your profile to find better matches.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map(rec => (
            <motion.div key={rec.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="h-full flex flex-col group border-stone-200 hover:border-stone-300 transition-all duration-300">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img src={rec.user.avatarUrl} alt="" className="w-12 h-12 rounded-full border border-stone-200 object-cover" />
                      <div>
                        <h3 className="font-bold text-lg text-stone-900">
                          <Link to={`/people/${rec.candidateId}`} className="hover:text-primary-700 transition-colors">
                            {rec.user.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-stone-600">{rec.user.headline}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <div>
                         <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">They Bring</p>
                         <div className="flex flex-wrap gap-1.5">
                           {rec.complementarity.matchingCapabilities.length > 0 ? (
                             rec.complementarity.matchingCapabilities.map(c => <Badge key={c} variant="outline" className="bg-white">{c}</Badge>)
                           ) : (
                             <span className="text-sm text-stone-500">Other skills</span>
                           )}
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="mt-auto bg-primary-50 p-6 border-t border-primary-100 flex-grow flex flex-col justify-between">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2 text-primary-700">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Why You Should Meet</span>
                      </div>
                      <p className="text-sm text-primary-900 leading-relaxed font-medium">
                        {rec.complementarity.reason}
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="flex-1" onClick={() => {}}>
                        <UserPlus className="w-4 h-4 mr-2" /> Connect
                      </Button>
                      <Button variant="outline" className="bg-white hover:bg-stone-50 flex-1" asChild>
                        <Link to={`/people/${rec.candidateId}`}>View Profile</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
