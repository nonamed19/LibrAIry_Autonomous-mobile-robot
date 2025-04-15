package com.example.library.domain.arrivezone.repository;

import com.example.library.domain.arrivezone.entity.ArriveZone;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArriveZoneRepository extends JpaRepository<ArriveZone, Integer> {

    Optional<ArriveZone> findByArriveZoneName(String arriveZoneName);
}
