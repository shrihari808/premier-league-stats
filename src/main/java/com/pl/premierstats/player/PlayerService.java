package com.pl.premierstats.player;

import com.pl.premierstats.exception.PlayerNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PlayerService {
    private final PlayerRepository playerRepository;

    @Autowired
    public PlayerService(PlayerRepository playerRepository){
        this.playerRepository = playerRepository;
    }

    public Page<Player> getPlayers(Specification<Player> spec, Pageable pageable){
        return playerRepository.findAll(spec, pageable);
    }

    public Page<Player> getPlayers(Pageable pageable){
        return playerRepository.findAll(pageable);
    }

    public Player getPlayerByName(String name){
        return playerRepository.findByName(name)
                .orElseThrow(() -> new PlayerNotFoundException(name));
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
        return playerRepository.save(player);
    }

    public Player updatePlayer(Player updatedPlayer){
        Player existing = playerRepository.findByName(updatedPlayer.getName())
                .orElseThrow(() -> new PlayerNotFoundException(updatedPlayer.getName()));

        if (updatedPlayer.getTeam() != null) existing.setTeam(updatedPlayer.getTeam());
        if (updatedPlayer.getPos() != null) existing.setPos(updatedPlayer.getPos());
        if (updatedPlayer.getNation() != null) existing.setNation(updatedPlayer.getNation());
        if (updatedPlayer.getAge() != null) existing.setAge(updatedPlayer.getAge());
        if (updatedPlayer.getMp() != null) existing.setMp(updatedPlayer.getMp());
        if (updatedPlayer.getStarts() != null) existing.setStarts(updatedPlayer.getStarts());
        if (updatedPlayer.getMin() != null) existing.setMin(updatedPlayer.getMin());
        if (updatedPlayer.getGls() != null) existing.setGls(updatedPlayer.getGls());
        if (updatedPlayer.getAst() != null) existing.setAst(updatedPlayer.getAst());
        if (updatedPlayer.getPk() != null) existing.setPk(updatedPlayer.getPk());
        if (updatedPlayer.getCrdy() != null) existing.setCrdy(updatedPlayer.getCrdy());
        if (updatedPlayer.getCrdr() != null) existing.setCrdr(updatedPlayer.getCrdr());
        if (updatedPlayer.getXg() != null) existing.setXg(updatedPlayer.getXg());
        if (updatedPlayer.getXag() != null) existing.setXag(updatedPlayer.getXag());

        return playerRepository.save(existing);
    }

    @Transactional
    public void deletePlayer(String playerName){
        if (!playerRepository.existsById(playerName)) {
            throw new PlayerNotFoundException(playerName);
        }
        playerRepository.deleteByName(playerName);
    }
}
