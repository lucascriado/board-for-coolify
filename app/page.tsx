import { fetchDashboard } from '@/lib/coolify'
import { ProjectCard } from '@/components/ProjectCard'
import { ServerCard } from '@/components/ServerCard'
import { StatBadge } from '@/components/StatBadge'
import { ThemeToggle } from '@/components/ThemeToggle'

export const revalidate = 30

const COOLIFY_URL = process.env.NEXT_PUBLIC_COOLIFY_URL ?? 'http://localhost:8000'

export default async function DashboardPage() {
  let data
  let error: string | null = null

  try {
    data = await fetchDashboard()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Falha ao conectar ao Coolify'
  }

  if (error || !data) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠</div>
          <div style={{ color: 'var(--text)', fontWeight: 600, marginBottom: 6 }}>Não foi possível conectar ao Coolify</div>
          <div style={{ fontSize: 12 }}>{error}</div>
        </div>
      </main>
    )
  }

  const totalRunning = [
    ...data.applications.map(a => a.status),
    ...data.services.map(s => s.status),
    ...data.databases.map(d => d.status),
  ].filter(s => (s ?? '').toLowerCase().startsWith('running')).length

  const totalResources = data.applications.length + data.services.length + data.databases.length

  return (
    <main style={{ minHeight: '100vh', padding: '0 0 60px' }}>
      {/* Barra superior */}
      <div
        style={{
          borderBottom: '1px solid var(--border)',
          padding: '0 32px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: 'var(--topbar-bg)',
          backdropFilter: 'blur(14px)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="topbar-logo">◈</span>
          <span
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-fustat), system-ui, sans-serif',
            }}
          >
            Board Coolify
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Atualizado às {new Date(data.fetchedAt).toLocaleTimeString('pt-BR')}
          </span>
          <ThemeToggle />
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Cabeçalho */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 38,
              fontWeight: 800,
              color: 'var(--text)',
              letterSpacing: '-0.04em',
              lineHeight: 1.02,
              marginBottom: 8,
              fontFamily: 'var(--font-fustat), system-ui, sans-serif',
            }}
          >
            Visão geral da infraestrutura
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, letterSpacing: '-0.01em' }}>
            {data.servers[0]?.ip ?? 'localhost'} · Coolify v4
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 12,
            marginBottom: 40,
          }}
        >
          <StatBadge label="Projetos" value={data.projects.length} color="#7c3aed" />
          <StatBadge label="Apps" value={data.applications.length} color="#3b82f6" />
          <StatBadge label="Serviços" value={data.services.length} color="#06b6d4" />
          <StatBadge label="Bancos" value={data.databases.length} color="#f59e0b" />
          <StatBadge label="Rodando" value={`${totalRunning}/${totalResources}`} color="#22c55e" />
        </div>

        {/* Servidores */}
        {data.servers.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <SectionTitle label="Servidores" count={data.servers.length} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.servers.map(server => (
                <ServerCard key={server.uuid} server={server} coolifyUrl={COOLIFY_URL} />
              ))}
            </div>
          </section>
        )}

        {/* Projetos */}
        <section>
          <SectionTitle label="Projetos" count={data.projects.length} />
          {data.projects.length === 0 ? (
            <EmptyState label="Nenhum projeto encontrado" />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))',
                gap: 16,
              }}
            >
              {data.projects.map(project => (
                <ProjectCard
                  key={project.uuid}
                  project={project}
                  applications={data.applications}
                  services={data.services}
                  databases={data.databases}
                  envMap={data.envMap}
                  logsMap={data.logsMap}
                  coolifyUrl={COOLIFY_URL}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function SectionTitle({ label, count }: { label: string; count: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </span>
      <span
        style={{
          fontSize: 11,
          padding: '2px 8px',
          borderRadius: 20,
          background: 'var(--surface-2)',
          color: 'var(--text-muted)',
          fontWeight: 500,
          border: '1px solid var(--border)',
        }}
      >
        {count}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        color: 'var(--text-muted)',
        fontSize: 13,
        border: '1px dashed var(--border)',
        borderRadius: 12,
      }}
    >
      {label}
    </div>
  )
}
