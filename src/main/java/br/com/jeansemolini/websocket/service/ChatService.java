package br.com.jeansemolini.websocket.service;

import java.util.List;

public interface ChatService {

    void adicionaUsuario(String usuario);
    void removeUsuario(String usuario);
    List<String> getUsuarios();
}
