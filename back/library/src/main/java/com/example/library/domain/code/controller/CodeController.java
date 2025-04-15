package com.example.library.domain.code.controller;

import com.example.library.domain.code.dto.request.CodeRequestDto;
import com.example.library.domain.code.service.CodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/code")
@Tag(name = "QR 코드 도메인")
public class CodeController {

    CodeService codeService;

    public CodeController(CodeService codeService) {
        this.codeService = codeService;
    }

    @Operation(summary = "사용자 QR 코드 조회", description = "사용자가 대출을 하기 위해 QR 코드를 요청하는 API 입니다.")
    @PostMapping("")
    public ResponseEntity<byte[]> getCode(HttpServletRequest request) {

        int userId = ((Long) request.getAttribute("userId")).intValue();
        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_PNG)
            .body(codeService.getCode(new CodeRequestDto(userId)));
    }

    @Operation(summary = "사용자 QR 코드 조회 - JWT 사용 x", description = "사용자가 대출을 하기 위해 QR 코드를 요청하는 API 입니다.")
    @PostMapping("/2")
    public ResponseEntity<byte[]> getCode2(@RequestBody CodeRequestDto codeRequestDto) {

        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_PNG)
            .body(codeService.getCode(new CodeRequestDto(codeRequestDto.getUserId())));
    }
}
