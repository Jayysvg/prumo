'use client';

import { useCallback, useState } from 'react';
import {
  Bell, ChartNoAxesCombined, CircleUserRound, LayoutDashboard, Menu,
  Plus, Search, Settings, UsersRound,
} from 'lucide-react';
import type { Lead, LeadStatus } from '@/types/crm';
import { initialLeads } from '@/data/leads';
import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { LeadsPage } from '@/components/leads/leads-page';
import { ClientsPage } from '@/components/clients/clients-page';
import { ActivitiesPage } from '@/components/activities/activities-page';
import { NewLeadDialog, type LeadDraft } from '@/components/leads/new-lead-dialog';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { useWebMcpCreateLead } from '@/hooks/use-webmcp';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Page = 'Dashboard' | 'Leads' | 'Clientes' | 'Atividades';
const nav = [
  { name: 'Dashboard' as Page, icon: LayoutDashboard },
  { name: 'Leads' as Page, icon: ChartNoAxesCombined },
  { name: 'Clientes' as Page, icon: UsersRound },
  { name: 'Atividades' as Page, icon: CircleUserRound },
];

export function CRMApp() {
  const [page, setPage] = useState<Page>('Dashboard');
  const [leads, setLeads] = useState(initialLeads);
  const [modal, setModal] = useState(false);
  const [prefill, setPrefill] = useState<Partial<LeadDraft>>({});
  const startLead = useCallback((input: { name: string; company: string }) => {
    setPrefill(input);
    setModal(true);
  }, []);
  useWebMcpCreateLead(startLead);

  const move = (id: string, status: LeadStatus) =>
    setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status, lastContact: 'Agora' } : lead));
  const create = (lead: Lead) => {
    setLeads((current) => [lead, ...current]);
    setPage('Leads');
  };
  const openNew = () => {
    setPrefill({});
    setModal(true);
  };

  return (
    <main className="app-canvas min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <DesktopSidebar page={page} leadCount={leads.length} onNavigate={setPage} />
      <section className="min-w-0">
        <AppHeader page={page} leadCount={leads.length} onNavigate={setPage} onNew={openNew} />
        <div className="mx-auto max-w-[1540px] p-4 sm:p-6 lg:p-8 xl:px-10">
          {page === 'Dashboard' && <DashboardPage />}
          {page === 'Leads' && <LeadsPage leads={leads} onMove={move} />}
          {page === 'Clientes' && <ClientsPage />}
          {page === 'Atividades' && <ActivitiesPage />}
        </div>
      </section>
      <NewLeadDialog open={modal} onOpenChange={setModal} onCreate={create} initialDraft={prefill} />
    </main>
  );
}

function Logo() {
  return (
    <div className="rounded-[11px] border border-white/10 bg-[#f7faf8] px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,.14)]">
      <img
        src="/prumo-logo-primary.png"
        alt="Prumo"
        width={2172}
        height={724}
        className="h-8 w-auto max-w-[166px] object-contain"
      />
    </div>
  );
}

function NavItems({ page, leadCount, onNavigate }: { page: Page; leadCount: number; onNavigate: (page: Page) => void }) {
  return (
    <nav className="mt-9">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-white/30">Workspace</p>
      <div className="space-y-1">
        {nav.map(({ name, icon: Icon }) => (
          <button key={name} onClick={() => onNavigate(name)} className={`group relative flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition ${page === name ? 'bg-white/[.09] font-medium text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.04)]' : 'text-white/50 hover:bg-white/[.045] hover:text-white/85'}`}>
            {page === name && <span className="absolute -left-4 h-5 w-[2px] rounded-r bg-[var(--brand-lime)]" />}
            <Icon size={17} strokeWidth={1.8} className={page === name ? 'text-[var(--brand-lime)]' : 'transition group-hover:text-white/70'} />
            {name}
            {name === 'Leads' && <span className="ml-auto min-w-6 rounded-md border border-white/[.07] bg-black/10 px-1.5 py-0.5 text-center text-[10px] text-white/50">{leadCount}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
}

function UserCard() {
  return (
    <div className="mt-auto">
      <div className="mb-4 rounded-xl border border-white/[.07] bg-white/[.025] p-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-white/30">Pipeline mensal</p>
          <span className="size-1.5 rounded-full bg-[var(--brand-lime)] shadow-[0_0_8px_rgba(200,243,90,.65)]" />
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[.07]"><div className="h-full w-[74%] bg-[var(--brand-lime)]" /></div>
        <div className="mt-2 flex justify-between text-[11px]"><span className="text-white/40">R$ 38.750</span><span className="font-medium text-white/70">74%</span></div>
      </div>
      <button className="mb-2 flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm text-white/45 transition hover:bg-white/[.045] hover:text-white/80"><Settings size={17} />Configurações</button>
      <div className="flex items-center gap-3 border-t border-white/[.07] px-1 pt-4">
        <div className="grid size-9 place-items-center rounded-[10px] bg-[#d8a3ff] text-xs font-bold text-[#362047]">JM</div>
        <div className="min-w-0"><p className="truncate text-sm font-medium text-white/90">João Martins</p><p className="text-[11px] text-white/35">Administrador</p></div>
        <span className="ml-auto text-white/30">•••</span>
      </div>
    </div>
  );
}

function SidebarBody({ page, leadCount, onNavigate }: { page: Page; leadCount: number; onNavigate: (page: Page) => void }) {
  return <><Logo /><NavItems page={page} leadCount={leadCount} onNavigate={onNavigate} /><UserCard /></>;
}

function DesktopSidebar({ page, leadCount, onNavigate }: { page: Page; leadCount: number; onNavigate: (page: Page) => void }) {
  return <aside className="sticky top-0 hidden h-screen flex-col border-r border-white/[.06] bg-[#0d2927] px-4 py-5 text-white dark:bg-[#091715] lg:flex"><SidebarBody page={page} leadCount={leadCount} onNavigate={onNavigate} /></aside>;
}

function MobileNav({ page, leadCount, onNavigate }: { page: Page; leadCount: number; onNavigate: (page: Page) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="icon" className="control-button lg:hidden" />}><Menu size={18} /></SheetTrigger>
      <SheetContent side="left" className="flex w-[286px] flex-col border-none bg-[#0d2927] p-5 text-white dark:bg-[#091715]">
        <SheetTitle className="sr-only">Menu principal</SheetTitle>
        <SidebarBody page={page} leadCount={leadCount} onNavigate={(next) => { onNavigate(next); setOpen(false); }} />
      </SheetContent>
    </Sheet>
  );
}

function AppHeader({ page, leadCount, onNavigate, onNew }: { page: Page; leadCount: number; onNavigate: (page: Page) => void; onNew: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[var(--line)] bg-[color:var(--surface-raised)]/92 px-4 backdrop-blur-xl sm:px-6 lg:px-8 xl:px-10">
      <div className="flex items-center gap-3">
        <MobileNav page={page} leadCount={leadCount} onNavigate={onNavigate} />
        <div className="flex items-center gap-2 text-sm">
          <span className="hidden text-[var(--text-faint)] sm:inline">Comercial</span>
          <span className="hidden text-[var(--line)] sm:inline">/</span>
          <h1 className="font-semibold tracking-[-.015em] text-[var(--text-strong)]">{page}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <label className="premium-input hidden h-9 items-center gap-2 rounded-[10px] border px-3 text-sm md:flex">
          <Search size={15} />
          <input className="w-36 bg-transparent text-[13px] outline-none xl:w-52" placeholder="Buscar no workspace" />
          <kbd className="rounded border border-[var(--line)] bg-[var(--surface-raised)] px-1.5 py-0.5 text-[9px] text-[var(--text-faint)]">⌘ K</kbd>
        </label>
        <ThemeToggle />
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="icon" className="control-button relative" aria-label="Notificações" />}>
            <Bell size={16} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#e38b65] ring-2 ring-[var(--surface-raised)]" />
          </TooltipTrigger>
          <TooltipContent>3 notificações</TooltipContent>
        </Tooltip>
        <Button onClick={onNew} className="h-9 rounded-[10px] bg-[var(--brand-deep)] px-3 text-[13px] font-semibold text-white shadow-[0_3px_10px_rgba(12,41,39,.14)] hover:opacity-90 dark:text-[#13231f] sm:px-4">
          <Plus size={16} /><span className="hidden sm:inline">Novo lead</span>
        </Button>
      </div>
    </header>
  );
}
