var elementoConectando = document.querySelector('.conectando');
var areaMensagem = document.querySelector('#areaMensagem');

var usuario = null;
var stompClient = null;

var cores = [
   '#2196F3', '#32c787', '#00BCD4', '#ff5652',
   '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function conectar(event) {
   usuario = document.querySelector('#nome').value.trim();

   if (usuario) {
      document.querySelector('#username-page').style.display = 'none';
      document.querySelector('#chat-page').style.display = 'block';

      var socket = new SockJS('/arquitetura-chat');
      stompClient = Stomp.over(socket);

      stompClient.connect({}, onConectado, onErro);
   }
   event.preventDefault();
}

function onConectado() {
   stompClient.subscribe('/topico/publico', onMensagemRecebida)

   stompClient.send('/app/chat.registrar', {},
       JSON.stringify({remetente: usuario, tipoMensagem: 'ENTRAR'}));

   elementoConectando.classList.add('hidden');
}

function onErro(error) {
   console.log('erro ' + error);
}

function enviar(event) {
   var mensagemInput = document.querySelector('#mensagem');
   var mensagem = mensagemInput.value.trim();

   if (mensagem && stompClient) {
      var chatMensagem = {
         conteudo: mensagemInput.value,
         remetente: usuario,
         tipoMensagem: 'CHAT'
      };
      stompClient.send('/app/chat.enviar', {}, JSON.stringify(chatMensagem));
      mensagemInput.value = '';
   }

   event.preventDefault();
}

function onMensagemRecebida(payload) {
   var mensagem = JSON.parse(payload.body);

   var elementoMensagem = document.createElement('li');

   if (mensagem.tipoMensagem === 'ENTRAR') {
      elementoMensagem.classList.add('event-message');
      mensagem.conteudo = mensagem.remetente + ' entrou';
   } else if (mensagem.tipoMensagem === 'SAIR') {
      elementoMensagem.classList.add('event-message');
      mensagem.conteudo = mensagem.remetente + ' saiu';
   } else {
      elementoMensagem.classList.add('chat-message');

      var elementoAvatar = document.createElement('i');
      var textoAvatar = document.createTextNode(mensagem.remetente[0]);
      elementoAvatar.appendChild(textoAvatar);
      elementoAvatar.style['background-color'] = getCorAvatar(mensagem.remetente);

      elementoMensagem.appendChild(elementoAvatar);

   }

   var elementoTexto = document.createElement('p');
   var textoMensagem = document.createTextNode(mensagem.conteudo);
   elementoTexto.appendChild(textoMensagem);

   elementoMensagem.appendChild(elementoTexto);

   areaMensagem.appendChild(elementoMensagem);
   areaMensagem.scrollTop = areaMensagem.scrollHeight;
}

function getCorAvatar(remetente) {
   var hash = 0;
   for (var i = 0; i < remetente.length; i++) {
      hash = 31 * hash + remetente.charCodeAt(i);
   }

   var index = Math.abs(hash % cores.length);
   return cores[index];
}

window.addEventListener('beforeunload', function (e) {
   stompClient.subscribe('/topico/publico', onMensagemRecebida);
   stompClient.send("/app/chat.sair",
       { },
       JSON.stringify({remetente: usuario, tipoMensagem: 'SAIR'})
   )

   elementoConectando.classList.add('hidden');
});

function verificarUsuario(event) {
   var url = window.location.origin + '/chat/usuario/' + document.querySelector('#nome').value.trim();
   //alert(window.location.origin);
   let xhr = new XMLHttpRequest();
   xhr.open('GET', url, false);
   xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
         if (xhr.status == 204) {
            conectar(event);
         } else {
            alert("Usuário já conectado");
            event.preventDefault();
         }
      }
   }
   xhr.send();
}

document.querySelector('#usernameForm').addEventListener('submit', verificarUsuario, true);
document.querySelector('#messageForm').addEventListener('submit', enviar, true);
