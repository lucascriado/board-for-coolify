'use client'

type Props = { lines: string[] }

const ERROR_PATTERNS = ['erro', 'error', 'falha', 'fail', 'exception', 'crash']
const WARN_PATTERNS = ['warn', 'ação necessária', 'atenção', 'expirando']
const OK_PATTERNS = ['running', 'rodando', 'iniciado', 'registrado', 'success']

function lineColor(line: string): string {
  const l = line.toLowerCase()
  if (ERROR_PATTERNS.some(p => l.includes(p))) return 'var(--red)'
  if (WARN_PATTERNS.some(p => l.includes(p))) return 'var(--yellow)'
  if (OK_PATTERNS.some(p => l.includes(p))) return 'var(--green)'
  return 'var(--text-dim)'
}

export function LogsPanel({ lines }: Props) {
  if (lines.length === 0) return null

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, paddingLeft: 2 }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          logs recentes
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      <div
        style={{
          background: 'var(--logs-bg)',
          border: '1px solid var(--logs-border)',
          borderRadius: 8,
          padding: '10px 12px',
          maxHeight: 140,
          overflowY: 'auto',
          fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
          fontSize: 11,
          lineHeight: 1.6,
        }}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ color: lineColor(line), wordBreak: 'break-all' }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}
