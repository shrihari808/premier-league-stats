package com.pl.premierstats.data;

import com.opencsv.CSVReader;
import com.pl.premierstats.player.Player;
import com.pl.premierstats.player.PlayerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private final PlayerRepository playerRepository;

    public DataSeeder(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Override
    public void run(String... args) {
        if (playerRepository.count() > 0) {
            log.info("Database already seeded with {} players. Skipping CSV import.", playerRepository.count());
            return;
        }

        log.info("Starting CSV data seeding from player_statistics_postgres.csv...");
        ClassPathResource resource = new ClassPathResource("player_statistics_postgres.csv");
        if (!resource.exists()) {
            log.warn("player_statistics_postgres.csv not found in classpath. Skipping seeding.");
            return;
        }

        Map<String, Player> playerMap = new LinkedHashMap<>();

        try (CSVReader reader = new CSVReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            String[] line;
            int lineNumber = 0;
            while ((line = reader.readNext()) != null) {
                lineNumber++;
                if (line.length < 15) {
                    log.warn("Skipping invalid line {}: insufficient columns ({})", lineNumber, line.length);
                    continue;
                }

                String name = line[0].trim();
                String nation = line[1].trim();
                String pos = line[2].trim();
                Integer age = parseInteger(line[3]);
                Integer mp = parseInteger(line[4]);
                Integer starts = parseInteger(line[5]);
                Double min = parseDouble(line[6]);
                Double gls = parseDouble(line[7]);
                Double ast = parseDouble(line[8]);
                Double pk = parseDouble(line[9]);
                Double crdy = parseDouble(line[10]);
                Double crdr = parseDouble(line[11]);
                Double xg = parseDouble(line[12]);
                Double xag = parseDouble(line[13]);
                String team = line[14].trim();

                Player player = new Player(name, nation, pos, age, mp, starts, min, gls, ast, pk, crdy, crdr, xg, xag, team);

                // For players appearing multiple times (e.g. transferred mid-season), keep the record with higher minutes
                if (playerMap.containsKey(name)) {
                    Player existing = playerMap.get(name);
                    double existingMin = existing.getMin() != null ? existing.getMin() : 0.0;
                    double currentMin = min != null ? min : 0.0;
                    if (currentMin >= existingMin) {
                        playerMap.put(name, player);
                    }
                } else {
                    playerMap.put(name, player);
                }
            }

            playerRepository.saveAll(playerMap.values());
            log.info("Successfully seeded {} unique players from CSV into database.", playerMap.size());

        } catch (Exception e) {
            log.error("Failed to seed database from CSV: {}", e.getMessage(), e);
        }
    }

    private Integer parseInteger(String val) {
        if (val == null || val.trim().isEmpty()) return 0;
        try {
            return (int) Math.round(Double.parseDouble(val.trim()));
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private Double parseDouble(String val) {
        if (val == null || val.trim().isEmpty()) return 0.0;
        try {
            return Double.parseDouble(val.trim());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
}
