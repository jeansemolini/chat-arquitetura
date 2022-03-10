package br.com.jeansemolini.websocket.api.controller;

import br.com.jeansemolini.websocket.model.ChatMensagem;
import br.com.jeansemolini.websocket.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class ChatController {

    @Autowired
    private ChatService chatService;

    @MessageMapping("/chat.registrar")
    @SendTo("/topico/publico")
    public ChatMensagem registrar(@Payload ChatMensagem chatMensagem, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("usuario", chatMensagem.getRemetente());
        return chatMensagem;
    }

    @MessageMapping("/chat.enviar")
    @SendTo("/topico/publico")
    public ChatMensagem enviarMensagem(@Payload ChatMensagem chatMensagem) {
        return chatMensagem;
    }

    @MessageMapping("/chat.sair")
    @SendTo("/topico/publico")
    public ChatMensagem sair(@Payload ChatMensagem chatMensagem, SimpMessageHeaderAccessor headerAccessor) {
        chatService.removeUsuario(chatMensagem.getRemetente());
        headerAccessor.getSessionAttributes().put("username" , chatMensagem.getRemetente());
        return chatMensagem;
    }

    @GetMapping("/chat/usuario/{usuario}")
    public ResponseEntity<Void> verificaUsuario(@PathVariable String usuario) {
        try {
            chatService.adicionaUsuario(usuario);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

}
