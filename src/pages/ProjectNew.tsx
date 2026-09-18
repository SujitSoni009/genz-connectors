import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { projectService } from '../services/projectService';
import { authService } from '../services/authService';

const DOMAINS = ['Healthcare', 'FinTech', 'EdTech', 'E-commerce', 'AI/ML', 'Developer Tools', 'Social', 'Gaming', 'Web3', 'Other'];
const STAGES = ['Idea', 'Planning', 'Prototype', 'MVP', 'Beta', 'Production'] as const;

export default function ProjectNew() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    domain: 'AI/ML',
    stage: 'Idea' as any,
  });

  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);

  const [capInput, setCapInput] = useState('');
  const [currentCapabilities, setCurrentCapabilities] = useState<string[]>([]);

  const [needInput, setNeedInput] = useState('');
  const [declaredNeeds, setDeclaredNeeds] = useState<string[]>([]);

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = (input: string, setInput: any, list: string[], setList: any) => {
    if (input.trim() && !list.includes(input.trim())) {
      setList([...list, input.trim()]);
    }
    setInput('');
  };

  const handleRemove = (item: string, list: string[], setList: any) => {
    setList(list.filter((i) => i !== item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = authService.getCurrentUser();
      if (!user) throw new Error("Not logged in");

      const project = await projectService.createProject({
        name: formData.name,
        description: formData.description,
        domain: formData.domain,
        stage: formData.stage,
        technologies,
        currentCapabilities,
        declaredNeeds,
      }, user.id);

      navigate(`/projects/${project.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-stone-900">Create New Project</h1>
        <p className="mt-2 text-stone-600">Tell us what you are building so we can find the right people to help.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700">Project Name</label>
              <Input name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. HealthConnect AI" className="mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">Description</label>
              <textarea
                name="description"
                required
                rows={3}
                className="mt-1 w-full rounded-xl border border-stone-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                placeholder="What is the project trying to accomplish?"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700">Domain</label>
                <select name="domain" value={formData.domain} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-stone-300 px-4 py-2 bg-white">
                  {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700">Stage</label>
                <select name="stage" value={formData.stage} onChange={handleChange} className="mt-1 block w-full rounded-xl border border-stone-300 px-4 py-2 bg-white">
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="border-t border-stone-100 pt-6 mt-6">
              <label className="block text-sm font-bold text-stone-900 mb-2">Technology Stack</label>
              <p className="text-xs text-stone-500 mb-3">What technologies are you using or planning to use?</p>
              <div className="flex gap-2 mb-3">
                <Input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAdd(techInput, setTechInput, technologies, setTechnologies))} placeholder="e.g. React, Java, AWS" />
                <Button type="button" variant="outline" onClick={() => handleAdd(techInput, setTechInput, technologies, setTechnologies)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {technologies.map(t => (
                  <span key={t} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-stone-100 text-stone-800">
                    {t}
                    <button type="button" onClick={() => handleRemove(t, technologies, setTechnologies)} className="ml-2 text-stone-500 hover:text-stone-700">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-100 pt-6 mt-6">
              <label className="block text-sm font-bold text-stone-900 mb-2">Current Team Capabilities</label>
              <p className="text-xs text-stone-500 mb-3">What can you and your current team already do?</p>
              <div className="flex gap-2 mb-3">
                <Input value={capInput} onChange={e => setCapInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAdd(capInput, setCapInput, currentCapabilities, setCurrentCapabilities))} placeholder="e.g. Backend Development, Product Management" />
                <Button type="button" variant="outline" onClick={() => handleAdd(capInput, setCapInput, currentCapabilities, setCurrentCapabilities)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentCapabilities.map(c => (
                  <span key={c} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-800 border border-primary-100">
                    {c}
                    <button type="button" onClick={() => handleRemove(c, currentCapabilities, setCurrentCapabilities)} className="ml-2 text-primary-600 hover:text-primary-800">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-100 pt-6 mt-6">
              <label className="block text-sm font-bold text-stone-900 mb-2">What We Need</label>
              <p className="text-xs text-stone-500 mb-3">What specific roles or skills are missing?</p>
              <div className="flex gap-2 mb-3">
                <Input value={needInput} onChange={e => setNeedInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAdd(needInput, setNeedInput, declaredNeeds, setDeclaredNeeds))} placeholder="e.g. UI/UX Designer, React Developer" />
                <Button type="button" variant="outline" onClick={() => handleAdd(needInput, setNeedInput, declaredNeeds, setDeclaredNeeds)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {declaredNeeds.map(n => (
                  <span key={n} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-800 border border-red-100">
                    {n}
                    <button type="button" onClick={() => handleRemove(n, declaredNeeds, setDeclaredNeeds)} className="ml-2 text-red-600 hover:text-red-800">×</button>
                  </span>
                ))}
              </div>
            </div>

          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-stone-100">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || !formData.name || !formData.description}>
              {isSubmitting ? 'Saving...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
