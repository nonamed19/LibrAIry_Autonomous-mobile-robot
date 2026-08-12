package com.example.library.domain.notice.service;

import com.example.library.domain.notice.dto.request.NoticeDeleteRequestDto;
import com.example.library.domain.notice.dto.response.NewNoticeResponseDto;
import com.example.library.domain.notice.dto.response.NoticeResponseDto;
import com.example.library.domain.notice.dto.response.NoticeResponseDto.NoticeDto;
import com.example.library.domain.notice.entity.Notice;
import com.example.library.domain.notice.repository.NoticeRepository;
import com.example.library.domain.robot.entity.RobotStatus;
import jakarta.transaction.Transactional;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class NoticeService {

    private NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    public NoticeResponseDto getNoticeList() {
        return new NoticeResponseDto(noticeRepository.findAll().stream()
            .map(this::changeToDto)
            .toList()
        );
    }

    private NoticeDto changeToDto(Notice notice) {
        boolean targetNoticeStatus = notice.isNoticeStatus();
        notice.setNoticeStatus(false);

        return new NoticeDto(notice.getNoticeId(),
            notice.getNoticeCreatedAt(),
            targetNoticeStatus,
            RobotStatus.values()[notice.getNoticeType()].getStatusDisc(),
            notice.getNoticeContent(),
            notice.getRobot().getRobotId());
    }

    public NewNoticeResponseDto getUnreadNotice() {
        return new NewNoticeResponseDto(
            noticeRepository.countUnreadNotice()
        );
    }

    public void deleteNotice(NoticeDeleteRequestDto noticeDeleteRequestDto) {
        Notice targetNotice = noticeRepository.findById(noticeDeleteRequestDto.getNoticeId())
            .orElseThrow(() -> new NoSuchElementException("해당 알림 데이터가 존재하지 않습니다."));

        noticeRepository.delete(targetNotice);
    }
}
