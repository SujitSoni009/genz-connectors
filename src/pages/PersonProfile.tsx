import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recommendationService } from '../services/recommendationService';
import { connectionService } from '../services/connectionService';
import { User, Profile, Recommendation } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { Loader2, ArrowLeft, MapPin, Briefcase, GraduationCap, Sparkles, Target, UserPlus, CheckCircle, Clock } from 'lucide-react';

export default function PersonProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<(User & Profile) | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const c = await recommendationService.getCandidateById(id);
        if (c) {
          setCandidate(c);
          
          // Look up if we have a recommendation for this user to show the "Why meet" section
          const recs = await recommendationService.getRecommendations();
          const rec = recs.find(r => r.candidateId === id);
          if (rec) setRecommendation(rec);
          
          const conns = await connectionService.getConnections();
          const existing = conns.find(conn => conn.receiverId === id || conn.requesterId === id);
          if (existing) {
            setConnectionStatus(existing.status);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleConnect = async () => {
    if (!id || connecting) return;
    setConnecting(true);
    try {
      const conn = await connectionService.requestConnection(id);
      setConnectionStatus(conn.status);
    } catch (err) {
      console.error("Failed to connect", err);
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="text-2xl font-bold font-serif text-stone-900">Profile Not Found</h2>
        <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 bg-white">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Profile Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-stone-200">
            <div className="h-32 bg-stone-100 relative">
              <div className="absolute -bottom-12 left-8">
                <img 
                  src={candidate.avatarUrl} 
                  alt={candidate.name} 
                  className="h-24 w-24 rounded-full border-4 border-white bg-stone-200 object-cover" 
                />
              </div>
            </div>
            
            <CardContent className="pt-16 pb-8 px-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold font-serif text-stone-900">{candidate.name}</h1>
                  <p className="text-lg text-stone-600 font-medium mt-1">{candidate.headline}</p>
                </div>
                {connectionStatus === 'ACCEPTED' ? (
                  <Button variant="outline" className="bg-green-50 text-green-700 border-green-200" disabled>
                    <CheckCircle className="w-4 h-4 mr-2" /> Connected
                  </Button>
                ) : connectionStatus === 'PENDING' ? (
                  <Button variant="outline" className="bg-stone-50 text-stone-600 border-stone-200" disabled>
                    <Clock className="w-4 h-4 mr-2" /> Request Sent
                  </Button>
                ) : (
                  <Button onClick={handleConnect} disabled={connecting}>
                    {connecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />} 
                    Connect
                  </Button>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-stone-600">
                {candidate.location && (
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{candidate.location}</div>
                )}
                {(candidate.role || candidate.company) && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {candidate.role} {candidate.company ? `at ${candidate.company}` : ''}
                  </div>
                )}
                {candidate.university && (
                  <div className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" />{candidate.university}</div>
                )}
              </div>

              {candidate.bio && (
                <div className="mt-8 border-t border-stone-100 pt-6">
                  <h3 className="text-lg font-bold text-stone-900 mb-3">About</h3>
                  <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{candidate.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="border-stone-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-stone-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map(s => <Badge key={s} variant="outline" className="bg-white">{s}</Badge>)}
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-stone-900 mb-4">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.interests.map(i => <Badge key={i} variant="secondary">{i}</Badge>)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {recommendation && (
            <Card className="border-primary-200 bg-primary-50/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4 text-primary-700">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Why You Should Meet</h3>
                </div>
                <p className="text-primary-900 text-sm leading-relaxed mb-6">
                  {recommendation.complementarity.reason}
                </p>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-primary-600/70 uppercase tracking-wider block mb-1">Potential Collaboration</span>
                    <p className="text-sm font-medium text-primary-900">{recommendation.complementarity.potentialCollaboration}</p>
                  </div>
                  {recommendation.complementarity.matchingCapabilities.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-primary-600/70 uppercase tracking-wider block mb-1">They Bring</span>
                      <p className="text-sm font-medium text-primary-900">{recommendation.complementarity.matchingCapabilities.join(', ')}</p>
                    </div>
                  )}
                  {recommendation.complementarity.sharedInterests.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-primary-600/70 uppercase tracking-wider block mb-1">Shared Interests</span>
                      <p className="text-sm font-medium text-primary-900">{recommendation.complementarity.sharedInterests.join(', ')}</p>
                    </div>
                  )}
                </div>
                {!connectionStatus && (
                  <Button 
                    className="w-full mt-6 bg-primary-600 text-white hover:bg-primary-700"
                    onClick={handleConnect}
                    disabled={connecting}
                  >
                    {connecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Request Connection"}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="border-stone-200">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-stone-500" /> Looking For
                </h3>
                <ul className="space-y-2">
                  {candidate.lookingFor.map((item, i) => (
                    <li key={i} className="text-sm text-stone-700 flex items-start gap-2">
                      <span className="text-stone-300">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-stone-100 pt-6">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-stone-500" /> Can Offer
                </h3>
                <ul className="space-y-2">
                  {candidate.canOffer.map((item, i) => (
                    <li key={i} className="text-sm text-stone-700 flex items-start gap-2">
                      <span className="text-stone-300">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
