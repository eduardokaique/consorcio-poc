# ADR-002: PostgreSQL como banco principal + Polyglot Persistence

**Data:** 2026-03-10
**Status:** aceito
**Author:** @tech-lead

---

## Contexto

Sistema financeiro regulado exige:
- ACID compliance em todas as operações de parcelas e fundo comum
- Histórico imutável de transações (auditoria BACEN)
- Consultas analíticas complexas (relatórios SUCOR)
- Armazenamento de documentos (contratos, atas, procurações)
- Cache para sessão e dados frequentemente acessados

---

## Decisão

**Polyglot persistence** com cada tecnologia para seu caso de uso ideal:

| Tecnologia | Uso | Justificativa |
|---|---|---|
| PostgreSQL 16 (AWS RDS Multi-AZ) | Dados transacionais principais | ACID, JSONB, Row-level security |
| Redis 7 (ElastiCache) | Sessão, cache, filas Bull | Sub-millisecond, TTL nativo |
| MongoDB 7 (Atlas) | Logs de auditoria, eventos de domínio | Schema-less, alta escrita |
| AWS S3 | Documentos, contratos, atas PDF | Custo baixo, durabilidade 11 nines |

---

## Modelo de isolamento

Cada microserviço tem seu **próprio schema** no PostgreSQL (não banco separado no MVP):
```
schema: auth
schema: grupos
schema: participantes
schema: assembleias
schema: financeiro
schema: contemplacao
```

Evolução: migrar para RDS separados por serviço se carga justificar (provavelmente Fase 2).

---

## Trade-offs

### Vantagens
- ✅ ACID garante consistência financeira (débito/crédito nunca ficam em estado inconsistente)
- ✅ PostgreSQL JSONB para campos semi-estruturados (configurações de grupo)
- ✅ Row-level security para multi-tenancy futuro
- ✅ Redis elimina consultas ao DB para sessão (100k+ usuários simultâneos)
- ✅ MongoDB ideal para event sourcing (audit trail imutável)

### Desvantagens / Riscos
- ⚠️ 4 tecnologias de dados para o time dominar
- ⚠️ Backup e DR mais complexo
- ⚠️ Schema-per-service ainda compartilha servidor (risco de noisy neighbor)

### Mitigações
- Prisma ORM abstrai PostgreSQL (curva de aprendizado baixa)
- AWS gerencia backup automático (RDS + S3)
- Read replicas para queries analíticas pesadas

---

## Alternativas descartadas

- **MySQL**: descartado por suporte inferior a JSONB e window functions (necessárias para relatórios)
- **CockroachDB**: descartado por custo e complexidade desnecessária para escala inicial
- **MongoDB como banco principal**: descartado por falta de ACID nativo (transações multi-documento mais complexas)
- **DynamoDB**: descartado por queries analíticas inflexíveis e custo em escrita

---

## Próximos passos

- [ ] Criar schemas e migrations iniciais com Prisma
- [ ] Configurar RDS Multi-AZ com failover automático
- [ ] Definir política de backup: RTO < 1h, RPO < 5min
- [ ] Implementar connection pooling (PgBouncer)
- [ ] Configurar read replica para relatórios
