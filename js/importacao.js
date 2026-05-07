/* =========================================================
   IMPORTAÇÃO
========================================================= */

function importarArquivoJSON(){
    const arquivo = document.getElementById("importarArquivo").files[0];
    if(!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = e => {
        try{
            dados = migrar(JSON.parse(e.target.result));
            salvarLocalStorage();
            gerarTabela();
        }catch{
            alert("Arquivo JSON inválido.");
        }
    };
    leitor.readAsText(arquivo);
}

function importarJSONColado(){
    try{
        const txt = document.getElementById("jsonPaste").value;
        dados = migrar(JSON.parse(txt));
        salvarLocalStorage();
        gerarTabela();
        alert("JSON importado.");
    }catch{
        alert("JSON inválido.");
    }
}
