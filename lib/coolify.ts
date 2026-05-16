const BASE = process.env.COOLIFY_BASE_URL!
const TOKEN = process.env.COOLIFY_API_TOKEN!

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    headers,
    next: { revalidate: 30 },
  })
  if (!res.ok) throw new Error(`Coolify API ${path} → ${res.status}`)
  return res.json()
}

export type CoolifyEnvironment = {
  id: number
  uuid: string
  name: string
  project_id: number
}

export type CoolifyProject = {
  id: number
  uuid: string
  name: string
  description: string | null
  environments: CoolifyEnvironment[]
}

export type CoolifyApplication = {
  uuid: string
  name: string
  status: string
  fqdn: string | null
  environment_id: number
  git_repository: string | null
  build_pack: string | null
  updated_at: string
}

export type CoolifyService = {
  uuid: string
  name: string
  status: string
  environment_id: number
  type: string | null
  updated_at: string
}

export type CoolifyDatabase = {
  uuid: string
  name: string
  status: string
  type: string
  environment_id: number
  updated_at: string
}

export type CoolifyServer = {
  uuid: string
  name: string
  description: string | null
  ip: string
  port: number
  user: string
  is_reachable: boolean
  is_usable: boolean
  is_coolify_host: boolean
}

// environment_id (number) → project uuid
export type EnvMap = Record<number, string>

// app uuid → last N log lines
export type LogsMap = Record<string, string[]>

export type DashboardData = {
  projects: CoolifyProject[]
  applications: CoolifyApplication[]
  services: CoolifyService[]
  databases: CoolifyDatabase[]
  servers: CoolifyServer[]
  envMap: EnvMap
  logsMap: LogsMap
  fetchedAt: string
}

async function fetchAppLogs(uuid: string): Promise<string[]> {
  try {
    const data = await get<{ logs: string }>(`/applications/${uuid}/logs`)
    const lines = (data.logs ?? '').split('\n').filter(Boolean)
    return lines.slice(-15)
  } catch {
    return []
  }
}

export async function fetchDashboard(): Promise<DashboardData> {
  const [projectList, applications, services, databases, servers] = await Promise.all([
    get<CoolifyProject[]>('/projects'),
    get<CoolifyApplication[]>('/applications'),
    get<CoolifyService[]>('/services'),
    get<CoolifyDatabase[]>('/databases'),
    get<CoolifyServer[]>('/servers'),
  ])

  // Fetch full project details (includes environments with their numeric IDs)
  const projects = await Promise.all(
    (projectList ?? []).map(p => get<CoolifyProject>(`/projects/${p.uuid}`))
  )

  // Build map: environment.id → project.uuid
  const envMap: EnvMap = {}
  for (const project of projects) {
    for (const env of project.environments ?? []) {
      envMap[env.id] = project.uuid
    }
  }

  // Fetch logs for all applications in parallel
  const appList = applications ?? []
  const logResults = await Promise.all(appList.map(a => fetchAppLogs(a.uuid)))
  const logsMap: LogsMap = {}
  appList.forEach((app, i) => { logsMap[app.uuid] = logResults[i] })

  return {
    projects,
    applications: appList,
    services: services ?? [],
    databases: databases ?? [],
    servers: servers ?? [],
    envMap,
    logsMap,
    fetchedAt: new Date().toISOString(),
  }
}
