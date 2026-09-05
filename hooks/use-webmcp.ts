'use client';
import { useEffect } from 'react';

type Context={registerTool:(tool:{name:string;title:string;description:string;inputSchema:object;annotations:object;execute:(input:unknown)=>unknown},options:{signal:AbortSignal})=>void|Promise<void>};
declare global { interface Document { modelContext?: Context } }

export function useWebMcpCreateLead(onStart:(input:{name:string;company:string})=>void){useEffect(()=>{const context=document.modelContext;if(!context?.registerTool)return;const lifecycle=new AbortController();void Promise.resolve(context.registerTool({name:'start_lead_creation',title:'Iniciar cadastro de lead',description:'Abre e preenche o cadastro de um novo lead no FlowDesk.',inputSchema:{type:'object',properties:{name:{type:'string'},company:{type:'string'}},required:['name','company'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){const value=input as {name?:string;company?:string};if(!value?.name?.trim()||!value?.company?.trim())throw new Error('Nome e empresa são obrigatórios.');onStart({name:value.name,company:value.company});return {status:'form_opened',name:value.name,company:value.company}}},{signal:lifecycle.signal})).catch(()=>{});return()=>lifecycle.abort()},[onStart])}
