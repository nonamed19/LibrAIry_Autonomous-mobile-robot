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
GPIO.setup(IN2, GPIO.OUT)
GPIO.setup(IN3, GPIO.OUT)
GPIO.setup(IN4, GPIO.OUT)

def motor_forward():
    GPIO.output(IN1, GPIO.HIGH)
    GPIO.output(IN2, GPIO.LOW)
    GPIO.output(IN3, GPIO.HIGH)
    GPIO.output(IN4, GPIO.LOW)
    print("Motors: FORWARD")

def stop_motor():
    GPIO.output(IN1, GPIO.LOW)
    GPIO.output(IN2, GPIO.LOW)
    GPIO.output(IN3, GPIO.LOW)
    GPIO.output(IN4, GPIO.LOW)
    print("Motors: STOPPED")

try:
    motor_forward()
    while True:
        time.sleep(1)  # 계속 전진 (1초 대기하며 루프 유지)
except KeyboardInterrupt:
    pass
finally:
    stop_motor()
    GPIO.cleanup()  # 종료 시 GPIO 초기화