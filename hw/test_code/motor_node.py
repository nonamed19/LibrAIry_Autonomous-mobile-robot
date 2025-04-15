import Jetson.GPIO as GPIO
import time

# 📍 GPIO 핀 설정 (BOARD 모드)
IN1 = 13   # 모터 A IN1
IN2 = 15   # 모터 A IN2
IN3 = 16   # 모터 B IN3
IN4 = 18   # 모터 B IN4

# 📍 GPIO 초기화
GPIO.setmode(GPIO.BOARD)
GPIO.setup(IN1, GPIO.OUT)
GPIO.setup(IN3, GPIO.OUT)
GPIO.setup(IN2, GPIO.OUT)
GPIO.setup(IN4, GPIO.OUT)

# 🔹 속도 조절을 위한 변수 (0.1초 주기로 ON/OFF 반복)
SPEED_DELAY = 0.01  # 값을 키우면 더 천천히 돌고, 줄이면 빨라짐

def motor_forward():
    GPIO.output(IN2, GPIO.HIGH)
    GPIO.output(IN1, GPIO.LOW)
    GPIO.output(IN3, GPIO.HIGH) 
    GPIO.output(IN4, GPIO.LOW)
    print("Motors: FORWARD (Slow Mode)")

def stop_motor():
    GPIO.output(IN1, GPIO.LOW)
    GPIO.output(IN2, GPIO.LOW)
    GPIO.output(IN3, GPIO.LOW)
    GPIO.output(IN4, GPIO.LOW)
    print("Motors: STOPPED")

try:
    while True:
        motor_forward()
        time.sleep(1)  # 모터가 켜진 상태 유지
        #stop_motor()
        # for _ in range(5):
        #     time.sleep(SPEED_DELAY)  # 모터를 껐다가 다시 켬
except KeyboardInterrupt:
    pass
finally:
    stop_motor()
    GPIO.cleanup()  # 종료 시 GPIO 초기화
