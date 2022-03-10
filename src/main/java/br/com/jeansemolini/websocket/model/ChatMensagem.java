package br.com.jeansemolini.websocket.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMensagem {

    private String conteudo;
    private String remetente;
    private TipoMensagem tipoMensagem;

    public enum TipoMensagem {
        CHAT, ENTRAR, SAIR;
    }
}
