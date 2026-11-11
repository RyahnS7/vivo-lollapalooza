
/* =====================================
   ABRIR CAMPANHAS
===================================== */

function abrirCampanha(numero) {

    const campanha = document.getElementById("campanha-" + numero);

    if (!campanha) return;

    // Esconde todas as páginas
    document.querySelectorAll(".page").forEach(pagina => {
        pagina.classList.remove("active");
    });

    // Mostra somente a campanha escolhida
    campanha.classList.add("active");

    // Atualiza o endereço
    history.pushState(
        { pagina: numero },
        "",
        "#campanha-" + numero
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
    const numero = hash.match(/^#campanha-([1-4])$/);

    if (numero) {
        abrirCampanha(Number(numero[1]));
    } else {
        voltarInicio();
    }

});
