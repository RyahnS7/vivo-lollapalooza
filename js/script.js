
/* =====================================
   ABRIR PEÇAS
===================================== */

function abrirPeca(numero) {

    const peca = document.getElementById("peca-" + numero);

    if (!peca) return;

    // Esconde todas as páginas
    document.querySelectorAll(".page").forEach(pagina => {
        pagina.classList.remove("active");
    });

    // Mostra somente a peça escolhida
    peca.classList.add("active");

    // Atualiza o endereço
    history.pushState(
        { pagina: numero },
        "",
        "#peca-" + numero
    );

    // Volta para o topo
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================
   VOLTAR AO INÍCIO
===================================== */

function voltarInicio() {

    document.querySelectorAll(".page").forEach(pagina => {
        pagina.classList.remove("active");
    });

    document.getElementById("inicio").classList.add("active");

    history.pushState(
        { pagina: "inicio" },
        "",
        window.location.pathname
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================
   NAVEGAÇÃO PELO HISTÓRICO
===================================== */

window.addEventListener("popstate", () => {

    const hash = window.location.hash;
    const numero = hash.match(/^#peca-([1-4])$/);

    if (numero) {
        abrirPeca(Number(numero[1]));
    } else {
        voltarInicio();
    }

});
