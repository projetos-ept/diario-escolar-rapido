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

    document.getElementById("tituloTabela").textContent = dados.titulo;
}

function gerarThead(){
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");

    /* Coluna Aluno */
    const thAluno = document.createElement("th");
    thAluno.textContent = "Aluno";
    thAluno.classList.add("nome-coluna");
    trHead.appendChild(thAluno);

    /* Atividades (renomeáveis, NÃO removíveis) */
    dados.atividades.forEach((atividade, index) => {
        const th = document.createElement("th");
        th.contentEditable = "true";
        th.classList.add("th-editavel");
        th.textContent = atividade;
        th.title = "Clique para renomear (atividades não podem ser removidas para preservar dados)";

        th.addEventListener("focus", () => {
            th.dataset.original = th.textContent;
            selecionarTudo(th);
        });

        th.addEventListener("input", () => {
            const novo = th.textContent.trim();
            if(novo){
                dados.atividades[index] = novo;
                salvarLocalStorage();
            }
        });

        th.addEventListener("blur", () => {
            if(!th.textContent.trim()){
                th.textContent = dados.atividades[index];
            }
        });

        trHead.appendChild(th);
    });

    /* Observações */
    const thObs = document.createElement("th");
    thObs.textContent = "Observações";
    thObs.classList.add("obs-coluna");
    trHead.appendChild(thObs);

    /* Somatória */
    const thTotal = document.createElement("th");
    thTotal.textContent = "Somatória";
    trHead.appendChild(thTotal);

    /* Ações */
    const thAcoes = document.createElement("th");
    thAcoes.textContent = "Ações";
    thAcoes.classList.add("acoes");
    trHead.appendChild(thAcoes);

    thead.appendChild(trHead);
    return thead;
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
        const valor = normalizarNota(td.textContent);
        const anterior = aluno.notas[col];
        aluno.notas[col] = valor;

        if(calcularSomaCrua(aluno) > TOTAL_MAXIMO){
            alert("A somatória máxima é " + TOTAL_MAXIMO + ".");
            aluno.notas[col] = anterior;
        }

        salvarLocalStorage();
        gerarTabela();
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
