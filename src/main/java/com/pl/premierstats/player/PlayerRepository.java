package com.pl.premierstats.player;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, String> {
    void deleteByName(String playerName);
    Optional<Player> findByName(String name);
    Page<Player> findByTeam(String team, Pageable pageable);
    Page<Player> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Player> findByPosContainingIgnoreCase(String pos, Pageable pageable);
    Page<Player> findByNationContainingIgnoreCase(String nation, Pageable pageable);
    Page<Player> findByTeamAndPos(String team, String pos, Pageable pageable);
}

