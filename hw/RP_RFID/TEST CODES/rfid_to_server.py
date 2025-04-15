import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import requests
import time

# RFID 리더 초기화
reader = SimpleMFRC522()

# 서버 URL
SERVER_URL = "http://43.200.7.229:8080/api/book/save?bookId="

try:
    print("📡 RFID 시스템 시작...")
    
    while True:
        print("📡 RFID 태그를 스캔하세요...")

        # RFID 태그 읽기
        id, text = reader.read()
        print(f"✅ 태그 인식 완료: {id}")

        # 서버로 데이터 전송
        try:
            response = requests.get(f"{SERVER_URL}{id}", timeout=5)  # 타임아웃 추가
            response.raise_for_status()  # HTTP 에러 발생 시 예외 처리

            print(f"📤 서버 전송 성공: {response.text}")
        except requests.exceptions.RequestException as e:
            print(f"❌ 서버 전송 실패: {e}")

        time.sleep(2)  # 중복 인식 방지

except KeyboardInterrupt:
    print("\n프로그램 종료")

finally:
    GPIO.cleanup()
