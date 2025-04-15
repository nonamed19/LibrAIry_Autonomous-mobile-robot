package com.example.library.util;

import java.security.SecureRandom;

public class Base58StringGenerator {

    private static final String BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generateBase58String(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = RANDOM.nextInt(BASE58_ALPHABET.length());
            sb.append(BASE58_ALPHABET.charAt(index));
        }
        return sb.toString();
    }
}
