# US-003 — Assembleia Mensal e Sorteio

**Epic:** Core do Consórcio
**Sprint:** 4–5
**Pontos:** 21
**Author:** @product-manager | Review: @qa-engineer

---

## User Story

**Como** consorciado ativo,
**Quero** participar da assembleia mensal e acompanhar o sorteio em tempo real,
**Para que** eu saiba minha situação e possa ofertar lances com transparência.

---

## Critérios de Aceite

### Cenário 1 — Notificação pré-assembleia
```gherkin
Dado que sou consorciado ativo em um grupo
Quando faltam 7 dias para a assembleia
Então recebo notificação (push + email) informando:
  - Data e horário da assembleia
  - Prazo para oferta de lances (48h antes)
  - Link para acompanhar ao vivo
```

### Cenário 2 — Oferta de lance livre
```gherkin
Dado que estou logado e faltam mais de 1h para a assembleia
Quando acesso "Oferecer Lance"
Então vejo:
  - Meu saldo disponível para lance
  - Histórico de lances vencedores anteriores (percentual mínimo para vencer)
  - Campo para informar o valor do lance (em R$ ou % da carta)
Quando confirmo o lance
Então meu saldo é bloqueado (não posso cancelar após 1h do início)
  E recebo confirmação com protocolo do lance
```

### Cenário 3 — Sorteio ao vivo
```gherkin
Dado que a assembleia começou
Quando acesso a sala da assembleia ao vivo
Então vejo:
  - Contador regressivo até o sorteio
  - Número de participantes ativos
  - Minha posição/cota
Quando o sorteio é realizado
Então vejo:
  - Animação do sorteio (efeito "roda da fortuna" com cotas)
  - Resultado: cota contemplada
  - Seed do sorteio revelado (transparência)
  - Link para verificar o resultado independentemente
```

### Cenário 4 — Contemplação por sorteio
```gherkin
Dado que minha cota foi sorteada
Então recebo notificação instantânea (push + SMS + email)
  E no meu dashboard aparece banner "Parabéns! Você foi contemplado"
  E sou direcionado para o fluxo de aprovação da carta de crédito
```

### Cenário 5 — Contemplação por lance
```gherkin
Dado que ofereci um lance
Quando a assembleia processa os lances
Então o lance vencedor é o maior percentual da carta
  E em caso de empate: desempate por sorteio entre os empatados
Quando meu lance vence
Então recebo notificação e sou direcionado para aprovação da carta
Quando meu lance perde
Então vejo o resultado e o lance não é cobrado (saldo liberado)
```

### Cenário 6 — Ata da assembleia
```gherkin
Dado que a assembleia foi concluída
Então em até 24h a ata oficial é publicada no sistema
  E todos os consorciados do grupo recebem email com a ata
  E a ata contém: data, grupo, número da assembleia,
    contemplados, seed do sorteio, lances registrados, assinatura digital
```

### Cenário 7 — Verificação independente do sorteio
```gherkin
Dado que quero verificar se o sorteio foi legítimo
Quando acesso a página pública de auditoria
  E informo o seed revelado + lista de cotas
Então o sistema recalcula o resultado
  E confirma se o resultado bate com o publicado
  E exibe "Sorteio verificado ✓" ou "Divergência detectada ✗"
```

---

## Definição de Pronto

- [ ] Motor de sorteio com seed auditável implementado e testado
- [ ] Testes de reproductibilidade: 1000 runs com mesmo seed = mesmo resultado
- [ ] Websocket para atualização em tempo real durante assembleia
- [ ] Geração automática da ata em PDF
- [ ] Página pública de verificação funcional
- [ ] Testes de carga: 1000 usuários simultâneos na sala da assembleia
- [ ] Notificações: push, email e SMS testados end-to-end
