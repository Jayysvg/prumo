import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CRMApp } from '@/components/layout/crm-app';
import { TooltipProvider } from '@/components/ui/tooltip';
import '@/app/globals.css';
import './static.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <CRMApp />
    </TooltipProvider>
  </StrictMode>,
);
