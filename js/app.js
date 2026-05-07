/* =========================================================
   APP — orquestração e ações de UI
========================================================= */

function adicionarAluno(){
    const campo = document.getElementById("novoAluno");
    const nome = campo.value.trim();
    if(!nome) return;

    dados.alunos.push({
        nome,
        notas: dados.atividades.map(() => 0),
        observacoes: ""
    });

    campo.value = "";
    salvarLocalStorage();
    gerarTabela();
}

function adicionarAlunosEmMassa(){
    const campo = document.getElementById("alunosEmMassa");
    const linhas = campo.value
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean);

    if(linhas.length === 0) return;

    linhas.forEach(nome => {
        dados.alunos.push({
            nome,
            notas: dados.atividades.map(() => 0),
            observacoes: ""
        });
    });

    campo.value = "";
    salvarLocalStorage();
    gerarTabela();
}

function adicionarAtividade(){
    const campo = document.getElementById("novaAtividade");
    const atividade = campo.value.trim();
    if(!atividade) return;

    dados.atividades.push(atividade);
    dados.alunos.forEach(a => a.notas.push(0));

    campo.value = "";
    salvarLocalStorage();
    gerarTabela();
}

function alterarTitulo(){
    const titulo = document.getElementById("tituloInput").value.trim();
    if(!titulo) return;
    dados.titulo = titulo;
    salvarLocalStorage();
    gerarTabela();
}

function configurarBusca(){
    document
        .getElementById("buscaRapida")
        .addEventListener("input", e => {
            const termo = e.target.value.toLowerCase();
            document.querySelectorAll("tbody tr").forEach(linha => {
                const nome = linha.dataset.nome || "";
                linha.style.display = nome.includes(termo) ? "" : "none";
            });
        });
}

function smokeTests(){
    console.log("25 =>", normalizarNota(25));
    console.log("3 =>", normalizarNota(3));
    console.log("9.7 =>", normalizarNota(9.7));
    console.log("TOTAL:", calcularTotal({ notas:[3,2,5] }));
}

/* =========================================================
   INIT
========================================================= */
function init(){
    carregarLocalStorage();
    gerarTabela();
    configurarBusca();
    configurarPainelImpressao();
    smokeTests();
}

document.addEventListener("DOMContentLoaded", init);
