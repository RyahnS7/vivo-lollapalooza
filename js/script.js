
/* =====================================
   NAVEGAÇÃO DO SITE
===================================== */

function mostrarPeca(numero, atualizarHistorico = true) {
    const id = numero === "inicio" ? "inicio" : "peca-" + numero;
    const pagina = document.getElementById(id);

    if (!pagina) return;

    document.querySelectorAll(".page").forEach(item => {
        item.classList.remove("active");
    });

    pagina.classList.add("active");

    if (atualizarHistorico) {
        const url = numero === "inicio"
            ? window.location.pathname + window.location.search
            : "#peca-" + numero;

        history.pushState({ pagina: numero }, "", url);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function abrirPeca(numero) {
    if (![1, 2, 3, 4].includes(Number(numero))) return;
    mostrarPeca(Number(numero));
}

function voltarInicio() {
    mostrarPeca("inicio");
}

window.addEventListener("popstate", () => {
    const match = window.location.hash.match(/^#peca-([1-4])$/);
    mostrarPeca(match ? Number(match[1]) : "inicio", false);
});

document.addEventListener("DOMContentLoaded", () => {
    const match = window.location.hash.match(/^#peca-([1-4])$/);
    mostrarPeca(match ? Number(match[1]) : "inicio", false);
});


/* =====================================
   CAÇA-PALAVRAS — PEÇA 04
===================================== */

(() => {
    const root = document.getElementById("lollaWordSearch");
    if (!root) return;

    const matrix = [
        ['C','S','B','G','O','C','L','O','V','E','R','U','R'],
        ['L','R','L','L','O','H','K','O','G','A','U','E','A'],
        ['P','U','O','C','L','O','L','B','R','A','T','L','N'],
        ['A','R','C','G','L','A','P','H','E','T','I','O','M'],
        ['P','P','A','O','A','L','O','B','E','R','C','C','A'],
        ['A','C','I','I','O','Z','A','A','N','D','K','K','G'],
        ['T','R','P','V','N','V','X','B','R','A','R','N','A'],
        ['R','B','A','R','T','I','S','T','A','R','C','N','V'],
        ['I','D','R','P','I','V','O','R','L','S','E','C','K'],
        ['C','I','A','F','N','O','I','N','B','O','W','C','R'],
        ['K','R','D','T','U','F','U','V','C','R','K','D','K'],
        ['S','H','E','Ç','E','A','M','S','T','C','K','A','K'],
        ['C','S','A','G','R','C','L','O','E','R','R','N','G'],
        ['L','R','L','L','A','H','C','O','G','R','A','D','R'],
        ['P','U','O','C','G','L','E','B','R','A','T','O','C'],
        ['A','R','C','A','I','O','D','K','E','T','I','R','A'],
        ['P','P','A','K','R','L','U','B','E','R','C','K','I']
    ];

    const words = [
        { key: "VIVO", label: "VIVO" },
        { key: "OUÇA", label: "OUÇA" },
        { key: "OUSE", label: "OUSE" },
        { key: "ARTISTA", label: "ARTISTA" }
    ];

    const board = document.getElementById("lollaWordBoard");
    const bank = document.getElementById("lollaWordBank");
    const progress = document.getElementById("lollaGameProgress");
    const winBanner = document.getElementById("lollaWinBanner");
    const playAgain = document.getElementById("lollaPlayAgain");

    if (!board || !bank || !progress || !winBanner || !playAgain) return;

    let found = new Set();
    let dragging = false;
    let start = null;
    let selection = [];

    function initGame() {
        board.innerHTML = "";
        bank.innerHTML = "";
        found.clear();
        selection = [];
        dragging = false;
        start = null;

        winBanner.classList.remove("is-visible");
        progress.textContent = "0 / 4 encontradas";

        matrix.forEach((row, r) => {
            row.forEach((letter, c) => {
                const cell = document.createElement("div");

                cell.className = "lolla-cell";
                cell.textContent = letter;
                cell.dataset.row = r;
                cell.dataset.col = c;

                board.appendChild(cell);
            });
        });

        words.forEach(({ key, label }) => {
            const pill = document.createElement("span");

            pill.className = "lolla-word-pill";
            pill.id = `lolla-word-${key}`;
            pill.textContent = label;

            bank.appendChild(pill);
        });
    }

    function getLine(r1, c1, r2, c2) {
        const dr = r2 - r1;
        const dc = c2 - c1;

        if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) {
            return [];
        }

        const steps = Math.max(Math.abs(dr), Math.abs(dc));

        if (steps === 0) return [];

        const sr = dr === 0 ? 0 : dr / steps;
        const sc = dc === 0 ? 0 : dc / steps;

        const result = [];

        for (let i = 0; i <= steps; i++) {
            const cell = board.querySelector(
                `.lolla-cell[data-row="${r1 + i * sr}"][data-col="${c1 + i * sc}"]`
            );

            if (cell) result.push(cell);
        }

        return result;
    }

    function clearSelection() {
        board.querySelectorAll(".lolla-cell.is-selecting")
            .forEach(cell => cell.classList.remove("is-selecting"));

        selection = [];
    }

    function getCellAt(x, y) {
        const element = document.elementFromPoint(x, y);
        const cell = element && element.closest(".lolla-cell");

        return cell && board.contains(cell) ? cell : null;
    }

    board.addEventListener("pointerdown", event => {
        const cell = event.target.closest(".lolla-cell");
        if (!cell) return;

        event.preventDefault();

        dragging = true;

        start = {
            row: Number(cell.dataset.row),
            col: Number(cell.dataset.col)
        };

        clearSelection();

        selection = [cell];
        cell.classList.add("is-selecting");
    });

    board.addEventListener("pointermove", event => {
        if (!dragging || !start) return;

        const cell = getCellAt(event.clientX, event.clientY);
        if (!cell) return;

        const line = getLine(
            start.row,
            start.col,
            Number(cell.dataset.row),
            Number(cell.dataset.col)
        );

        if (!line.length) return;

        clearSelection();
        selection = line;

        selection.forEach(item => {
            item.classList.add("is-selecting");
        });
    });

    function finishSelection() {
        if (!dragging) return;

        dragging = false;

        if (selection.length > 1) {
            const selected = selection
                .map(cell => cell.textContent)
                .join("");

            const reversed = [...selected].reverse().join("");

            const match = words.find(({ key }) =>
                !found.has(key) &&
                (key === selected || key === reversed)
            );

            if (match) {
                found.add(match.key);

                selection.forEach((cell, index) => {
                    setTimeout(() => {
                        cell.classList.remove("is-selecting");
                        cell.classList.add("is-found");
                    }, index * 45);
                });

                const pill = document.getElementById(
                    `lolla-word-${match.key}`
                );

                if (pill) pill.classList.add("is-completed");

                progress.textContent =
                    `${found.size} / 4 encontradas`;

                if (found.size === 4) {
                    setTimeout(() => {
                        winBanner.classList.add("is-visible");
                    }, 500);
                }
            }
        }

        clearSelection();
        start = null;
    }

    window.addEventListener("pointerup", finishSelection);
    window.addEventListener("pointercancel", finishSelection);

    playAgain.addEventListener("click", initGame);

    initGame();
})();
