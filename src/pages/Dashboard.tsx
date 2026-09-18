import React, { useEffect, useState } from 'react';
import { profileService } from '../services/profileService';
import { intentService } from '../services/intentService';
import { recommendationService } from '../services/recommendationService';
import { authService } from '../services/authService';
import { Profile, Intent, Recommendation } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Loader2, Sparkles, ArrowRight, UserPlus, Check, X, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const ConnectModal = ({ 
  rec, 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  rec: Recommendation | null; 
  isOpen: boolean; 
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSending(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen || !rec) return null;

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirm();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-stone-100 flex justify-between items-start">
          <h3 className="text-xl font-bold font-serif text-stone-900">Connect with {rec.user.name.split(' ')[0]}?</h3>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
            <h4 className="text-sm font-semibold text-primary-900 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" /> Shared Context
            </h4>
            <p className="text-sm text-primary-800 leading-relaxed">
              {rec.complementarity.reason}
            </p>
          </div>
          {rec.complementarity.sharedInterests.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Shared Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {rec.complementarity.sharedInterests.map(i => <Badge key={i} variant="secondary">{i}</Badge>)}
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-stone-100 flex gap-3 justify-end bg-stone-50">
          <Button variant="outline" onClick={onClose} disabled={isSending || isSuccess}>Cancel</Button>
          <Button onClick={handleSend} disabled={isSending || isSuccess} variant={isSuccess ? 'secondary' : 'default'}>
            {isSending ? 'Sending...' : isSuccess ? (
              <span className="flex items-center"><Check className="mr-2 h-4 w-4" /> Request Sent ✓</span>
            ) : (
              'Send Request'
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [p, i, recs] = await Promise.all([
          profileService.getCurrentProfile(),
          intentService.getCurrentIntent(),
          recommendationService.getRecommendations()
        ]);
        setProfile(p);
        setIntent(i);
        setRecommendations(recs);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const completionPercentage = profile ? 
    Math.round(
      (Object.keys(profile).length / 10) * 100
    ) : 0;
  const clampedCompletion = Math.min(completionPercentage, 100);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Modals */}
      <AnimatePresence>
        {selectedRec && (
          <ConnectModal 
            rec={selectedRec} 
            isOpen={!!selectedRec} 
            onClose={() => setSelectedRec(null)} 
            onConfirm={() => {
              setRecommendations(prev => prev.filter(r => r.id !== selectedRec.id));
              setSelectedRec(null);
            }}
          />
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-stone-900">
          Good morning{authService.getCurrentUser()?.name ? `, ${authService.getCurrentUser()?.name.split(' ')[0]}` : '!'}
        </h1>
        <p className="mt-2 text-lg text-stone-600">Let's find the people who can move your idea forward.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 font-serif">
              <Sparkles className="h-5 w-5 text-primary-600" />
              Who Should I Meet?
            </h2>
          </div>

          {recommendations.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <div className="mx-auto h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-stone-400" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">No recommendations yet</h3>
              <p className="text-stone-600 mt-2 max-w-sm mx-auto mb-6">Complete your profile and intent to unlock better connections and personalized matches.</p>
              <Button asChild><Link to="/profile/setup">Complete Profile</Link></Button>
            </Card>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
              {recommendations.map((rec) => (
                <motion.div key={rec.id} variants={itemVariants}>
                  <Card className="group overflow-hidden border-stone-200 hover-lift hover-glow cursor-default">
                    <CardContent className="p-0">
                      <div className="p-6 transition-colors duration-300 group-hover:bg-primary-50/20">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <img src={rec.user.avatarUrl} alt="" className="h-12 w-12 rounded-full border border-stone-200 shrink-0 object-cover" />
                            <div>
                              <h3 className="text-lg font-bold">{rec.user.name}</h3>
                              <p className="text-sm text-stone-600">{rec.user.headline}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Matching Capabilities</p>
                            <div className="flex flex-wrap gap-1.5">
                              {rec.complementarity.matchingCapabilities.map(skill => (
                                <Badge key={skill} variant="outline" className="bg-white">{skill}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Looking for</p>
                            <p className="text-sm font-medium text-stone-800 line-clamp-2">{rec.user.lookingFor?.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-primary-50 p-6 border-t border-primary-100">
                        <div className="flex items-start gap-3 group/ai">
                          <Sparkles className="h-5 w-5 text-primary-600 shrink-0 mt-0.5 transition-transform duration-500 group-hover/ai:rotate-12 group-hover/ai:scale-110" />
                          <div>
                            <span className="font-semibold text-primary-900 block mb-1 text-sm uppercase tracking-wide">Why You Should Meet</span>
                            <p className="text-sm text-primary-800 leading-relaxed">
                              {rec.complementarity.reason}
                            </p>
                          </div>
                        </div>
                        <div className="mt-5 flex gap-3">
                          <Button onClick={() => setSelectedRec(rec)} className="flex-1 sm:flex-none">
                            <span className="flex items-center"><UserPlus className="mr-2 h-4 w-4" /> Connect</span>
                          </Button>
                          <Button variant="outline" className="flex-1 sm:flex-none bg-white hover:bg-stone-50" asChild>
                            <Link to={`/people/${rec.user.id}`}>View Profile</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="hover-lift border-stone-200">
            <CardHeader className="pb-3 border-b border-stone-100">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-stone-500">Your Current Intent</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="font-medium text-stone-900 leading-snug">
                {intent?.description || intent?.types.join(', ') || 'No intent set.'}
              </p>
              
              {(profile?.lookingFor?.length ?? 0) > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Looking For</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile?.lookingFor.map(l => (
                      <Badge key={l} variant="secondary">{l}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <Button variant="outline" className="w-full mt-2" asChild>
                <Link to="/onboarding">Edit Intent</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-lift border-stone-200">
            <CardHeader className="pb-3 border-b border-stone-100">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-stone-500">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-serif font-bold text-stone-900">{clampedCompletion}%</span>
                <span className="text-sm text-stone-500 mb-1">Complete</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2.5 mb-4 overflow-hidden">
                <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${clampedCompletion}%` }}></div>
              </div>
              {clampedCompletion < 100 && (
                <p className="text-sm text-stone-600 mb-4">Add missing information to improve your matches.</p>
              )}
              <Button variant="link" className="px-0 mt-1 w-full justify-start text-stone-500 hover:text-primary-600" asChild>
                <Link to="/profile/setup">Update profile</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover-lift border-stone-200">
            <CardHeader className="pb-3 border-b border-stone-100">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-stone-500">Networking Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center group">
                  <span className="text-stone-600 group-hover:text-stone-900 transition-colors">Potential Connections</span>
                  <Badge variant="default">12</Badge>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-stone-600 group-hover:text-stone-900 transition-colors">Pending Requests</span>
                  <Badge variant="secondary">4</Badge>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-stone-600 group-hover:text-stone-900 transition-colors">Active Projects</span>
                  <span className="font-medium text-stone-900">2</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-stone-600 group-hover:text-stone-900 transition-colors">Upcoming Events</span>
                  <span className="font-medium text-stone-900">1</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
