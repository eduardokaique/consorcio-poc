# Roadmap — ConsorcioPro
**Author:** @product-manager + @tech-lead
**Última atualização:** 2026-03-10

---

## Visão de Fases

```
FASE 1 — MVP (0–6 meses)        → Produto mínimo para operar
FASE 2 — Crescimento (6–12m)    → App mobile + IA + escala
FASE 3 — Expansão (12–24m)      → Open Finance + marketplace
```

---

## Fase 1 — MVP (Sprints 1–12)

### Sprint 1–2 | Fundação
- [x] Setup infraestrutura (AWS EKS, RDS, Redis, Kafka)
- [x] CI/CD pipeline (GitHub Actions)
- [ ] auth-service: cadastro, login, JWT, 2FA
- [ ] Schema Prisma e migrations iniciais
- [ ] Simulador de consórcio (web)

**Critério de saída:** ambiente de staging rodando, simulador no ar

---

### Sprint 3–4 | Onboarding
- [ ] Integração Serpro (validação CPF/CNPJ)
- [ ] Integração iDwall (KYC + biometria)
- [ ] Fluxo de cadastro PF completo
- [ ] Integração DocuSign (contrato digital)
- [ ] grupos-service: CRUD de grupos

**Critério de saída:** usuário consegue se cadastrar e assinar contrato

---

### Sprint 5–6 | Financeiro
- [ ] financeiro-service: geração de parcelas
- [ ] Integração Celcoin (Pix + boleto)
- [ ] Webhook de confirmação de pagamento
- [ ] Dashboard básico do consorciado
- [ ] Notificações: email (AWS SES) + SMS (SNS)

**Critério de saída:** primeiro pagamento de parcela processado end-to-end

---

### Sprint 7–8 | Assembleia
- [ ] assembleia-service: agendamento mensal
- [ ] Motor de sorteio auditável (commit-reveal)
- [ ] Gestão de lances (livre + embutido)
- [ ] Ata digital gerada automaticamente
- [ ] Página de verificação pública do sorteio

**Critério de saída:** primeira assembleia simulada com sorteio auditável

---

### Sprint 9–10 | Contemplação
- [ ] contemplacao-service: workflow de aprovação
- [ ] Análise de crédito do contemplado
- [ ] Liberação da carta de crédito
- [ ] documento-service: geração e assinatura de documentos

**Critério de saída:** fluxo completo do contemplado (do sorteio à carta)

---

### Sprint 11–12 | Regulatório + Backoffice
- [ ] Portal de backoffice para gestores (Next.js)
- [ ] relatorio-service: SUCOR (relatório BACEN)
- [ ] Dashboard gerencial (inadimplência, contemplações, receita)
- [ ] Testes de carga (k6): 500 req/s
- [ ] Pentest externo
- [ ] Preparação para BACEN (documentação compliance)

**Critério de saída:** sistema auditável, relatórios BACEN prontos, pronto para produção

---

## Fase 2 — Crescimento (Sprints 13–24)

| Iniciativa | Prazo | Impacto |
|---|---|---|
| App mobile React Native (iOS + Android) | Sprint 13–16 | Alto (UX) |
| Chat com IA (RAG sobre FAQ) | Sprint 14–15 | Médio (suporte) |
| Lance embutido automático (estratégia configurável) | Sprint 17 | Médio (conversão) |
| Portabilidade de consórcio | Sprint 18–19 | Alto (aquisição) |
| Integração com corretor (lead) | Sprint 20 | Alto (canal) |
| Consórcio PJ multi-sócio | Sprint 21–22 | Médio (ticket) |
| Programa de indicação | Sprint 23 | Médio (viral) |

---

## Fase 3 — Expansão (Ano 2)

| Iniciativa | Impacto Estimado |
|---|---|
| Open Finance: análise de crédito automática | -30% inadimplência |
| Marketplace de imóveis/veículos para usar a carta | +15% NPS |
| White-label para outras administradoras | Nova linha de receita |
| Internacionalização (Portugal, México) | Novo mercado |

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Demora na autorização BACEN | Alta | Crítico | Iniciar processo de autorização no mês 1; operar sob CNPJ de administradora parceira no MVP |
| Inadimplência acima do projetado | Média | Alto | Scoring de crédito rigoroso na adesão; fundo de reserva de 2% |
| Vazamento de dados | Baixa | Crítico | Criptografia at-rest + transit, pentest trimestral, DPO |
| Concentração em poucos grupos | Média | Médio | Diversificar por categoria e região desde o início |
| Concorrente copia o diferencial do sorteio auditável | Alta | Baixo | Registrar marca, ser first-mover na comunicação |

---

## Equipe necessária por fase

### Fase 1 (MVP)
| Papel | Qtd |
|---|---|
| Tech Lead | 1 |
| Backend Developer (NestJS) | 3 |
| Frontend Developer (Next.js) | 2 |
| Mobile Developer | 0 (Fase 2) |
| QA Engineer | 1 |
| DevOps / SRE | 1 |
| Product Manager | 1 |
| Designer UX/UI | 1 |
| **Total** | **10** |

---

## KPIs por fase

| KPI | Fase 1 (mês 6) | Fase 2 (mês 12) | Fase 3 (mês 24) |
|---|---|---|---|
| Grupos ativos | 20 | 200 | 2.000 |
| Consorciados | 500 | 5.000 | 50.000 |
| Receita MRR (taxa admin) | R$ 50k | R$ 500k | R$ 5M |
| NPS | 50 | 65 | 70 |
| Taxa inadimplência | < 4% | < 3% | < 2.5% |
