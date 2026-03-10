# US-004 — Dashboard do Consorciado

**Epic:** Engajamento / Retenção
**Sprint:** 3
**Pontos:** 8
**Author:** @product-manager | Review: @qa-engineer

---

## User Story

**Como** consorciado ativo,
**Quero** um painel completo com minha situação em tempo real,
**Para que** eu acompanhe meu progresso e tome decisões sobre lances.

---

## Critérios de Aceite

### Cenário 1 — Visão geral
```gherkin
Dado que acesso meu dashboard
Então vejo no topo:
  - Meu nome e foto (avatar)
  - Status da cota: Ativo / Contemplado / Inadimplente
  - Próxima parcela: valor e data de vencimento
  - Percentual pago do contrato (barra de progresso)
```

### Cenário 2 — Detalhes do grupo
```gherkin
Dado que clico no card do meu grupo
Então vejo:
  - Número do grupo e categoria
  - Minha cota número X de Y
  - Total de contemplados até hoje
  - Próxima assembleia: data e horário
  - Valor da minha carta de crédito
  - Reajuste acumulado (se aplicável)
```

### Cenário 3 — Histórico de parcelas
```gherkin
Dado que acesso "Meu extrato"
Então vejo lista paginada de todas as parcelas:
  - Número, vencimento, valor, status, forma de pagamento, comprovante
Quando filtro por status "vencida"
Então vejo apenas as parcelas em atraso com botão "Pagar agora"
```

### Cenário 4 — Segunda via e pagamento
```gherkin
Dado que tenho uma parcela pendente
Quando clico em "Pagar"
Então vejo opções:
  - Pix: QR code + código copia e cola (expira em 24h)
  - Boleto: gerar e copiar linha digitável
Quando o pagamento é confirmado (webhook Celcoin)
Então o status atualiza em < 5 segundos na tela
```

### Cenário 5 — Posição no sorteio
```gherkin
Dado que ainda não fui contemplado
Quando acesso "Minha posição"
Então vejo:
  - Probabilidade de contemplação no próximo sorteio (1/cotas_ativas)
  - Histórico de assembleias que participei
  - Sugestão de lance: valor mínimo histórico para vencer
```

---

## Definição de Pronto

- [ ] Dashboard responsivo (mobile-first)
- [ ] Tempo de carregamento < 2s (LCP)
- [ ] Dados em tempo real via polling (30s) ou WebSocket
- [ ] Comprovante de pagamento em PDF disponível para download
- [ ] Testes E2E no fluxo de pagamento via Pix
