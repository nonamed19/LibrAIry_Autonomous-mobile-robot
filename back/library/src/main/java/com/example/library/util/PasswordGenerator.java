package com.example.library.util;

import java.security.SecureRandom;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class PasswordGenerator {

    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL = "!@#$%^&*()-_=+<>?";
    private static final String ALL_CHARS = UPPER + LOWER + DIGITS + SPECIAL;

    private static final Random random = new SecureRandom(); // 보안적으로 안전한 난수 생성기

    public static String generatePassword(int length) {
        // 필수 요소 하나씩 포함
        String password = String.valueOf(UPPER.charAt(random.nextInt(UPPER.length()))) +
            LOWER.charAt(random.nextInt(LOWER.length())) +
            DIGITS.charAt(random.nextInt(DIGITS.length())) +
            SPECIAL.charAt(random.nextInt(SPECIAL.length()));

        // 나머지 길이만큼 무작위 문자 추가
        password += IntStream.range(0, length - 4)
            .mapToObj(i -> String.valueOf(ALL_CHARS.charAt(random.nextInt(ALL_CHARS.length()))))
            .collect(Collectors.joining());

        // 무작위로 섞기
        return shuffleString(password);
    }

    private static String shuffleString(String input) {
        char[] array = input.toCharArray();
        for (int i = array.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return new String(array);
    }
}
