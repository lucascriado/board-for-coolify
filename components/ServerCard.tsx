'use client'

import { CoolifyServer } from '@/lib/coolify'

type Props = { server: CoolifyServer; coolifyUrl: string }

export function ServerCard({ server, coolifyUrl }: Props) {
  const reachable = server.is_reachable && server.is_usable
  const dot = reachable ? 'var(--green)' : 'var(--red)'
  const glow = reachable ? '#22c55e40' : '#ef444440'
  const label = reachable ? 'Acessível' : 'Inacessível'

  return (
    <a
      href={coolifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          transition: 'border-color 0.15s, box-shadow 0.15s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--purple)'
          el.style.boxShadow = '0 4px 20px #7c3aed20'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--border)'
          el.style.boxShadow = 'none'
        }}
      >
        <div
          className="server-icon"
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            flexShrink: 0,
            color: 'var(--icon-color)',
          }}
        >
          ⬡
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>{server.name}</span>
            {server.is_coolify_host && (
              <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 10, background: '#7c3aed20', border: '1px solid #7c3aed40', color: '#a78bfa' }}>
                host
              </span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', opacity: 0.6 }}>↗</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            {server.ip}:{server.port} · {server.user}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: dot,
              boxShadow: `0 0 6px 2px ${glow}`,
            }}
          />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
        </div>
      </div>
    </a>
  )
}
