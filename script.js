$(function () {
  var imagens = [
    "img/facebook.png",
    "img/android.png",
    "img/chrome.png",
    "img/firefox.png",
    "img/html5.png",
    "img/googleplus.png",
    "img/twitter.png",
    "img/windows.png",
  ];
  var pecas = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
  var original = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
  var array = [];
  var total = 0;
  var inicio = 0;
  var fim = 0;
  var tempo = 0;

  function embaralhar(pecas) {
    let index = pecas.length,
      aleatorio;
    while (index != 0) {
      aleatorio = Math.floor(Math.random() * index);
      index--;
      [pecas[index], pecas[aleatorio]] = [pecas[aleatorio], pecas[index]];
    }

    return pecas;
  }

  var pecasEmbaralhadas = embaralhar(pecas);
  let x = 0;

  for (let j = 0; j < 4; j++) {
    $("#tabuleiro").append(`<div class="linha" id="linha${j}" ></div>`);
    for (let i = 0; i < 4; i++) {
      $(`#linha${j}`).append(`<div class="quadrado" id="${x}" ></div>`);
      let bg = imagens[original[x]];
      $(`#${x}`).css("background-image", `url(${bg})`);
      $(`#${x}`).css("background-size", "100%");
      x++;
    }
  }

  function preencher() {
    pecasEmbaralhadas = embaralhar(pecasEmbaralhadas);
    for (let i = 0; i < 16; i++) {
      let bg = imagens[pecasEmbaralhadas[i]];
      $(`#${i}`).css("background-image", `url(${bg})`);
      $(`#${i}`).css("background-size", "100%");
    }
  }

  $("body").append(`<div class="botoes" ></div>`);
  $("body").append(`<div class="tempo" ></div>`);
  $(".botoes").append(`<button id="iniciar" >Iniciar</button>`);
  $(".botoes").append(`<button id="record" >Record</button>`);

  function verificaCasasIguais(a, b) {
    $(".quadrado").unbind("click", clickCasa);
    setTimeout(() => {
      let casaB = $(`#${b}`);
      let casaA = $(`#${a}`);
      let bgB = $(casaB).css("background-image");
      let bgA = $(casaA).css("background-image");
      if (bgA == bgB && bgA != "none" && bgA != "") {
        $(".quadrado").bind("click", clickCasa);
        total = total + 1;
      } else {
        if (bgA != "none" && bgA != "") {
          setTimeout(function () {
            $(casaA).fadeOut("fast", function () {
              $(casaA).css("background-image", "");
              $(casaA).fadeIn("fast");
              $(casaA).slideDown("fast");
            });
            $(casaA).css("background-size", "100%");
            $(casaB).fadeOut("fast", function () {
              $(casaB).css("background-image", "");
              $(casaB).fadeIn("fast");
              $(casaB).slideDown("fast");
            });
            $(casaB).css("background-size", "100%");
            $(".quadrado").bind("click", clickCasa);
          }, 1500);
          return 0;
        }
      }
    }, 1000);
  }

  function verificaMelhorTempo(tempo) {
    let melhorTempo = localStorage.getItem("t1");
    if (melhorTempo == null) {
      localStorage.setItem("t1", tempo);
    }
    if (melhorTempo > tempo) {
      return localStorage.setItem("t1", tempo);
    }
  }

  function mostrarTempo() {
    $("#record").unbind("click", mostrarTempo);
    tempo = localStorage.getItem("t1");
    if (tempo == null) {
      $(".tempo").append(`<p id="textoRecord" >Sem Records</p>`);
      setTimeout(() => {
        $("#record").bind("click", mostrarTempo);
        $("p").remove();
      }, 5000);
    } else {
      $(".tempo").append(
        `<p id="textoRecord" >Melhor tempo: ${tempo} segundos</p>`
      );
      setTimeout(() => {
        $("p").remove();
        $("#record").bind("click", mostrarTempo);
      }, 5000);
    }
  }

  function iniciarJogo() {
    inicio = 0;
    inicio = new Date();
    total = 0;
    tempo = 0;
    $("#iniciar").unbind("click", iniciarJogo);
    $("#iniciar").attr("hidden", "hidden");
    preencher();
    setTimeout(() => {
      for (let i = 0; i < 16; i++) {
        $(`#${i}`).css("background-image", "");
        $(`#${i}`).css("background-size", "100%");
      }
      $("#iniciar").bind("click", iniciarJogo);
      $("#iniciar").removeAttr("hidden", "hidden");
    }, 3000);
    return inicio;
  }

  function clickCasa() {
    let bg = $(this).css("background-image");
    if (bg == "none" || bg == "") {
      $(this).fadeOut("fast", function () {
        $(this).css(
          "background-image",
          `url(${imagens[pecasEmbaralhadas[this.id]]})`
        );
        $(this).fadeIn("fast");
        $(this).slideDown("fast");
      });
      $(this).css("background-size", "100%");
      array.push(this.id);
      if (array.length == 2) {
        verificaCasasIguais(array[0], array[1]);
        array.length = 0;
        if (total == 7) {
          fim = new Date();
          tempo = fim.getTime() - inicio.getTime();

          return verificaMelhorTempo((tempo / 1000).toFixed(2));
        }
      }
    }
  }

  $("#iniciar").click(iniciarJogo);
  $("#record").click(mostrarTempo);
  $(".quadrado").click(clickCasa);
});
