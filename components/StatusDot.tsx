'use client'

type Props = { status: string; size?: 'sm' | 'md' }

type StatusInfo = { dot: string; glow: string; label: string }

function resolveStatus(raw: string): StatusInfo {
  const s = (raw ?? '').toLowerCase()
  // Coolify format: "running:unknown", "running:healthy", "running:unhealthy"
  const [state, health] = s.split(':')

  if (state === 'running') {
    if (health === 'unhealthy') return { dot: '#f59e0b', glow: '#f59e0b40', label: 'Unhealthy' }
    return { dot: '#22c55e', glow: '#22c55e40', label: 'Running' }
  }
  if (state === 'starting' || state === 'restarting') return { dot: '#f59e0b', glow: '#f59e0b40', label: 'Starting' }
  if (state === 'stopped' || state === 'exited' || state === 'dead') return { dot: '#6b6b8a', glow: 'transparent', label: 'Stopped' }
  if (state === 'error' || state === 'failed') return { dot: '#ef4444', glow: '#ef444440', label: 'Error' }
  if (s === 'reachable') return { dot: '#22c55e', glow: '#22c55e40', label: 'Reachable' }

  return { dot: '#6b6b8a', glow: 'transparent', label: raw || 'Unknown' }
}

export function StatusDot({ status, size = 'sm' }: Props) {
  const { dot, glow, label } = resolveStatus(status)
  const px = size === 'md' ? 10 : 7

  return (
    <span
      title={label}
      style={{
        display: 'inline-block',
        width: px,
        height: px,
        borderRadius: '50%',
        background: dot,
        boxShadow: `0 0 6px 2px ${glow}`,
        flexShrink: 0,
      }}
    />
  )
}

export function statusLabel(status: string) {
  return resolveStatus(status).label
}
