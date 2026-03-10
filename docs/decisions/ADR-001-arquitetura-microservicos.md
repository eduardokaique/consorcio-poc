# ADR-001: Arquitetura de Microserviços com Event-Driven

**Data:** 2026-03-10
**Status:** aceito
**Author:** @tech-lead

---

## Contexto

Sistema de consórcio regulado pelo BACEN com os seguintes requisitos:
- Alta disponibilidade (operações financeiras críticas)
- Auditabilidade completa de todas as mutações
- Múltiplos canais (web, mobile, backoffice, APIs parceiros)
- Times independentes por domínio (grupos, financeiro, contemplação)
- Regulatório: relatórios mensais ao BACEN com dados segregados

---

## Decisão

Adotar arquitetura de **microserviços orientada a eventos** com:
- 9 serviços independentes por domínio de negócio
- Comunicação síncrona via gRPC (inter-serviços) e REST/GraphQL (clientes)
- Comunicação assíncrona via Kafka para eventos de negócio
- BFF (Backend for Frontend) como agregador GraphQL
- API Gateway (Kong) como borda única

---

## Trade-offs

### Vantagens
- ✅ Escalabilidade independente por domínio (pico de assembleias não afeta onboarding)
- ✅ Isolamento de falhas: financeiro-service offline não derruba o portal
- ✅ Deploy independente: financeiro pode ter ciclo mais conservador
- ✅ Auditabilidade nativa via event log no Kafka
- ✅ Times paralelos sem conflitos de merge
- ✅ Fundo comum segregado por serviço (requisito BACEN)

### Desvantagens / Riscos
- ⚠️ Complexidade operacional maior (9 serviços para monitorar)
- ⚠️ Transações distribuídas exigem Saga pattern
- ⚠️ Overhead de rede inter-serviços
- ⚠️ Consistência eventual (não imediata) em algumas operações

### Mitigações
- Kubernetes + Helm charts padronizados reduzem overhead operacional
- Saga Orchestration (não coreografia) para fluxos críticos como contemplação
- Datadog APM para rastrear latência inter-serviços
- Circuit breaker (Resilience4j) em todas as chamadas síncronas

---

## Alternativas descartadas

- **Monolito modular**: descartado porque o domínio financeiro exige isolamento regulatório e deploy independente
- **Serverless (Lambda)**: descartado por cold start incompatível com SLO de 200ms e complexidade de VPC para dados financeiros
- **Monolito distribuído (shared DB)**: descartado por criar acoplamento que anula benefícios de microserviços

---

## Próximos passos

- [x] Definir contratos gRPC entre serviços (proto files)
- [ ] Configurar Kafka com topologia de tópicos por domínio
- [ ] Implementar service mesh (Istio) para mTLS inter-serviços
- [ ] Definir estratégia de Saga para fluxo de contemplação
