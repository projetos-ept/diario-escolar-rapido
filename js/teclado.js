/* =========================================================
   TECLADO E SELEÇÃO
   Navegação tipo planilha + edição Excel-like
========================================================= */

function selecionarTudo(elemento){
    setTimeout(() => {
        const range = document.createRange();
        range.selectNodeContents(elemento);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }, 0);
}

function buscarCelula(row, col){
    return document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
    );
}

/* Total de colunas editáveis por linha:
   col 0 = nome
   col 1..N = notas
   col N+1 = observações
*/
function totalColunas(){
    return dados.atividades.length + 1; // nome + notas + obs (índice máximo = atividades.length + 1)
}

function navegarTeclado(e){
    const atual = e.target;
    const row = Number(atual.dataset.row);
    const col = Number(atual.dataset.col);
    const maxCol = totalColunas();
    const maxRow = dados.alunos.length - 1;

    let prox = null;
    let alvoRow = row;
    let alvoCol = col;

    switch(e.key){
        case "Escape":
            atual.textContent = atual.dataset.original ?? atual.textContent;
            atual.blur();
            return;

        case "ArrowRight":
            if(e.shiftKey || e.ctrlKey) return;
            e.preventDefault();
            alvoCol = col + 1;
            if(alvoCol > maxCol){
                alvoCol = 0;
                alvoRow = row + 1;
            }
            break;

        case "ArrowLeft":
            if(e.shiftKey || e.ctrlKey) return;
            e.preventDefault();
            alvoCol = col - 1;
            if(alvoCol < 0){
                alvoCol = maxCol;
                alvoRow = row - 1;
            }
            break;

        case "ArrowDown":
            e.preventDefault();
            alvoRow = row + 1;
            break;

        case "ArrowUp":
            e.preventDefault();
            alvoRow = row - 1;
            break;

        case "Enter":
            // Em observações, Enter = quebra de linha (não navega)
            if(atual.classList.contains("observacao") && !e.shiftKey){
                return;
            }
            e.preventDefault();
            alvoRow = row + 1;
            break;

        case "Tab":
            e.preventDefault();
            alvoCol = col + (e.shiftKey ? -1 : 1);
            if(alvoCol > maxCol){
                alvoCol = 0;
                alvoRow = row + 1;
            }
            if(alvoCol < 0){
                alvoCol = maxCol;
                alvoRow = row - 1;
            }
            break;

        default:
            return;
    }

    if(alvoRow < 0 || alvoRow > maxRow) return;

    prox = buscarCelula(alvoRow, alvoCol);
    if(prox){
        prox.focus();
        if(!prox.classList.contains("observacao")){
            selecionarTudo(prox);
        }
    }
}

