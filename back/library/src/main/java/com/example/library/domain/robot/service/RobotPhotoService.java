package com.example.library.domain.robot.service;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class RobotPhotoService {

    @Value("${HTTPS_DOMAIN}")
    private String httpsDomain;

    private String uploadDir = "/robotphoto/";


    public void uploadPhoto(int robotId, MultipartFile robotImage) {
        try {
            String filePath = "/tmp" + uploadDir + robotId + ".png";
            Path path = Paths.get(filePath);
            robotImage.transferTo(path.toFile()); // 파일 저장

        } catch (IOException e) {
            throw new NoSuchElementException("파일 생성 과정에서 오류");
        }
    }

    public String getRobotPhotoUrl(int robotId) {
        return "https://" + httpsDomain + uploadDir + robotId + ".png";
    }
}
