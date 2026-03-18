'use client'
import { useDashboardStore } from '@/store'
import { Card, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { Theme } from '@/types'

function Row({ label, description, children }: {
  label: string; description?: string; children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-[12px] text-[hsl(var(--muted-fg))] mt-0.5 max-w-sm">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative w-10 h-5 rounded-full transition-colors duration-200',
        enabled ? 'bg-[hsl(var(--accent))]' : 'bg-[hsl(var(--border))]'
      )}
    >
      <span className={cn(
        'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
        enabled ? 'translate-x-5' : 'translate-x-0'
      )} />
    </button>
  )
}

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light',  label: 'Light' },
  { value: 'dark',   label: 'Dark' },
  { value: 'system', label: 'System' },
]

const INTERVAL_OPTIONS = [
  { value: 30_000,  label: '30 sec' },
  { value: 60_000,  label: '1 min' },
  { value: 120_000, label: '2 min' },
  { value: 300_000, label: '5 min' },
]

export default function SettingsPage() {
  const {
    theme, setTheme,
    autoRefresh, setAutoRefresh,
    refreshIntervalMs, setRefreshInterval,
    dataSource, setDataSource,
    sheetsEndpoint, setSheetsEndpoint,
    userId, setUserId,
    lastUpdated, error,
  } = useDashboardStore()

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-[13px] text-[hsl(var(--muted-fg))] mt-0.5">Dashboard configuration</p>
      </div>

      {/* Appearance */}
      <Card>
        <CardTitle>Appearance</CardTitle>
        <Row label="Theme">
          <div className="flex gap-1.5">
            {THEME_OPTIONS.map(o => (
              <button
                key={o.value}
                onClick={() => setTheme(o.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all',
                  theme === o.value
                    ? 'bg-[hsl(var(--accent))] text-white border-transparent'
                    : 'border-border hover:bg-[hsl(var(--muted))]'
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Row>
      </Card>

      {/* Data source */}
      <Card>
        <CardTitle>Data Source</CardTitle>

        <Row
          label="Source"
          description="Switch between mock data for testing and real Google Sheets data."
        >
          <div className="flex gap-1.5">
            {(['mock', 'google_sheets'] as const).map(v => (
              <button
                key={v}
                onClick={() => setDataSource(v)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all',
                  dataSource === v
                    ? 'bg-[hsl(var(--accent))] text-white border-transparent'
                    : 'border-border hover:bg-[hsl(var(--muted))]'
                )}
              >
                {v === 'mock' ? 'Mock' : 'Google Sheets'}
              </button>
            ))}
          </div>
        </Row>

        <Row
          label="Google Sheets Endpoint"
          description="Apps Script Web App URL or your backend URL that returns { rows: [...] }"
        >
          <input
            type="url"
            value={sheetsEndpoint}
            onChange={e => setSheetsEndpoint(e.target.value)}
            placeholder="https://script.google.com/..."
            className="w-72 text-[12px] px-3 py-1.5 rounded-xl border border-border bg-surface-raised
              text-inherit outline-none focus:border-[hsl(var(--accent))] transition-colors font-mono"
          />
        </Row>

        <Row
          label="User ID"
          description="Telegram user ID. Passed as ?uid= query param when fetching data."
        >
          <input
            type="text"
            value={userId ?? ''}
            onChange={e => setUserId(e.target.value || null)}
            placeholder="123456789"
            className="w-40 text-[12px] px-3 py-1.5 rounded-xl border border-border bg-surface-raised
              text-inherit outline-none focus:border-[hsl(var(--accent))] transition-colors font-mono"
          />
        </Row>

        {/* Sync status */}
        <Row label="Sync Status">
          <div className="text-right">
            {error ? (
              <p className="text-[12px] text-[hsl(var(--danger))]">Failed: {error}</p>
            ) : lastUpdated ? (
              <p className="text-[12px] text-[hsl(var(--success))]">
                Last sync: {new Date(lastUpdated).toLocaleTimeString()}
              </p>
            ) : (
              <p className="text-[12px] text-[hsl(var(--muted-fg))]">Not synced yet</p>
            )}
          </div>
        </Row>
      </Card>

      {/* Auto-refresh */}
      <Card>
        <CardTitle>Auto Refresh</CardTitle>

        <Row
          label="Auto refresh"
          description="Automatically re-fetch data in the background."
        >
          <Toggle enabled={autoRefresh} onChange={setAutoRefresh} />
        </Row>

        <Row
          label="Refresh interval"
          description="How often to pull fresh data."
        >
          <div className="flex gap-1.5 flex-wrap justify-end">
            {INTERVAL_OPTIONS.map(o => (
              <button
                key={o.value}
                onClick={() => setRefreshInterval(o.value)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-[12px] font-medium border transition-all',
                  refreshIntervalMs === o.value
                    ? 'bg-[hsl(var(--accent))] text-white border-transparent'
                    : 'border-border hover:bg-[hsl(var(--muted))]'
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Row>
      </Card>

      {/* About */}
      <Card>
        <CardTitle>About</CardTitle>
        <Row label="Version"><span className="font-mono text-[12px]">1.0.0</span></Row>
        <Row label="Data mode">
          <span className="font-mono text-[12px] text-[hsl(var(--muted-fg))]">{dataSource}</span>
        </Row>
        <Row label="Telegram command">
          <span className="font-mono text-[12px]">/report</span>
        </Row>
      </Card>
    </div>
  )
}
