'use client'

import { CoolifyApplication, CoolifyDatabase, CoolifyProject, CoolifyService, EnvMap, LogsMap } from '@/lib/coolify'
import { ResourceRow } from './ResourceRow'
import { LogsPanel } from './LogsPanel'

type Props = {
  project: CoolifyProject
  applications: CoolifyApplication[]
  services: CoolifyService[]
  databases: CoolifyDatabase[]
  envMap: EnvMap
  logsMap: LogsMap
  coolifyUrl: string
}

export function ProjectCard({ project, applications, services, databases, envMap, logsMap, coolifyUrl }: Props) {
  const apps = applications.filter(a => envMap[a.environment_id] === project.uuid)
  const svcs = services.filter(s => envMap[s.environment_id] === project.uuid)
  const dbs = databases.filter(d => envMap[d.environment_id] === project.uuid)
  const total = apps.length + svcs.length + dbs.length

  const runningCount = [
    ...apps.map(a => a.status),
    ...svcs.map(s => s.status),
    ...dbs.map(d => d.status),
  ].filter(s => (s ?? '').toLowerCase().startsWith('running')).length

  // Use first environment UUID for the Coolify project link
  const firstEnv = project.environments?.[0]
  const projectHref = firstEnv
    ? `${coolifyUrl}/project/${project.uuid}/environment/${firstEnv.uuid}`
    : `${coolifyUrl}/projects`

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = '#7c3aed50'
        el.style.boxShadow = '0 0 0 1px #7c3aed20, 0 8px 32px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--border)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Header — clicável */}
      <a
        href={projectHref}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: total > 0 ? '1px solid var(--border)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'var(--server-icon-bg)',
                border: '1px solid var(--server-icon-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                color: 'var(--icon-color)',
              }}
            >
              ◈
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {project.name}
                <span style={{ fontSize: 11, color: 'var(--text-muted)', opacity: 0.6 }}>↗</span>
              </div>
              {project.description && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{project.description}</div>
              )}
            </div>
          </div>
          <div
            style={{
              fontSize: 11,
              padding: '3px 10px',
              borderRadius: 20,
              background: runningCount > 0 ? '#22c55e15' : '#6b6b8a15',
              border: `1px solid ${runningCount > 0 ? '#22c55e30' : '#6b6b8a30'}`,
              color: runningCount > 0 ? 'var(--green)' : 'var(--text-muted)',
              fontWeight: 500,
            }}
          >
            {runningCount}/{total} rodando
          </div>
        </div>
      </a>

      {/* Resources + Logs */}
      {total > 0 && (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {apps.map(app => (
            <div key={app.uuid}>
              <ResourceRow
                resource={app}
                kind="app"
                coolifyUrl={coolifyUrl}
                projectUuid={project.uuid}
                envUuid={firstEnv?.uuid}
              />
              <LogsPanel lines={logsMap[app.uuid] ?? []} />
            </div>
          ))}
          {svcs.map(svc => (
            <ResourceRow
              key={svc.uuid}
              resource={svc}
              kind="service"
              coolifyUrl={coolifyUrl}
              projectUuid={project.uuid}
              envUuid={firstEnv?.uuid}
            />
          ))}
          {dbs.map(db => (
            <ResourceRow
              key={db.uuid}
              resource={db}
              kind="db"
              coolifyUrl={coolifyUrl}
              projectUuid={project.uuid}
              envUuid={firstEnv?.uuid}
            />
          ))}
        </div>
      )}

      {total === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
          Nenhum recurso
        </div>
      )}
    </div>
  )
}
