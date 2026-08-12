import Jetson.GPIO as GPIO
import time
from Jetson_MFRC522 import SimpleMFRC522

# 📍 GPIO 핀 설정 (BOARD 모드)
IN1 = 13   # 모터 A IN1
IN2 = 15   # 모터 A IN2
IN3 = 16   # 모터 B IN3
IN4 = 18   # 모터 B IN4

# 📍 GPIO 초기화
GPIO.setmode(GPIO.BOARD)
GPIO.setup(IN1, GPIO.OUT)
GPIO.setup(IN2, GPIO.OUT)
GPIO.setup(IN3, GPIO.OUT)
GPIO.setup(IN4, GPIO.OUT)

# 🔹 속도 조절을 위한 변수
SPEED_DELAY = 0.5  # 값을 키우면 더 천천히 돌고, 줄이면 빨라짐

# 📍 RFID 리더 초기화
reader = SimpleMFRC522()

# 🔹 모터 제어 함수 (time.sleep()을 활용하여 속도 조절)
def motor_forward():
    print("🚗 모터: FORWARD (이동 중)")
    for _ in range(2):  # 반복적으로 모터를 ON/OFF하여 천천히 이동
        GPIO.output(IN1, GPIO.HIGH)
        GPIO.output(IN2, GPIO.LOW)
        GPIO.output(IN3, GPIO.HIGH) 
        GPIO.output(IN4, GPIO.LOW)
        time.sleep(SPEED_DELAY)  # 일정 시간 모터 작동

        GPIO.output(IN1, GPIO.LOW)
        GPIO.output(IN2, GPIO.LOW)
        GPIO.output(IN3, GPIO.LOW)
        GPIO.output(IN4, GPIO.LOW)
        time.sleep(SPEED_DELAY)  # 일정 시간 모터 정지 후 반복

def stop_motor():
    GPIO.output(IN1, GPIO.LOW)
    GPIO.output(IN2, GPIO.LOW)
    GPIO.output(IN3, GPIO.LOW)
    GPIO.output(IN4, GPIO.LOW)
    print("🛑 모터: STOPPED (정지)")

try:
    print("🔹 모터 시작: 첫 번째 RFID를 찾는 중...")
    motor_forward()  # 프로그램 시작 시 모터 바로 작동

    while True:
        print("🔹 첫 번째 RFID를 태그하세요...")
        id1, text1 = reader.read()  # 첫 번째 RFID 읽기
        print(f"✅ 첫 번째 RFID 인식됨: {id1}, {text1.strip()}")
        
        start_time = time.time()
        rfid_detected = False

        while time.time() - start_time < 10:  # 5초 동안 두 번째 RFID 대기
            motor_forward()  # 모터 계속 이동
            print("⏳ 두 번째 RFID를 기다리는 중...")
            id2, text2 = reader.read_no_block()  # 블로킹 없이 RFID 감지
            
            if id2:  # 두 번째 RFID 감지 시 즉시 모터 정지
                print(f"✅ 두 번째 RFID 인식됨: {id2}, {text2.strip()}")
                rfid_detected = True
                break

        stop_motor()  # 10초 후 자동 정지 또는 두 번째 RFID 감지 시 정지

        if not rfid_detected:
            print("⏰ 10초 동안 두 번째 RFID 인식되지 않아 자동 정지.")

        time.sleep(5)  # 다음 RFID 인식을 위해 대기

except KeyboardInterrupt:
    print("\n🛑 프로그램 종료")
finally:
    stop_motor()
    GPIO.cleanup()  # 종료 시 GPIO 초기화
