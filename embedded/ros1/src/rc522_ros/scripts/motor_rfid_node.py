#!/usr/bin/env python3
import rospy
import Jetson.GPIO as GPIO
import time
from Jetson_MFRC522 import SimpleMFRC522
from std_msgs.msg import String

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
SPEED_DELAY = 0.05  # 값을 키우면 더 천천히 돌고, 줄이면 빨라짐

# 📍 RFID 리더 초기화
reader = SimpleMFRC522()

# 🔹 모터 제어 함수
def motor_forward():
    rospy.loginfo("🚗 모터: FORWARD (이동 중)")
    for _ in range(5):  
        GPIO.output(IN1, GPIO.HIGH)
        GPIO.output(IN2, GPIO.LOW)
        GPIO.output(IN3, GPIO.HIGH) 
        GPIO.output(IN4, GPIO.LOW)
        time.sleep(SPEED_DELAY)

        GPIO.output(IN1, GPIO.LOW)
        GPIO.output(IN2, GPIO.LOW)
        GPIO.output(IN3, GPIO.LOW)
        GPIO.output(IN4, GPIO.LOW)
        time.sleep(SPEED_DELAY)

def stop_motor():
    GPIO.output(IN1, GPIO.LOW)
    GPIO.output(IN2, GPIO.LOW)
    GPIO.output(IN3, GPIO.LOW)
    GPIO.output(IN4, GPIO.LOW)
    rospy.loginfo("🛑 모터: STOPPED (정지)")

def rfid_motor_control():
    rospy.init_node('rfid_motor_node', anonymous=True)
    rospy.loginfo("🔹 모터 시작: 첫 번째 RFID를 찾는 중...")
    motor_forward()  # 프로그램 시작 시 모터 바로 작동

    while not rospy.is_shutdown():
        rospy.loginfo("🔹 첫 번째 RFID를 태그하세요...")
        id1, text1 = reader.read()
        rospy.loginfo(f"✅ 첫 번째 RFID 인식됨: {id1}, {text1.strip()}")

        start_time = time.time()
        rfid_detected = False

        while time.time() - start_time < 10:
            motor_forward()
            rospy.loginfo("⏳ 두 번째 RFID를 기다리는 중...")
            id2, text2 = reader.read_no_block()
            
            if id2:
                rospy.loginfo(f"✅ 두 번째 RFID 인식됨: {id2}, {text2.strip()}")
                rfid_detected = True
                break

        stop_motor()

        if not rfid_detected:
            rospy.loginfo("⏰ 10초 동안 두 번째 RFID 인식되지 않아 자동 정지.")

        time.sleep(5)

    stop_motor()
    GPIO.cleanup()

if __name__ == '__main__':
    try:
        rfid_motor_control()
    except rospy.ROSInterruptException:
        GPIO.cleanup()
