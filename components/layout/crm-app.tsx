'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Page = 'Visão geral' | 'Leads' | 'Clientes' | 'Atividades';
const nav = [
  { name: 'Visão geral' as Page, icon: LayoutDashboard },
  { name: 'Leads' as Page, icon: ChartNoAxesCombined },
  { name: 'Clientes' as Page, icon: UsersRound },
  { name: 'Atividades' as Page, icon: CircleUserRound },
];

export function CRMApp() {
  const [page, setPage] = useState<Page>('Visão geral');
  const [leads, setLeads] = useState(initialLeads);
  const [globalQuery, setGlobalQuery] = useState('');
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
        <AppHeader page={page} leadCount={leads.length} globalQuery={globalQuery} onQueryChange={setGlobalQuery} onNavigate={setPage} onNew={openNew} />
        <div className="mx-auto max-w-[1540px] p-4 sm:p-6 lg:p-8 xl:px-10">
          {page === 'Visão geral' && <DashboardPage />}
          {page === 'Leads' && <LeadsPage leads={leads} onMove={move} initialQuery={globalQuery} />}
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
    <div className="brand-lockup w-fit rounded-md px-1 py-1 dark:px-2 dark:py-1.5">
      <Image
        src="/prumo-logo-primary.png"
        alt="Prumo"
        width={2172}
        height={724}
        className="h-8 w-auto max-w-[154px] object-contain"
      />
    </div>
  );
}

function NavItems({ page, leadCount, onNavigate }: { page: Page; leadCount: number; onNavigate: (page: Page) => void }) {
  return (
    <nav className="mt-10">
      <p className="mb-3 px-3 text-xs font-medium text-[var(--text-faint)]">Área comercial</p>
      <div className="space-y-1">
        {nav.map(({ name, icon: Icon }) => (
          <button key={name} onClick={() => onNavigate(name)} className={`group relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${page === name ? 'bg-[var(--surface-soft)] font-semibold text-[var(--text-strong)]' : 'text-[var(--text-soft)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]'}`}>
            {page === name && <span className="absolute -left-4 h-6 w-[2px] bg-[var(--brand-lime)]" />}
            <Icon size={17} strokeWidth={1.8} className={page === name ? 'text-[var(--success)]' : 'transition'} />
            {name}
            {name === 'Leads' && <span className="ml-auto min-w-6 rounded border border-[var(--line)] bg-[var(--surface-raised)] px-1.5 py-0.5 text-center text-xs text-[var(--text-soft)]">{leadCount}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
}

function UserCard() {
  return (
    <div className="mt-auto">
      <div className="mb-4 border-l-2 border-[var(--brand-lime)] bg-[var(--surface-soft)] p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-[var(--text-soft)]">Meta de setembro</p>
          <span className="text-xs font-semibold text-[var(--success)]">74%</span>
        </div>
        <div className="mt-3 h-1 overflow-hidden bg-[var(--surface-subtle)]"><div className="h-full w-[74%] bg-[var(--brand-lime)]" /></div>
        <div className="mt-2 flex justify-between text-xs"><span className="text-[var(--text-soft)]">R$ 38.750</span><span className="font-medium text-[var(--text-strong)]">de R$ 52 mil</span></div>
      </div>
      <button className="mb-2 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[var(--text-soft)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"><Settings size={17} />Configurações</button>
      <div className="flex items-center gap-3 border-t border-[var(--line)] px-1 pt-4">
        <div className="grid size-9 place-items-center rounded-[10px] bg-[#d8a3ff] text-xs font-bold text-[#362047]">JM</div>
        <div className="min-w-0"><p className="truncate text-sm font-medium text-[var(--text-strong)]">João Martins</p><p className="text-xs text-[var(--text-faint)]">Administrador</p></div>
        <span className="ml-auto text-[var(--text-faint)]">•••</span>
      </div>
    </div>
  );
}

function SidebarBody({ page, leadCount, onNavigate }: { page: Page; leadCount: number; onNavigate: (page: Page) => void }) {
  return <><Logo /><NavItems page={page} leadCount={leadCount} onNavigate={onNavigate} /><UserCard /></>;
}

function DesktopSidebar({ page, leadCount, onNavigate }: { page: Page; leadCount: number; onNavigate: (page: Page) => void }) {
  return <aside className="sticky top-0 hidden h-screen flex-col border-r border-[var(--line)] bg-[var(--surface-raised)] px-4 py-6 lg:flex"><SidebarBody page={page} leadCount={leadCount} onNavigate={onNavigate} /></aside>;
}

function MobileNav({ page, leadCount, onNavigate }: { page: Page; leadCount: number; onNavigate: (page: Page) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="icon" className="control-button lg:hidden" />}><Menu size={18} /></SheetTrigger>
      <SheetContent side="left" className="flex w-[286px] flex-col border-r border-[var(--line)] bg-[var(--surface-raised)] p-5">
        <SheetTitle className="sr-only">Menu principal</SheetTitle>
        <SidebarBody page={page} leadCount={leadCount} onNavigate={(next) => { onNavigate(next); setOpen(false); }} />
      </SheetContent>
    </Sheet>
  );
}

function AppHeader({ page, leadCount, globalQuery, onQueryChange, onNavigate, onNew }: { page: Page; leadCount: number; globalQuery: string; onQueryChange: (query: string) => void; onNavigate: (page: Page) => void; onNew: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[var(--line)] bg-[color:var(--surface-raised)]/92 px-4 backdrop-blur-xl sm:px-6 lg:px-8 xl:px-10">
      <div className="flex items-center gap-3">
        <MobileNav page={page} leadCount={leadCount} onNavigate={onNavigate} />
        <div className="flex items-center gap-2 text-sm">
          <span className="hidden text-[var(--text-faint)] sm:inline">Prumo</span>
          <span className="hidden text-[var(--line)] sm:inline">/</span>
          <h1 className="font-semibold tracking-[-.015em] text-[var(--text-strong)]">{page}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <form onSubmit={(event) => { event.preventDefault(); if (globalQuery.trim()) onNavigate('Leads'); }} className="premium-input hidden h-9 items-center gap-2 rounded-md border px-3 text-sm md:flex">
          <Search size={15} />
          <input value={globalQuery} onChange={(event) => onQueryChange(event.target.value)} className="w-36 bg-transparent text-sm outline-none xl:w-52" placeholder="Buscar pessoa ou empresa" />
          <kbd className="rounded border border-[var(--line)] bg-[var(--surface-raised)] px-1.5 py-0.5 text-xs text-[var(--text-faint)]">↵</kbd>
        </form>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="icon" className="control-button relative" aria-label="Notificações" />}><Bell size={16} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#d87a52] ring-2 ring-[var(--surface-raised)]" /></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72"><DropdownMenuLabel>Pendências de hoje</DropdownMenuLabel><DropdownMenuSeparator/><DropdownMenuItem onClick={() => onNavigate('Leads')}>Proposta da Grupo Lumina vence hoje</DropdownMenuItem><DropdownMenuItem onClick={() => onNavigate('Leads')}>Mobi Parts está há 2 dias sem retorno</DropdownMenuItem><DropdownMenuItem onClick={() => onNavigate('Atividades')}>Reunião com Atlas Tech às 15h</DropdownMenuItem></DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={onNew} className="h-9 rounded-md bg-[var(--brand-deep)] px-3 text-sm font-semibold text-white shadow-none hover:opacity-90 dark:text-[#13231f] sm:px-4">
          <Plus size={16} /><span className="hidden sm:inline">Novo lead</span>
        </Button>
      </div>
    </header>
  );
}
