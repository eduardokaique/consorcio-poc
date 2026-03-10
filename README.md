# ConsorcioPro

Plataforma digital-first de consórcios. Concorrente direto da Porto Seguro e Embracon.

---

## Diferenciais

- Contratação 100% digital em < 10 minutos
- Taxas de administração 30–40% menores que a concorrência (10–13% a.a. vs 18–22% mercado)
- Sorteio auditável publicamente (commit-reveal criptográfico SHA-256)
- Transparência total: posição em tempo real, histórico completo

---

## Estrutura do projeto

```
consorcio/
├── docs/
│   ├── prd.md                          ← Product Requirements Doc
│   ├── tech-spec.md                    ← Especificação técnica completa
│   ├── roadmap.md                      ← Fases e sprints (0–24 meses)
│   ├── compliance/
│   │   └── bacen-checklist.md          ← Checklist Lei 11.795 + Circular 3.865
│   ├── decisions/
│   │   ├── ADR-001-arquitetura.md
│   │   ├── ADR-002-banco-de-dados.md
│   │   └── ADR-003-sorteio-auditavel.md
│   └── user-stories/
│       ├── US-001-simulador.md
│       ├── US-002-onboarding.md
│       ├── US-003-assembleia-sorteio.md
│       └── US-004-dashboard-consorciado.md
├── src/
│   ├── backend/                        ← NestJS API
│   │   ├── prisma/
│   │   │   ├── schema.prisma           ← Schema completo (10 entidades)
│   │   │   ├── migrations/             ← Migrações SQL versionadas
│   │   │   └── seed/seed.ts            ← Dados de desenvolvimento
│   │   └── src/modules/
│   │       ├── auth/                   ← JWT + refresh token rotation
│   │       ├── grupos/                 ← Gestão de grupos e cotas
│   │       ├── participantes/          ← Onboarding, KYC (iDwall + Serpro)
│   │       ├── assembleias/            ← Sorteio auditável commit-reveal
│   │       ├── financeiro/             ← Parcelas, Pix, boleto (Celcoin)
│   │       ├── contemplacao/           ← Carta de crédito
│   │       ├── notificacoes/           ← Email (SES) + SMS (SNS)
│   │       ├── relatorios/             ← SUCOR BACEN + relatórios gerenciais
│   │       └── health/                 ← Liveness/readiness probes
│   └── frontend/                       ← Next.js 15
│       └── src/app/
│           ├── page.tsx                ← Landing page
│           ├── simulador/              ← Simulador (topo de funil)
│           ├── login/ + cadastro/      ← Autenticação
│           ├── dashboard/              ← Área do consorciado
│           ├── grupos/                 ← Catálogo de grupos
│           └── admin/                  ← Backoffice (ADMIN/GESTOR)
├── infra/
│   ├── docker/docker-compose.yml       ← Ambiente local completo
│   ├── terraform/
│   │   ├── modules/vpc/                ← VPC multi-AZ
│   │   ├── modules/rds/                ← PostgreSQL 16 Multi-AZ + read replica
│   │   ├── modules/eks/                ← EKS 1.31 (spot + on-demand)
│   │   ├── environments/production/
│   │   └── environments/staging/
│   └── k8s/
│       ├── base/                       ← Deployment, Service, HPA, Ingress
│       └── overlays/production/        ← 5 réplicas, HPA 5–50
├── tests/
│   ├── e2e/                            ← Playwright (Chromium + Mobile Safari)
│   └── k6/                             ← Load tests (SLO p95 < 300ms @ 500 req/s)
└── .github/workflows/
    ├── ci.yml                          ← lint → unit → SAST → build → integration
    └── cd.yml                          ← blue/green deploy → smoke → rollback
```

---

## Início rápido

```bash
# 1. Subir infraestrutura local (Postgres, Redis, Kafka)
cd infra/docker
docker-compose up -d postgres redis kafka

# 2. Backend
cd src/backend
npm install
cp .env.example .env.local          # ajustar variáveis
npx prisma migrate dev               # aplica migrations
npx prisma db seed                   # popula dados de dev
npm run dev                          # http://localhost:3001

# 3. Frontend
cd src/frontend
npm install
npm run dev                          # http://localhost:3000
```

### Credenciais de desenvolvimento (após seed)

| Email | Senha | Papel |
|---|---|---|
| admin@consorciropro.com.br | Senha@123 | ADMIN |
| gestor@consorciropro.com.br | Senha@123 | GESTOR |
| joao.silva@email.com | Senha@123 | CLIENTE (contemplado) |
| maria.souza@email.com | Senha@123 | CLIENTE |
| carlos.pereira@email.com | Senha@123 | CLIENTE |

---

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | NestJS 11 + TypeScript + Prisma ORM |
| Frontend | Next.js 15 + TailwindCSS v4 + shadcn/ui |
| Banco | PostgreSQL 16 + Redis 7 + MongoDB (audit) |
| Eventos | Kafka (Confluent) |
| Infra | AWS EKS + Terraform + Kustomize |
| Pagamentos | Celcoin BaaS (Pix QR + boleto) |
| KYC | iDwall (biometria) + Serpro (CPF) |
| Email/SMS | AWS SES + SNS |
| Testes | Jest (unit) + Playwright (E2E) + k6 (load) |
| CI/CD | GitHub Actions + ECR + Helm blue/green |

---

## Arquitetura

```
Internet
    │
[ALB + WAF]
    │
[Kong API Gateway]
    ├── /api/v1/*  → [NestJS Backend]  ←─────────────────────┐
    └── /*         → [Next.js Frontend]                       │
                                                              │
[NestJS Modules]                                              │
├── AuthModule      → PostgreSQL (usuarios, sessoes)          │
├── GruposModule    → PostgreSQL (grupos)                     │
├── ParticipantesModule → PostgreSQL + iDwall + Serpro        │
├── AssembleiasModule  → PostgreSQL + SHA-256 commit-reveal   │
├── FinanceiroModule   → PostgreSQL + Celcoin BaaS + Redis    │
├── ContemplacaoModule → PostgreSQL                           │
├── NotificacoesModule → AWS SES + SNS                        │
├── RelatoriosModule   → PostgreSQL → SUCOR TXT               │
└── HealthModule       → Terminus (DB + memory + disk)        │
                                                              │
[Kafka Events]                                                │
├── participante.criado → gerarParcelas                       │
├── assembleia.realizada → iniciarContemplacao                │
└── contemplacao.iniciada → notificarContemplado  ────────────┘
```

---

## SLOs

| Métrica | Alvo |
|---|---|
| Latência p95 | < 300 ms |
| Disponibilidade | 99.5% / mês |
| Throughput | ≥ 500 req/s |
| Erro 5xx | < 0.1% |
| Tempo de recuperação (RTO) | < 4h |

---

## Compliance

- **Lei 11.795/2008** — Lei dos Consórcios
- **Circular BACEN 3.432/2009** — Funcionamento de grupos
- **Circular BACEN 3.865/2018** — SUCOR (relatório mensal)
- **Resolução BCB 44/2021** — KYC / PLD-FT
- **LGPD** — CPF hasheado, dados criptografados, audit log

Ver checklist completo em [`docs/compliance/bacen-checklist.md`](docs/compliance/bacen-checklist.md).

---

## Squad

| Papel | Responsabilidade |
|---|---|
| @tech-lead | Arquitetura, code review, ADRs |
| @product-manager | PRD, user stories, roadmap |
| @developer | Implementação, testes |
| @qa-engineer | Critérios de aceite, testes E2E |
| @data-analyst | Métricas, relatórios BACEN |
