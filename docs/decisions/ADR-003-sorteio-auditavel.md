# ADR-003: Motor de Sorteio Auditável

**Data:** 2026-03-10
**Status:** aceito
**Author:** @tech-lead

---

## Contexto

A Circular BACEN 3.432 exige que o sorteio em assembleias seja:
- Transparente e verificável pelos participantes
- Resistente à manipulação (interno ou externo)
- Documentado em ata oficial

Diferencial competitivo: sorteio 100% transparente e auditável publicamente.

---

## Decisão

**Commit-Reveal Scheme** com seed público:

```
1. PRÉ-ASSEMBLEIA (48h antes):
   - Sistema gera seed aleatório (CSPRNG: crypto.randomBytes(32))
   - Publica hash SHA-256 do seed na plataforma (commitment)
   - Participantes podem verificar o commitment publicamente

2. ASSEMBLEIA:
   - Sistema revela o seed original
   - Qualquer um pode verificar: SHA256(seed) == commitment publicado
   - Seed + lista_cotas + numero_assembleia → deterministic shuffle (ChaCha20)
   - Primeiro elemento = contemplado por sorteio

3. PÓS-ASSEMBLEIA:
   - Seed, commitment, resultado e lista de cotas publicados na ata digital
   - Hash da ata registrado em blockchain pública (opcional, Fase 2)
```

---

## Trade-offs

- ✅ Matematicamente impossível manipular após o commitment
- ✅ Qualquer participante pode reprovar o resultado com o seed
- ✅ Diferencial de marketing vs. concorrentes (caixa-preta)
- ⚠️ Requer que o seed não seja comprometido antes da assembleia (mitigado por HSM)
- ⚠️ Complexidade de explicar ao usuário leigo (mitigado por UX simplificada)

---

## Alternativas descartadas

- **Loteria Federal (Caixa)**: dependência externa, delays, custo, não funciona em todos os grupos
- **PRNG simples sem auditoria**: não diferencia da concorrência, risco regulatório
- **Blockchain para cada sorteio**: custo e complexidade desnecessários no MVP

---

## Próximos passos

- [ ] Implementar módulo `sorteio` no assembleia-service
- [ ] Criar testes de reproductibilidade (dado seed + lista → mesmo resultado sempre)
- [ ] UI de verificação pública do sorteio
- [ ] Documentar processo para usuários (FAQ + vídeo)
