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
let filtroAprovacao = "off"; // "off" | "aprovados" | "reprovados"

function configurarBusca(){
    document
        .getElementById("buscaRapida")
        .addEventListener("input", aplicarFiltros);

    document
        .getElementById("mediaCorte")
        .addEventListener("input", aplicarFiltros);
}

function configurarMenu(){
    const botoes = document.querySelectorAll("[data-dropdown]");

    botoes.forEach(btn => {
        btn.addEventListener("click", e => {
            e.stopPropagation();
            const dropdown = btn.parentElement;
            const jaAberto = dropdown.classList.contains("aberto");

            document
                .querySelectorAll(".dropdown.aberto")
                .forEach(d => d.classList.remove("aberto"));

            if(!jaAberto) dropdown.classList.add("aberto");
        });
    });

    document.addEventListener("click", e => {
        if(!e.target.closest(".dropdown")){
            document
                .querySelectorAll(".dropdown.aberto")
                .forEach(d => d.classList.remove("aberto"));
        }
    });

    document.addEventListener("keydown", e => {
        if(e.key === "Escape"){
            document
                .querySelectorAll(".dropdown.aberto")
                .forEach(d => d.classList.remove("aberto"));
        }
    });
}

function obterMediaCorte(){
    const v = parseFloat(document.getElementById("mediaCorte").value);
    return isNaN(v) ? 5.0 : v;
}

function atualizarEstatisticas(){
    const corte = obterMediaCorte();
    let aprovados = 0;
    let reprovados = 0;

    dados.alunos.forEach(a => {
        const total = calcularTotal(a);
        if(total >= corte) aprovados++;
        else reprovados++;
    });

    document.getElementById("estatTotal").textContent = dados.alunos.length;
    document.getElementById("estatAprovados").textContent = aprovados;
    document.getElementById("estatReprovados").textContent = reprovados;
    document.getElementById("estatCorte").textContent = corte.toFixed(1);
}

function aplicarFiltros(){
    const termo = document.getElementById("buscaRapida").value.toLowerCase();
    const corte = obterMediaCorte();
    atualizarEstatisticas();

    document.querySelectorAll("tbody tr").forEach((linha, row) => {
        const nome = linha.dataset.nome || "";
        const aluno = dados.alunos[row];
        if(!aluno){
            linha.style.display = "none";
            return;
        }

        const casaTermo = nome.includes(termo);
        const semNota = aluno.notas.some(n => Number(n) === 0);
        const total = calcularTotal(aluno);
        const aprovado = total >= corte;

        let casaAprovacao = true;
        if(filtroAprovacao === "aprovados") casaAprovacao = aprovado;
        if(filtroAprovacao === "reprovados") casaAprovacao = !aprovado;

        const passa =
            casaTermo &&
            (!filtroSemNotaAtivo || semNota) &&
            casaAprovacao;

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

function alternarFiltroAprovacao(){
    const ordem = ["off", "aprovados", "reprovados"];
    const idx = ordem.indexOf(filtroAprovacao);
    filtroAprovacao = ordem[(idx + 1) % ordem.length];

    const btn = document.getElementById("btnAprovacao");
    btn.classList.remove("aprovado","reprovado");

    if(filtroAprovacao === "aprovados"){
        btn.textContent = "Mostrando: Aprovados";
        btn.classList.add("aprovado");
    }else if(filtroAprovacao === "reprovados"){
        btn.textContent = "Mostrando: Reprovados";
        btn.classList.add("reprovado");
    }else{
        btn.textContent = "Filtrar aprovação";
    }

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
    configurarMenu();
    smokeTests();
}

document.addEventListener("DOMContentLoaded", init);
