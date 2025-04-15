package com.example.library.domain.arrivezone.repository;

import com.example.library.domain.arrivezone.entity.LibraryMap;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MapRepository extends JpaRepository<LibraryMap, Integer> {

}
