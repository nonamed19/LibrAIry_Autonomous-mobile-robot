package com.example.library.domain.user.service;

import com.example.library.domain.robot.repository.RobotRepository;
import com.example.library.domain.user.dto.request.UserFrontRequestDto;
import com.example.library.domain.user.dto.request.UserRobotRequestDto;
import com.example.library.domain.user.dto.response.UserFrontResponseDto;
import com.example.library.domain.user.entity.User;
import com.example.library.domain.user.repository.UserRepository;
import java.time.Duration;
import java.util.NoSuchElementException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserConnectService {

    private final RedisTemplate<String, String> redisTemplate;

    private UserRepository userRepository;
    private RobotRepository robotRepository;

    private final static String REDIS_KEY = "user_borrow/";

    public UserConnectService(RedisTemplate<String, String> redisTemplate,
        UserRepository userRepository, RobotRepository robotRepository) {
        this.redisTemplate = redisTemplate;
        this.userRepository = userRepository;
        this.robotRepository = robotRepository;
    }

    public void saveUserInfo(UserRobotRequestDto userRobotRequestDto) {
        if (!robotRepository.existsById(userRobotRequestDto.getRobotId())) {
            throw new NoSuchElementException("해당 로봇 정보가 존재하지 않습니다.");
        }

        if (!userRepository.existsByUserCode(userRobotRequestDto.getUserCode())) {
            throw new NoSuchElementException("해당 유저 정보가 존재하지 않습니다.");
        }

        redisTemplate.opsForValue()
            .set(REDIS_KEY + userRobotRequestDto.getRobotId(),
                userRobotRequestDto.getUserCode(), Duration.ofMinutes(5));
    }

    public UserFrontResponseDto getUserInfo(UserFrontRequestDto userFrontRequestDto) {
        String targetRedisKey = REDIS_KEY + userFrontRequestDto.getRobotId();
        String targetUserCode = redisTemplate.opsForValue().get(targetRedisKey);

        if (targetUserCode == null) {
            throw new NoSuchElementException("저장된 유저 데이터가 없습니다.");
        }

        User targetUser = userRepository.findByUserCode(targetUserCode)
            .orElseThrow(() -> new NoSuchElementException("해당 유저 정보가 존재하지 않습니다."));

        redisTemplate.delete(targetRedisKey);
        return new UserFrontResponseDto(
            targetUser.getUserId(),
            targetUser.getUserName(),
            targetUser.getUserBorrowStatus()
        );
    }
}
