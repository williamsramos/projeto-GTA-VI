// OBJETIVO: dar comportamento ao site do GTA VI com JavaScript.

// Passos:
// 1. MENU QUE SOME AO ROLAR + MENU MOBILE + LINK ATIVO
//    - achar o menu no HTML
//    - escutar o evento de rolagem da janela
//    - se a página desceu mais de 50px, adicionar a classe "menu-rolado"
//    - se voltou pro topo, remover a classe
//    - abrir/fechar o menu no celular ao clicar no botão hambúrguer
//    - destacar o link do menu correspondente à seção visível na tela

// 2. BLOCOS QUE APARECEM
//    - achar todos os elementos com a classe "aparecer"
//    - avisar quando cada um entrar na tela
//    - ao entrar, adicionar a classe "visivel"

// 3. VÍDEO QUE ANDA COM O SCROLL
//    - achar o vídeo da capa
//    - prender a capa na tela enquanto a pessoa rola
//    - sumir com o conteúdo da capa e revelar o vídeo
//    - avançar o tempo do vídeo conforme o scroll

const menu = document.getElementById("menu");
const menuLinks = document.getElementById("menuLinks");
const menuAlternar = document.getElementById("menuAlternar");
const linksDeSecao = document.querySelectorAll("#menuLinks a[data-secao]");
const secoes = document.querySelectorAll("section[id]");
const blocos = document.querySelectorAll(".aparecer");
const video = document.querySelector(".capa-video");
const capa = document.querySelector(".capa");
const capaPainel = document.querySelector(".capa-painel");
const capaConteudo = document.querySelector(".capa-conteudo");

if (menu) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            menu.classList.add("menu-rolado");
        } else {
            menu.classList.remove("menu-rolado");
        }
    });
}

if (menuAlternar && menuLinks) {
    menuAlternar.addEventListener("click", function () {
        const aberto = menuLinks.classList.toggle("aberto");
        menuAlternar.setAttribute("aria-expanded", aberto ? "true" : "false");
        menuAlternar.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });

    // fecha o menu mobile assim que a pessoa escolhe um link
    menuLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            menuLinks.classList.remove("aberto");
            menuAlternar.setAttribute("aria-expanded", "false");
        });
    });
}

if (secoes.length && linksDeSecao.length) {
    const observadorDeSecao = new IntersectionObserver(
        function (entradas) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) {
                    return;
                }

                linksDeSecao.forEach(function (link) {
                    const alvo = link.getAttribute("data-secao");
                    link.classList.toggle("ativo", alvo === entrada.target.id);
                });
            });
        },
        { rootMargin: "-45% 0px -45% 0px" }
    );

    secoes.forEach(function (secao) {
        observadorDeSecao.observe(secao);
    });
}

if (blocos.length) {
    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
            }
        });
    });

    blocos.forEach(function (bloco) {
        observador.observe(bloco);
    });
}

if (window.gsap && window.ScrollTrigger && video && capa && capaConteudo) {
    gsap.registerPlugin(ScrollTrigger);

    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");

    const tocarVideo = function () {
        const playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () {
                // autoplay pode ser bloqueado até o usuário interagir
            });
        }
    };

    if (video.readyState >= 2) {
        tocarVideo();
    } else {
        video.addEventListener("loadeddata", tocarVideo, { once: true });
    }

    gsap.timeline({
        scrollTrigger: {
            trigger: capa,
            start: "top top",
            end: "+=2500",
            scrub: 1,
            pin: true,
        }
    })
        .to(video, { opacity: 1, ease: "none" }, 0)
        .to(".capa-conteudo, .capa-barra, .capa-seta", {
            opacity: 0,
            y: -40,
            scale: 0.6,
            duration: 0.1,
            ease: "none",
        }, 0.02);

    gsap.to(video, {
        currentTime: function () {
            if (!video.duration || Number.isNaN(video.duration)) {
                return 0;
            }

            return video.duration;
        },
        ease: "none",
        scrollTrigger: {
            trigger: capa,
            start: "top top",
            end: "+=1200",
            scrub: 1.2,
            invalidateOnRefresh: true,
        }
    });
}

// Adicione este trecho ao final de main.js:

// 4. MODAL DO TRAILER (YOUTUBE)
const btnAbrirTrailer = document.getElementById("btnAbrirTrailer");
const btnFecharModal = document.getElementById("btnFecharModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalTrailer = document.getElementById("modalTrailer");
const iframeTrailer = document.getElementById("iframeTrailer");

// ID do vídeo extraído do link (https://www.youtube.com/watch?v=IpSDW3Mq-7E)
const videoUrl = "https://www.youtube.com/embed/IpSDW3Mq-7E?autoplay=1";

function abrirModal() {
    if (modalTrailer && iframeTrailer) {
        iframeTrailer.setAttribute("src", videoUrl);
        modalTrailer.classList.add("ativo");
        modalTrailer.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Desativa o scroll de fundo
    }
}

function fecharModal() {
    if (modalTrailer && iframeTrailer) {
        modalTrailer.classList.remove("ativo");
        modalTrailer.setAttribute("aria-hidden", "true");
        iframeTrailer.setAttribute("src", ""); // Para a execução do vídeo
        document.body.style.overflow = ""; // Reativa o scroll
    }
}

if (btnAbrirTrailer) {
    btnAbrirTrailer.addEventListener("click", abrirModal);
}

if (btnFecharModal) {
    btnFecharModal.addEventListener("click", fecharModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener("click", fecharModal);
}

// Fechar modal ao pressionar a tecla 'ESC'
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalTrailer && modalTrailer.classList.contains("ativo")) {
        fecharModal();
    }
});


// CONTADOR REGRESSIVO
function iniciarContador() {
    const dataAlvo = new Date("November 19, 2026 00:00:00").getTime();

    const intervalo = setInterval(() => {
        const agora = new Date().getTime();
        const diferenca = dataAlvo - agora;

        if (diferenca < 0) {
            clearInterval(intervalo);
            const el = document.getElementById("contador");
            if (el) el.innerHTML = "<p class='contador-numero'>JÁ LANÇADO!</p>";
            return;
        }

        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

        const elDias = document.getElementById("dias");
        const elHoras = document.getElementById("horas");
        const elMin = document.getElementById("minutos");
        const elSeg = document.getElementById("segundos");

        if (elDias) elDias.innerText = String(dias).padStart(2, '0');
        if (elHoras) elHoras.innerText = String(horas).padStart(2, '0');
        if (elMin) elMin.innerText = String(minutos).padStart(2, '0');
        if (elSeg) elSeg.innerText = String(segundos).padStart(2, '0');
    }, 1000);
}

iniciarContador();

// PLAYER DE RÁDIO
const estacoes = [
    { nome: "Flash FM", estilo: "Pop, Synthwave & Retrowave", src: "https://stream.zeno.fm/f3wvbbqmdg8uv" },
    { nome: "V-Rock", estilo: "Classic Rock & Heavy Metal", src: "https://stream.zeno.fm/03831868438uv" },
    { name: "Wave 103", estilo: "New Wave & Post-Punk", src: "https://stream.zeno.fm/65804300438uv" }
];

let estacaoAtual = 0;
let tocando = false;

const radioNome = document.getElementById("radioNome");
const radioEstilo = document.getElementById("radioEstilo");
const audioPlayer = document.getElementById("audioPlayer");
const btnRadioPlay = document.getElementById("btnRadioPlay");
const radioIconePlay = document.getElementById("radioIconePlay");
const btnRadioPrev = document.getElementById("btnRadioPrev");
const btnRadioNext = document.getElementById("btnRadioNext");

function carregarEstacao(index) {
    if (!radioNome || !audioPlayer) return;
    radioNome.textContent = estacoes[index].nome;
    radioEstilo.textContent = estacoes[index].estilo;
    audioPlayer.src = estacoes[index].src;
    if (tocando) audioPlayer.play();
}

if (btnRadioPlay) {
    btnRadioPlay.addEventListener("click", () => {
        if (!audioPlayer.src) carregarEstacao(estacaoAtual);

        if (tocando) {
            audioPlayer.pause();
            radioIconePlay.textContent = "▶";
        } else {
            audioPlayer.play();
            radioIconePlay.textContent = "❚❚";
        }
        tocando = !tocando;
    });
}

if (btnRadioNext) {
    btnRadioNext.addEventListener("click", () => {
        estacaoAtual = (estacaoAtual + 1) % estacoes.length;
        carregarEstacao(estacaoAtual);
    });
}

if (btnRadioPrev) {
    btnRadioPrev.addEventListener("click", () => {
        estacaoAtual = (estacaoAtual - 1 + estacoes.length) % estacoes.length;
        carregarEstacao(estacaoAtual);
    });
}

// FAQ ACCORDION
const faqItens = document.querySelectorAll(".faq-item");

faqItens.forEach((item) => {
    const pergunta = item.querySelector(".faq-pergunta");
    if (pergunta) {
        pergunta.addEventListener("click", () => {
            const estaAtivo = item.classList.contains("ativo");

            // Fecha todos os outros
            faqItens.forEach((outros) => outros.classList.remove("ativo"));

            // Se não estava ativo, abre
            if (!estaAtivo) {
                item.classList.add("ativo");
            }
        });
    }
});