#!/usr/bin/env python3

import Jetson.GPIO as GPIO
import rospy
from std_msgs.msg import Bool
import time  # 모터 속도 조절용 딜레이 추가

# 📍 GPIO 핀 설정 (BOARD 모드)
IN1 = 13   # 모터 A IN1
IN2 = 15   # 모터 A IN2
IN3 = 16   # 모터 B IN3
IN4 = 18   # 모터 B IN4

def motor_callback(msg):
    if msg.data:
        # 🚗 모터 A, 🚙 모터 B 전진
        GPIO.output(IN1, GPIO.HIGH)
        GPIO.output(IN2, GPIO.LOW)
        GPIO.output(IN3, GPIO.HIGH)
        GPIO.output(IN4, GPIO.LOW)
        rospy.loginfo("Motors: FORWARD")
    else:
        # 🚗 모터 A, 🚙 모터 B 후진
        GPIO.output(IN1, GPIO.LOW)
        GPIO.output(IN2, GPIO.HIGH)
        GPIO.output(IN3, GPIO.LOW)
        GPIO.output(IN4, GPIO.HIGH)
        rospy.loginfo("Motors: REVERSE")
    
    time.sleep(0.5)  # 모터 속도 제어 (0.5초 딜레이)

def main():
    # 🚀 ROS 노드 초기화
    rospy.init_node('l298n_motor_node')
    rospy.Subscriber("motor_control", Bool, motor_callback)  # 단일 토픽으로 제어

    # 📍 GPIO 초기화
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(IN1, GPIO.OUT)
    GPIO.setup(IN2, GPIO.OUT)
    GPIO.setup(IN3, GPIO.OUT)
    GPIO.setup(IN4, GPIO.OUT)

    try:
        rospy.spin()  # ROS 메시지 대기
    except KeyboardInterrupt:
        pass
    finally:
        GPIO.cleanup()  # 종료 시 GPIO 초기화

if __name__ == '__main__':
    main()
