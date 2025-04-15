package com.example.library.domain.user.service;

import com.example.library.domain.email.service.EmailService;
import com.example.library.domain.token.service.TokenService;
import com.example.library.domain.user.dto.auth.request.UserChangeRequestDto;
import com.example.library.domain.user.dto.auth.request.UserLoginRequestDto;
import com.example.library.domain.user.dto.auth.request.UserLogoutRequestDto;
import com.example.library.domain.user.dto.auth.request.UserSearchIdRequestDto;
import com.example.library.domain.user.dto.auth.request.UserSearchPwRequestDto;
import com.example.library.domain.user.dto.auth.response.UserLoginResponseDto;
import com.example.library.domain.user.entity.Salt;
import com.example.library.domain.user.entity.User;
import com.example.library.domain.user.repository.SaltRepository;
import com.example.library.domain.user.repository.UserRepository;
import com.example.library.util.OpenCrypt;
import com.example.library.util.PasswordGenerator;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserAuthService {

    UserRepository userRepository;
    SaltRepository saltRepository;
    EmailService emailService;
    TokenService tokenService;

    public UserAuthService(UserRepository userRepository, SaltRepository saltRepository,
        EmailService emailService, TokenService tokenService) {
        this.userRepository = userRepository;
        this.saltRepository = saltRepository;
        this.emailService = emailService;
        this.tokenService = tokenService;
    }

    public void findUserId(UserSearchIdRequestDto userSearchIdRequestDto)
        throws MessagingException {
        User targetUser = userRepository.findByUserEmail(userSearchIdRequestDto.getUserEmail())
            .orElseThrow(() -> new NoSuchElementException("해당 이메일로 가입된 유저가 존재하지 않습니다."));

        emailService.sendUserId(targetUser.getUserEmail(), targetUser.getUserLoginId());
    }

    public String findUserPw(UserSearchPwRequestDto userSearchPwRequestDto)
        throws MessagingException {
        User targetUser = userRepository.findByUserLoginId(userSearchPwRequestDto.getUserLoginId())
            .orElseThrow(() -> new NoSuchElementException("일치하는 정보를 갖는 유저가 존재하지 않습니다."));

        if (!targetUser.getUserBirth().equals(userSearchPwRequestDto.getUserBirth())) {
            throw new NoSuchElementException("일치하는 정보를 갖는 유저가 존재하지 않습니다.");
        }

        Salt targetSalt = saltRepository.findById(targetUser.getUserId())
            .orElseThrow(() -> new NoSuchElementException("데이터 베이스 오류!"));

        String newPassword = PasswordGenerator.generatePassword(12);
        String hashedPassword = OpenCrypt.byteArrayToHex(
            OpenCrypt.getSHA256(newPassword, targetSalt.getSalt()));

        targetUser.setUserPassword(hashedPassword);
        emailService.sendUserPw(targetUser.getUserEmail(), newPassword);
        return newPassword;
    }

    public UserLoginResponseDto userLogin(UserLoginRequestDto userLoginRequestDto,
        HttpServletResponse response) {
        User targetUser = userRepository.findByUserLoginId(userLoginRequestDto.getUserLoginId())
            .orElseThrow(() -> new NoSuchElementException("아이디 또는 비밀번호가 잘못되었습니다."));

        if (targetUser.getUserId() < 6) {
            if (!targetUser.getUserPassword().equals(userLoginRequestDto.getUserPassword())) {
                throw new NoSuchElementException("아이디 또는 비밀번호가 일치하지 않습니다.");
            }

            tokenService.setTokens(targetUser.getUserId(), response);

            return new UserLoginResponseDto(targetUser.getUserId(), targetUser.getUserName());
        }

        Salt targetSalt = saltRepository.findById(targetUser.getUserId())
            .orElseThrow(() -> new NoSuchElementException("데이터 베이스 오류!"));

        String hashedPassword = OpenCrypt.byteArrayToHex(
            OpenCrypt.getSHA256(userLoginRequestDto.getUserPassword(), targetSalt.getSalt()));

        if (!hashedPassword.equals(targetUser.getUserPassword())) {
            throw new NoSuchElementException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        tokenService.setTokens(targetUser.getUserId(), response);

        return new UserLoginResponseDto(targetUser.getUserId(), targetUser.getUserName());
    }

    public void changeUserPw(UserChangeRequestDto userChangeRequestDto) {
        User targetUser = userRepository.findById(userChangeRequestDto.getUserId())
            .orElseThrow(() -> new NoSuchElementException("잘못된 접근입니다."));

        String targetPassword;

        if (targetUser.getUserId() < 6) {
            targetPassword = userChangeRequestDto.getUserPassword();
        } else {
            Salt targetSalt = saltRepository.findById(targetUser.getUserId())
                .orElseThrow(() -> new NoSuchElementException("데이터 베이스 오류!"));

            targetPassword = OpenCrypt.byteArrayToHex(
                OpenCrypt.getSHA256(userChangeRequestDto.getUserPassword(), targetSalt.getSalt()));
        }
        
        if (userChangeRequestDto.getAction() == 0) {
            if (!targetPassword.equals(targetUser.getUserPassword())) {
                throw new NoSuchElementException("비밀번호가 일치하지 않습니다.");
            }
        }

        if (userChangeRequestDto.getAction() == 1) {
            targetUser.setUserPassword(targetPassword);
        }
    }

    public void userLogout(UserLogoutRequestDto userLogoutRequestDto) {
        tokenService.userLogout(userLogoutRequestDto.getUserId());
    }
}
