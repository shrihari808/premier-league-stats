package com.pl.premierstats.player;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Component
public class PlayerService {
    private final PlayerRepository playerRepository;

    @Autowired
    public PlayerService(PlayerRepository playerRepository){
        this.playerRepository = playerRepository;
    }

    public Page<Player> getPlayers(Pageable pageable){
        return playerRepository.findAll(pageable);
    }

    public Page<Player> getPlayersFromTeam(String team, Pageable pageable){
        return playerRepository.findByTeam(team, pageable);
    }

    public Page<Player> getPlayersByName(String name, Pageable pageable){
        return playerRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    public Page<Player> getPlayersByPos(String pos, Pageable pageable){
        return playerRepository.findByPosContainingIgnoreCase(pos, pageable);
    }

    public Page<Player> getPlayersByNation(String nation, Pageable pageable){
        return playerRepository.findByNationContainingIgnoreCase(nation, pageable);
    }

    public Page<Player> getPlayersByTeamAndPosition(String team, String pos, Pageable pageable){
        return playerRepository.findByTeamAndPos(team, pos, pageable);
    }

    public Player addPlayer(Player player){
        playerRepository.save(player);
        return player;
    }

    public Player updatePlayer(Player updatedPlayer){
        Optional<Player> existingPlayer = playerRepository.findByName(updatedPlayer.getName());
        if(existingPlayer.isPresent()){
            Player playerToUpdate = existingPlayer.get();
            playerToUpdate.setName(updatedPlayer.getName());
            playerToUpdate.setTeam(updatedPlayer.getTeam());
            playerToUpdate.setPos(updatedPlayer.getPos());
            playerToUpdate.setNation(updatedPlayer.getNation());

            playerRepository.save(playerToUpdate);
            return playerToUpdate;
        }
        return null;
    }

    @Transactional
    public void deletePlayer(String playerName){
        playerRepository.deleteByName(playerName);
    }
}
