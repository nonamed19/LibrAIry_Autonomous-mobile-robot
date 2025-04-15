package com.example.library.domain.email.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${MAIL_USERNAME}")
    private String mailUser;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendVerificationEmail(String recipientEmail, String verificationCode)
        throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // HTML 템플릿 적용
        Context context = new Context();
        context.setVariable("code", verificationCode);
        String htmlContent = templateEngine.process("otp", context);

        helper.setTo(recipientEmail);
        helper.setSubject("이메일 인증 코드입니다.");
        helper.setText(htmlContent, true);
        helper.setFrom(mailUser);

        mailSender.send(message);
    }

    public void sendUserId(String recipientEmail, String userId) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // HTML 템플릿 적용
        Context context = new Context();
        context.setVariable("userId", userId);
        String htmlContent = templateEngine.process("userid", context);

        helper.setTo(recipientEmail);
        helper.setSubject("해당 이메일로 가입된 아이디입니다.");
        helper.setText(htmlContent, true);
        helper.setFrom(mailUser);

        mailSender.send(message);
    }

    public void sendUserPw(String recipientEmail, String userPassword) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // HTML 템플릿 적용
        Context context = new Context();
        context.setVariable("userPassword", userPassword);
        String htmlContent = templateEngine.process("password", context);

        helper.setTo(recipientEmail);
        helper.setSubject("임시 비밀번호 보내드립니다.");
        helper.setText(htmlContent, true);
        helper.setFrom(mailUser);

        mailSender.send(message);
    }
}