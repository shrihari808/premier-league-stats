package com.pl.premierstats.player;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/v1/player")
@CrossOrigin(origins = "*")
@Tag(name = "Player", description = "Premier League Player Statistics Management API")
public class PlayerController {

    private final PlayerService playerService;

    @Autowired
    public PlayerController(PlayerService playerService){
        this.playerService = playerService;
    }

    @GetMapping
    @Operation(summary = "Query players", description = "Fetch players with pagination, sorting (e.g. ?sort=gls,desc), and multi-criteria filtering")
    public Page<Player> getPlayers(
            @Parameter(description = "Filter by player name (partial match)") @RequestParam(required = false) String name,
            @Parameter(description = "Filter by club/team") @RequestParam(required = false) String team,
            @Parameter(description = "Filter by position (e.g. FW, MF, DF, GK)") @RequestParam(required = false) String position,
            @Parameter(description = "Filter by nationality") @RequestParam(required = false) String nation,
            @Parameter(description = "Minimum goals scored") @RequestParam(required = false) Double minGoals,
            @Parameter(description = "Minimum assists provided") @RequestParam(required = false) Double minAssists,
            @Parameter(description = "Minimum minutes played") @RequestParam(required = false) Double minMinutes,
            Pageable pageable
    ){
        Specification<Player> spec = PlayerSpecification.filter(name, team, position, nation, minGoals, minAssists, minMinutes);
        return playerService.getPlayers(spec, pageable);
    }

    @GetMapping("/{playerName}")
    @Operation(summary = "Get player by name", description = "Fetch complete statistics for a single player")
    public ResponseEntity<Player> getPlayerByName(@PathVariable String playerName) {
        Player player = playerService.getPlayerByName(playerName);
        return ResponseEntity.ok(player);
    }

    @PostMapping
    @Operation(summary = "Add a new player", description = "Insert a new player record")
    public ResponseEntity<Player> addPlayer(@RequestBody Player player){
        Player createdPlayer = playerService.addPlayer(player);
        return new ResponseEntity<>(createdPlayer, HttpStatus.CREATED);
    }

    @PutMapping
    @Operation(summary = "Update player", description = "Update statistics for an existing player")
    public ResponseEntity<Player> updatePlayer(@RequestBody Player player){
        Player resultPlayer = playerService.updatePlayer(player);
        return new ResponseEntity<>(resultPlayer, HttpStatus.OK);
    }

    @DeleteMapping("/{playerName}")
    @Operation(summary = "Delete player", description = "Remove a player by name")
    public ResponseEntity<String> deletePlayer(@PathVariable String playerName){
        playerService.deletePlayer(playerName);
        return new ResponseEntity<>("Player '" + playerName + "' deleted successfully", HttpStatus.OK);
    }
}
