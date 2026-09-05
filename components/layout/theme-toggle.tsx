'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ThemeToggle() {
  const toggle = () => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.style.colorScheme = next;
    localStorage.setItem('flowdesk-theme', next);
  };

  return (
    <Tooltip>
      <TooltipTrigger render={<Button onClick={toggle} variant="outline" size="icon" className="control-button" aria-label="Alternar modo claro ou escuro" />}>
        <Moon size={16} className="dark:hidden" />
        <Sun size={16} className="hidden dark:block" />
      </TooltipTrigger>
      <TooltipContent>Alternar tema</TooltipContent>
    </Tooltip>
  );
}
