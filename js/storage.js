/* =========================================================
   STORAGE
   Persistência local + estrutura padrão dos dados
========================================================= */

const STORAGE_KEY = "diarioEscolarInteligente";

const dadosPadrao = () => ({
    titulo:"Diário Rápido",
    subtitulo:"Planilha de Notas",
    disciplina:"",
    professor:"",
    atividades:["P1","P2","P3"],
    datas:["","",""],
    valores:[0,0,0],
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

    if(typeof out.subtitulo !== "string") out.subtitulo = base.subtitulo;
    if(typeof out.disciplina !== "string") out.disciplina = "";
    if(typeof out.professor !== "string") out.professor = "";

    if(!Array.isArray(out.datas)) out.datas = out.atividades.map(() => "");
    if(!Array.isArray(out.valores)) out.valores = out.atividades.map(() => 0);
    while(out.datas.length < out.atividades.length) out.datas.push("");
    while(out.valores.length < out.atividades.length) out.valores.push(0);

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
