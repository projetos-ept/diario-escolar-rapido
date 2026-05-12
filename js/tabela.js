/* =========================================================
   TABELA — render + interações de células
========================================================= */

function gerarTabela(){
    const tabela = document.getElementById("tabela");
    tabela.innerHTML = "";

    /* Auto-ajuste para muitas colunas */
    const totalCols = dados.atividades.length;
    if(totalCols > 6){
        tabela.classList.add("compacto");
    }else{
        tabela.classList.remove("compacto");
    }

    tabela.appendChild(gerarThead());
    tabela.appendChild(gerarTbody());

    if(typeof atualizarCabecalho === "function"){
        atualizarCabecalho();
    }

    if(typeof aplicarFiltros === "function"){
        aplicarFiltros();
    }
}

function gerarThead(){
    const thead = document.createElement("thead");

    /* =====================================================
       LINHA 1 — DATAS
    ===================================================== */
    const trDatas = document.createElement("tr");
    trDatas.classList.add("tr-datas");

    /* célula vazia (Aluno) */
    trDatas.appendChild(Object.assign(document.createElement("th"), {className:"nome-coluna"}));

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

    /* célula vazia (Observações) */
    trDatas.appendChild(Object.assign(document.createElement("th"), {className:"obs-coluna"}));

    /* total dos valores máximos */
    const thTotalMax = document.createElement("th");
    thTotalMax.classList.add("th-total-max");
    atualizarTotalMax(thTotalMax);
    trDatas.appendChild(thTotalMax);

    /* célula vazia (Ações) */
    trDatas.appendChild(Object.assign(document.createElement("th"), {className:"acoes"}));

    thead.appendChild(trDatas);

    /* =====================================================
       LINHA 2 — NOMES + VALORES
    ===================================================== */
    const trHead = document.createElement("tr");

    const thAluno = document.createElement("th");
    thAluno.textContent = "Aluno";
    thAluno.classList.add("nome-coluna");
    trHead.appendChild(thAluno);

    dados.atividades.forEach((atividade, index) => {
        const th = document.createElement("th");
        th.classList.add("th-editavel");

        /* topo: nome + botão remover */
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

        /* rodapé: valor máximo da avaliação */
        const inputValor = document.createElement("input");
        inputValor.type = "text";
        inputValor.classList.add("th-valor");
        inputValor.placeholder = "0.0";
        inputValor.title = "Pontuação máxima";
        inputValor.value = Number(dados.valores[index] || 0).toFixed(1);

        inputValor.addEventListener("focus", () => inputValor.select());
        inputValor.addEventListener("blur", () => {
            const v = normalizarNota(inputValor.value);
            dados.valores[index] = v;
            inputValor.value = v.toFixed(1);
            salvarLocalStorage();
            /* atualiza total máx sem rebuild */
            const thMax = document.querySelector(".th-total-max");
            if(thMax) atualizarTotalMax(thMax);
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

    const thTotal = document.createElement("th");
    thTotal.textContent = "Somatória";
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
    el.textContent = soma > 0 ? soma.toFixed(1) : "";
}

function gerarTbody(){
    const tbody = document.createElement("tbody");

    dados.alunos.forEach((aluno, row) => {
        const tr = document.createElement("tr");
        tr.dataset.nome = (aluno.nome || "").toLowerCase();

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
    td.textContent = Number(aluno.notas[col] || 0).toFixed(1);

    td.addEventListener("focus", () => {
        td.dataset.original = td.textContent;
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

        td.textContent = Number(valor).toFixed(1);
        aluno.total = calcularTotal(aluno);

        const tdTotal = td.parentElement.querySelector(".total");
        if(tdTotal) tdTotal.textContent = aluno.total.toFixed(1);

        salvarLocalStorage();
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

    td.addEventListener("focus", () => {
        td.dataset.original = td.textContent;
    });

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
            salvarLocalStorage();
            gerarTabela();
        }
    });

    td.appendChild(btn);
    return td;
}
