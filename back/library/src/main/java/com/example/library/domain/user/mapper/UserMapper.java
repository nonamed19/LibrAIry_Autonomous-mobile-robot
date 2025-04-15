package com.example.library.domain.user.mapper;

import com.example.library.domain.book.entity.BorrowRecord;
import com.example.library.domain.user.dto.request.UserSignUpRequestDto;
import com.example.library.domain.user.dto.response.UserRecordResponseDto.UserRecordDto;
import com.example.library.domain.user.entity.User;
import com.example.library.util.Base58StringGenerator;
import java.time.LocalDate;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User signUpDtoToEntity(UserSignUpRequestDto userSignUpRequestDto,
        String encryptPassword) {
        return new User(
            userSignUpRequestDto.getUserLoginId(),
            encryptPassword,
            userSignUpRequestDto.getUserName(),
            userSignUpRequestDto.getUserEmail(),
            userSignUpRequestDto.getUserBirth(),
            LocalDate.now(),
            0,
            Base58StringGenerator.generateBase58String(10)
        );
    }

    public UserRecordDto changeToDto(BorrowRecord borrowRecord) {
        return new UserRecordDto(
            borrowRecord.getBook().getBookIsbn(),
            borrowRecord.getBorrowAt(),
            borrowRecord.getReturnAt(),
            borrowRecord.getBorrowRecordStatus()
        );
    }
}
