# Tech Spec — ConsorcioPro
**Versão:** 1.0
**Data:** 2026-03-10
**Status:** Aprovado
**Author:** @tech-lead

---

## 1. Visão Arquitetural

### Princípios
1. **Domain-Driven Design** — cada domínio de negócio é um módulo isolado
2. **Event-driven** — operações financeiras críticas propagadas via eventos (Kafka)
3. **API-first** — contrato OpenAPI antes da implementação
4. **Zero-trust** — autenticação em toda borda, mesmo interna
5. **Auditabilidade** — toda mutação financeira é imutável e rastreável

---

## 2. Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTES                                 │
│   [Web App Next.js]  [App Mobile RN]  [Portal Admin Next.js]   │
└──────────────┬──────────────┬──────────────────────────────────┘
               │              │
┌──────────────▼──────────────▼──────────────────────────────────┐
│                    API GATEWAY (Kong)                           │
│         Rate limiting │ Auth │ Routing │ Observability          │
└──────────────┬──────────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────────┐
│                   BFF — Backend for Frontend                    │
│                    (NestJS — GraphQL)                           │
└───┬───────┬────────┬────────┬────────┬────────┬────────────────┘
    │       │        │        │        │        │
 [Auth]  [Grupos] [Partic.] [Assem.] [Fin.]  [Contemp.]
    │       │        │        │        │        │
┌───▼───────▼────────▼────────▼────────▼────────▼────────────────┐
│              MICROSERVIÇOS (NestJS REST + gRPC)                 │
│                                                                 │
│  auth-service     grupos-service    participantes-service       │
│  assembleia-service   financeiro-service   contemplacao-service │
│  notificacao-service  relatorio-service    documento-service    │
└───┬────────────────────────────────────────────────────────────┘
    │
┌───▼────────────────────────────────────────────────────────────┐
│                    EVENT BUS (Kafka)                            │
│  participante.criado │ parcela.paga │ sorteio.realizado         │
│  lance.ofertado │ contemplacao.aprovada │ carta.liberada        │
└───┬────────────────────────────────────────────────────────────┘
    │
┌───▼────────────────────────────────────────────────────────────┐
│                    DADOS                                        │
│  PostgreSQL (principal)   Redis (cache/sessão)                 │
│  MongoDB (documentos/logs)   S3 (arquivos/contratos)           │
└───┬────────────────────────────────────────────────────────────┘
    │
┌───▼────────────────────────────────────────────────────────────┐
│                 INTEGRAÇÕES EXTERNAS                            │
│  Celcoin (BaaS)   Serpro (CPF/CNPJ)   Receita Federal         │
│  iDwall (KYC/biometria)   Correios (endereço)                  │
│  AWS SES/SNS (email/SMS)   DocuSign (assinatura)               │
│  BACEN (reporting)   Pix (BC)                                  │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. Serviços e Responsabilidades

### auth-service
- Autenticação: JWT + Refresh Token (rotação)
- Autorização: RBAC (roles: ADMIN, GESTOR, CONSORCIADO, READONLY)
- KYC/Biometria: integração iDwall
- 2FA: TOTP (Google Authenticator) + SMS

### grupos-service
- CRUD de grupos de consórcio
- Regras: tamanho, categoria, prazo, taxa admin
- Controle de vagas disponíveis
- Encerramento automático de grupo completo

### participantes-service
- Onboarding PF e PJ
- Validação CPF/CNPJ (Serpro)
- Análise de risco inicial
- Contrato digital (DocuSign + ICP-Brasil)

### assembleia-service
- Agendamento mensal de assembleias
- Motor de sorteio: PRNG criptográfico (CSPRNG) + seed auditável
- Gestão de lances: livre, embutido, fixo
- Ata digital gerada automaticamente

### financeiro-service
- Emissão de cobranças: Pix, boleto, débito automático
- Conciliação bancária
- Gestão do fundo comum (segregado)
- Cálculo de reajuste (INPC/IPCA)
- Inadimplência e negativação (Serasa)

### contemplacao-service
- Workflow de aprovação pós-contemplação
- Análise de crédito do contemplado
- Liberação da carta de crédito
- Rastreamento do bem adquirido

### notificacao-service
- Email (AWS SES), SMS (AWS SNS), Push, WhatsApp (360dialog)
- Template engine (Handlebars)
- Preferências de canal por usuário
- Retry com backoff exponencial

### relatorio-service
- SUCOR (BACEN mensal)
- Relatórios gerenciais (inadimplência, contemplações, receita)
- Exportação: PDF, CSV, XLSX

### documento-service
- Geração de contratos (PDF)
- Armazenamento S3 com presigned URLs
- Versionamento de documentos
- Assinatura eletrônica ICP-Brasil

---

## 4. Stack Tecnológica

### Backend
| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | 22 LTS | Runtime |
| NestJS | 11 | Framework backend |
| TypeScript | 5.4 | Linguagem |
| Prisma ORM | 6 | ORM PostgreSQL |
| Apollo Server | 4 | GraphQL (BFF) |
| gRPC | — | Comunicação inter-serviços |
| Kafka (Confluent) | 3.7 | Event bus |
| Redis | 7 | Cache e sessão |
| Bull | 4 | Filas de processamento |

### Frontend Web
| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 15 | Framework React |
| TypeScript | 5.4 | Linguagem |
| TailwindCSS | 4 | Estilização |
| shadcn/ui | — | Componentes |
| React Query | 5 | Data fetching |
| Zustand | 5 | Estado global |
| React Hook Form + Zod | — | Formulários + validação |
| Recharts | — | Gráficos e dashboards |

### Mobile
| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.77 | Framework mobile |
| Expo | 52 | Tooling |
| React Navigation | 7 | Navegação |

### Infraestrutura
| Tecnologia | Uso |
|---|---|
| AWS EKS | Kubernetes gerenciado |
| AWS RDS PostgreSQL | Banco principal (Multi-AZ) |
| AWS ElastiCache Redis | Cache |
| AWS MSK (Kafka) | Event streaming |
| AWS S3 | Arquivos e documentos |
| AWS CloudFront | CDN frontend |
| Kong | API Gateway |
| Datadog | Observabilidade |
| Vault (HashiCorp) | Secrets management |
| Terraform | IaC |
| GitHub Actions | CI/CD |

---

## 5. Modelo de Dados Principal

### Entidades Core

```sql
-- Grupo de Consórcio
grupos (
  id UUID PK,
  codigo VARCHAR(20) UNIQUE,
  categoria ENUM('imovel','veiculo_leve','veiculo_pesado','servico','moto'),
  valor_credito DECIMAL(15,2),
  total_participantes INT,
  participantes_ativos INT,
  prazo_meses INT,
  taxa_admin_percentual DECIMAL(5,2),
  fundo_reserva_percentual DECIMAL(5,2),
  status ENUM('formando','ativo','encerrado'),
  data_inicio DATE,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- Participante
participantes (
  id UUID PK,
  grupo_id UUID FK grupos,
  usuario_id UUID FK usuarios,
  numero_cota INT,
  status ENUM('ativo','inadimplente','contemplado','desistente','excluido'),
  valor_credito DECIMAL(15,2),
  percentual_pago DECIMAL(5,2),
  data_adesao DATE,
  data_contemplacao DATE NULL,
  tipo_contemplacao ENUM('sorteio','lance_livre','lance_embutido') NULL,
  created_at TIMESTAMPTZ
)

-- Assembleia
assembleias (
  id UUID PK,
  grupo_id UUID FK grupos,
  numero INT,
  data_realizacao TIMESTAMPTZ,
  status ENUM('agendada','em_andamento','realizada','cancelada'),
  seed_sorteio VARCHAR(64),  -- auditável
  resultado_sorteio JSONB,
  ata_url VARCHAR(500),
  created_at TIMESTAMPTZ
)

-- Parcela
parcelas (
  id UUID PK,
  participante_id UUID FK participantes,
  assembleia_id UUID FK assembleias NULL,
  numero INT,
  valor_principal DECIMAL(15,2),
  valor_fundo_comum DECIMAL(15,2),
  valor_fundo_reserva DECIMAL(15,2),
  valor_taxa_admin DECIMAL(15,2),
  valor_seguro DECIMAL(15,2) DEFAULT 0,
  valor_total DECIMAL(15,2),
  status ENUM('pendente','paga','vencida','cancelada'),
  data_vencimento DATE,
  data_pagamento TIMESTAMPTZ NULL,
  metodo_pagamento ENUM('pix','boleto','debito') NULL,
  txid_pix VARCHAR(100) NULL,
  created_at TIMESTAMPTZ
)

-- Lance
lances (
  id UUID PK,
  assembleia_id UUID FK assembleias,
  participante_id UUID FK participantes,
  tipo ENUM('livre','embutido','fixo'),
  valor_ofertado DECIMAL(15,2),
  percentual_carta DECIMAL(5,2),
  status ENUM('pendente','vencedor','perdedor','cancelado'),
  created_at TIMESTAMPTZ
)

-- Carta de Crédito
cartas_credito (
  id UUID PK,
  participante_id UUID FK participantes,
  valor DECIMAL(15,2),
  status ENUM('pendente_analise','aprovada','em_uso','utilizada','expirada'),
  data_aprovacao TIMESTAMPTZ NULL,
  data_validade DATE,
  tipo_bem VARCHAR(100),
  valor_bem DECIMAL(15,2) NULL,
  created_at TIMESTAMPTZ
)
```

---

## 6. Segurança

### Autenticação e Autorização
- OAuth 2.0 + OIDC (Keycloak self-hosted)
- JWT com expiração de 15min + refresh 7 dias
- RBAC granular por recurso
- Sessão invalidada em logout

### Proteção de Dados
- Dados sensíveis criptografados at-rest (AES-256)
- TLS 1.3 em todas as comunicações
- PII tokenizado (CPF, dados bancários)
- Logs sem dados pessoais

### Compliance
- LGPD: consentimento explícito, direito ao esquecimento, DPO
- PCI-DSS Nível 1 para dados de pagamento (delegado ao BaaS)
- SOC 2 Type II como meta Ano 1

---

## 7. Observabilidade

```
Métricas   → Datadog (APM + Infra)
Logs       → Datadog Logs (estruturado JSON)
Tracing    → Datadog APM (OpenTelemetry)
Alertas    → Datadog Monitors → PagerDuty
Dashboards → Datadog + Grafana (financeiro)
```

### SLOs definidos
| Serviço | Disponibilidade | Latência p95 |
|---|---|---|
| auth-service | 99.95% | < 200ms |
| financeiro-service | 99.99% | < 300ms |
| assembleia-service | 99.9% | < 500ms |
| BFF GraphQL | 99.9% | < 400ms |
| Frontend | 99.9% | FCP < 1.5s |

---

## 8. CI/CD

```yaml
Pipeline (GitHub Actions):
  PR aberto:
    - lint + type-check
    - testes unitários
    - SAST (CodeQL + Snyk)
    - build Docker
    - deploy preview (ambiente efêmero)

  Merge em main:
    - todos os checks do PR
    - testes de integração
    - testes e2e (Playwright)
    - DAST (OWASP ZAP)
    - deploy em staging
    - smoke tests

  Tag de release:
    - deploy em produção (blue/green)
    - testes de sanidade
    - rollback automático se smoke falhar
```

---

## 9. Estratégia de Testes

| Tipo | Ferramenta | Cobertura mínima |
|---|---|---|
| Unitário | Jest | 80% lógica de negócio |
| Integração | Jest + Testcontainers | Todos os endpoints |
| E2E | Playwright | Fluxos críticos |
| Performance | k6 | 500 req/s nas APIs críticas |
| Segurança | Snyk + ZAP | Sem HIGH/CRITICAL |
| Contrato | Pact | Entre todos os serviços |
