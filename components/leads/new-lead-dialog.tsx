'use client';

import { useState } from 'react';
import type { Lead, LeadStatus } from '@/types/crm';
import { users } from '@/data/leads';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export type LeadDraft = { name: string; company: string; email: string; phone: string; value: string; status: LeadStatus; ownerId: string; notes: string };
const empty: LeadDraft = { name: '', company: '', email: '', phone: '', value: '', status: 'Novo', ownerId: 'João Martins', notes: '' };

export function NewLeadDialog({ open, onOpenChange, onCreate, initialDraft }: { open: boolean; onOpenChange: (value: boolean) => void; onCreate: (lead: Lead) => void; initialDraft?: Partial<LeadDraft> }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && <LeadForm key={`${initialDraft?.name ?? ''}-${initialDraft?.company ?? ''}`} initialDraft={initialDraft} onClose={() => onOpenChange(false)} onCreate={onCreate} />}
    </Dialog>
  );
}

function LeadForm({ initialDraft, onClose, onCreate }: { initialDraft?: Partial<LeadDraft>; onClose: () => void; onCreate: (lead: Lead) => void }) {
  const [form, setForm] = useState<LeadDraft>(() => ({ ...empty, ...initialDraft }));
  const set = (key: keyof LeadDraft, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.company.trim()) return;
    onCreate({
      id: `l-${Date.now()}`, name: form.name, company: form.company, email: form.email,
      phone: form.phone, value: Number(form.value) || 0, lastContact: 'Agora',
      owner: users.find((user) => user.name === form.ownerId) ?? users[0],
      status: form.status, tags: ['Novo'], notes: form.notes,
    });
    onClose();
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
          <Field label="Responsável">
            <Select value={form.ownerId} onValueChange={(value) => value && set('ownerId', value)}><SelectTrigger className="premium-input w-full"><SelectValue /></SelectTrigger><SelectContent>{users.map((user) => <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>)}</SelectContent></Select>
          </Field>
          <div className="sm:col-span-2"><Field label="Observações"><Textarea value={form.notes} onChange={(event) => set('notes', event.target.value)} placeholder="Contexto, necessidades e próximos passos..." className="premium-input min-h-24" /></Field></div>
        </div>
        <DialogFooter className="border-t border-[var(--line-soft)] pt-4">
          <Button type="button" variant="outline" className="control-button" onClick={onClose}>Cancelar</Button>
          <Button className="bg-[var(--brand-deep)] text-white hover:opacity-90 dark:text-[#13231f]">Adicionar lead</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-2"><span className="block text-xs font-medium text-[var(--text-soft)]">{label}</span>{children}</label>;
}
