import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';
import { Profile } from '../types';
import { User, MapPin, Briefcase, GraduationCap } from 'lucide-react';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState('Demo User');
  const [profile, setProfile] = useState<Partial<Profile>>({
    headline: '',
    bio: '',
    university: '',
    company: '',
    role: '',
    experience: 'Intermediate',
    location: '',
    privacy: {
      showProfile: true,
      allowRequests: true,
      showIntent: true
    }
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && user.name) {
      setUserName(user.name);
    }
    profileService.getCurrentProfile().then(p => {
      if (p) setProfile(prev => ({ ...prev, ...p }));
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy!,
        [e.target.name]: e.target.checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await profileService.saveProfile(profile);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Form Section */}
        <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
          <h1 className="text-2xl font-bold text-stone-900 font-serif mb-2">Complete Your Profile</h1>
          <p className="text-stone-600 mb-8">Add the details that make you stand out.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-stone-100">
              <div className="h-24 w-24 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-200">
                <User className="h-10 w-10 text-stone-400" />
              </div>
              <Button type="button" variant="outline">Upload Photo</Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700">Headline</label>
                <Input name="headline" value={profile.headline || ''} onChange={handleChange} placeholder="e.g. Frontend Engineer & AI Enthusiast" className="mt-1" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700">Bio</label>
                <textarea
                  name="bio"
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="Tell us a little about yourself..."
                  value={profile.bio || ''}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Role / Title</label>
                <Input name="role" value={profile.role || ''} onChange={handleChange} placeholder="Software Engineer" className="mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Location (City)</label>
                <Input name="location" value={profile.location || ''} onChange={handleChange} placeholder="San Francisco, CA" className="mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Company</label>
                <Input name="company" value={profile.company || ''} onChange={handleChange} placeholder="Tech Corp" className="mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">University</label>
                <Input name="university" value={profile.university || ''} onChange={handleChange} placeholder="Stanford University" className="mt-1" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-stone-700">Experience Level</label>
                <select
                  name="experience"
                  value={profile.experience || 'Intermediate'}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-xl border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100">
              <h3 className="text-lg font-medium text-stone-900 mb-4">Privacy Options</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="showProfile" checked={profile.privacy?.showProfile} onChange={handlePrivacyChange} className="w-5 h-5 rounded border-stone-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-stone-700 text-sm">Make my profile visible to others</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="allowRequests" checked={profile.privacy?.allowRequests} onChange={handlePrivacyChange} className="w-5 h-5 rounded border-stone-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-stone-700 text-sm">Allow connection requests</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="showIntent" checked={profile.privacy?.showIntent} onChange={handlePrivacyChange} className="w-5 h-5 rounded border-stone-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-stone-700 text-sm">Show my current intent on my profile</span>
                </label>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save & Continue'}
              </Button>
            </div>
          </form>
        </div>

        {/* Live Preview Section */}
        <div className="flex-1 hidden lg:block">
          <div className="sticky top-8 space-y-4">
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider pl-2">Live Preview</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover-lift">
              <div className="h-32 bg-stone-100 relative">
                <div className="absolute -bottom-12 left-6">
                  <div className="h-24 w-24 rounded-full bg-white p-1 shadow-sm">
                    <div className="h-full w-full rounded-full bg-stone-200 flex items-center justify-center">
                      <User className="h-10 w-10 text-stone-400" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-16 pb-6 px-6">
                <h2 className="text-xl font-bold text-stone-900 font-serif">{userName}</h2>
                <p className="text-stone-600 font-medium">{profile.headline || 'Headline...'}</p>
                
                <div className="mt-4 space-y-2 text-sm text-stone-500">
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {(profile.role || profile.company) && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{profile.role} {profile.company ? `at ${profile.company}` : ''}</span>
                    </div>
                  )}
                  {profile.university && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>{profile.university}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-stone-100 pt-4">
                  <p className="text-sm text-stone-700 whitespace-pre-wrap">
                    {profile.bio || 'Your bio will appear here...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
