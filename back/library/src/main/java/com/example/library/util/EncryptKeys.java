package com.example.library.util;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Base64;

public class EncryptKeys {

    private static KeyPair JWE_KEY_PAIR;
    private static String REFRESH_TOKEN_KEY;

    static {
        try {
            KeyPairGenerator RSAGenerator = KeyPairGenerator.getInstance("RSA");
            RSAGenerator.initialize(2048);
            JWE_KEY_PAIR = RSAGenerator.generateKeyPair();

            SecureRandom sr = new SecureRandom();
            byte[] salt = new byte[16]; // 16바이트 (128비트) 추천
            sr.nextBytes(salt);
            REFRESH_TOKEN_KEY = Base64.getEncoder().encodeToString(salt);
        } catch (NoSuchAlgorithmException e) {
        }
    }

    public static RSAPublicKey getPublicKey() {
        return (RSAPublicKey) JWE_KEY_PAIR.getPublic();
    }

    public static RSAPrivateKey getPrivateKey() {
        return (RSAPrivateKey) JWE_KEY_PAIR.getPrivate();
    }

    public static String getRefreshTokenKey() {
        return REFRESH_TOKEN_KEY;
    }
}
