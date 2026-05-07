# Diário Escolar Inteligente

Sistema HTML offline para gerenciamento de notas escolares com:

- tabela dinâmica
- importação/exportação JSON
- navegação por teclado tipo Excel
- impressão A4 customizável (paisagem/retrato, margens, observações)
- salvamento automático em LocalStorage
- funcionamento 100% offline
- coluna de observações por aluno

---

# Objetivo

Sistema autocontido para:

- mini diário eletrônico
- planilha escolar portátil
- lançamento de notas e observações
- gerador de relatórios imprimíveis em A4

Construído apenas com HTML, CSS e JavaScript puro. Sem servidor, banco de dados, internet ou frameworks. Exportou JSON: só subir e rodar em qualquer lugar.

---

# Estrutura do projeto (v2)

```text
diario-escolar-rapido/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── storage.js      → persistência e migração de dados
    ├── validacao.js    → normalização de notas e somas
    ├── teclado.js      → navegação tipo planilha
    ├── tabela.js       → render da tabela e células
    ├── importacao.js   → importar JSON (arquivo / colado)
    ├── exportacao.js   → exportar JSON (simples / total)
    ├── impressao.js    → painel A4 customizável
    └── app.js          → orquestração e inicialização
```

---

# Funcionalidades

## Alunos

- adicionar aluno único
- adicionar alunos em massa (um nome por linha)
- editar nome diretamente na tabela
- remover aluno (com confirmação)
- busca rápida por nome

## Atividades

- adicionar atividade
- renomear clicando no cabeçalho
- remover atividade pelo botão `✕` no header (com confirmação)
- mantém no mínimo uma atividade

## Notas

- edição inline
- seleção automática ao focar
- normalização inteligente de entrada
- limite de somatória total = 10
- atualização in-place do total (sem rebuild)

### Regras de normalização

| Entrada | Resultado |
|---------|-----------|
| `3`     | `3.0`     |
| `25`    | `2.5`     |
| `9.7`   | `9.7`     |
| `,5`    | `0.5`     |

## Observações

Coluna dedicada por aluno para registrar:

- comportamento
- pendências
- recuperação
- entrega de atividade

Suporta múltiplas linhas (Enter cria nova linha dentro da observação).

---

# Navegação por teclado

| Tecla       | Função                                              |
|-------------|------------------------------------------------------|
| `↑` `↓`     | célula acima / abaixo                               |
| `←` `→`     | célula esquerda / direita                           |
| `→` no fim  | pula para o início da próxima linha                 |
| `←` no início | volta para o fim da linha anterior                |
| `Enter`     | próxima linha (em observações: nova linha no texto) |
| `Tab`       | próxima coluna                                      |
| `Shift+Tab` | coluna anterior                                     |
| `Esc`       | cancela edição e restaura valor original            |

---

# Impressão A4 customizável

Painel de impressão com:

- **Orientação**: paisagem ou retrato
- **Margem**: 5 / 8 / 12 / 20 mm
- **Observações**: incluir ou ocultar na impressão

Configuração persistida no JSON e aplicada via `@page` dinâmico.

A impressão remove automaticamente:

- controles
- campos de busca e título
- textareas de JSON
- painel de configuração
- botões de remover

---

# Persistência

Todos os dados são salvos automaticamente em `localStorage`. Fechar o navegador não perde nada.

Chave: `diarioEscolarInteligente`

---

# Importação / Exportação JSON

## Importar

- **Arquivo**: campo `file` + botão `Importar Arquivo JSON`
- **Colado**: textarea + botão `Importar JSON Colado`

A importação aplica migração automática para preservar compatibilidade com JSONs antigos (preenche `observacoes` e `config` ausentes).

## Exportar

- **Exportar JSON**: dados puros (`titulo`, `atividades`, `alunos`, `config`)
- **Exportar Total JSON**: inclui `mediaTurma` e `geradoEm`

Nome do arquivo gerado a partir do slug do título.

---

# Estrutura JSON

```json
{
    "titulo": "Diário Escolar",
    "atividades": ["P1", "P2", "P3"],
    "alunos": [
        {
            "nome": "Aluno 1",
            "notas": [2, 3, 5],
            "observacoes": "Precisa entregar relatório"
        }
    ],
    "config": {
        "orientacao": "landscape",
        "margem": "8mm",
        "mostrarObservacoesNaImpressao": true
    }
}
```

---

# Como executar

Basta abrir `index.html` no navegador (Chrome, Edge ou Firefox). Funciona via `file://`, sem servidor.

Para servir localmente (opcional):

```bash
python3 -m http.server 8000
```

---

# Compatibilidade

| Plataforma | Suporte |
|------------|---------|
| Windows    | ✅      |
| Linux      | ✅      |
| macOS      | ✅      |
| Android    | ✅      |
| iOS        | ✅      |

---

# Tecnologias

- HTML5
- CSS3
- JavaScript Vanilla (ES6+)

Zero dependências externas.

---

# Roadmap futuro

Já entregue (v2):

- ✅ refatoração modular
- ✅ cabeçalho editável corrigido
- ✅ coluna de observações
- ✅ remoção de atividades
- ✅ adição em massa de alunos
- ✅ navegação infinita por teclado
- ✅ painel de impressão customizável
- ✅ auto-ajuste para muitas colunas

Possível v3:

- exportação XLSX
- geração direta de PDF
- PWA instalável
- IndexedDB no lugar de LocalStorage
- múltiplas turmas em um único arquivo
- modo escuro

---

# Licença

Uso livre para fins educacionais, escolares, acadêmicos e institucionais.
