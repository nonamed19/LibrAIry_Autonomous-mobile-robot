package com.example.library.domain.user.controller;

import com.example.library.domain.user.dto.auth.request.UserChangeRequestDto;
import com.example.library.domain.user.dto.auth.request.UserLoginRequestDto;
import com.example.library.domain.user.dto.auth.request.UserLogoutRequestDto;
import com.example.library.domain.user.dto.auth.request.UserSearchIdRequestDto;
import com.example.library.domain.user.dto.auth.request.UserSearchPwRequestDto;
import com.example.library.domain.user.dto.auth.response.UserChangeResponseDto;
import com.example.library.domain.user.dto.auth.response.UserLoginResponseDto;
import com.example.library.domain.user.dto.auth.response.UserLogoutResponseDto;
import com.example.library.domain.user.dto.auth.response.UserSearchIdResponseDto;
import com.example.library.domain.user.dto.auth.response.UserSearchPwResponseDto;
import com.example.library.domain.user.service.UserAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/auth")
@Tag(name = "user/auth 도메인")
public class UserAuthController {

    UserAuthService userAuthService;

    public UserAuthController(UserAuthService userAuthService) {
        this.userAuthService = userAuthService;
    }


    @Operation(summary = "사용자 아이디 찾기 - 이메일로 아이디 발송", description = "사용자가 아이디를 찾을 때 사용되는 API 입니다.")
    @PostMapping("/searchid")
    public ResponseEntity<UserSearchIdResponseDto> userSearchId(
        @RequestBody UserSearchIdRequestDto userSearchIdRequestDto) {

        try {
            userAuthService.findUserId(userSearchIdRequestDto);
            return ResponseEntity.status(HttpStatus.OK)
                .body(new UserSearchIdResponseDto(true, "이메일 발송 성공!"));
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new UserSearchIdResponseDto(false, "이메일 발송 실패!"));
        }
    }

    @Operation(summary = "사용자 비밀번호 찾기 - 아이디, 생년월일과 연결된 이메일로 임시 비밀번호 발송", description = "사용자가 비밀번호를 찾을 때 사용되는 API 입니다.")
    @PostMapping("/searchpw")
    public ResponseEntity<UserSearchPwResponseDto> userSearchPw(
        @RequestBody UserSearchPwRequestDto userSearchPwRequestDto) {

        try {
            userAuthService.findUserPw(userSearchPwRequestDto);
            return ResponseEntity.status(HttpStatus.OK)
                .body(new UserSearchPwResponseDto(true, "이메일 발송 성공!"));
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new UserSearchPwResponseDto(false, "이메일 발송 실패!"));
        }
    }

    @Operation(summary = "사용자 로그인", description = "사용자가 로그인 할 때 사용되는 API 입니다.")
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> userLogin(HttpServletResponse response,
        @RequestBody UserLoginRequestDto userLoginRequestDto) {

        return ResponseEntity.status(HttpStatus.OK)
            .body(userAuthService.userLogin(userLoginRequestDto, response));
    }

    @Operation(summary = "사용자 로그아웃", description = "사용자가 로그아웃 할 때 사용되는 API 입니다.")
    @PostMapping("/logout")
    public ResponseEntity<UserLogoutResponseDto> userLogout(HttpServletRequest request) {

        int userId = ((Long) request.getAttribute("userId")).intValue();
        userAuthService.userLogout(new UserLogoutRequestDto(userId));

        return ResponseEntity.status(HttpStatus.OK).body(
            new UserLogoutResponseDto(true, "로그아웃 성공!"));
    }

    @Operation(summary = "사용자 비밀번호 변경 과정에서 비밀번호 재입력/수정",
        description = "사용자가 비밀번호를 변경할 때 사용되는 API 입니다.\n\naction: 0이면 재입력, 1이면 수정")
    @PostMapping("/change")
    public ResponseEntity<UserChangeResponseDto> userChangePw(
        @RequestBody UserChangeRequestDto userChangeRequestDto) {

        userAuthService.changeUserPw(userChangeRequestDto);

        if (userChangeRequestDto.getAction() == 0) {
            return ResponseEntity.status(HttpStatus.OK).body(
                new UserChangeResponseDto(true, "비밀번호가 일치합니다."));
        }

        if (userChangeRequestDto.getAction() == 1) {
            return ResponseEntity.status(HttpStatus.OK).body(
                new UserChangeResponseDto(true, "비밀번호가 변경되었습니다."));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            new UserChangeResponseDto(false, "잘못된 접근입니다."));
    }
}
