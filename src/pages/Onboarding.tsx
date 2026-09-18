import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { intentService } from '../services/intentService';
import { profileService } from '../services/profileService';
import { Check } from 'lucide-react';

const INTENT_OPTIONS = [
  'Find collaborators', 'Find a cofounder', 'Find a mentor',
  'Find researchers', 'Find customers', 'Find job/internship opportunities',
  'Build a project', 'Learn something', 'Teach something', 'Expand my professional network'
];

const SKILL_OPTIONS = [
  'Java', 'Spring Boot', 'Python', 'React', 'Next.js', 'JavaScript', 'TypeScript',
  'AWS', 'Machine Learning', 'AI', 'UI/UX', 'Product Design', 'Data Science',
  'DevOps', 'Docker', 'SQL', 'System Design', 'Marketing', 'Business Development'
];

const INTEREST_OPTIONS = [
  'AI', 'Cloud Computing', 'Startups', 'Web Development', 'FinTech',
  'HealthTech', 'EdTech', 'Open Source', 'Research', 'Cybersecurity',
  'Robotics', 'Data', 'Developer Tools', 'SaaS'
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1
  const [selectedIntents, setSelectedIntents] = useState<string[]>([]);
  const [intentDescription, setIntentDescription] = useState('');

  // Step 2
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');

  // Step 3
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Step 4
  const [canOffer, setCanOffer] = useState('');
  const [lookingFor, setLookingFor] = useState('');

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleSelection = (item: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
    }
    setCustomSkill('');
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await intentService.saveIntent({
        types: selectedIntents,
        description: intentDescription
      });

      await profileService.saveProfile({
        skills: selectedSkills,
        interests: selectedInterests,
        canOffer: canOffer.split(',').map(s => s.trim()).filter(Boolean),
        lookingFor: lookingFor.split(',').map(s => s.trim()).filter(Boolean)
      });

      navigate('/profile/setup');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-2xl mb-8 flex justify-between items-center">
        <h1 className="font-serif text-2xl text-stone-900 font-bold">GenZ Connectors</h1>
        <span className="text-sm font-medium text-stone-500">Step {step} of 4</span>
      </div>

      <div className="w-full max-w-2xl bg-white shadow-sm border border-stone-200 rounded-2xl p-8 sm:p-10 transition-all duration-300">
        
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-stone-900">What are you here to accomplish?</h2>
            <div className="flex flex-wrap gap-3">
              {INTENT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => toggleSelection(opt, selectedIntents, setSelectedIntents)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedIntents.includes(opt) 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {opt}
                  {selectedIntents.includes(opt) && <Check className="inline-block ml-2 w-4 h-4" />}
                </button>
              ))}
            </div>

            <div className="pt-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Tell us in your own words what you're trying to accomplish.
              </label>
              <textarea
                className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
                rows={4}
                placeholder="I am building an AI healthcare project and I'm looking for a frontend developer..."
                value={intentDescription}
                onChange={(e) => setIntentDescription(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-stone-900">What can you bring to the table?</h2>
            <p className="text-stone-600">Select your skills or add custom ones.</p>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSelection(skill, selectedSkills, setSelectedSkills)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedSkills.includes(skill)
                    ? 'bg-primary-100 text-primary-800 border-2 border-primary-500'
                    : 'bg-white border-2 border-stone-200 text-stone-600 hover:border-primary-300'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            
            <div className="pt-4 flex gap-2">
              <input
                type="text"
                placeholder="Add custom skill..."
                className="flex-1 rounded-lg border border-stone-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
              />
              <Button type="button" variant="outline" onClick={addCustomSkill}>Add</Button>
            </div>
            
            {selectedSkills.length > 0 && (
              <div className="pt-4 border-t border-stone-100 mt-6">
                <p className="text-sm font-medium text-stone-500 mb-3">Selected Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map(skill => (
                    <Badge key={skill} variant="default" className="pl-3 pr-2 py-1 flex items-center gap-1 hover-lift cursor-default">
                      {skill}
                      <button onClick={() => toggleSelection(skill, selectedSkills, setSelectedSkills)} className="hover:bg-primary-200 rounded-full p-0.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-stone-900">What are you interested in?</h2>
            <p className="text-stone-600">This helps us find relevant communities and projects for you.</p>
            <div className="flex flex-wrap gap-3">
              {INTEREST_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => toggleSelection(opt, selectedInterests, setSelectedInterests)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedInterests.includes(opt) 
                    ? 'bg-stone-800 text-white shadow-md' 
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {opt}
                  {selectedInterests.includes(opt) && <Check className="inline-block ml-2 w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-stone-900">Let's find a match</h2>
            <p className="text-stone-600">This is crucial for our complementarity engine.</p>
            
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-2 font-semibold">
                What can you offer? (Comma separated)
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="e.g. Backend development, AI/ML, Cloud/AWS..."
                value={canOffer}
                onChange={(e) => setCanOffer(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-900 mb-2 font-semibold">
                What are you looking for? (Comma separated)
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="e.g. Frontend developer, UI/UX designer, Cofounder..."
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-between items-center pt-6 border-t border-stone-100">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className={step === 1 ? 'opacity-0 pointer-events-none' : ''}
          >
            Back
          </Button>
          
          {step < 4 ? (
            <Button onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Complete Onboarding'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
