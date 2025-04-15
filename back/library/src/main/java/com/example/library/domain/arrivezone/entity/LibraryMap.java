package com.example.library.domain.arrivezone.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class LibraryMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "library_map_id")
    private int libraryMapId;
    private String libraryMapName;
    @Column(name = "library_map_x")
    private double libraryMapX;
    @Column(name = "library_map_y")
    private double libraryMapY;
    @Column(name = "library_map_w")
    private double libraryMapW;

    public LibraryMap() {
    }

    public LibraryMap(String libraryMapName, double libraryMapX, double libraryMapY,
        double libraryMapW) {
        this.libraryMapName = libraryMapName;
        this.libraryMapX = libraryMapX;
        this.libraryMapY = libraryMapY;
        this.libraryMapW = libraryMapW;
    }

    public int getLibraryMapId() {
        return libraryMapId;
    }

    public String getLibraryMapName() {
        return libraryMapName;
    }

    public double getLibraryMapX() {
        return libraryMapX;
    }

    public double getLibraryMapY() {
        return libraryMapY;
    }

    public double getLibraryMapW() {
        return libraryMapW;
    }
}
