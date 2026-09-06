'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Bell, ChartNoAxesCombined, CircleUserRound, LayoutDashboard, Menu,
  Plus, Search, Settings, UsersRound,
} from 'lucide-react';
import type { Lead, LeadStatus, SessionUser } from '@/types/crm';
import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { LeadsPage } from '@/components/leads/leads-page';
import { ClientsPage } from '@/components/clients/clients-page';
import { ActivitiesPage } from '@/components/activities/activities-page';
import { NewLeadDialog, type LeadDraft } from '@/components/leads/new-lead-dialog';
import { LeadDetailSheet } from '@/components/leads/lead-detail-sheet';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { useWebMcpCreateLead } from '@/hooks/use-webmcp';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Page = 'Visão geral' | 'Leads' | 'Clientes' | 'Atividades';
const nav = [
  { name: 'Visão geral' as Page, icon: LayoutDashboard },
  { name: 'Leads' as Page, icon: ChartNoAxesCombined },
  { name: 'Clientes' as Page, icon: UsersRound },
  { name: 'Atividades' as Page, icon: CircleUserRound },
];

export function CRMApp() {
  const [page, setPage] = useState<Page>('Visão geral');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [globalQuery, setGlobalQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [session, setSession] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [prefill, setPrefill] = useState<Partial<LeadDraft>>({});
  const startLead = useCallback((input: { name: string; company: string }) => {
    setPrefill(input);
    setModal(true);
  }, []);
  useWebMcpCreateLead(startLead);

  useEffect(() => {
    Promise.all([fetch('/api/leads'), fetch('/api/session')]).then(async ([leadResponse, sessionResponse]) => {
      if (!leadResponse.ok || !sessionResponse.ok) throw new Error('Não foi possível carregar seu espaço de trabalho.');
      const leadData = await leadResponse.json() as { leads: Lead[] };
      const sessionData = await sessionResponse.json() as SessionUser;
      setLeads(leadData.leads); setSession(sessionData);
    }).catch((reason) => setError(reason instanceof Error ? reason.message : 'Não foi possível carregar os dados.')).finally(() => setLoading(false));
  }, []);

  const move = async (id: string, status: LeadStatus) => {
    const previous = leads; setError(null); setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status } : lead));
    try { const response=await fetch(`/api/leads/${id}`,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({status})}); const data=await response.json() as {lead?:Lead;error?:string}; if(!response.ok||!data.lead) throw new Error(data.error||'Não foi possível mover o lead.'); setLeads((current)=>current.map((lead)=>lead.id===id?data.lead!:lead)); setNotice('Etapa atualizada e registrada no histórico.'); }
    catch(reason){ setLeads(previous); setError(reason instanceof Error?reason.message:'Não foi possível mover o lead.'); }
  };
  const create = async (draft: LeadDraft) => {
    setError(null); const response=await fetch('/api/leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(draft)}); const data=await response.json() as {lead?:Lead;error?:string}; if(!response.ok||!data.lead) throw new Error(data.error||'Não foi possível criar o lead.');
    setLeads((current) => [data.lead!, ...current]); setNotice('Lead adicionado ao pipeline.');
    setPage('Leads');
  };
  const update = async (id: string, draft: Partial<LeadDraft>) => { const response=await fetch(`/api/leads/${id}`,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify(draft)}); const data=await response.json() as {lead?:Lead;error?:string}; if(!response.ok||!data.lead) throw new Error(data.error||'Não foi possível salvar as alterações.'); setLeads((current)=>current.map((lead)=>lead.id===id?data.lead!:lead)); setNotice('Alterações salvas.'); return data.lead; };
  const archive = async (id: string) => { const response=await fetch(`/api/leads/${id}`,{method:'DELETE'}); const data=await response.json() as {ok?:boolean;error?:string}; if(!response.ok) throw new Error(data.error||'Não foi possível arquivar o lead.'); setLeads((current)=>current.filter((lead)=>lead.id!==id)); setSelectedLeadId(null); setNotice('Lead arquivado.'); };
  const openNew = () => {
    setPrefill({});
    setModal(true);
  };

  return (
    <main className="app-canvas min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <DesktopSidebar page={page} leadCount={leads.length} session={session} onNavigate={setPage} />
      <section className="min-w-0">
        <AppHeader page={page} leadCount={leads.length} globalQuery={globalQuery} onQueryChange={setGlobalQuery} onNavigate={setPage} onNew={openNew} />
        <div className="mx-auto max-w-[1540px] p-4 sm:p-6 lg:p-8 xl:px-10">
          {(error || notice) && <div aria-live="polite" className={`mb-4 flex items-center justify-between border px-4 py-3 text-sm ${error?'border-red-300/50 bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-200':'border-[var(--line)] bg-[var(--brand-lime-soft)] text-[var(--text-strong)]'}`}><span>{error || notice}</span><button onClick={()=>{setError(null);setNotice(null)}} aria-label="Fechar mensagem">×</button></div>}
          {page === 'Visão geral' && <DashboardPage leads={leads} loading={loading} />}
          {page === 'Leads' && <LeadsPage leads={leads} onMove={move} onOpen={setSelectedLeadId} initialQuery={globalQuery} loading={loading} />}
          {page === 'Clientes' && <ClientsPage />}
          {page === 'Atividades' && <ActivitiesPage />}
        </div>
      </section>
      <NewLeadDialog open={modal} onOpenChange={setModal} onCreate={create} initialDraft={prefill} />
      <LeadDetailSheet leadId={selectedLeadId} onOpenChange={(open)=>!open&&setSelectedLeadId(null)} onUpdate={update} onArchive={archive} />
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

function UserCard({ session }: { session: SessionUser | null }) {
  return (
    <div className="mt-auto">
      <div className="mb-4 border-l-2 border-[var(--brand-lime)] bg-[var(--surface-soft)] p-3">
        <p className="text-xs text-[var(--text-faint)]">Espaço atual</p>
        <p className="mt-1 truncate text-sm font-semibold text-[var(--text-strong)]">{session?.workspaceName || 'Prumo'}</p>
      </div>
      <button className="mb-2 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[var(--text-soft)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"><Settings size={17} />Configurações</button>
      <div className="flex items-center gap-3 border-t border-[var(--line)] px-1 pt-4">
        <div className="grid size-9 place-items-center rounded-[10px] bg-[#d8a3ff] text-xs font-bold text-[#362047]">JM</div>
        <div className="min-w-0"><p className="truncate text-sm font-medium text-[var(--text-strong)]">{session?.name || 'Carregando...'}</p><p className="truncate text-xs text-[var(--text-faint)]">{session?.role === 'member' ? 'Membro' : 'Administrador'}</p></div>
        <span className="ml-auto text-[var(--text-faint)]">•••</span>
      </div>
      <form action="/signout-with-chatgpt" method="get" target="_top" className="mt-3 px-1"><input type="hidden" name="return_to" value="/"/><button type="submit" className="text-xs text-[var(--text-faint)] hover:text-[var(--text-strong)]">Encerrar sessão</button></form>
    </div>
  );
}

function SidebarBody({ page, leadCount, session, onNavigate }: { page: Page; leadCount: number; session: SessionUser | null; onNavigate: (page: Page) => void }) {
  return <><Logo /><NavItems page={page} leadCount={leadCount} onNavigate={onNavigate} /><UserCard session={session} /></>;
}

function DesktopSidebar({ page, leadCount, session, onNavigate }: { page: Page; leadCount: number; session: SessionUser | null; onNavigate: (page: Page) => void }) {
  return <aside className="sticky top-0 hidden h-screen flex-col border-r border-[var(--line)] bg-[var(--surface-raised)] px-4 py-6 lg:flex"><SidebarBody page={page} leadCount={leadCount} session={session} onNavigate={onNavigate} /></aside>;
}

function MobileNav({ page, leadCount, onNavigate }: { page: Page; leadCount: number; onNavigate: (page: Page) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="icon" className="control-button lg:hidden" />}><Menu size={18} /></SheetTrigger>
      <SheetContent side="left" className="flex w-[286px] flex-col border-r border-[var(--line)] bg-[var(--surface-raised)] p-5">
        <SheetTitle className="sr-only">Menu principal</SheetTitle>
        <SidebarBody page={page} leadCount={leadCount} session={null} onNavigate={(next) => { onNavigate(next); setOpen(false); }} />
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
          <DropdownMenuTrigger render={<Button variant="outline" size="icon" className="control-button" aria-label="Notificações" />}><Bell size={16} /></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72"><DropdownMenuLabel>Notificações</DropdownMenuLabel><DropdownMenuSeparator/><p className="px-3 py-4 text-sm text-[var(--text-soft)]">Nenhuma notificação nova.</p></DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={onNew} className="h-9 rounded-md bg-[var(--brand-deep)] px-3 text-sm font-semibold text-white shadow-none hover:opacity-90 dark:text-[#13231f] sm:px-4">
          <Plus size={16} /><span className="hidden sm:inline">Novo lead</span>
        </Button>
      </div>
    </header>
  );
}
