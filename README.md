# Prumo

![Logo do Prumo](public/prumo-logo-primary.png)

Prumo é um CRM comercial pensado para pequenas equipes acompanharem oportunidades sem perder contexto. O projeto reúne pipeline visual, agenda de atividades, histórico de contatos e indicadores em uma interface responsiva com modos claro e escuro.

## Demonstração

A versão pública utiliza somente dados fictícios e salva alterações no próprio navegador. Ela permite explorar o produto sem cadastro e pode ser restaurada ao estado inicial a qualquer momento.

**Acessar demonstração:** https://jayysvg.github.io/prumo/

## Funcionalidades

- Dashboard com valor em pipeline, receita conquistada, conversão e prioridades
- Pipeline Kanban com movimentação de leads entre etapas
- Cadastro, edição e remoção de oportunidades
- Agenda de ligações, reuniões, emails e tarefas
- Conclusão, reabertura, edição e exclusão de atividades
- Conversão automática de negócios fechados em clientes
- Busca, filtros, notificações e histórico por lead
- Interface responsiva com modos claro e escuro
- Ambiente demonstrativo restaurável com dados fictícios

## Tecnologias

- TypeScript e React
- Vinext e Vite
- Tailwind CSS
- Base UI e componentes acessíveis
- Cloudflare Workers e D1/SQLite na versão completa
- Drizzle ORM para persistência no backend

## Arquitetura

A aplicação é organizada em componentes por domínio — dashboard, leads, clientes e atividades — com tipos compartilhados e uma camada de rotas para acesso aos dados. A versão completa usa autenticação e banco D1. A demonstração pública troca essa camada por estado local persistido no navegador, evitando qualquer exposição de dados reais.

## Executar localmente

Requisitos: Node.js 22.13 ou superior.

```bash
npm install
npm run dev
```

Para verificar uma compilação de produção:

```bash
npm run build
```

### GitHub Pages

A demonstração possui uma compilação estática independente, sem backend e sem dados reais:

```bash
npm run build:pages
```

O resultado é gerado em `dist-pages`. O workflow `.github/workflows/deploy-pages.yml` publica essa pasta automaticamente quando houver um push na branch `main`.

Depois de enviar o projeto ao GitHub, abra **Settings → Pages** no repositório e selecione **GitHub Actions** em **Source**.

## Decisões de produto

- O pipeline é o centro da experiência e mantém as etapas sempre visíveis.
- Atividades ficam ligadas aos leads para preservar contexto comercial.
- Indicadores são calculados a partir dos dados cadastrados, sem números decorativos.
- A demonstração é isolada e restaurável para facilitar a avaliação em portfólio.

## Próximos passos

- Gestão de usuários e permissões por equipe
- Importação e exportação de contatos
- Relatórios avançados e metas comerciais
- Integrações com email, calendário e mensageria
- Testes automatizados de fluxos críticos

## Autor

Projeto de portfólio desenvolvido para demonstrar construção de produto, interface, modelagem de dados e implementação full-stack.
