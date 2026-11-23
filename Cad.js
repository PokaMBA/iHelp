const formulario = document.getElementById("form-cadastro");
const caixaErros = document.getElementById("erros");
const listaErros = document.getElementById("erros-lista");

const areaCadastro = document.getElementById("area-cadastro");
const areaJaCadastrado = document.getElementById("area-ja-cadastrado");
const botaoSair = document.getElementById("btn-sair");
const botaoOutraConta = document.getElementById("btn-outra-conta");


const PADRAO_NOME = /^\p{L}[\p{L}'’-]*(?:\s+\p{L}[\p{L}'’-]*)*$/u;
const PADRAO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const NOME_MINIMO = 3;
const NOME_MAXIMO = 50;



const TOKEN_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJuYW1lIjoiRW5nLiBDb21wdXRhXHUwMGU3XHUwMGUzbyIsInJvbGUiOiJKV1QiLCJpYXQiOjE3NTk5ODEzMTcsImV4cCI6MTc1OTk4NDkxN30.b1KfcSFInRwYnvRA0Ae5jYuL59KZmCsufPgISNGq0X0";


function validarNome(input) {
    const nome = input.value.trim().replace(/\s+/g, " ");
    if (nome === "") {
        return "Nome não foi preenchido";
    }
    if (!PADRAO_NOME.test(nome)) {
        return "Nome deve conter apenas letras";
    }

    const quantidadeDeLetras = nome.replace(/[^\p{L}]/gu, "").length;

    if (quantidadeDeLetras < NOME_MINIMO) {
        return "Nome deve ter no mínimo 3 letras";
    }
    if (quantidadeDeLetras > NOME_MAXIMO) {
        return "Nome deve conter no máximo 50 letras";
    }
    return "";
}
function validarEmail(input) {
    const email = input.value.trim();
    if (email === "") {
        return "E-mail não foi preenchido";
    }
    if (!PADRAO_EMAIL.test(email)) {
        return "E-mail com formato inválido (use o modelo exemplo@email.com)";
    }
    return "";
}
function dataDeHoje() {
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${hoje.getFullYear()}-${mes}-${dia}`;
}
function validarNascimento(input) {
    if (input.validity.badInput) {
        return "Data de nascimento está incompleta";
    }
    if (input.value === "") {
        return "Data de nascimento não foi preenchida";
    }
    if (input.value > dataDeHoje()) {
        return "Data de nascimento inválida";
    }
    return "";
}


const campos = [
    { id: "nome",       validar: validarNome },
    { id: "email",      validar: validarEmail },
    { id: "nascimento", validar: validarNascimento }
];


function mostrarResultado(campo) {
    const input = document.getElementById(campo.id);
    const mensagem = document.getElementById(campo.id + "-msg");
    const erro = campo.validar(input);
    const correto = erro === "";

    input.classList.toggle("campo--ok", correto);
    input.classList.toggle("campo--erro", !correto);
    input.setAttribute("aria-invalid", String(!correto));

    mensagem.textContent = correto
        ? "Campo preenchido corretamente."
        : erro;
    mensagem.className = "campo__msg " + (correto ? "campo__msg--ok" : "campo__msg--erro");
}


function coletarErros() {
    const erros = [];

    campos.forEach((campo) => {
        const erro = campo.validar(document.getElementById(campo.id));
        if (erro !== "") {
            erros.push(erro);
        }
    });

    return erros;
}

function exibirErros(erros) {
    listaErros.replaceChildren();

    erros.forEach((texto) => {
        const item = document.createElement("li");
        item.textContent = texto;
        listaErros.appendChild(item);
    });

    caixaErros.hidden = false;
}

function atualizarResumo() {
    if (caixaErros.hidden) {
        return;
    }

    const erros = coletarErros();

    if (erros.length === 0) {
        caixaErros.hidden = true;
    } else {
        exibirErros(erros);
    }
}

function limparTudo() {
    campos.forEach((campo) => {
        const input = document.getElementById(campo.id);
        const mensagem = document.getElementById(campo.id + "-msg");

        input.classList.remove("campo--ok", "campo--erro");
        input.removeAttribute("aria-invalid");
        mensagem.textContent = "";
        mensagem.className = "campo__msg";
    });

    caixaErros.hidden = true;
    listaErros.replaceChildren();
}




function mostrarJaCadastrado() {
    areaCadastro.hidden = true;
    areaJaCadastrado.hidden = false;
}

function mostrarCadastro() {
    areaJaCadastrado.hidden = true;
    areaCadastro.hidden = false;
}


function verificarCadastroExistente() {
    if (localStorage.getItem("token")) {
        mostrarJaCadastrado();
    }
}




formulario.addEventListener("submit", (evento) => {
    campos.forEach(mostrarResultado);

    const erros = coletarErros();

    if (erros.length > 0) {
        evento.preventDefault();
        exibirErros(erros);

        const primeiroComErro = formulario.querySelector(".campo--erro");
        if (primeiroComErro) {
            primeiroComErro.focus();
        }
    } else {
        caixaErros.hidden = true;
        localStorage.setItem("token", TOKEN_JWT);
    }
});


formulario.addEventListener("reset", limparTudo);


campos.forEach((campo) => {
    const input = document.getElementById(campo.id);

    input.addEventListener("blur", (evento) => {
        
        const destino = evento.relatedTarget;
        if (destino && destino.closest("button, a")) {
            return;
        }

        mostrarResultado(campo);
        atualizarResumo();
    });

    input.addEventListener("input", () => {
        const jaFoiVerificado = input.classList.contains("campo--ok")
            || input.classList.contains("campo--erro");

        if (jaFoiVerificado) {
            mostrarResultado(campo);
            atualizarResumo();
        }
    });
});



botaoSair.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});


botaoOutraConta.addEventListener("click", () => {
    localStorage.removeItem("token");
    mostrarCadastro();
    document.getElementById("nome").focus();
});


verificarCadastroExistente();
