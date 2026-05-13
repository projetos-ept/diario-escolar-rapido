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
    dados.datas.push("");
    dados.valores.push(0);
    dados.alunos.forEach(a => a.notas.push(0));

    campo.value = "";
    salvarLocalStorage();
    gerarTabela();
}

function atualizarCabecalho(){
    const tit = document.getElementById("tituloTabela");
    const sub = document.getElementById("subtituloTabela");
    const meta = document.getElementById("metaPlanilha");

    if(document.activeElement !== tit){
        tit.textContent = dados.titulo || "Diário Rápido";
    }
    if(document.activeElement !== sub){
        sub.textContent = dados.subtitulo || "Planilha de Notas";
    }

    meta.innerHTML = "";
    if(dados.disciplina && dados.disciplina.trim()){
        meta.appendChild(criarMeta("Disciplina", dados.disciplina));
    }
    if(dados.professor && dados.professor.trim()){
        meta.appendChild(criarMeta("Professor", dados.professor));
    }

    const disc = document.getElementById("cfgDisciplina");
    const prof = document.getElementById("cfgProfessor");
    if(disc && document.activeElement !== disc) disc.value = dados.disciplina || "";
    if(prof && document.activeElement !== prof) prof.value = dados.professor || "";
}

function criarMeta(rotulo, valor){
    const span = document.createElement("span");
    span.classList.add("meta");
    const r = document.createElement("span");
    r.classList.add("meta-rotulo");
    r.textContent = rotulo + ":";
    span.appendChild(r);
    span.appendChild(document.createTextNode(" " + valor));
    return span;
}

function configurarCabecalhoEditavel(){
    const tit = document.getElementById("tituloTabela");
    const sub = document.getElementById("subtituloTabela");

    const ligarEdicao = (el, chave, padrao) => {
        el.addEventListener("input", () => {
            dados[chave] = el.textContent;
            salvarLocalStorage();
        });

        el.addEventListener("blur", () => {
            const txt = el.textContent.trim();
            dados[chave] = txt || padrao;
            el.textContent = dados[chave];
            salvarLocalStorage();
        });

        el.addEventListener("keydown", e => {
            if(e.key === "Enter"){
                e.preventDefault();
                el.blur();
            }
            if(e.key === "Escape"){
                el.textContent = dados[chave] || padrao;
                el.blur();
            }
        });

        el.addEventListener("paste", e => {
            e.preventDefault();
            const txt = (e.clipboardData || window.clipboardData)
                .getData("text").replace(/\r?\n/g, " ");
            document.execCommand("insertText", false, txt);
        });
    };

    ligarEdicao(tit, "titulo", "Diário Rápido");
    ligarEdicao(sub, "subtitulo", "Planilha de Notas");
}

function configurarMetadados(){
    const disc = document.getElementById("cfgDisciplina");
    const prof = document.getElementById("cfgProfessor");

    disc.value = dados.disciplina || "";
    prof.value = dados.professor || "";

    disc.addEventListener("input", () => {
        dados.disciplina = disc.value;
        salvarLocalStorage();
        atualizarCabecalho();
    });

    prof.addEventListener("input", () => {
        dados.professor = prof.value;
        salvarLocalStorage();
        atualizarCabecalho();
    });
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
    const elTotal = document.getElementById("estatTotal");
    const elAprov = document.getElementById("estatAprovados");
    const elRepr = document.getElementById("estatReprovados");
    const elCorte = document.getElementById("estatCorte");
    if(!elTotal || !elAprov || !elRepr || !elCorte) return;

    const corte = obterMediaCorte();
    let aprovados = 0;
    let reprovados = 0;

    dados.alunos.forEach(a => {
        const total = calcularTotal(a);
        if(total >= corte) aprovados++;
        else reprovados++;
    });

    elTotal.textContent = dados.alunos.length;
    elAprov.textContent = aprovados;
    elRepr.textContent = reprovados;
    elCorte.textContent = corte.toFixed(1);
}

/* =========================================================
   SELEÇÃO DE ALUNOS
========================================================= */
function atualizarBarraSelecao(){
    const barra = document.getElementById("barraAcoesSelecao");
    const contador = document.getElementById("contadorSelecao");
    if(!barra || !contador) return;

    const n = selecionados.size;
    contador.textContent = n;
    barra.hidden = n === 0;

    const chkTodos = document.getElementById("chkSelecionarTodos");
    if(chkTodos){
        const visiveis = Array.from(document.querySelectorAll("tbody tr"))
            .filter(tr => tr.style.display !== "none").length;
        chkTodos.checked = visiveis > 0 && n >= visiveis;
        chkTodos.indeterminate = n > 0 && n < visiveis;
    }
}

function limparSelecao(){
    selecionados.clear();
    document.querySelectorAll(".chk-aluno").forEach(c => c.checked = false);
    document.querySelectorAll("tbody tr").forEach(tr => tr.classList.remove("linha-selecionada"));
    atualizarBarraSelecao();
}

function imprimirSelecionados(){
    if(selecionados.size === 0) return;
    document.querySelectorAll("tbody tr").forEach((tr, row) => {
        if(!selecionados.has(row)) tr.classList.add("ocultar-impressao");
    });
    const limpar = () => {
        document.querySelectorAll(".ocultar-impressao")
            .forEach(tr => tr.classList.remove("ocultar-impressao"));
        window.removeEventListener("afterprint", limpar);
    };
    window.addEventListener("afterprint", limpar);
    if(typeof aplicarConfigImpressao === "function") aplicarConfigImpressao();
    setTimeout(() => window.print(), 50);
}

function excluirSelecionados(){
    const n = selecionados.size;
    if(n === 0) return;
    const resposta = prompt(
        "Você está prestes a excluir " + n + " aluno(s).\n\n" +
        "Esta ação é irreversível.\n" +
        "Digite \"excluir\" (sem aspas) para confirmar:"
    );
    if(resposta === null) return;
    if(resposta.trim().toLowerCase() !== "excluir"){
        alert("Confirmação inválida. Nenhum aluno foi excluído.");
        return;
    }
    const indices = Array.from(selecionados).sort((a,b) => b - a);
    indices.forEach(i => dados.alunos.splice(i, 1));
    selecionados.clear();
    salvarLocalStorage();
    gerarTabela();
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
    console.log("F =>", normalizarNota("F"));
    console.log("ausente =>", normalizarNota("ausente"));
    console.log("TOTAL [3,2,F]:", calcularTotal({ notas:[3,2,"F"] }));
}

/* =========================================================
   INIT
========================================================= */
function init(){
    carregarLocalStorage();
    configurarCabecalhoEditavel();
    configurarMetadados();
    gerarTabela();
    configurarBusca();
    configurarPainelImpressao();
    configurarMenu();
    atualizarEstatisticas();
    smokeTests();
}

document.addEventListener("DOMContentLoaded", init);
