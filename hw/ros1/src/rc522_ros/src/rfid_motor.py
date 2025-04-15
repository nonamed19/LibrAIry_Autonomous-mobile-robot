#!/usr/bin/env python3
import rospy
import Jetson.GPIO as GPIO
import time
from Jetson_MFRC522 import SimpleMFRC522
from std_msgs.msg import String


class RFIDMotorController:
    def __init__(self, speed_delay=0.05):
        # 📍 GPIO 핀 설정 (BOARD 모드)
        self.IN1 = 13   # 모터 A IN1
        self.IN2 = 15   # 모터 A IN2
        self.IN3 = 16   # 모터 B IN3
        self.IN4 = 18   # 모터 B IN4

        self.SPEED_DELAY = speed_delay  # 속도 조절

        # 📍 GPIO 초기화
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(self.IN1, GPIO.OUT)
        GPIO.setup(self.IN2, GPIO.OUT)
        GPIO.setup(self.IN3, GPIO.OUT)
        GPIO.setup(self.IN4, GPIO.OUT)

        # 📍 RFID 리더 초기화
        self.reader = SimpleMFRC522()

        # ROS 노드 초기화
        rospy.init_node('rfid_motor_node', anonymous=True)

    def motor_forward(self):
        """모터를 전진시키는 함수"""
        rospy.loginfo("🚗 모터: FORWARD (이동 중)")
        for _ in range(5):  
            GPIO.output(self.IN1, GPIO.HIGH)
            GPIO.output(self.IN2, GPIO.LOW)
            GPIO.output(self.IN3, GPIO.HIGH) 
            GPIO.output(self.IN4, GPIO.LOW)
            time.sleep(self.SPEED_DELAY)

            GPIO.output(self.IN1, GPIO.LOW)
            GPIO.output(self.IN2, GPIO.LOW)
            GPIO.output(self.IN3, GPIO.LOW)
            GPIO.output(self.IN4, GPIO.LOW)
            time.sleep(self.SPEED_DELAY)

    def stop_motor(self):
        """모터를 정지시키는 함수"""
        GPIO.output(self.IN1, GPIO.LOW)
        GPIO.output(self.IN2, GPIO.LOW)
        GPIO.output(self.IN3, GPIO.LOW)
        GPIO.output(self.IN4, GPIO.LOW)
        rospy.loginfo("🛑 모터: STOPPED (정지)")

    def rfid_motor_control(self):
        """RFID 태깅을 통해 모터 제어"""
        rospy.loginfo("🔹 모터 시작: 첫 번째 RFID를 찾는 중...")
        self.motor_forward()  # 프로그램 시작 시 모터 바로 작동

        while not rospy.is_shutdown():
            rospy.loginfo("🔹 첫 번째 RFID를 태그하세요...")
            id1, text1 = self.reader.read()
            rospy.loginfo(f"✅ 첫 번째 RFID 인식됨: {id1}, {text1.strip()}")

            start_time = time.time()
            rfid_detected = False

            while time.time() - start_time < 10:
                self.motor_forward()
                rospy.loginfo("⏳ 두 번째 RFID를 기다리는 중...")
                id2, text2 = self.reader.read_no_block()
                
                if id2:
                    rospy.loginfo(f"✅ 두 번째 RFID 인식됨: {id2}, {text2.strip()}")
                    rfid_detected = True
                    break

            self.stop_motor()

            if not rfid_detected:
                # 두번쨰로 갈곳이 없으면  0 있으면 1 
                rospy.loginfo("⏰ 10초 동안 두 번째 RFID 인식되지 않아 자동 정지.")
                return 0
            else : 
                return 1

        self.cleanup()

    def cleanup(self):
        """GPIO 리소스를 정리하는 함수"""
        self.stop_motor()
        GPIO.cleanup()
        rospy.loginfo("🧹 GPIO 정리 완료!")

if __name__ == '__main__':
    try:
        controller = RFIDMotorController()
        controller.rfid_motor_control()
    except rospy.ROSInterruptException:
        controller.cleanup()
