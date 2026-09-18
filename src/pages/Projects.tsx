import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { Project } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Loader2, Plus, ArrowRight, BrainCircuit, Activity } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-stone-900">Your Projects</h1>
          <p className="mt-2 text-stone-600">Manage your ideas and find collaborators.</p>
        </div>
        <Button asChild>
          <Link to="/projects/new"><Plus className="w-4 h-4 mr-2" /> New Project</Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed border-2 border-stone-200 bg-stone-50/50">
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-bold text-stone-900 mb-2">No projects yet</h3>
            <p className="text-stone-500 mb-6 max-w-md mx-auto">Create your first project to start analyzing gaps and finding the perfect collaborators.</p>
            <Button asChild>
              <Link to="/projects/new">Create Project</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="border-stone-200 hover:border-stone-300 transition-colors group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-serif text-stone-900 group-hover:text-primary-700 transition-colors">
                      <Link to={`/projects/${project.id}`}>{project.name}</Link>
                    </h3>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="bg-white">{project.stage}</Badge>
                      <Badge variant="secondary">{project.domain}</Badge>
                    </div>
                  </div>
                  {project.analysis && (
                    <div className="bg-primary-50 text-primary-700 p-2 rounded-full" title="AI Intelligence Active">
                       <BrainCircuit className="w-5 h-5" />
                    </div>
                  )}
                </div>
                
                <p className="text-stone-600 text-sm line-clamp-2 mb-6">{project.description}</p>

                {project.analysis && (
                  <div className="mb-6 p-4 bg-stone-50 rounded-xl border border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Project Health
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <p className="text-2xl font-bold text-stone-900">{project.analysis.gaps.length}</p>
                         <p className="text-xs text-stone-500">Open Gaps</p>
                       </div>
                       <div>
                         <p className="text-2xl font-bold text-stone-900">{project.analysis.recommendedCapabilities.length}</p>
                         <p className="text-xs text-stone-500">Needed Skills</p>
                       </div>
                    </div>
                  </div>
                )}

                <Button variant="outline" className="w-full justify-between group-hover:bg-stone-50" asChild>
                  <Link to={`/projects/${project.id}`}>
                    View Details <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 transition-colors" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
