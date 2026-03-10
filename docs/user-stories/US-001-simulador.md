# US-001 — Simulador de Consórcio

**Epic:** Aquisição / Topo de funil
**Sprint:** 1
**Pontos:** 5
**Author:** @product-manager | Review: @qa-engineer

---

## User Story

**Como** potencial cliente que está pesquisando formas de adquirir um bem,
**Quero** simular um consórcio com minha carta de crédito desejada,
**Para que** eu possa comparar com financiamento e tomar uma decisão informada.

---

## Critérios de Aceite

### Cenário 1 — Simulação básica
```gherkin
Dado que acesso a página do simulador sem estar logado
Quando preencho:
  | campo             | valor        |
  | categoria         | Imóvel       |
  | valor_credito     | R$ 300.000   |
  | prazo             | 180 meses    |
Então vejo:
  - Parcela mensal estimada
  - Total pago ao final
  - Taxa de administração informada (13%)
  - Comparativo: consórcio vs. financiamento (taxa média Caixa 10,5% a.a.)
  - Economia estimada em reais
```

### Cenário 2 — Comparativo visual
```gherkin
Dado que visualizo o resultado da simulação
Então vejo um gráfico comparativo mostrando:
  - Linha consórcio (sem juros, com taxa admin)
  - Linha financiamento (com juros compostos)
  - Diferença acumulada mês a mês
```

### Cenário 3 — CTA de conversão
```gherkin
Dado que visualizo o resultado da simulação
Quando clico em "Quero contratar"
Então sou direcionado para o fluxo de cadastro
  E os dados da simulação são pré-preenchidos no formulário
```

### Cenário 4 — Validações
```gherkin
Dado que preencho o formulário de simulação
Quando informo valor_credito < R$ 5.000 ou > R$ 1.500.000
Então vejo mensagem de erro com os limites aceitos por categoria
```

### Cenário 5 — Compartilhamento
```gherkin
Dado que visualizo o resultado
Quando clico em "Compartilhar simulação"
Então recebo um link único com os parâmetros da simulação
  E o link funciona sem login
```

---

## Definição de Pronto

- [ ] Cálculo de parcela validado por planilha do financeiro
- [ ] Comparativo com financiamento revisado por PM
- [ ] Responsivo (mobile-first)
- [ ] Sem dados pessoais coletados (cookie-free analytics)
- [ ] Testes unitários no motor de cálculo (100% cobertura)
- [ ] Teste E2E do fluxo simulação → cadastro

---

## Notas técnicas

```typescript
// Fórmula da parcela mensal de consórcio
parcelaMensal = (valorCredito * (1 + taxaAdmin/100)) / prazoMeses
// Onde taxaAdmin é o total ao longo do plano (ex: 13%)

// Reajuste anual pelo índice (INPC/IPCA) não entra no simulador v1
```
