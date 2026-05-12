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

let filtroSemNotaAtivo = false;

function configurarBusca(){
    document
        .getElementById("buscaRapida")
        .addEventListener("input", aplicarFiltros);
}

function aplicarFiltros(){
    const termo = document.getElementById("buscaRapida").value.toLowerCase();

    document.querySelectorAll("tbody tr").forEach((linha, row) => {
        const nome = linha.dataset.nome || "";
        const aluno = dados.alunos[row];
        const casaTermo = nome.includes(termo);
        const semNota = aluno && aluno.notas.some(n => Number(n) === 0);
        const passa = casaTermo && (!filtroSemNotaAtivo || semNota);
        linha.style.display = passa ? "" : "none";
    });
}

function alternarFiltroSemNota(){
    filtroSemNotaAtivo = !filtroSemNotaAtivo;
    const btn = document.getElementById("btnSemNota");
    btn.classList.toggle("ativo", filtroSemNotaAtivo);
    btn.textContent = filtroSemNotaAtivo
        ? "Mostrar todos"
        : "Estudantes sem nota";
    aplicarFiltros();
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
