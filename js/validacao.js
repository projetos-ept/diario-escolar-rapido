/* =========================================================
   VALIDAÇÃO DE NOTAS
========================================================= */

const NOTA_MAXIMA = 10;
const TOTAL_MAXIMO = 10;
const AUSENTE = "F";

function ehAusente(valor){
    return valor === AUSENTE ||
        String(valor).trim().toUpperCase() === "F" ||
        String(valor).trim().toLowerCase() === "ausente";
}

function normalizarNota(valor){
    if(ehAusente(valor)) return AUSENTE;

    valor = String(valor).replace(",", ".").trim();

    if(valor === "") return 0;

    /* 25 => 2.5 quando não tem ponto */
    if(!valor.includes(".") && Number(valor) > NOTA_MAXIMA){
        valor = Number(valor) / 10;
    }

    valor = Number(valor);

    if(isNaN(valor)) valor = 0;
    if(valor < 0) valor = 0;
    if(valor > NOTA_MAXIMA) valor = NOTA_MAXIMA;

    return Number(valor.toFixed(1));
}

function notaParaNumero(valor){
    if(ehAusente(valor)) return 0;
    const n = Number(valor);
    return isNaN(n) ? 0 : n;
}

function formatarNota(valor){
    if(ehAusente(valor)) return "Ausente";
    return Number(valor || 0).toFixed(1);
}

function calcularTotal(aluno){
    const total = aluno.notas.reduce(
        (a,b) => a + notaParaNumero(b),
        0
    );
    return Number(Math.min(total, TOTAL_MAXIMO).toFixed(1));
}

function calcularSomaCrua(aluno){
    return aluno.notas.reduce(
        (a,b) => a + notaParaNumero(b),
        0
    );
}
