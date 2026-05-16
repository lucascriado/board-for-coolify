'use client'

import { StatusDot, statusLabel } from './StatusDot'

type Resource = {
  uuid: string
  name: string
  status: string
  fqdn?: string | null
  type?: string | null
  build_pack?: string | null
}

type Props = {
  resource: Resource
  kind: 'app' | 'service' | 'db'
  coolifyUrl?: string
  projectUuid?: string
  envUuid?: string
}

const kindIcon: Record<Props['kind'], string> = { app: '⬡', service: '⚙', db: '◈' }
const kindColor: Record<Props['kind'], string> = { app: '#7c3aed', service: '#3b82f6', db: '#f59e0b' }

export function ResourceRow({ resource, kind, coolifyUrl, projectUuid, envUuid }: Props) {
  const icon = kindIcon[kind]
  const color = kindColor[kind]
  const label = statusLabel(resource.status)

  const href = coolifyUrl && projectUuid && envUuid
    ? `${coolifyUrl}/project/${projectUuid}/environment/${envUuid}/${kind === 'app' ? 'application' : kind === 'service' ? 'service' : 'database'}/${resource.uuid}`
    : undefined

  const inner = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px',
        borderRadius: 8,
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        transition: 'border-color 0.15s',
        cursor: href ? 'pointer' : 'default',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-hover)')}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)')}
    >
      <span style={{ color, fontSize: 13, lineHeight: 1 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {resource.name}
        </div>
        {resource.fqdn && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {resource.fqdn}
          </div>
        )}
        {(resource.type || resource.build_pack) && !resource.fqdn && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{resource.type ?? resource.build_pack}</div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <StatusDot status={resource.status} />
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        {inner}
      </a>
    )
  }
  return inner
}
