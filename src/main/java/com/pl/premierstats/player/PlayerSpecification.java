package com.pl.premierstats.player;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class PlayerSpecification {

    public static Specification<Player> filter(
            String name,
            String team,
            String position,
            String nation,
            Double minGoals,
            Double minAssists,
            Double minMinutes
    ) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (name != null && !name.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%" + name.trim().toLowerCase() + "%"
                ));
            }

            if (team != null && !team.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("team")),
                        "%" + team.trim().toLowerCase() + "%"
                ));
            }

            if (position != null && !position.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("pos")),
                        "%" + position.trim().toLowerCase() + "%"
                ));
            }

            if (nation != null && !nation.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("nation")),
                        "%" + nation.trim().toLowerCase() + "%"
                ));
            }

            if (minGoals != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("gls"), minGoals));
            }

            if (minAssists != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("ast"), minAssists));
            }

            if (minMinutes != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("min"), minMinutes));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
