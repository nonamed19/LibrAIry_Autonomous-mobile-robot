#!/usr/bin/env python3

import rospy
import time
import math
import requests
import Jetson.GPIO as GPIO
from Jetson_MFRC522 import SimpleMFRC522
from std_msgs.msg import String
from geometry_msgs.msg import PoseStamped, Quaternion
from actionlib_msgs.msg import GoalStatusArray
from time import sleep
import signal
import sys
import json
import tf.transformations as tf


class RC522Node:
    def __init__(self):
        rospy.init_node('rc522_node', anonymous=True)

        # ✅ 설정 파일 로드
        self.config = self.load_config()
        self.BASE_URL = self.config["api"]["base_url"]
        self.ROBOT_ID = self.config["api"]["robot_id"]
        self.HEADERS = self.config["api"]["headers"]

        self.publisher = rospy.Publisher('rc522_data', String, queue_size=10)
        self.goal_publisher = rospy.Publisher('/move_base_simple/goal', PoseStamped, queue_size=10)
        self.status_subscriber = rospy.Subscriber('/move_base/status', GoalStatusArray, self.status_callback)

        self.goal_reached = False
        self.reader = SimpleMFRC522()
        self.motor_controller = RFIDMotorController()  # ✅ 모터 컨트롤러 통합
        GPIO.setmode(GPIO.BOARD)  # 물리적 핀 번호 설정
        rospy.loginfo("RC522Node initialized. Ready to read tags.")

        signal.signal(signal.SIGINT, self.signal_handler)  # Ctrl+C 핸들러 등록

    def load_config(self):
        """설정 파일(config.json)을 불러오는 함수"""
        CONFIG_PATH = "config.json"
        try:
            with open(CONFIG_PATH, "r") as file:
                return json.load(file)
        except Exception as e:
            rospy.logerr(f"Config 파일 로드 실패: {e}")
            sys.exit(1)

    def read_and_publish(self):
        try:
            while not rospy.is_shutdown():
                print("Hold a tag near the reader")
                id, text = self.reader.read()  # 태그 읽기
                book_id = str(id)  # ID 값을 문자열로 변환
                rospy.loginfo(f"Tag ID: {book_id}, Text: {text}")
                self.publisher.publish(f"ID: {book_id}, Text: {text}")

                sleep(2)  # 안전을 위한 딜레이 추가

                # API 호출하여 목표 위치 받기
                target_pose = self.send_api_request("/start", book_id)
                if target_pose:
                    self.send_goal(target_pose)
                    self.send_api_request("/end", book_id)

                # 벨트 작동 코드
                if self.motor_controller.rfid_motor_control():
                    continue
                else:
                    continue
        except KeyboardInterrupt:
            rospy.loginfo("Shutting down RC522Node.")
        finally:
            self.cleanup()

    def send_api_request(self, fun_name, book_id):
        """API 요청을 보내 목표 좌표를 받아오는 함수"""
        data = {
            "bookId": book_id,
            "robotId": self.ROBOT_ID
        }
        try:
            response = requests.post(self.BASE_URL + fun_name, headers=self.HEADERS, json=data)
            if response.status_code == 200:
                rospy.loginfo("API 호출 성공: " + response.text)
                result = response.json()
                return result.get("libraryMapX"), result.get("libraryMapY"), result.get("libraryMapW")
            else:
                rospy.logwarn(f"API 호출 실패: {response.status_code}, 응답: {response.text}")
                sleep(1)
        except requests.exceptions.RequestException as e:
            rospy.logerr(f"API 요청 중 오류 발생: {e}")
        return None

    def send_goal(self, target_pose):
        """목표 위치(goal)을 ROS에 전송하는 함수"""
        x, y, theta = target_pose
        goal = PoseStamped()
        goal.header.stamp = rospy.Time.now()
        goal.header.frame_id = "map"
        goal.pose.position.x = x - 2
        goal.pose.position.y = 0
        goal.pose.orientation = Quaternion(*tf.quaternion_from_euler(0, 0, math.radians(0)))

        rospy.loginfo(f"목표 위치 전송: x={x}, y={y}, theta={theta}")
        self.goal_publisher.publish(goal)

        rospy.loginfo("목표 위치에 도달할 때까지 대기 중...")
        self.goal_reached = False
        while not self.goal_reached and not rospy.is_shutdown():
            rospy.sleep(1)  # 목표 도달 여부 확인을 위한 대기
        rospy.loginfo("목표 위치에 도착함.")

    def status_callback(self, msg):
        """로봇의 이동 상태를 확인하는 콜백 함수"""
        if msg.status_list:
            last_status = msg.status_list[-1].status  # 최신 상태 확인
            if last_status == 3:  # Goal reached 상태
                self.goal_reached = True

    def signal_handler(self, sig, frame):
        """Ctrl+C 입력 시 안전하게 종료"""
        rospy.loginfo("Ctrl+C detected. Shutting down...")
        self.cleanup()
        sys.exit(0)

    def cleanup(self):
        """GPIO 정리 및 종료 메시지 출력"""
        GPIO.cleanup()
        rospy.loginfo("GPIO cleaned up. Exiting.")


class RFIDMotorController:
    def __init__(self, speed_delay=0.1):
        """RFID 기반 모터 컨트롤러"""
        self.IN1 = 13
        self.IN2 = 15
        self.IN3 = 16
        self.IN4 = 18

        self.SPEED_DELAY = speed_delay

        # GPIO 설정
        GPIO.setup(self.IN1, GPIO.OUT)
        GPIO.setup(self.IN2, GPIO.OUT)
        GPIO.setup(self.IN3, GPIO.OUT)
        GPIO.setup(self.IN4, GPIO.OUT)

        self.reader = SimpleMFRC522()

    def motor_forward(self):
        """모터를 전진시키는 함수"""
        rospy.loginfo("🚗 모터: FORWARD (이동 중)")
        GPIO.output(self.IN2, GPIO.HIGH)
        GPIO.output(self.IN1, GPIO.LOW)
        GPIO.output(self.IN3, GPIO.HIGH)
        GPIO.output(self.IN4, GPIO.LOW)
        sleep(self.SPEED_DELAY)

        GPIO.output(self.IN1, GPIO.LOW)
        GPIO.output(self.IN2, GPIO.LOW)
        GPIO.output(self.IN3, GPIO.LOW)
        GPIO.output(self.IN4, GPIO.LOW)
        sleep(self.SPEED_DELAY)

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
        id1, text1 = self.reader.read()
        rospy.loginfo(f"✅ 첫 번째 RFID 인식됨: {id1}, {text1.strip()}")
        
        start_time = time.time()
        rfid_detected = False
        
        while time.time() - start_time < 10:
            rospy.loginfo("move_forward")
            self.motor_forward()
            id2, text2 = self.reader.read_no_block()
            if id2:
                if(id2 != id1):
                    rfid_detected = True
                    break
            
        self.stop_motor()

        return 1 if rfid_detected else 0

        self.cleanup()

    def cleanup(self):
        """GPIO 정리"""
        self.stop_motor()
        GPIO.cleanup()
        rospy.loginfo("🧹 GPIO 정리 완료!")


if __name__ == "__main__":
    try:
        node = RC522Node()
        node.read_and_publish()
    except rospy.ROSInterruptException:
        pass
