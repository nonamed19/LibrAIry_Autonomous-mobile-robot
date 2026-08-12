package com.example.library.domain.code.service;

import com.example.library.domain.code.dto.request.CodeRequestDto;
import com.example.library.domain.user.entity.User;
import com.example.library.domain.user.repository.UserRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import jakarta.transaction.Transactional;
import java.io.ByteArrayOutputStream;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class CodeService {

    UserRepository userRepository;

    public CodeService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public byte[] getCode(CodeRequestDto codeRequestDto) {
        int width = 200;
        int height = 200;

        User targetUser = userRepository.findById(codeRequestDto.getUserId())
            .orElseThrow(() -> new NoSuchElementException("해당 유저가 존재하지 않습니다."));

        // QR Code - Image 생성. : 1회성으로 생성해야 하기 때문에
        // stream으로 Generate(1회성이 아니면 File로 작성 가능.)
        try {
            BitMatrix encode = new MultiFormatWriter()
                .encode(targetUser.getUserCode(), BarcodeFormat.QR_CODE, width, height);
            //output Stream
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            //Bitmatrix, file.format, outputStream
            MatrixToImageWriter.writeToStream(encode, "PNG", out);

            return out.toByteArray();

        } catch (Exception e) {
            throw new NoSuchElementException("QR 코드 작성 과정에서 오류!");
        }
    }
}
