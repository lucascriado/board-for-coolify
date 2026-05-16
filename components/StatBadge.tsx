type Props = { label: string; value: number | string; color?: string }

export function StatBadge({ label, value, color = '#7c3aed' }: Props) {
  return (
    <div
      style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '14px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <span
        style={{
          fontSize: 26,
          fontWeight: 800,
          color,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          fontFamily: 'var(--font-fustat), system-ui, sans-serif',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 10,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  )
}
