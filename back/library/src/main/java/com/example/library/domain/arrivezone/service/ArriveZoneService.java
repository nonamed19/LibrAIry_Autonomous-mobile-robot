package com.example.library.domain.arrivezone.service;

import com.example.library.domain.arrivezone.dto.request.ArriveZoneResetRequestDto;
import com.example.library.domain.arrivezone.dto.response.ArriveZoneResponseDto;
import com.example.library.domain.arrivezone.dto.response.ArriveZoneResponseDto.ArriveZoneDto;
import com.example.library.domain.arrivezone.entity.ArriveZone;
import com.example.library.domain.arrivezone.repository.ArriveZoneRepository;
import jakarta.transaction.Transactional;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class ArriveZoneService {

    private ArriveZoneRepository arriveZoneRepository;

    public ArriveZoneService(ArriveZoneRepository arriveZoneRepository) {
        this.arriveZoneRepository = arriveZoneRepository;
    }

    public ArriveZoneResponseDto getArriveZoneList() {
        return new ArriveZoneResponseDto(arriveZoneRepository.findAll().stream()
            .map(this::changeToDto)
            .toList());
    }

    private ArriveZoneDto changeToDto(ArriveZone arriveZone) {
        return new ArriveZoneDto(
            arriveZone.getArriveZoneId(),
            arriveZone.getArriveZoneName(),
            arriveZone.getArriveZoneBook(),
            arriveZone.getArriveZoneTime()
        );
    }

    public void resetArriveZone(ArriveZoneResetRequestDto arriveZoneResetRequestDto) {
        ArriveZone targetArriveZone = arriveZoneRepository
            .findById(arriveZoneResetRequestDto.getArriveZoneId())
            .orElseThrow(() -> new NoSuchElementException("해당 회수 구역의 데이터가 없습니다."));

        targetArriveZone.resetBookCount();
    }
}
