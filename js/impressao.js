/* =========================================================
   IMPRESSÃO — A4 com customização
   Orientação (landscape/portrait), margens e
   exibir/ocultar coluna de observações
========================================================= */

function aplicarConfigImpressao(){
    const cfg = dados.config || {};
    const orientacao = cfg.orientacao || "landscape";
    const margem = cfg.margem || "8mm";
    const mostrarObs = cfg.mostrarObservacoesNaImpressao !== false;

    document.body.classList.toggle("print-sem-obs", !mostrarObs);

    let style = document.getElementById("estilo-impressao-dinamico");
    if(!style){
        style = document.createElement("style");
        style.id = "estilo-impressao-dinamico";
        document.head.appendChild(style);
    }
    style.textContent =
        "@media print{@page{size:A4 " + orientacao + ";margin:" + margem + ";}}";
}

function imprimirA4(){
    aplicarConfigImpressao();
    setTimeout(() => window.print(), 50);
}

function configurarPainelImpressao(){
    const orient = document.getElementById("cfgOrientacao");
    const margem = document.getElementById("cfgMargem");
    const obs = document.getElementById("cfgMostrarObs");

    orient.value = dados.config.orientacao;
    margem.value = dados.config.margem;
    obs.checked = dados.config.mostrarObservacoesNaImpressao !== false;

    orient.addEventListener("change", () => {
        dados.config.orientacao = orient.value;
        salvarLocalStorage();
        aplicarConfigImpressao();
    });

    margem.addEventListener("change", () => {
        dados.config.margem = margem.value;
        salvarLocalStorage();
        aplicarConfigImpressao();
    });

    obs.addEventListener("change", () => {
        dados.config.mostrarObservacoesNaImpressao = obs.checked;
        salvarLocalStorage();
        aplicarConfigImpressao();
    });

    aplicarConfigImpressao();
}
