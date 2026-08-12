package com.example.library.domain.user.service;

import com.example.library.domain.user.dto.PasswordEncryptionResultDto;
import com.example.library.domain.user.dto.request.UserDupCheckRequestDto;
import com.example.library.domain.user.dto.request.UserLeaveRequestDto;
import com.example.library.domain.user.dto.request.UserRecordRequestDto;
import com.example.library.domain.user.dto.request.UserSignUpRequestDto;
import com.example.library.domain.user.dto.response.UserFrontResponseDto;
import com.example.library.domain.user.dto.response.UserRecordResponseDto;
import com.example.library.domain.user.entity.Salt;
import com.example.library.domain.user.entity.User;
import com.example.library.domain.user.mapper.UserMapper;
import com.example.library.domain.user.repository.SaltRepository;
import com.example.library.domain.user.repository.UserRepository;
import com.example.library.util.OpenCrypt;
import jakarta.transaction.Transactional;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserService {

    UserRepository userRepository;
    UserMapper userMapper;
    SaltRepository saltRepository;

    public UserService(UserRepository userRepository, UserMapper userMapper,
        SaltRepository saltRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.saltRepository = saltRepository;
    }

    public void addUser(UserSignUpRequestDto userSignUpRequestDto) {
        PasswordEncryptionResultDto encryptionResult = OpenCrypt.encryptPw(
            userSignUpRequestDto.getUserPassword());

        User user = userMapper.signUpDtoToEntity(userSignUpRequestDto,
            encryptionResult.getHashedPassword());

        userRepository.save(user);
        saltRepository.save(new Salt(user.getUserId(), encryptionResult.getSalt()));
    }

    public UserFrontResponseDto getUserInfo(String userCode) {
        User targetUser = userRepository.findByUserCode(userCode)
            .orElseThrow(() -> new NoSuchElementException("해당 바코드 정보가 존재하지 않습니다."));

        return new UserFrontResponseDto(
            targetUser.getUserId(),
            targetUser.getUserName(),
            targetUser.getUserBorrowStatus()
        );
    }

    public boolean dupCheck(UserDupCheckRequestDto userDupCheckRequestDto) {
        if (userDupCheckRequestDto.getAction() == 0) {
            return userRepository.existsByUserLoginId(userDupCheckRequestDto.getTargetString());
        }

        return userRepository.existsByUserEmail(userDupCheckRequestDto.getTargetString());
    }

    public UserRecordResponseDto getUserRecord(UserRecordRequestDto userRecordRequestDto) {
        User targetUser = userRepository.findById(userRecordRequestDto.getUserId())
            .orElseThrow(() -> new NoSuchElementException("해당 유저가 존재하지 않습니다."));

        return new UserRecordResponseDto(targetUser.getBorrowRecordList().stream()
            .map(borrowRecord -> userMapper.changeToDto(borrowRecord))
            .toList());
    }

    public void deleteUser(UserLeaveRequestDto userLeaveRequestDto) {
        User targetUser = userRepository.findById(userLeaveRequestDto.getUserId())
            .orElseThrow(() -> new NoSuchElementException("해당 유저가 존재하지 않습니다."));

        Salt targetSalt = saltRepository.findById(userLeaveRequestDto.getUserId())
            .orElseThrow(() -> new NoSuchElementException("데이터 베이스 오류!"));

        if (targetUser.hasBorrowBook()) {
            throw new NoSuchElementException("아직 대출 중인 도서가 있습니다.");
        }

        saltRepository.delete(targetSalt);
        userRepository.delete(targetUser);
    }

}
