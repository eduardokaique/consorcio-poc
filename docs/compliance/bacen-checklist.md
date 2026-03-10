# Checklist de Compliance BACEN — ConsorcioPro

> **Base legal:** Lei 11.795/2008 · Circular BACEN 3.432/2009 · Circular BACEN 3.865/2018
> **Última revisão:** 2026-03-10
> **Responsável:** Tech Lead + Jurídico

---

## 1. Autorização e Registro

| # | Requisito | Status | Evidência |
|---|-----------|--------|-----------|
| 1.1 | Autorização de funcionamento emitida pelo BACEN | ⏳ Pendente (pré-operação) | — |
| 1.2 | Registro de todos os grupos junto ao BACEN antes da captação | ⏳ Pendente (pré-operação) | — |
| 1.3 | Administradora capitalizada com patrimônio líquido mínimo exigido | ⏳ Pendente | — |
| 1.4 | Responsável técnico registrado no BACEN | ⏳ Pendente | — |

---

## 2. Contrato de Adesão (Art. 16, Lei 11.795/2008)

| # | Requisito | Status | Evidência |
|---|-----------|--------|-----------|
| 2.1 | Contrato com todos os campos obrigatórios (crédito, prazo, taxa admin, fundo reserva) | ✅ OK | `src/frontend/src/app/cadastro/page.tsx` + template jurídico |
| 2.2 | Disponibilização prévia do contrato (7 dias de reflexão) | ✅ OK | Fluxo de onboarding: aceite com timestamp armazenado |
| 2.3 | Direito de desistência em 7 dias (Código de Defesa do Consumidor) | ✅ OK | `participantes.service.ts::cancelarAdesao` |
| 2.4 | Taxa de administração total explícita em % ao ano | ✅ OK | `grupos.controller.ts` — campo `taxaAdminAnual` exposto |
| 2.5 | Prazo máximo por categoria respeitado (imovel ≤ 240m, veiculo ≤ 100m) | ✅ OK | `enums/categoria.enum.ts::LIMITES_POR_CATEGORIA` |

---

## 3. Fundo Comum (Art. 23, Lei 11.795/2008)

| # | Requisito | Status | Evidência |
|---|-----------|--------|-----------|
| 3.1 | Recursos do fundo comum segregados dos recursos próprios da administradora | ✅ OK | Campo `fundoComum` por grupo em `grupos` + `calcularFundoComum` |
| 3.2 | Movimentação do fundo somente para pagamento de carta de crédito | ✅ OK | `financeiro.service.ts::calcularFundoComum` — somente créditos |
| 3.3 | Conta corrente bancária exclusiva por grupo | ⏳ Pendente | Celcoin sub-conta por grupo (roadmap Sprint 8) |
| 3.4 | Prestação de contas mensal aos cotistas | ✅ OK | `relatorios.controller.ts::fluxoCaixa` — endpoint por grupo |

---

## 4. Processo de Contemplação (Art. 22, Lei 11.795/2008)

| # | Requisito | Status | Evidência |
|---|-----------|--------|-----------|
| 4.1 | Sorteio realizado exclusivamente em assembleia | ✅ OK | `assembleias.service.ts::realizar` |
| 4.2 | Lance contempla apenas mediante oferta em assembleia | ✅ OK | `assembleias.service.ts::ofertarLance` — janela de 1h antes |
| 4.3 | Resultado do sorteio auditável e verificável por terceiros | ✅ OK | Commit-reveal SHA-256 · `GET /assembleias/:id/verificar-sorteio` · ADR-003 |
| 4.4 | Contemplado recebe notificação formal | ✅ OK | `notificacoes.service.ts::notificarContemplacao` — email + SMS |
| 4.5 | Carta de crédito válida por mínimo 180 dias após emissão | ✅ OK | `contemplacao.service.ts` — validadeAte = +365 dias |
| 4.6 | Contemplação não extingue obrigação de pagar parcelas | ✅ OK | Status do participante mantém-se ATIVO após contemplação |

---

## 5. Assembleias (Circular 3.432, Art. 11–18)

| # | Requisito | Status | Evidência |
|---|-----------|--------|-----------|
| 5.1 | Periodicidade mínima: 1 assembleia por mês | ✅ OK | `@Cron(EVERY_MINUTE)` verifica horário agendado; 1 assembleia/mês |
| 5.2 | Convocação com antecedência mínima de 5 dias úteis | ✅ OK | `notificacoes::notificarAssembleiaAgendada` disparado 7 dias antes |
| 5.3 | Ata de assembleia gerada e armazenada | ⏳ Pendente | Geração de PDF da ata (roadmap Sprint 12) |
| 5.4 | Compromisso (commitment hash) publicado 48h antes | ✅ OK | `sorteio.service.ts::gerarCommitment` + notificação |
| 5.5 | Seed revelado após a assembleia e publicado na plataforma | ✅ OK | `assembleias.service.ts::realizar` — persiste `seedRevelado` |

---

## 6. Relatórios ao BACEN (Circular 3.865/2018 — SUCOR)

| # | Requisito | Status | Evidência |
|---|-----------|--------|-----------|
| 6.1 | Envio mensal do arquivo SUCOR até dia 15 do mês subsequente | ✅ OK | `sucor.service.ts` — arquivo gerado; envio manual Sprint 12 |
| 6.2 | Formato fixo (latin1, CRLF, 240 chars por registro) | ✅ OK | `sucor.service.ts::padEnd/padStart`, encoding latin1 |
| 6.3 | Registros tipo 0 (header), 1 (grupo), 2 (participante), 3 (assembleia), 9 (trailer) | ✅ OK | `sucor.service.ts` — todos os tipos implementados |
| 6.4 | Campos monetários em centavos sem separador decimal | ✅ OK | `formatarDecimal(valor, 15)` — multiplica por 100 |
| 6.5 | Código da administradora no header (tipo 0) | ⚠️ Atenção | Código real deve ser inserido em `BACEN_ADMIN_CODE` no `.env` |

---

## 7. KYC / PLD-FT (Resolução BCB 44/2021)

| # | Requisito | Status | Evidência |
|---|-----------|--------|-----------|
| 7.1 | Identificação do cliente (nome, CPF, data nascimento, endereço) | ✅ OK | `registro.dto.ts` + `kyc.service.ts` |
| 7.2 | Verificação de identidade (biometria facial + liveness) | ✅ OK | `kyc.service.ts::iniciarKyc` — iDwall session |
| 7.3 | Validação de CPF junto à Receita Federal / Serpro | ✅ OK | `kyc.service.ts::validarCpf` |
| 7.4 | Monitoramento de transações suspeitas | ⏳ Pendente | Integração com sistema PLD (roadmap Sprint 13) |
| 7.5 | Registro de operações por 5 anos (COAF) | ✅ OK | MongoDB audit log (`audit_events`) — retenção configurável |
| 7.6 | Política de PLD/CFT documentada | ⏳ Pendente | Documento jurídico (roadmap pré-operação) |

---

## 8. Segurança da Informação (LGPD + Resolução BCB 85/2021)

| # | Requisito | Status | Evidência |
|---|-----------|--------|-----------|
| 8.1 | CPF armazenado apenas como hash SHA-256 | ✅ OK | `auth.service.ts::registro` |
| 8.2 | Senhas com bcrypt (fator 10+) | ✅ OK | `auth.service.ts::hashSenha` |
| 8.3 | Tokens JWT com expiração curta (≤ 15 min) | ✅ OK | `auth.service.ts::gerarTokens` — accessToken 15min |
| 8.4 | Refresh token rotativo + revogação imediata | ✅ OK | `auth.service.ts::refresh` — invalidates old token |
| 8.5 | Comunicação TLS 1.2+ em todos os endpoints | ✅ OK | Ingress ALB com `ssl-redirect: "443"` |
| 8.6 | Dados em repouso criptografados (RDS + S3) | ✅ OK | `storage_encrypted = true` · S3 SSE-S3 |
| 8.7 | Logs de acesso a dados pessoais (auditoria) | ✅ OK | `logging.interceptor.ts` + MongoDB audit |
| 8.8 | SAST em pipeline CI (CodeQL + Snyk) | ✅ OK | `.github/workflows/ci.yml` |
| 8.9 | Relatório de incidentes ao BACEN em até 72h | ⏳ Pendente | Processo operacional (pré-operação) |

---

## 9. Atendimento ao Consumidor (Resolução CMN 4.860/2020)

| # | Requisito | Status | Evidência |
|---|-----------|--------|-----------|
| 9.1 | Canal de ouvidoria disponível | ⏳ Pendente | Email/telefone na landing page (roadmap Sprint 12) |
| 9.2 | Prazo de resposta à reclamação: 10 dias úteis | ⏳ Pendente | Processo operacional |
| 9.3 | Registro de reclamações | ⏳ Pendente | Módulo de tickets (roadmap Sprint 14) |
| 9.4 | Transparência de taxa (CET/TAC) na simulação | ✅ OK | `simulador/page.tsx` — exibe taxa total e economia vs. financiamento |

---

## 10. Resumo de Pendências Críticas (pré-lançamento)

| Prioridade | Item | Sprint |
|------------|------|--------|
| 🔴 CRÍTICO | Autorização BACEN | Pré-operação |
| 🔴 CRÍTICO | Conta corrente exclusiva por grupo (Celcoin sub-conta) | Sprint 8 |
| 🟡 ALTO | Geração e armazenamento de ata de assembleia | Sprint 12 |
| 🟡 ALTO | Envio automático SUCOR ao BACEN | Sprint 12 |
| 🟡 ALTO | Canal de ouvidoria | Sprint 12 |
| 🟢 MÉDIO | Integração PLD/CFT | Sprint 13 |
| 🟢 MÉDIO | Módulo de tickets de reclamações | Sprint 14 |

---

*Documento mantido pela equipe de Engenharia e Jurídico. Revisar a cada sprint de compliance.*
