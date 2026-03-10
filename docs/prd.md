# PRD — ConsorcioPro
**Versão:** 1.0
**Data:** 2026-03-10
**Status:** Aprovado
**Author:** @product-manager

---

## 1. Visão do Produto

**ConsorcioPro** é uma plataforma digital-first de consórcios que compete diretamente com Itaú Consórcios, Porto Seguro e Embracon, entregando:

- **Taxas de administração menores** (média mercado: 18–22% | meta: 12–15%)
- **UX superior**: contratação 100% digital em < 10 minutos
- **Transparência total**: dashboard com posição em tempo real, histórico de assembleias e sorteios auditáveis
- **Atendimento humano + IA**: resolução de 80% das dúvidas sem agente humano

---

## 2. Problema

| Dor do cliente | Situação atual (concorrentes) |
|---|---|
| Processo burocrático | Assinatura física, cartório, semanas de espera |
| Falta de transparência | Clientes não sabem sua posição real no grupo |
| Taxas opacas | TAC, fundo de reserva e admin misturados |
| Atendimento ruim | Filas de 30min+, agentes desinformados |
| Sem app funcional | Apps dos concorrentes com notas < 3.5 na loja |

---

## 3. Público-alvo

### Primário — PF (Pessoa Física)
- 25–55 anos, classe B/C
- Objetivo: imóvel próprio ou troca de veículo
- Digital: usa app bancário diariamente
- Motivação: não pagar juros (vs. financiamento)

### Secundário — PJ (Pessoa Jurídica)
- Empresas renovando frota ou adquirindo imóveis comerciais
- Ticket médio maior, decisão mais racional

---

## 4. Categorias de Consórcio

| Categoria | Ticket mín. | Ticket máx. | Prazo máx. | Taxa admin |
|---|---|---|---|---|
| Imóveis | R$ 100.000 | R$ 1.500.000 | 240 meses | 13% |
| Veículos leves | R$ 30.000 | R$ 250.000 | 84 meses | 12% |
| Veículos pesados | R$ 100.000 | R$ 500.000 | 100 meses | 13% |
| Serviços | R$ 5.000 | R$ 30.000 | 36 meses | 10% |
| Motos | R$ 5.000 | R$ 40.000 | 60 meses | 11% |

---

## 5. Funcionalidades — MoSCoW

### Must Have (MVP)
- [ ] Cadastro e onboarding digital (PF e PJ) com validação biométrica
- [ ] Simulador de consórcio com comparativo vs. financiamento
- [ ] Contratação 100% digital com assinatura eletrônica (ICP-Brasil)
- [ ] Gestão de grupos: criação, composição, regras
- [ ] Cobrança automática de parcelas (boleto, débito, Pix)
- [ ] Assembleia mensal: sorteio eletrônico auditável + lances
- [ ] Dashboard do consorciado: posição, parcelas pagas, histórico
- [ ] Contemplação: aprovação, análise de crédito, liberação da carta
- [ ] Portal administrativo (backoffice) para gestores
- [ ] Relatórios regulatórios para BACEN

### Should Have (Fase 2)
- [ ] App mobile (iOS + Android)
- [ ] Chat com IA para suporte (RAG sobre base de conhecimento)
- [ ] Lance embutido automático (configurar estratégia)
- [ ] Portabilidade de consórcio (receber de outros administradores)
- [ ] Integração com corretor de imóveis / concessionárias

### Could Have (Fase 3)
- [ ] Open Finance: importar dados bancários para análise de crédito
- [ ] Marketplace de imóveis/veículos para uso da carta de crédito
- [ ] Programa de indicação com gamificação
- [ ] Consórcio empresarial com múltiplos sócios

### Won't Have (fora de escopo)
- Câmbio / investimentos
- Seguro (parceria futura)
- Crédito pessoal

---

## 6. Fluxo Principal — Jornada do Consorciado

```
1. DESCOBERTA
   └─ Simulador → compara parcela consórcio vs. financiamento

2. CONTRATAÇÃO
   └─ Cadastro → Validação (biometria + CPF + renda)
   └─ Escolha do grupo → Assinatura eletrônica → Pagamento 1ª parcela

3. PARTICIPAÇÃO
   └─ Pagamento mensal (Pix/débito/boleto)
   └─ Acompanhamento: posição no grupo, assembleias, lances

4. CONTEMPLAÇÃO
   ├─ Por sorteio → notificação instantânea
   ├─ Por lance livre → oferta via app
   └─ Por lance embutido → desconto automático na carta

5. USO DA CARTA
   └─ Análise de crédito → Aprovação → Liberação para o bem

6. PÓS-CONTEMPLAÇÃO
   └─ Continua pagando parcelas até o fim do grupo
```

---

## 7. Requisitos Regulatórios

| Requisito | Fonte | Responsável |
|---|---|---|
| Autorização BACEN como administradora | Lei 11.795/2008 | Jurídico |
| Fundo comum segregado | Res. BACEN 4.656 | Financeiro |
| Sorteio via loteria federal ou sistema próprio auditável | Circular BACEN 3.432 | Backend |
| Relatório mensal ao BACEN (SUCOR) | Circular BACEN 3.865 | Dados |
| KYC/AML — prevenção a lavagem de dinheiro | Lei 9.613/1998 | Compliance |
| LGPD — proteção de dados | Lei 13.709/2018 | Eng. + Jurídico |
| Assinatura eletrônica ICP-Brasil | MP 2.200-2/2001 | Backend |

---

## 8. Métricas de Sucesso

| Métrica | Baseline (mercado) | Meta Ano 1 | Meta Ano 2 |
|---|---|---|---|
| Contratações/mês | — | 500 | 3.000 |
| Ticket médio | R$ 80k | R$ 75k | R$ 90k |
| NPS | 32 (média setor) | 55 | 70 |
| Churn mensal | 2.1% | 1.5% | 1.0% |
| Taxa de inadimplência | 4.5% | 3.5% | 2.8% |
| Tempo de contratação | 5 dias | < 10 min | < 5 min |
| CSAT atendimento | 3.2/5 | 4.2/5 | 4.6/5 |

---

## 9. Definição de Pronto (DoD)

Uma feature está pronta quando:
- [ ] Código revisado pelo Tech Lead
- [ ] Cobertura de testes ≥ 80% na lógica de negócio
- [ ] Documentação da API atualizada (OpenAPI 3.0)
- [ ] Critérios de aceite validados pelo QA
- [ ] Performance: p95 < 500ms nas APIs críticas
- [ ] Sem vulnerabilidades HIGH/CRITICAL no SAST
- [ ] Demo aprovada pelo PM
