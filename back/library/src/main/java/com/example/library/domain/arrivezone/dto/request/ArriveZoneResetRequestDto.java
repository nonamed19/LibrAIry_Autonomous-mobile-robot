package com.example.library.domain.arrivezone.dto.request;

public class ArriveZoneResetRequestDto {

    private int arriveZoneId;

    public ArriveZoneResetRequestDto() {
    }

    public ArriveZoneResetRequestDto(int arriveZoneId) {
        this.arriveZoneId = arriveZoneId;
    }

    public int getArriveZoneId() {
        return arriveZoneId;
    }
}
