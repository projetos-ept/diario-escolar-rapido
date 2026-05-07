# Diário Escolar Inteligente

Sistema HTML offline para gerenciamento de notas escolares com:

- tabela dinâmica
- importação/exportação JSON
- navegação por teclado
- impressão otimizada em A4
- salvamento automático em LocalStorage
- funcionamento offline

---

# Objetivo

O projeto foi criado para funcionar como um:

- mini diário eletrônico
- planilha escolar portátil
- sistema offline de lançamento de notas
- gerador de tabelas imprimíveis

Tudo utilizando apenas:

- HTML
- CSS
- JavaScript puro

Sem necessidade de:

- servidor
- banco de dados
- internet
- frameworks

---

# Funcionalidades

## Gestão de estudantes

✅ adicionar estudantes  
✅ editar nome diretamente na tabela  
✅ busca rápida de estudantes  

---

## Gestão de atividades

✅ adicionar atividades  
✅ editar título da atividade clicando no cabeçalho  
✅ atividades dinâmicas  

---

## Notas

✅ edição rápida  
✅ navegação por teclado estilo Excel  

### Regras automáticas

| Entrada | Resultado |
|---|---|
| `3` | `3.0` |
| `25` | `2.5` |
| `9.7` | `9.7` |

---

## Controle de somatória

A soma total das atividades:

```text
P1 + P2 + P3 + ... + Pn
```

nunca pode ultrapassar:

```text
10.0
```

Se ultrapassar:

- o sistema alerta
- a última nota é zerada automaticamente

---

# Navegação por teclado

## Suportado

| Tecla | Função |
|---|---|
| ↑ | sobe |
| ↓ | desce |
| ← | esquerda |
| → | direita |
| Enter | próxima linha |
| Tab | próxima coluna |

---

# Impressão

## Otimizado para

✅ folha A4  
✅ modo paisagem  
✅ PDF  

---

## A impressão remove automaticamente

- botões
- campos
- textarea JSON
- importadores
- interface de edição

Imprime apenas:

✅ título  
✅ tabela  
✅ notas  

---

# Salvamento automático

Todos os dados são salvos automaticamente usando:

```javascript
localStorage
```

Mesmo fechando o navegador os dados permanecem salvos.

---

# Importação JSON

## 1. Colar JSON

Área:

```text
Cole o JSON aqui
```

---

## 2. Arquivo JSON

Botão:

```text
Importar Arquivo JSON
```

---

# Exportação JSON

## Exportação simples

```text
Exportar JSON
```

Exporta:

- alunos
- notas
- atividades

---

## Exportação total

```text
Exportar Total JSON
```

Exporta:

- alunos
- atividades
- totais
- média da turma
- configurações

---

# Estrutura JSON

## Estrutura padrão

```json
{
    "titulo": "Diário Escolar",

    "atividades": [
        "P1",
        "P2",
        "P3"
    ],

    "alunos": [

        {
            "nome": "Aluno 1",
            "notas": [2,3,5]
        }

    ]
}
```

---

# Estrutura de aluno

```json
{
    "nome":"Aluno",
    "notas":[2,3,5]
}
```

---

# Como executar

## Método simples

Basta abrir:

```text
arquivo.html
```

no navegador.

Recomendado:

- Chrome
- Edge
- Firefox

---

# Compatibilidade

## Desktop

✅ Windows  
✅ Linux  
✅ macOS  

---

## Mobile

✅ Android  
✅ iPhone  

---

# Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript Vanilla

---

# Arquitetura

O sistema é dividido em:

| Área | Função |
|---|---|
| HTML | estrutura |
| CSS | aparência |
| JS | lógica |

---

# Recursos implementados

## Interface

✅ responsiva  
✅ adaptável  
✅ impressão limpa  
✅ tabela dinâmica  

---

## Edição

✅ inline editing  
✅ seleção automática  
✅ foco inteligente  

---

## Persistência

✅ LocalStorage  
✅ exportação JSON  
✅ importação JSON  

---

# Smoke Tests implementados

O sistema possui testes básicos internos:

```javascript
normalizarNota(25)
normalizarNota(3)
calcularTotal([3,2,5])
```

---

# Melhorias futuras sugeridas

## Possíveis evoluções

- médias automáticas
- recuperação
- frequência
- conceitos
- exportação XLSX
- exportação PDF direta
- PWA instalável
- modo escuro
- múltiplas turmas
- autenticação
- sincronização em nuvem

---

# Estrutura recomendada futura

```json
{
    "config": {},
    "atividades": [],
    "alunos": [],
    "estatisticas": {}
}
```

---

# Licença

Uso livre para fins:

- educacionais
- escolares
- acadêmicos
- institucionais

---

# Autor

Projeto desenvolvido para gerenciamento escolar simples, portátil e offline utilizando tecnologias web puras.
