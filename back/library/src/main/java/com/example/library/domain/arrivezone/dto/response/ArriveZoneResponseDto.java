package com.example.library.domain.arrivezone.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class ArriveZoneResponseDto {

    private List<ArriveZoneDto> arriveZoneList;

    public ArriveZoneResponseDto() {
    }

    public ArriveZoneResponseDto(List<ArriveZoneDto> arriveZoneList) {
        this.arriveZoneList = arriveZoneList;
    }

    public List<ArriveZoneDto> getArriveZoneList() {
        return arriveZoneList;
    }

    public static class ArriveZoneDto {

        private int arriveZoneId;
        private String arriveZoneName;
        private int arriveZoneBook;
        private LocalDateTime arriveZoneTime;

        public ArriveZoneDto() {
        }

        public ArriveZoneDto(int arriveZoneId, String arriveZoneName, int arriveZoneBook,
            LocalDateTime arriveZoneTime) {
            this.arriveZoneId = arriveZoneId;
            this.arriveZoneName = arriveZoneName;
            this.arriveZoneBook = arriveZoneBook;
            this.arriveZoneTime = arriveZoneTime;
        }

        public int getArriveZoneId() {
            return arriveZoneId;
        }

        public String getArriveZoneName() {
            return arriveZoneName;
        }

        public int getArriveZoneBook() {
            return arriveZoneBook;
        }

        public LocalDateTime getArriveZoneTime() {
            return arriveZoneTime;
        }
    }
}
