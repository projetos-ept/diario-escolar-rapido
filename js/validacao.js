/* =========================================================
   VALIDAÇÃO DE NOTAS
========================================================= */

const NOTA_MAXIMA = 10;
const TOTAL_MAXIMO = 10;

function normalizarNota(valor){
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

function calcularTotal(aluno){
    const total = aluno.notas.reduce(
        (a,b) => a + Number(b || 0),
        0
    );
    return Number(Math.min(total, TOTAL_MAXIMO).toFixed(1));
}

function calcularSomaCrua(aluno){
    return aluno.notas.reduce(
        (a,b) => a + Number(b || 0),
        0
    );
}
