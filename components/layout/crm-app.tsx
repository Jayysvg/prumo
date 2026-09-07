'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Bell, ChartNoAxesCombined, CircleUserRound, LayoutDashboard, Menu,
  Plus, Search, Settings, UsersRound,
} from 'lucide-react';
import type { Activity, Lead, LeadStatus, SessionUser } from '@/types/crm';
import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { LeadsPage } from '@/components/leads/leads-page';
import { ClientsPage } from '@/components/clients/clients-page';
import { ActivitiesPage } from '@/components/activities/activities-page';
import { ActivityDialog, type ActivityDraft } from '@/components/activities/activity-dialog';
import { NewLeadDialog, type LeadDraft } from '@/components/leads/new-lead-dialog';
import { LeadDetailSheet } from '@/components/leads/lead-detail-sheet';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { useWebMcpCreateLead } from '@/hooks/use-webmcp';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [globalQuery, setGlobalQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [session, setSession] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activityModal, setActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activityLeadId, setActivityLeadId] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<Partial<LeadDraft>>({});
  const startLead = useCallback((input: { name: string; company: string }) => {
    setPrefill(input);
    setModal(true);
  }, []);
  useWebMcpCreateLead(startLead);

  useEffect(() => {
    Promise.all([fetch('/api/leads'), fetch('/api/activities'), fetch('/api/session')]).then(async ([leadResponse, activityResponse, sessionResponse]) => {
      if (!leadResponse.ok || !activityResponse.ok || !sessionResponse.ok) throw new Error('Não foi possível carregar seu espaço de trabalho.');
      const leadData = await leadResponse.json() as { leads: Lead[] };
      const activityData = await activityResponse.json() as { activities: Activity[] };
      const sessionData = await sessionResponse.json() as SessionUser;
      setLeads(leadData.leads); setActivities(activityData.activities); setSession(sessionData);
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
  const refreshLeads = async () => { const response=await fetch('/api/leads'); if(response.ok){const data=await response.json() as {leads:Lead[]};setLeads(data.leads);} };
  const openNewActivity = (leadId?:string) => { setEditingActivity(null); setActivityLeadId(leadId||null); setActivityModal(true); };
  const openEditActivity = (activity:Activity) => { setEditingActivity(activity); setActivityLeadId(activity.leadId); setActivityModal(true); };
  const saveActivity = async (draft:ActivityDraft,id?:string) => { const response=await fetch(id?`/api/activities/${id}`:'/api/activities',{method:id?'PATCH':'POST',headers:{'content-type':'application/json'},body:JSON.stringify(draft)});const data=await response.json() as {activity?:Activity;error?:string};if(!response.ok||!data.activity)throw new Error(data.error||'Não foi possível salvar a atividade.');setActivities((current)=>id?current.map((item)=>item.id===id?data.activity!:item):[data.activity!,...current]);await refreshLeads();setNotice(id?'Atividade atualizada.':'Atividade criada e adicionada à agenda.'); };
  const toggleActivity = async (activity:Activity) => { await saveActivity({leadId:activity.leadId,type:activity.type,title:activity.title,description:activity.description,scheduledAt:activity.scheduledAt,status:activity.status==='pending'?'completed':'pending'},activity.id); };
  const deleteActivity = async (id:string) => { const response=await fetch(`/api/activities/${id}`,{method:'DELETE'});const data=await response.json() as {ok?:boolean;error?:string};if(!response.ok)throw new Error(data.error||'Não foi possível excluir a atividade.');setActivities((current)=>current.filter((item)=>item.id!==id));await refreshLeads();setNotice('Atividade excluída.'); };

  return (
    <main className="app-canvas min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <DesktopSidebar page={page} leadCount={leads.length} session={session} onNavigate={setPage} onSettings={() => setSettingsOpen(true)} />
      <section className="min-w-0">
        <AppHeader page={page} leadCount={leads.length} activities={activities} globalQuery={globalQuery} onQueryChange={setGlobalQuery} onNavigate={setPage} onNew={openNew} onSettings={() => setSettingsOpen(true)} onOpenLead={setSelectedLeadId} />
        <div className="mx-auto max-w-[1540px] p-4 sm:p-6 lg:p-8 xl:px-10">
          {(error || notice) && <div aria-live="polite" className={`mb-4 flex items-center justify-between border px-4 py-3 text-sm ${error?'border-red-300/50 bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-200':'border-[var(--line)] bg-[var(--brand-lime-soft)] text-[var(--text-strong)]'}`}><span>{error || notice}</span><button onClick={()=>{setError(null);setNotice(null)}} aria-label="Fechar mensagem">×</button></div>}
          {page === 'Visão geral' && <DashboardPage leads={leads} loading={loading} />}
          {page === 'Leads' && <LeadsPage leads={leads} onMove={move} onOpen={setSelectedLeadId} initialQuery={globalQuery} loading={loading} />}
          {page === 'Clientes' && <ClientsPage />}
          {page === 'Atividades' && <ActivitiesPage activities={activities} leads={leads} loading={loading} onNew={()=>openNewActivity()} onEdit={openEditActivity} onToggle={toggleActivity} onDelete={deleteActivity} onOpenLead={setSelectedLeadId} />}
        </div>
      </section>
      <NewLeadDialog open={modal} onOpenChange={setModal} onCreate={create} initialDraft={prefill} />
      <LeadDetailSheet leadId={selectedLeadId} nextActionAt={leads.find((lead)=>lead.id===selectedLeadId)?.nextActionAt} activities={activities.filter((activity)=>activity.leadId===selectedLeadId)} onOpenChange={(open)=>!open&&setSelectedLeadId(null)} onUpdate={update} onArchive={archive} onNewActivity={()=>selectedLeadId&&openNewActivity(selectedLeadId)} onEditActivity={openEditActivity} onToggleActivity={toggleActivity} onDeleteActivity={deleteActivity} />
      <ActivityDialog open={activityModal} onOpenChange={setActivityModal} leads={leads} activity={editingActivity} initialLeadId={activityLeadId} onSave={saveActivity} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} session={session} />
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

function UserCard({ session, onSettings }: { session: SessionUser | null; onSettings: () => void }) {
  return (
    <div className="mt-auto">
      <div className="mb-4 border-l-2 border-[var(--brand-lime)] bg-[var(--surface-soft)] p-3">
        <p className="text-xs text-[var(--text-faint)]">Espaço atual</p>
        <p className="mt-1 truncate text-sm font-semibold text-[var(--text-strong)]">{session?.workspaceName || 'Prumo'}</p>
      </div>
      <button onClick={onSettings} className="mb-2 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[var(--text-soft)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"><Settings size={17} />Configurações</button>
      <div className="flex items-center gap-3 border-t border-[var(--line)] px-1 pt-4">
        <div className="grid size-9 place-items-center rounded-[10px] bg-[#d8a3ff] text-xs font-bold text-[#362047]">JM</div>
        <div className="min-w-0"><p className="truncate text-sm font-medium text-[var(--text-strong)]">{session?.name || 'Carregando...'}</p><p className="truncate text-xs text-[var(--text-faint)]">{session?.role === 'member' ? 'Membro' : 'Administrador'}</p></div>
        <span className="ml-auto text-[var(--text-faint)]">•••</span>
      </div>
      <form action="/signout-with-chatgpt" method="get" target="_top" className="mt-3 px-1"><input type="hidden" name="return_to" value="/"/><button type="submit" className="text-xs text-[var(--text-faint)] hover:text-[var(--text-strong)]">Encerrar sessão</button></form>
    </div>
  );
}

function SidebarBody({ page, leadCount, session, onNavigate, onSettings }: { page: Page; leadCount: number; session: SessionUser | null; onNavigate: (page: Page) => void; onSettings: () => void }) {
  return <><Logo /><NavItems page={page} leadCount={leadCount} onNavigate={onNavigate} /><UserCard session={session} onSettings={onSettings} /></>;
}

function DesktopSidebar({ page, leadCount, session, onNavigate, onSettings }: { page: Page; leadCount: number; session: SessionUser | null; onNavigate: (page: Page) => void; onSettings: () => void }) {
  return <aside className="sticky top-0 hidden h-screen flex-col border-r border-[var(--line)] bg-[var(--surface-raised)] px-4 py-6 lg:flex"><SidebarBody page={page} leadCount={leadCount} session={session} onNavigate={onNavigate} onSettings={onSettings} /></aside>;
}

function MobileNav({ page, leadCount, onNavigate, onSettings }: { page: Page; leadCount: number; onNavigate: (page: Page) => void; onSettings: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="icon" className="control-button lg:hidden" />}><Menu size={18} /></SheetTrigger>
      <SheetContent side="left" className="flex w-[286px] flex-col border-r border-[var(--line)] bg-[var(--surface-raised)] p-5">
        <SheetTitle className="sr-only">Menu principal</SheetTitle>
        <SidebarBody page={page} leadCount={leadCount} session={null} onNavigate={(next) => { onNavigate(next); setOpen(false); }} onSettings={() => { setOpen(false); onSettings(); }} />
      </SheetContent>
    </Sheet>
  );
}

function AppHeader({ page, leadCount, activities, globalQuery, onQueryChange, onNavigate, onNew, onSettings, onOpenLead }: { page: Page; leadCount: number; activities:Activity[]; globalQuery: string; onQueryChange: (query: string) => void; onNavigate: (page: Page) => void; onNew: () => void; onSettings: () => void; onOpenLead:(id:string)=>void }) {
  const [now]=useState(()=>Date.now());const nextDay=now+86400000;const notifications=activities.filter((activity)=>activity.status==='pending'&&new Date(activity.scheduledAt).getTime()<=nextDay).sort((a,b)=>a.scheduledAt.localeCompare(b.scheduledAt));
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[var(--line)] bg-[color:var(--surface-raised)]/92 px-4 backdrop-blur-xl sm:px-6 lg:px-8 xl:px-10">
      <div className="flex items-center gap-3">
        <MobileNav page={page} leadCount={leadCount} onNavigate={onNavigate} onSettings={onSettings} />
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
        <Popover>
          <PopoverTrigger render={<Button variant="outline" size="icon" className="control-button relative" aria-label={`Notificações${notifications.length?` (${notifications.length} pendentes)`:''}`} />}><Bell size={16} />{notifications.length>0&&<span className="absolute right-1 top-1 size-2 rounded-full bg-red-500 ring-2 ring-[var(--surface-raised)]"/>}</PopoverTrigger>
          <PopoverContent align="end" className="w-80 border border-[var(--line)] bg-[var(--surface-raised)] p-0">
            <PopoverHeader>
              <div className="border-b border-[var(--line-soft)] px-4 py-3"><PopoverTitle className="text-[var(--text-strong)]">Notificações</PopoverTitle><PopoverDescription className="text-[var(--text-soft)]">Acompanhamentos para as próximas 24 horas.</PopoverDescription></div>
              {notifications.length===0?<p className="px-4 py-5 text-sm text-[var(--text-soft)]">Nenhuma notificação nova.</p>:<div className="max-h-80 divide-y divide-[var(--line-soft)] overflow-y-auto">{notifications.map((activity)=>{const overdue=new Date(activity.scheduledAt).getTime()<now;return <button key={activity.id} onClick={()=>onOpenLead(activity.leadId)} className="block w-full px-4 py-3 text-left hover:bg-[var(--surface-soft)]"><span className="block text-sm font-semibold text-[var(--text-strong)]">{activity.title}</span><span className="mt-1 block text-xs text-[var(--text-soft)]">{activity.leadName} · {overdue?'Atrasada':new Date(activity.scheduledAt).toLocaleString('pt-BR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</span></button>})}</div>}
            </PopoverHeader>
          </PopoverContent>
        </Popover>
        <Button onClick={onNew} className="h-9 rounded-md bg-[var(--brand-deep)] px-3 text-sm font-semibold text-white shadow-none hover:opacity-90 dark:text-[#13231f] sm:px-4">
          <Plus size={16} /><span className="hidden sm:inline">Novo lead</span>
        </Button>
      </div>
    </header>
  );
}

function SettingsDialog({ open, onOpenChange, session }: { open: boolean; onOpenChange: (open: boolean) => void; session: SessionUser | null }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-[var(--line)] bg-[var(--surface-raised)] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl text-[var(--text-strong)]">Configurações</DialogTitle>
          <DialogDescription className="text-[var(--text-soft)]">Preferências do seu espaço no Prumo.</DialogDescription>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <section className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-strong)]">Aparência</h3>
              <p className="mt-1 text-sm text-[var(--text-soft)]">Alterne entre os modos claro e escuro.</p>
            </div>
            <ThemeToggle />
          </section>
          <section>
            <h3 className="text-sm font-semibold text-[var(--text-strong)]">Seu espaço</h3>
            <dl className="mt-3 grid gap-3 rounded-lg bg-[var(--surface-soft)] p-4 text-sm">
              <div className="flex items-center justify-between gap-4"><dt className="text-[var(--text-faint)]">Nome</dt><dd className="truncate font-medium text-[var(--text-strong)]">{session?.workspaceName || 'Prumo'}</dd></div>
              <div className="flex items-center justify-between gap-4"><dt className="text-[var(--text-faint)]">Usuário</dt><dd className="truncate font-medium text-[var(--text-strong)]">{session?.name || 'Carregando...'}</dd></div>
              <div className="flex items-center justify-between gap-4"><dt className="text-[var(--text-faint)]">Perfil</dt><dd className="font-medium text-[var(--text-strong)]">{session?.role === 'member' ? 'Membro' : 'Administrador'}</dd></div>
            </dl>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
