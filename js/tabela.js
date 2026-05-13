/* =========================================================
   TABELA — render + interações de células
========================================================= */

const selecionados = new Set();

function gerarTabela(){
    const tabela = document.getElementById("tabela");
    tabela.innerHTML = "";

    /* limpa seleções de índices que não existem mais */
    Array.from(selecionados).forEach(idx => {
        if(idx >= dados.alunos.length) selecionados.delete(idx);
    });

    /* Auto-ajuste para muitas colunas */
    const totalCols = dados.atividades.length;
    if(totalCols > 6){
        tabela.classList.add("compacto");
    }else{
        tabela.classList.remove("compacto");
    }

    tabela.appendChild(gerarThead());
    tabela.appendChild(gerarTbody());

    if(typeof atualizarCabecalho === "function") atualizarCabecalho();
    if(typeof aplicarFiltros === "function") aplicarFiltros();
    atualizarBarraSelecao();
}

function gerarThead(){
    const thead = document.createElement("thead");

    /* =====================================================
       LINHA 1 — DATAS
    ===================================================== */
    const trDatas = document.createElement("tr");
    trDatas.classList.add("tr-datas");

    /* célula vazia (checkbox + Aluno) */
    const thVazioSel = document.createElement("th");
    thVazioSel.classList.add("col-selecao");
    trDatas.appendChild(thVazioSel);

    trDatas.appendChild(Object.assign(document.createElement("th"), { className:"nome-coluna" }));

    dados.atividades.forEach((_, index) => {
        const th = document.createElement("th");
        th.classList.add("th-data");

        const input = document.createElement("input");
        input.type = "date";
        input.classList.add("input-data");
        input.title = "Data da avaliação";
        input.value = dados.datas[index] || "";

        input.addEventListener("change", () => {
            dados.datas[index] = input.value;
            salvarLocalStorage();
        });

        th.appendChild(input);
        trDatas.appendChild(th);
    });

    /* Observações, Somatória, Ações ficam vazios na linha de datas */
    trDatas.appendChild(Object.assign(document.createElement("th"), { className:"obs-coluna" }));
    trDatas.appendChild(Object.assign(document.createElement("th"), {}));
    trDatas.appendChild(Object.assign(document.createElement("th"), { className:"acoes" }));

    thead.appendChild(trDatas);

    /* =====================================================
       LINHA 2 — NOMES + VALORES
    ===================================================== */
    const trHead = document.createElement("tr");

    /* checkbox "selecionar todos" */
    const thSelTodos = document.createElement("th");
    thSelTodos.classList.add("col-selecao");
    const chkTodos = document.createElement("input");
    chkTodos.type = "checkbox";
    chkTodos.id = "chkSelecionarTodos";
    chkTodos.title = "Selecionar todos os visíveis";
    chkTodos.addEventListener("change", () => {
        document.querySelectorAll("tbody tr").forEach((tr, row) => {
            if(tr.style.display === "none") return;
            const chk = tr.querySelector(".chk-aluno");
            if(!chk) return;
            chk.checked = chkTodos.checked;
            if(chkTodos.checked) selecionados.add(row);
            else selecionados.delete(row);
        });
        atualizarBarraSelecao();
    });
    thSelTodos.appendChild(chkTodos);
    trHead.appendChild(thSelTodos);

    const thAluno = document.createElement("th");
    thAluno.textContent = "Aluno";
    thAluno.classList.add("nome-coluna");
    trHead.appendChild(thAluno);

    dados.atividades.forEach((atividade, index) => {
        const th = document.createElement("th");
        th.classList.add("th-editavel");

        const topo = document.createElement("div");
        topo.classList.add("th-topo");

        const span = document.createElement("span");
        span.contentEditable = "true";
        span.classList.add("th-nome");
        span.textContent = atividade;
        span.title = "Clique para renomear";

        span.addEventListener("focus", () => {
            span.dataset.original = span.textContent;
            selecionarTudo(span);
        });
        span.addEventListener("input", () => {
            const novo = span.textContent.trim();
            if(novo){ dados.atividades[index] = novo; salvarLocalStorage(); }
        });
        span.addEventListener("blur", () => {
            if(!span.textContent.trim()) span.textContent = dados.atividades[index];
        });

        const btnRemover = document.createElement("button");
        btnRemover.type = "button";
        btnRemover.contentEditable = "false";
        btnRemover.classList.add("btn-remover-atividade");
        btnRemover.textContent = "✕";
        btnRemover.title = "Remover atividade";
        btnRemover.addEventListener("click", e => {
            e.stopPropagation();
            if(dados.atividades.length <= 1){
                alert("É necessário manter pelo menos uma atividade.");
                return;
            }
            if(!confirm("Remover \"" + dados.atividades[index] + "\" e apagar todas as suas notas?")){
                return;
            }
            dados.atividades.splice(index, 1);
            dados.datas.splice(index, 1);
            dados.valores.splice(index, 1);
            dados.alunos.forEach(a => a.notas.splice(index, 1));
            salvarLocalStorage();
            gerarTabela();
        });

        topo.appendChild(span);
        topo.appendChild(btnRemover);

        const inputValor = document.createElement("input");
        inputValor.type = "text";
        inputValor.classList.add("th-valor");
        inputValor.placeholder = "0.0";
        inputValor.title = "Pontuação máxima da avaliação";
        inputValor.value = Number(dados.valores[index] || 0).toFixed(1);

        inputValor.addEventListener("focus", () => inputValor.select());
        inputValor.addEventListener("blur", () => {
            const v = normalizarNota(inputValor.value);
            const num = ehAusente(v) ? 0 : v;
            dados.valores[index] = num;
            inputValor.value = Number(num).toFixed(1);
            salvarLocalStorage();
            const elTotalMax = document.querySelector(".th-total-max-valor");
            if(elTotalMax) atualizarTotalMax(elTotalMax);
        });
        inputValor.addEventListener("keydown", e => {
            if(e.key === "Enter" || e.key === "Escape") inputValor.blur();
        });

        th.appendChild(topo);
        th.appendChild(inputValor);
        trHead.appendChild(th);
    });

    const thObs = document.createElement("th");
    thObs.textContent = "Observações";
    thObs.classList.add("obs-coluna");
    trHead.appendChild(thObs);

    /* Somatória — agora com total máximo abaixo, no mesmo padrão das avaliações */
    const thTotal = document.createElement("th");
    thTotal.classList.add("th-somatoria");

    const topoSom = document.createElement("div");
    topoSom.classList.add("th-topo");
    topoSom.textContent = "Somatória";
    thTotal.appendChild(topoSom);

    const totalMaxBox = document.createElement("div");
    totalMaxBox.classList.add("th-total-max-valor");
    atualizarTotalMax(totalMaxBox);
    thTotal.appendChild(totalMaxBox);
    trHead.appendChild(thTotal);

    const thAcoes = document.createElement("th");
    thAcoes.textContent = "Ações";
    thAcoes.classList.add("acoes");
    trHead.appendChild(thAcoes);

    thead.appendChild(trHead);
    return thead;
}

function atualizarTotalMax(el){
    const soma = (dados.valores || []).reduce((a,b) => a + Number(b||0), 0);
    el.textContent = soma > 0 ? soma.toFixed(1) : "—";
}

function gerarTbody(){
    const tbody = document.createElement("tbody");

    dados.alunos.forEach((aluno, row) => {
        const tr = document.createElement("tr");
        tr.dataset.nome = (aluno.nome || "").toLowerCase();
        if(selecionados.has(row)) tr.classList.add("linha-selecionada");

        tr.appendChild(criarCelulaSelecao(row));
        tr.appendChild(criarCelulaNome(aluno, row));

        dados.atividades.forEach((_, col) => {
            tr.appendChild(criarCelulaNota(aluno, row, col));
        });

        const colObs = dados.atividades.length + 1;
        tr.appendChild(criarCelulaObservacao(aluno, row, colObs));

        aluno.total = calcularTotal(aluno);
        const tdTotal = document.createElement("td");
        tdTotal.textContent = aluno.total.toFixed(1);
        tdTotal.classList.add("total");
        tr.appendChild(tdTotal);

        tr.appendChild(criarCelulaAcoes(row));

        tbody.appendChild(tr);
    });

    return tbody;
}

function criarCelulaSelecao(row){
    const td = document.createElement("td");
    td.classList.add("col-selecao");

    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.classList.add("chk-aluno");
    chk.checked = selecionados.has(row);
    chk.addEventListener("change", () => {
        if(chk.checked){
            selecionados.add(row);
            td.parentElement.classList.add("linha-selecionada");
        }else{
            selecionados.delete(row);
            td.parentElement.classList.remove("linha-selecionada");
        }
        atualizarBarraSelecao();
    });

    td.appendChild(chk);
    return td;
}

function criarCelulaNome(aluno, row){
    const td = document.createElement("td");
    td.contentEditable = "true";
    td.classList.add("editavel","nome-coluna");
    td.textContent = aluno.nome;
    td.dataset.row = row;
    td.dataset.col = 0;

    td.addEventListener("focus", () => {
        td.dataset.original = td.textContent;
        selecionarTudo(td);
    });

    td.addEventListener("input", () => {
        aluno.nome = td.textContent;
        td.parentElement.dataset.nome = aluno.nome.toLowerCase();
        salvarLocalStorage();
    });

    td.addEventListener("keydown", navegarTeclado);
    return td;
}

function criarCelulaNota(aluno, row, col){
    const td = document.createElement("td");
    td.contentEditable = "true";
    td.classList.add("editavel");
    td.dataset.row = row;
    td.dataset.col = col + 1;
    td.textContent = formatarNota(aluno.notas[col]);
    if(ehAusente(aluno.notas[col])) td.classList.add("nota-ausente");

    td.addEventListener("focus", () => {
        td.dataset.original = td.textContent;
        if(ehAusente(aluno.notas[col])) td.textContent = "F";
        selecionarTudo(td);
    });

    td.addEventListener("keydown", navegarTeclado);

    td.addEventListener("blur", () => {
        let valor = normalizarNota(td.textContent);
        const anterior = aluno.notas[col];
        aluno.notas[col] = valor;

        if(calcularSomaCrua(aluno) > TOTAL_MAXIMO){
            alert("A somatória máxima é " + TOTAL_MAXIMO + ".");
            aluno.notas[col] = anterior;
            valor = anterior;
        }

        td.textContent = formatarNota(valor);
        td.classList.toggle("nota-ausente", ehAusente(valor));
        aluno.total = calcularTotal(aluno);

        const tdTotal = td.parentElement.querySelector(".total");
        if(tdTotal) tdTotal.textContent = aluno.total.toFixed(1);

        salvarLocalStorage();

        if(typeof atualizarEstatisticas === "function") atualizarEstatisticas();
    });

    return td;
}

function criarCelulaObservacao(aluno, row, col){
    const td = document.createElement("td");
    td.contentEditable = "true";
    td.classList.add("editavel","observacao","obs-coluna");
    td.dataset.row = row;
    td.dataset.col = col;
    td.textContent = aluno.observacoes || "";

    td.addEventListener("focus", () => { td.dataset.original = td.textContent; });

    td.addEventListener("input", () => {
        aluno.observacoes = td.textContent;
        salvarLocalStorage();
    });

    td.addEventListener("keydown", navegarTeclado);
    return td;
}

function criarCelulaAcoes(row){
    const td = document.createElement("td");
    td.classList.add("acoes");

    const btn = document.createElement("button");
    btn.textContent = "Remover";
    btn.classList.add("btn-remover");
    btn.addEventListener("click", () => {
        const aluno = dados.alunos[row];
        if(confirm("Remover aluno \"" + aluno.nome + "\"?")){
            dados.alunos.splice(row, 1);
            selecionados.delete(row);
            salvarLocalStorage();
            gerarTabela();
        }
    });

    td.appendChild(btn);
    return td;
}
