package com.example.library.domain.user.controller;

import com.example.library.domain.user.dto.request.UserDupCheckRequestDto;
import com.example.library.domain.user.dto.request.UserFrontRequestDto;
import com.example.library.domain.user.dto.request.UserLeaveRequestDto;
import com.example.library.domain.user.dto.request.UserRecordRequestDto;
import com.example.library.domain.user.dto.request.UserRobotRequestDto;
import com.example.library.domain.user.dto.request.UserSignUpRequestDto;
import com.example.library.domain.user.dto.response.UserDupCheckResponseDto;
import com.example.library.domain.user.dto.response.UserFrontResponseDto;
import com.example.library.domain.user.dto.response.UserLeaveResponseDto;
import com.example.library.domain.user.dto.response.UserRecordResponseDto;
import com.example.library.domain.user.dto.response.UserRobotResponseDto;
import com.example.library.domain.user.dto.response.UserSignUpResponseDto;
import com.example.library.domain.user.service.UserConnectService;
import com.example.library.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@Tag(name = "user 도메인")
public class UserController {

    UserService userService;
    UserConnectService userConnectService;

    public UserController(UserService userService, UserConnectService userConnectService) {
        this.userService = userService;
        this.userConnectService = userConnectService;
    }

    @Operation(summary = "대출 사용자 정보 저장", description = "로봇에서 사용자 바코드를 찍고 사용자 정보를 백엔드에 저장할 때 사용되는 API 입니다.")
    @PostMapping("/save")
    public ResponseEntity<UserRobotResponseDto> userInfoRobot(
        @RequestBody UserRobotRequestDto userRobotRequestDto) {

        userConnectService.saveUserInfo(userRobotRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(
            new UserRobotResponseDto(true, "유저 정보 저장 성공!"));
    }

    @Operation(summary = "대출 사용자 정보 조회", description = "프론트에서 저장된 사용자 코드를 이용해 사용자 정보를 조회할 때 사용되는 API 입니다.")
    @PostMapping("/front")
    public ResponseEntity<UserFrontResponseDto> userInfoFront(
        @RequestBody UserFrontRequestDto userFrontRequestDto) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(userConnectService.getUserInfo(userFrontRequestDto));
    }

    @Operation(summary = "사용자 아이디/이메일 중복 확인",
        description = "사용자가 회원가입 시에 아이디 또는 이메일의 중복 확인을 할 때 사용되는 API 입니다.\n\naction: 0이면 아이디, 1이면 이메일")
    @PostMapping("/dupcheck")
    public ResponseEntity<UserDupCheckResponseDto> userDupCheck(
        @RequestBody UserDupCheckRequestDto userDupCheckRequestDto) {

        if (userService.dupCheck(userDupCheckRequestDto)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new UserDupCheckResponseDto(false, "이미 사용중입니다."));
        }

        return ResponseEntity.status(HttpStatus.OK)
            .body(new UserDupCheckResponseDto(true, "사용 가능합니다."));
    }

    @Operation(summary = "사용자 회원 가입", description = "회원 가입 시에 요청되는 API 입니다.")
    @PostMapping("/signup")
    public ResponseEntity<UserSignUpResponseDto> userSignUp(
        @RequestBody UserSignUpRequestDto userSignUpRequestDto) {

        userService.addUser(userSignUpRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new UserSignUpResponseDto(true, "회원 가입 완료!"));
    }

    @Operation(summary = "사용자 대출 기록 조회", description = "사용자의 마이 페이지에서 대출 현황을 클릭했을 때 요청되는 API 입니다.")
    @PostMapping("/search")
    public ResponseEntity<UserRecordResponseDto> searchBook(HttpServletRequest request) {

        int userId = ((Long) request.getAttribute("userId")).intValue();

        return ResponseEntity.status(HttpStatus.OK)
            .body(userService.getUserRecord(new UserRecordRequestDto(userId)));
    }

    @Operation(summary = "사용자 대출 기록 조회 - JWT 사용 x", description = "사용자의 마이 페이지에서 대출 현황을 클릭했을 때 요청되는 API 입니다.")
    @PostMapping("/search2")
    public ResponseEntity<UserRecordResponseDto> searchBook2(
        @RequestBody UserRecordRequestDto userRecordRequestDto) {

        return ResponseEntity.status(HttpStatus.OK).body(
            userService.getUserRecord(new UserRecordRequestDto(userRecordRequestDto.getUserId())));
    }

    @Operation(summary = "사용자 회원 탈퇴", description = "사용자가 회원 탈퇴 시에 요청하는 API 입니다.")
    @PostMapping("/leave")
    public ResponseEntity<UserLeaveResponseDto> leaveUser(
        HttpServletRequest request) {

        int userId = ((Long) request.getAttribute("userId")).intValue();

        userService.deleteUser(new UserLeaveRequestDto(userId));
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new UserLeaveResponseDto(true, "회원 삭제 완료!"));
    }

    @Operation(summary = "사용자 회원 탈퇴 - JWT 사용 x", description = "사용자가 회원 탈퇴 시에 요청하는 API 입니다.")
    @PostMapping("/leave2")
    public ResponseEntity<UserLeaveResponseDto> leaveUser2(
        @RequestBody UserLeaveRequestDto userLeaveRequestDto) {

        userService.deleteUser(new UserLeaveRequestDto(userLeaveRequestDto.getUserId()));
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new UserLeaveResponseDto(true, "회원 삭제 완료!"));
    }
}
