/* =========================================================
   EXPORTAÇÃO
========================================================= */

function baixarJSON(objeto, nome){
    const json = JSON.stringify(objeto, null, 4);
    const blob = new Blob([json], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nome;
    a.click();
    URL.revokeObjectURL(url);
}

function exportarJSON(){
    baixarJSON(dados, slug(dados.titulo) + ".json");
}

function exportarJSONTotal(){
    baixarJSON({
        ...dados,
        mediaTurma: calcularMediaTurma(),
        geradoEm: new Date().toISOString()
    }, slug(dados.titulo) + "-total.json");
}

function calcularMediaTurma(){
    if(dados.alunos.length === 0) return 0;
    let soma = 0;
    dados.alunos.forEach(a => {
        soma += a.total || calcularTotal(a);
    });
    return Number((soma / dados.alunos.length).toFixed(1));
}

function slug(texto){
    return String(texto || "diario")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        || "diario";
}
