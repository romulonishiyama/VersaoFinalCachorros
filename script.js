const opcoes = document.querySelector('#opcoes');
const btnPesquisar = document.querySelector('#botao-pesquisar');
const proximaFoto = document.querySelector('#next');
const fotoAnterior = document.querySelector('#previous');
const btnSalvar = document.querySelector('#salvarFoto');
const galeriaDeFotosSalvas = document.querySelector('.galeriaDeFotosSalvas');
const imagemPrincipal = document.querySelector('#imagem');
const titulo = document.querySelector('#titulo');
const bancoLocal = JSON.parse(localStorage.getItem('album')) || [];




var arrayDeFotosDaRaca = [];
var contador = 0;


function buscaImagens(raca) {
    let busca = fetch(`https://dog.ceo/api/breed/${raca}/images`).then((resultado) => resultado.json());

    return busca;
};

btnPesquisar.addEventListener('click', async () => {

    const dados = await buscaImagens(opcoes.value);
    titulo.innerText = "Raça: " + opcoes.value;

    if (dados.status == 'success') {
        arrayDeFotosDaRaca = dados.message;
        imagemPrincipal.src = arrayDeFotosDaRaca[0];

        verificar();

    } else {
        console.log('Erro ao buscar as fotos - ' + dados.status);
    }


});

function verificar() {
    if (imagemPrincipal.src != 'cacto.jpg') {
        btnSalvar.style.display = 'inline';
        proximaFoto.style.display = 'flex';
        fotoAnterior.style.display = 'flex';
    }
}

proximaFoto.addEventListener('click', () => {
    if (contador < arrayDeFotosDaRaca.length - 1) {
        contador++;
        imagemPrincipal.src = arrayDeFotosDaRaca[contador];
    }

});

fotoAnterior.addEventListener('click', () => {
    if (contador > 0) {
        contador--;
        imagemPrincipal.src = arrayDeFotosDaRaca[contador];
    }
});

btnSalvar.addEventListener('click', () => {
    

    let img64 = converteParaBase64(imagemPrincipal);
    let numeroAletorio = Math.random() * 100000;

    let obj = {
        id: numeroAletorio,
        fotoArmazenada: img64
    };

    //SE BANCO VAZIO    
    if (bancoLocal == null) {
        let arrayTemporario = [];
        arrayTemporario.push(obj);
        localStorage.setItem('album', JSON.stringify(arrayTemporario));
        criarElemento(obj);

        //SE COM DADOS
    } else {

        if (!verificarSeFotoJaExiste(bancoLocal, img64)) {
            bancoLocal.push(obj);
            localStorage.setItem('album', JSON.stringify(bancoLocal));
            criarElemento(obj);

        } else {
            alert("Foto já existe!")
        }



   }

});

function converteParaBase64(imagem) {
    let canvas = document.createElement('canvas');

    canvas.getContext('2d').drawImage(imagem, 0, 0, canvas.width, canvas.height);

    let imagemURL = canvas.toDataURL("image/jpeg");

    return imagemURL;

};

function criarElemento(obj) {


    let criarDiv = document.createElement('div');
    criarDiv.className = 'fotos-armazenadas';

    let criarImg = document.createElement('img');
    criarImg.id = obj.id;

    let btnExcluir = document.createElement('button');
    btnExcluir.innerText = 'X';
    btnExcluir.id = 'botaoExcluir';
    btnExcluir.onclick = excluirDoLocalStorage;
    btnExcluir.style.color = 'white';
    btnExcluir.style.backgroundColor = 'red';
    btnExcluir.style.height = '36px';
    btnExcluir.style.width = '20px';
    btnExcluir.style.marginRight = '20px';


    galeriaDeFotosSalvas.appendChild(criarDiv);
    criarDiv.appendChild(criarImg);
    criarImg.src = obj.fotoArmazenada;
    criarDiv.appendChild(btnExcluir);

};

function excluirDoLocalStorage(event) {


    let confirmacao = confirm("Deseja deletar essa foto?");
    if (confirmacao) {


        let valorDoID = event.target.parentNode.childNodes[0].attributes[0].value;

        let index = bancoLocal.findIndex(e => e.id == valorDoID);

        bancoLocal.splice(index, 1);

        localStorage.setItem('album', JSON.stringify(bancoLocal));

        imprimiFotosDoBanco();


    }

};


function imprimiFotosDoBanco() {



    if (bancoLocal != null) {
        galeriaDeFotosSalvas.innerHTML = "";

        bancoLocal.forEach(element => {
            criarElemento(element);

        });

    }

};

function verificarSeFotoJaExiste(bancoLocal, img64) {



    let resultado = bancoLocal.find(e => e.fotoArmazenada == img64);
    if (resultado != undefined || resultado != null) {
        if (resultado.fotoArmazenada != img64) {
            return false;
            console.log('Nao existe');
        } else {
            return true;
            console.log('Encontrado');
        }
    }

};


imprimiFotosDoBanco();
