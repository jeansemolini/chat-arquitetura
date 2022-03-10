package br.com.jeansemolini.websocket.service.impl;

import br.com.jeansemolini.websocket.service.ChatService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class ChatServiceImpl implements ChatService {

    private List<String> usuarios = new ArrayList<>();

    @Override
    public void adicionaUsuario(String usuario) {
        if (usuarios.contains(usuario)) {
            throw new RuntimeException("Usuário já conectado");
        }
        usuarios.add(usuario);
    }

    @Override
    public void removeUsuario(String usuario) {
        usuarios.remove(usuario);
    }

    @Override
    public List<String> getUsuarios() {
        usuarios.forEach(System.out::println);
        return usuarios;
    }
}
