import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, NavLink, useParams, Link, useLocation } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import styles from './ProjectLayout.module.css';
import { projectsApi, type Project } from '@/api/services';

export const ProjectLayout: React.FC = () => {
  const { projectId } = useParams();
  const { pathname } = useLocation();
  const step = pathname.endsWith('/voice') ? 'voice' : pathname.endsWith('/template') ? 'template' : pathname.endsWith('/wishlist') ? 'wishlist' : pathname.endsWith('/review') ? 'review' : 'voice';
  const stepOrder: Array<{key:'voice'|'template'|'wishlist'|'review'; label:string; to:string}> = [
    { key:'voice', label:'Voice Intake', to:`/projects/${projectId}/voice` },
    { key:'template', label:'Template', to:`/projects/${projectId}/template` },
    { key:'wishlist', label:'Wishlist', to:`/projects/${projectId}/wishlist` },
    { key:'review', label:'Review', to:`/projects/${projectId}/review` },
  ];
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const p = await projectsApi.getProject(projectId);
        if (mounted) {
          setProject(p);
          setError(null);
        }
      } catch (e: any) {
        if (mounted) setError('Failed to load project');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [projectId]);

  const statusClass = useMemo(() => {
    const s = project?.status;
    if (!s) return 'draft';
    return s.replace('-', '_');
  }, [project?.status]);

  return (
    <div className={styles.container}>
      <GlassCard>
        <div className={styles.artifactsCard}>
          <div className={styles.artifactsHeader}>
            <h3 className={styles.artifactsTitle}>Artifacts</h3>
            <Link to={`/projects/${projectId}`} className={styles.projectId}>#{projectId}</Link>
          </div>
          <nav className={styles.artifactsNav}>
            {stepOrder.map(s => (
              <NavLink key={s.key} to={s.to} className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}>{s.label}</NavLink>
            ))}
          </nav>
        </div>
      </GlassCard>
      <div className={styles.stageArea}>
        <GlassCard>
          <div className={styles.headerBar}>
            <div className={styles.headerLeft}>
              <h2 className={styles.projectTitle}>{project?.name || 'Project'}</h2>
              <span className={`chip ${statusClass}`}>{project?.status || 'draft'}</span>
            </div>
            <div className={styles.stepper}>
              {stepOrder.map((s, idx) => (
                <Link key={s.key} to={s.to} className={`${styles.step} ${step === s.key ? styles.stepActive : ''}`}>
                  <span className={styles.stepIndex}>{idx+1}</span>
                  <span>{s.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </GlassCard>
        <div className={styles.outletArea}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
