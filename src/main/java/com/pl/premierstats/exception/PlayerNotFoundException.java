package com.pl.premierstats.exception;

public class PlayerNotFoundException extends RuntimeException {
    public PlayerNotFoundException(String playerName) {
        super("Player with name '" + playerName + "' was not found.");
    }
}
