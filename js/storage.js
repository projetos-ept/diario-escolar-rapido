/* =========================================================
   STORAGE
   Persistência local + estrutura padrão dos dados
========================================================= */

const STORAGE_KEY = "diarioEscolarInteligente";

const dadosPadrao = () => ({
    titulo:"Diário Escolar",
    atividades:["P1","P2","P3"],
    alunos:[],
    config:{
        orientacao:"landscape",
        margem:"8mm",
        mostrarObservacoesNaImpressao:true
    }
});

let dados = dadosPadrao();

function salvarLocalStorage(){
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(dados)
    );
}

function carregarLocalStorage(){
    const salvo = localStorage.getItem(STORAGE_KEY);
    if(!salvo) return;
    try{
        const parsed = JSON.parse(salvo);
        dados = migrar(parsed);
    }catch{
        dados = dadosPadrao();
    }
}

/* =========================================================
   MIGRAÇÃO
   Garante compatibilidade com JSONs antigos
========================================================= */
function migrar(obj){
    const base = dadosPadrao();
    const out = {
        ...base,
        ...obj,
        config:{
            ...base.config,
            ...(obj.config || {})
        }
    };

    if(!Array.isArray(out.atividades) || out.atividades.length === 0){
        out.atividades = ["P1","P2","P3"];
    }

    if(!Array.isArray(out.alunos)){
        out.alunos = [];
    }

    out.alunos = out.alunos.map(a => ({
        nome: a.nome || "",
        notas: Array.isArray(a.notas)
            ? a.notas.slice(0, out.atividades.length)
            : [],
        observacoes: typeof a.observacoes === "string"
            ? a.observacoes
            : ""
    }));

    out.alunos.forEach(a => {
        while(a.notas.length < out.atividades.length){
            a.notas.push(0);
        }
    });

    return out;
}
