# US-002 — Onboarding e Contratação Digital

**Epic:** Contratação
**Sprint:** 2–3
**Pontos:** 13
**Author:** @product-manager | Review: @qa-engineer

---

## User Story

**Como** pessoa física interessada em um consórcio,
**Quero** me cadastrar e contratar 100% pelo app/web,
**Para que** eu não precise ir a uma agência ou assinar papel físico.

---

## Critérios de Aceite

### Cenário 1 — Cadastro básico
```gherkin
Dado que clico em "Contratar" ou "Criar conta"
Quando preencho nome completo, CPF, data de nascimento, email e celular
Então recebo SMS com código OTP de 6 dígitos
  E após validar o OTP, avanço para a etapa de dados complementares
```

### Cenário 2 — Validação de CPF
```gherkin
Dado que informo meu CPF
Quando o sistema consulta a Receita Federal via Serpro
Então:
  - CPF válido e regular: avanço normalmente
  - CPF inválido: vejo erro "CPF inválido"
  - CPF suspenso/cancelado: vejo "Não foi possível completar o cadastro. Entre em contato."
  - CPF de menor de 18 anos: vejo "Você precisa ter 18 anos para contratar"
```

### Cenário 3 — Biometria facial (KYC)
```gherkin
Dado que cheguei na etapa de validação de identidade
Quando envio foto do documento (RG ou CNH) frente e verso
  E realizo selfie com prova de vida (piscar olhos)
Então o sistema iDwall processa em < 30 segundos
  E se aprovado avanço para a próxima etapa
  E se reprovado vejo orientação de reenvio (máx. 3 tentativas)
```

### Cenário 4 — Escolha do plano
```gherkin
Dado que completei o KYC
Quando visualizo os grupos disponíveis para a categoria e valor simulado
Então vejo:
  - Número do grupo
  - Vagas disponíveis
  - Data da próxima assembleia
  - Valor da 1ª parcela
Quando seleciono um grupo e clico em "Continuar"
Então vejo o resumo completo do contrato
```

### Cenário 5 — Assinatura eletrônica
```gherkin
Dado que revisei o resumo do contrato
Quando clico em "Assinar contrato"
Então visualizo o contrato completo em PDF
  E assino via DocuSign com certificado ICP-Brasil
  E recebo o contrato assinado por email em < 5 minutos
```

### Cenário 6 — Pagamento da 1ª parcela
```gherkin
Dado que assinei o contrato
Quando escolho a forma de pagamento da 1ª parcela
Então posso pagar via:
  - Pix (QR code gerado instantaneamente, expira em 30min)
  - Boleto (vence em 3 dias úteis)
Quando o pagamento é confirmado
Então recebo confirmação por email e SMS
  E minha cota é ativada no grupo
```

### Cenário 7 — Onboarding PJ
```gherkin
Dado que seleciono "Pessoa Jurídica" no início do cadastro
Então o fluxo adiciona etapas de:
  - CNPJ (validação Receita Federal)
  - Dados do responsável legal (CPF + biometria)
  - Upload: contrato social, procuração (se aplicável)
  - Faturamento anual (para análise de capacidade)
```

---

## Definição de Pronto

- [ ] Integração iDwall em sandbox aprovada
- [ ] Integração Serpro CPF funcionando
- [ ] Fluxo DocuSign configurado com template do contrato
- [ ] Pix integrado via Celcoin (geração de cobrança)
- [ ] Testes E2E cobrindo happy path completo
- [ ] Testes de borda: CPF inválido, KYC rejeitado, pagamento expirado
- [ ] Acessibilidade: WCAG 2.1 AA

---

## Dependências

- US-003 (Gestão de Grupos): precisa existir ao menos 1 grupo ativo
- Contrato base revisado pelo jurídico
- Credenciais de produção: iDwall, Serpro, DocuSign, Celcoin
