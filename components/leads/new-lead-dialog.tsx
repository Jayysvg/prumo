'use client';

import { useState } from 'react';
import type { LeadStatus } from '@/types/crm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export type LeadDraft = { name: string; company: string; email: string; phone: string; value: string; status: LeadStatus; source: string; notes: string; nextActionAt: string };
const empty: LeadDraft = { name: '', company: '', email: '', phone: '', value: '', status: 'Novo', source: '', notes: '', nextActionAt: '' };

export function NewLeadDialog({ open, onOpenChange, onCreate, initialDraft }: { open: boolean; onOpenChange: (value: boolean) => void; onCreate: (draft: LeadDraft) => Promise<void>; initialDraft?: Partial<LeadDraft> }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && <LeadForm key={`${initialDraft?.name ?? ''}-${initialDraft?.company ?? ''}`} initialDraft={initialDraft} onClose={() => onOpenChange(false)} onCreate={onCreate} />}
    </Dialog>
  );
}

function LeadForm({ initialDraft, onClose, onCreate }: { initialDraft?: Partial<LeadDraft>; onClose: () => void; onCreate: (draft: LeadDraft) => Promise<void> }) {
  const [form, setForm] = useState<LeadDraft>(() => ({ ...empty, ...initialDraft }));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const set = (key: keyof LeadDraft, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.company.trim()) return;
    setPending(true); setError('');
    try { await onCreate(form); onClose(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Não foi possível adicionar o lead.'); }
    finally { setPending(false); }
  };

  return (
    <DialogContent className="max-h-[92vh] overflow-y-auto rounded-[15px] border-[var(--line)] bg-[var(--surface-raised)] shadow-2xl sm:max-w-[620px]">
      <form onSubmit={submit}>
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2"><span className="size-1.5 rounded-full bg-[var(--brand-lime)] ring-4 ring-[var(--brand-lime-soft)]" /><span className="text-[10px] font-semibold uppercase tracking-[.14em] text-[var(--text-faint)]">Nova oportunidade</span></div>
          <DialogTitle className="text-xl tracking-[-.03em] text-[var(--text-strong)]">Adicionar novo lead</DialogTitle>
          <DialogDescription className="text-[var(--text-soft)]">Registre uma nova oportunidade no pipeline comercial.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-5 sm:grid-cols-2">
          <Field label="Nome *"><Input className="premium-input" required value={form.name} onChange={(event) => set('name', event.target.value)} placeholder="Nome completo" /></Field>
          <Field label="Empresa *"><Input className="premium-input" required value={form.company} onChange={(event) => set('company', event.target.value)} placeholder="Nome da empresa" /></Field>
          <Field label="Email"><Input className="premium-input" type="email" value={form.email} onChange={(event) => set('email', event.target.value)} placeholder="nome@empresa.com" /></Field>
          <Field label="Telefone"><Input className="premium-input" value={form.phone} onChange={(event) => set('phone', event.target.value)} placeholder="(00) 00000-0000" /></Field>
          <Field label="Valor estimado"><Input className="premium-input" type="number" min="0" value={form.value} onChange={(event) => set('value', event.target.value)} placeholder="R$ 0" /></Field>
          <Field label="Status">
            <Select value={form.status} onValueChange={(value) => value && set('status', value as LeadStatus)}><SelectTrigger className="premium-input w-full"><SelectValue /></SelectTrigger><SelectContent>{['Novo','Contato','Negociação','Fechado','Perdido'].map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select>
          </Field>
          <Field label="Origem"><Input className="premium-input" value={form.source} onChange={(event) => set('source', event.target.value)} placeholder="Indicação, site, evento..." /></Field>
          <Field label="Próxima ação"><Input className="premium-input" type="datetime-local" value={form.nextActionAt} onChange={(event) => set('nextActionAt', event.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label="Observações"><Textarea value={form.notes} onChange={(event) => set('notes', event.target.value)} placeholder="Contexto, necessidades e próximos passos..." className="premium-input min-h-24" /></Field></div>
        </div>
        {error && <p role="alert" className="mb-4 text-sm text-red-600 dark:text-red-300">{error}</p>}
        <DialogFooter className="border-t border-[var(--line-soft)] pt-4">
          <Button type="button" variant="outline" className="control-button" onClick={onClose} disabled={pending}>Cancelar</Button>
          <Button disabled={pending} className="bg-[var(--brand-deep)] text-white hover:opacity-90 dark:text-[#13231f]">{pending ? 'Salvando...' : 'Adicionar lead'}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-2"><span className="block text-xs font-medium text-[var(--text-soft)]">{label}</span>{children}</label>;
}
