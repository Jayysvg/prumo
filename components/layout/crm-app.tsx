'use client';

import { useEffect, useState } from 'react';
import {
  Bell, ChartNoAxesCombined, CircleUserRound, Info, LayoutDashboard, Menu,
  Plus, RotateCcw, Search, Settings, UsersRound,
} from 'lucide-react';
import type { Activity, Lead, LeadHistory, LeadStatus, SessionUser } from '@/types/crm';
import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { LeadsPage } from '@/components/leads/leads-page';
import { ClientsPage } from '@/components/clients/clients-page';
import { ActivitiesPage } from '@/components/activities/activities-page';
import { ActivityDialog, type ActivityDraft } from '@/components/activities/activity-dialog';
import { NewLeadDialog, type LeadDraft } from '@/components/leads/new-lead-dialog';
import { LeadDetailSheet } from '@/components/leads/lead-detail-sheet';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { createDemoData, DEMO_STORAGE_KEY } from '@/data/demo-data';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';

type Page = 'Visão geral' | 'Leads' | 'Clientes' | 'Atividades' | 'Sobre';
const nav = [
  { name: 'Visão geral' as Page, icon: LayoutDashboard },
  { name: 'Leads' as Page, icon: ChartNoAxesCombined },
  { name: 'Clientes' as Page, icon: UsersRound },
  { name: 'Atividades' as Page, icon: CircleUserRound },
  { name: 'Sobre' as Page, icon: Info },
];

const demoSession: SessionUser = { name: 'Marina Costa', email: 'demo@prumo.exemplo', role: 'admin', workspaceName: 'Demonstração Prumo' };
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;

export function CRMApp() {
  const [page, setPage] = useState<Page>('Visão geral');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [history, setHistory] = useState<Record<string, LeadHistory[]>>({});
  const [globalQuery, setGlobalQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [session] = useState<SessionUser>(demoSession);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activityModal, setActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activityLeadId, setActivityLeadId] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<Partial<LeadDraft>>({});
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DEMO_STORAGE_KEY);
      const data = saved ? JSON.parse(saved) as ReturnType<typeof createDemoData> : createDemoData();
      setLeads(data.leads); setActivities(data.activities); setHistory(data.history);
    } catch { const data=createDemoData(); setLeads(data.leads); setActivities(data.activities); setHistory(data.history); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (!loading) localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({leads,activities,history})); }, [leads,activities,history,loading]);

  const move = async (id: string, status: LeadStatus) => {
    const currentLead=leads.find((lead)=>lead.id===id); if(!currentLead||currentLead.status===status)return;
    setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status, updatedAt:new Date().toISOString(), lastContact:'Agora' } : lead));
    setHistory((current)=>({...current,[id]:[{id:makeId('history'),type:'stage_changed',previousStage:currentLead.status,newStage:status,description:`Etapa alterada para ${status}.`,createdAt:new Date().toISOString(),authorName:demoSession.name},...(current[id]||[])]}));
    setNotice('Etapa atualizada nesta demonstração.');
  };
  const create = async (draft: LeadDraft) => {
    const now=new Date().toISOString(); const id=makeId('lead'); const lead:Lead={id,name:draft.name.trim(),company:draft.company.trim(),email:draft.email.trim(),phone:draft.phone.trim(),value:Number(draft.value)||0,lastContact:'Agora',owner:{id:'demo-user',name:'Marina Costa',initials:'MC',color:'#d8a3ff'},status:draft.status,tags:draft.source?[draft.source]:[],source:draft.source,notes:draft.notes,nextActionAt:draft.nextActionAt?new Date(draft.nextActionAt).toISOString():null,createdAt:now,updatedAt:now};
    setLeads((current) => [lead, ...current]); setHistory((current)=>({...current,[id]:[{id:makeId('history'),type:'created',previousStage:null,newStage:draft.status,description:'Lead adicionado ao pipeline.',createdAt:now,authorName:demoSession.name}]})); setNotice('Lead adicionado à demonstração.');
    setPage('Leads');
  };
  const update = async (id: string, draft: Partial<LeadDraft>) => { let updated:Lead|undefined; setLeads((current)=>current.map((lead)=>{if(lead.id!==id)return lead; updated={...lead,...draft,value:draft.value===undefined?lead.value:Number(draft.value)||0,nextActionAt:draft.nextActionAt===undefined?lead.nextActionAt:(draft.nextActionAt?new Date(draft.nextActionAt).toISOString():null),updatedAt:new Date().toISOString(),lastContact:'Agora'} as Lead;return updated;})); if(!updated)throw new Error('Lead não encontrado.'); setHistory((current)=>({...current,[id]:[{id:makeId('history'),type:'updated',previousStage:null,newStage:null,description:'Dados do lead atualizados.',createdAt:new Date().toISOString(),authorName:demoSession.name},...(current[id]||[])]})); setNotice('Alterações salvas na demonstração.'); return updated; };
  const archive = async (id: string) => { setLeads((current)=>current.filter((lead)=>lead.id!==id)); setActivities((current)=>current.filter((activity)=>activity.leadId!==id)); setSelectedLeadId(null); setNotice('Lead removido da demonstração.'); };
  const openNew = () => {
    setPrefill({});
    setModal(true);
  };
  const openNewActivity = (leadId?:string) => { setEditingActivity(null); setActivityLeadId(leadId||null); setActivityModal(true); };
  const openEditActivity = (activity:Activity) => { setEditingActivity(activity); setActivityLeadId(activity.leadId); setActivityModal(true); };
  const saveActivity = async (draft:ActivityDraft,id?:string) => { const lead=leads.find((item)=>item.id===draft.leadId);if(!lead)throw new Error('Selecione um lead válido.');const now=new Date().toISOString();const activity:Activity={id:id||makeId('activity'),leadId:lead.id,leadName:lead.name,leadCompany:lead.company,type:draft.type,title:draft.title,description:draft.description,scheduledAt:draft.scheduledAt,status:draft.status,completedAt:draft.status==='completed'?now:null,createdAt:now,updatedAt:now};setActivities((current)=>id?current.map((item)=>item.id===id?{...activity,createdAt:item.createdAt}:item):[activity,...current]);setLeads((current)=>current.map((item)=>item.id===lead.id?{...item,nextActionAt:draft.status==='pending'?draft.scheduledAt:item.nextActionAt,updatedAt:now}:item));setNotice(id?'Atividade atualizada.':'Atividade criada na demonstração.'); };
  const toggleActivity = async (activity:Activity) => { await saveActivity({leadId:activity.leadId,type:activity.type,title:activity.title,description:activity.description,scheduledAt:activity.scheduledAt,status:activity.status==='pending'?'completed':'pending'},activity.id); };
  const deleteActivity = async (id:string) => { setActivities((current)=>current.filter((item)=>item.id!==id));setNotice('Atividade excluída da demonstração.'); };
  const resetDemo = () => { const data=createDemoData();setLeads(data.leads);setActivities(data.activities);setHistory(data.history);setPage('Visão geral');setSelectedLeadId(null);setNotice('Demonstração restaurada com os dados originais.'); };

  return (
    <main className="app-canvas min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <DesktopSidebar page={page} leadCount={leads.length} session={session} onNavigate={setPage} onSettings={() => setSettingsOpen(true)} onReset={resetDemo} />
      <section className="min-w-0">
        <AppHeader page={page} leadCount={leads.length} activities={activities} globalQuery={globalQuery} onQueryChange={setGlobalQuery} onNavigate={setPage} onNew={openNew} onSettings={() => setSettingsOpen(true)} onReset={resetDemo} onOpenLead={setSelectedLeadId} />
        <div className="mx-auto max-w-[1540px] p-4 sm:p-6 lg:p-8 xl:px-10">
          {(error || notice) && <div aria-live="polite" className={`mb-4 flex items-center justify-between border px-4 py-3 text-sm ${error?'border-red-300/50 bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-200':'border-[var(--line)] bg-[var(--brand-lime-soft)] text-[var(--text-strong)]'}`}><span>{error || notice}</span><button onClick={()=>{setError(null);setNotice(null)}} aria-label="Fechar mensagem">×</button></div>}
          {page === 'Visão geral' && <DashboardPage leads={leads} loading={loading} />}
          {page === 'Leads' && <LeadsPage leads={leads} onMove={move} onOpen={setSelectedLeadId} initialQuery={globalQuery} loading={loading} />}
          {page === 'Clientes' && <ClientsPage leads={leads} />}
          {page === 'Atividades' && <ActivitiesPage activities={activities} leads={leads} loading={loading} onNew={()=>openNewActivity()} onEdit={openEditActivity} onToggle={toggleActivity} onDelete={deleteActivity} onOpenLead={setSelectedLeadId} />}
          {page === 'Sobre' && <AboutPage />}
        </div>
      </section>
      <NewLeadDialog open={modal} onOpenChange={setModal} onCreate={create} initialDraft={prefill} />
      <LeadDetailSheet leadId={selectedLeadId} initialLead={leads.find((lead)=>lead.id===selectedLeadId)} initialHistory={selectedLeadId?history[selectedLeadId]:[]} demo nextActionAt={leads.find((lead)=>lead.id===selectedLeadId)?.nextActionAt} activities={activities.filter((activity)=>activity.leadId===selectedLeadId)} onOpenChange={(open)=>!open&&setSelectedLeadId(null)} onUpdate={update} onArchive={archive} onNewActivity={()=>selectedLeadId&&openNewActivity(selectedLeadId)} onEditActivity={openEditActivity} onToggleActivity={toggleActivity} onDeleteActivity={deleteActivity} />
      <ActivityDialog open={activityModal} onOpenChange={setActivityModal} leads={leads} activity={editingActivity} initialLeadId={activityLeadId} onSave={saveActivity} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} session={session} />
    </main>
  );
}

function Logo() {
  return (
    <div className="brand-lockup w-fit rounded-md px-1 py-1 dark:px-2 dark:py-1.5">
      <img
        src={`${import.meta.env.BASE_URL || '/'}prumo-logo-primary.png`}
        alt="Prumo"
        width="2172"
        height="724"
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

function UserCard({ session, onSettings, onReset }: { session: SessionUser | null; onSettings: () => void; onReset: () => void }) {
  return (
    <div className="mt-auto">
      <div className="mb-4 border-l-2 border-[var(--brand-lime)] bg-[var(--surface-soft)] p-3">
        <p className="text-xs text-[var(--text-faint)]">Espaço atual</p>
        <p className="mt-1 truncate text-sm font-semibold text-[var(--text-strong)]">{session?.workspaceName || 'Prumo'}</p>
      </div>
      <button onClick={onSettings} className="mb-2 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[var(--text-soft)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"><Settings size={17} />Configurações</button>
      <button onClick={onReset} className="mb-3 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[var(--text-soft)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"><RotateCcw size={17} />Restaurar demonstração</button>
      <div className="flex items-center gap-3 border-t border-[var(--line)] px-1 pt-4">
        <div className="grid size-9 place-items-center rounded-[10px] bg-[#d8a3ff] text-xs font-bold text-[#362047]">JM</div>
        <div className="min-w-0"><p className="truncate text-sm font-medium text-[var(--text-strong)]">{session?.name || 'Carregando...'}</p><p className="truncate text-xs text-[var(--text-faint)]">{session?.role === 'member' ? 'Membro' : 'Administrador'}</p></div>
        <span className="ml-auto text-[var(--text-faint)]">•••</span>
      </div>
      <p className="mt-3 px-1 text-xs leading-relaxed text-[var(--text-faint)]">Ambiente público com dados fictícios salvos somente neste navegador.</p>
    </div>
  );
}

function SidebarBody({ page, leadCount, session, onNavigate, onSettings, onReset }: { page: Page; leadCount: number; session: SessionUser | null; onNavigate: (page: Page) => void; onSettings: () => void; onReset: () => void }) {
  return <><div className="flex items-center justify-between gap-2"><Logo /><span className="rounded-full border border-[var(--line)] bg-[var(--brand-lime-soft)] px-2 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-[var(--success)]">Demo</span></div><NavItems page={page} leadCount={leadCount} onNavigate={onNavigate} /><UserCard session={session} onSettings={onSettings} onReset={onReset} /></>;
}

function DesktopSidebar({ page, leadCount, session, onNavigate, onSettings, onReset }: { page: Page; leadCount: number; session: SessionUser | null; onNavigate: (page: Page) => void; onSettings: () => void; onReset: () => void }) {
  return <aside className="sticky top-0 hidden h-screen flex-col border-r border-[var(--line)] bg-[var(--surface-raised)] px-4 py-6 lg:flex"><SidebarBody page={page} leadCount={leadCount} session={session} onNavigate={onNavigate} onSettings={onSettings} onReset={onReset} /></aside>;
}

function MobileNav({ page, leadCount, onNavigate, onSettings, onReset }: { page: Page; leadCount: number; onNavigate: (page: Page) => void; onSettings: () => void; onReset: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="icon" className="control-button lg:hidden" />}><Menu size={18} /></SheetTrigger>
      <SheetContent side="left" className="flex w-[286px] flex-col border-r border-[var(--line)] bg-[var(--surface-raised)] p-5">
        <SheetTitle className="sr-only">Menu principal</SheetTitle>
        <SidebarBody page={page} leadCount={leadCount} session={demoSession} onNavigate={(next) => { onNavigate(next); setOpen(false); }} onSettings={() => { setOpen(false); onSettings(); }} onReset={() => { onReset(); setOpen(false); }} />
      </SheetContent>
    </Sheet>
  );
}

function AppHeader({ page, leadCount, activities, globalQuery, onQueryChange, onNavigate, onNew, onSettings, onReset, onOpenLead }: { page: Page; leadCount: number; activities:Activity[]; globalQuery: string; onQueryChange: (query: string) => void; onNavigate: (page: Page) => void; onNew: () => void; onSettings: () => void; onReset: () => void; onOpenLead:(id:string)=>void }) {
  const [now]=useState(()=>Date.now());const nextDay=now+86400000;const notifications=activities.filter((activity)=>activity.status==='pending'&&new Date(activity.scheduledAt).getTime()<=nextDay).sort((a,b)=>a.scheduledAt.localeCompare(b.scheduledAt));
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[var(--line)] bg-[color:var(--surface-raised)]/92 px-4 backdrop-blur-xl sm:px-6 lg:px-8 xl:px-10">
      <div className="flex items-center gap-3">
        <MobileNav page={page} leadCount={leadCount} onNavigate={onNavigate} onSettings={onSettings} onReset={onReset} />
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

function AboutPage() {
  return <div className="mx-auto max-w-4xl"><header className="prumo-guide mb-7 pl-4"><p className="text-sm font-medium text-[var(--success)]">Projeto de portfólio</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.04em] text-[var(--text-strong)] sm:text-4xl">Um CRM direto ao ponto para conduzir oportunidades.</h2><p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-soft)]">O Prumo transforma contatos dispersos em um pipeline visual, com contexto, agenda e indicadores comerciais em um só lugar.</p></header><div className="grid gap-4 md:grid-cols-3"><AboutCard title="Pipeline visual" text="Organize oportunidades por etapa e mova cada lead conforme a negociação avança."/><AboutCard title="Agenda integrada" text="Crie ligações, reuniões, emails e tarefas vinculadas ao contato certo."/><AboutCard title="Visão gerencial" text="Acompanhe valor em aberto, conversão, prioridades e negócios conquistados."/></div><section className="card-surface mt-4 p-6 sm:p-8"><h3 className="text-lg font-semibold text-[var(--text-strong)]">Sobre esta demonstração</h3><p className="mt-3 leading-relaxed text-[var(--text-soft)]">Todos os nomes, empresas, emails e valores exibidos aqui são fictícios. As alterações ficam apenas no seu navegador e podem ser desfeitas a qualquer momento em <strong className="text-[var(--text-strong)]">Restaurar demonstração</strong>.</p><p className="mt-3 text-sm text-[var(--text-faint)]">Construído com TypeScript, React, Vinext, Tailwind CSS e componentes acessíveis.</p></section></div>;
}

function AboutCard({title,text}:{title:string;text:string}){return <article className="card-surface p-5 sm:p-6"><div className="mb-4 h-1 w-10 bg-[var(--brand-lime)]"/><h3 className="font-semibold text-[var(--text-strong)]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">{text}</p></article>}
