package com.example.library.domain.token.service;

import com.example.library.domain.token.exception.AuthorizationException;
import com.example.library.domain.token.exception.TokenException;
import com.example.library.util.EncryptKeys;
import com.nimbusds.jose.EncryptionMethod;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWEAlgorithm;
import com.nimbusds.jose.JWEHeader;
import com.nimbusds.jose.JWEObject;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.RSADecrypter;
import com.nimbusds.jose.crypto.RSAEncrypter;
import com.nimbusds.jwt.JWTClaimsSet;
import jakarta.servlet.http.HttpServletRequest;
import java.security.PrivateKey;
import java.text.ParseException;
import java.time.Duration;
import java.util.Date;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class AccessTokenService {

    private static final String AT_BLACK_LIST_PREFIX = "access_token_";

    private final RedisTemplate<String, String> redisTemplate;

    public AccessTokenService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String generateAccessToken(int userId) {
        // JWT Claims
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
            .claim("userId", userId)
            .expirationTime(new Date(System.currentTimeMillis() + 30 * 60 * 1000))
            .build();

        // JWE Header
        JWEHeader header = new JWEHeader.Builder(JWEAlgorithm.RSA_OAEP_256,
            EncryptionMethod.A128GCM)
            .contentType("JWT")
            .build();

        // JWE Object
        JWEObject jweObject = new JWEObject(header, new Payload(claims.toJSONObject()));

        // Encrypt JWE with RSA Public Key
        try {
            jweObject.encrypt(new RSAEncrypter(EncryptKeys.getPublicKey()));
        } catch (JOSEException e) {
            throw new TokenException("access token 암호화 과정에서 문제!");
        }

        redisTemplate.delete(AT_BLACK_LIST_PREFIX + userId);
        return jweObject.serialize();
    }

    // JWE 검증 메서드
    public JWTClaimsSet decryptJWE(String jweToken) throws ParseException, JOSEException {
        // 1. JWE 토큰 파싱
        JWEObject jweObject = JWEObject.parse(jweToken);

        // 2. RSA 개인 키를 사용해 복호화
        PrivateKey privateKey = EncryptKeys.getPrivateKey();
        jweObject.decrypt(new RSADecrypter(privateKey));

        // 3. Payload에서 JWT Claims 추출
        String payload = jweObject.getPayload().toString();

        // 4. Payload를 JWTClaimsSet으로 변환
        return JWTClaimsSet.parse(payload);
    }

    // Payload 검증 메서드
    public boolean isValidClaims(JWTClaimsSet claims) {
        try {
            // 1. 만료 시간 (exp) 검증
            if (claims.getExpirationTime() == null || claims.getExpirationTime()
                .before(new Date())) {
                return false;
            }

            int userId = ((Long) claims.getClaim("userId")).intValue();

            return !redisTemplate.hasKey(AT_BLACK_LIST_PREFIX + userId);

            // 추가적인 검증 로직 필요시 여기에 추가
        } catch (Exception e) {
            throw new AuthorizationException("유효하지 않은 Access Token");
        }
    }

    public boolean isValidAuthClaims(JWTClaimsSet claims) {
        if (!isValidClaims(claims)) {
            return false;
        }

        try {
            int userId = ((Long) claims.getClaim("userId")).intValue();

            return userId < 6;
        } catch (Exception e) {
            throw new AuthorizationException("유효하지 않은 Access Token");
        }
    }

    public String resolveAccessToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 제거
        }
        return null;
    }

    public int getUserId(HttpServletRequest request) {
        try {
            return ((Long) decryptJWE(resolveAccessToken(request)).getClaim("userId")).intValue();
        } catch (Exception e) {
            throw new AuthorizationException("유효하지 않은 Access Token");
        }
    }

    public void addBlackList(int userId) {
        redisTemplate.opsForValue()
            .set(AT_BLACK_LIST_PREFIX + userId, "1", Duration.ofMinutes(30));
    }
}
