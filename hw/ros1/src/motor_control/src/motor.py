# #!/usr/bin/env python3

import rospy
import math
from geometry_msgs.msg import Twist
from adafruit_motor import motor
from adafruit_pca9685 import PCA9685
from adafruit_servokit import ServoKit
import board
import busio

# 서보 초기 위치 및 최소/최대 값 설정
INIT_V = 105
MIN_V = INIT_V - 35
MAX_V = INIT_V + 35

class PWMThrottleHat:
    def __init__(self, pwm, channel):
        self.pwm = pwm
        self.channel = channel
        self.pwm.frequency = 60  # 주파수 설정

    def set_throttle(self, throttle):
        pulse = int(0xFFFF * abs(throttle))  # 16비트 듀티 사이클 계산
        if throttle > 0:  # 전진
            self.pwm.channels[self.channel + 5].duty_cycle = pulse
            self.pwm.channels[self.channel + 4].duty_cycle = 0xFFFF
            self.pwm.channels[self.channel + 3].duty_cycle = 0
        elif throttle < 0:  # 후진
            self.pwm.channels[self.channel + 5].duty_cycle = pulse
            self.pwm.channels[self.channel + 4].duty_cycle = 0
            self.pwm.channels[self.channel + 3].duty_cycle = 0xFFFF
        else:  # 정지
            self.pwm.channels[self.channel + 5].duty_cycle = 0
            self.pwm.channels[self.channel + 4].duty_cycle = 0
            self.pwm.channels[self.channel + 3].duty_cycle = 0

class CmdVelSubscriber:
    def __init__(self):
        rospy.init_node('cmd_vel_subscriber', anonymous=True)
        rospy.Subscriber('/cmd_vel', Twist, self.listener_callback)

        # 모터 및 서보 컨트롤러 초기화
        i2c = busio.I2C(board.SCL, board.SDA)
        pca = PCA9685(i2c)
        pca.frequency = 60
        self.motor_hat = PWMThrottleHat(pca, channel=0)
        self.kit = ServoKit(channels=16, i2c=i2c, address=0x60)

        self.pan = INIT_V  # 초기 서보 위치
        self.kit.servo[0].angle = self.pan

        # 제어 변수
        self.linear_x = 0
        self.angular_z = 0
        self.running = True
        self.recovering = False

        rospy.on_shutdown(self.shutdown_callback)

    def shutdown_callback(self):
        """노드 종료 시 안전 정지"""
        rospy.loginfo("Shutting down the node.")
        self.running = False
        self.motor_hat.set_throttle(0)  # DC모터 정지
        self.kit.servo[0].angle = INIT_V  # 서보모터 초기화
        rospy.loginfo("Motor stopped and Servo initialized.")

    def listener_callback(self, msg):
        """cmd_vel 메시지 수신"""
        self.linear_x = msg.linear.x  # 전진/후진 속도
        self.angular_z = msg.angular.z  # 회전 속도
        rospy.loginfo(f"Received cmd_vel: linear_x={self.linear_x}, angular_z={self.angular_z}")

    def control_loop(self):
        """하나의 루프에서 리커버리, 조향 및 전진/후진을 수행"""
        dt = 0.1  # 업데이트 주기 (초)
        gain_factor = 200  # 회전 속도 조정 계수

        while self.running and not rospy.is_shutdown():
            # ✅ 1. 리커버리 모드 감지 및 처리 (제자리 회전)
            if abs(self.linear_x) <= 0.01 and self.angular_z != 0.0:
                self.recovering = True
                if self.angular_z > 0:
                    rospy.loginfo("Left Recovery: 제자리 회전")
                    self.kit.servo[0].angle = MAX_V
                    self.motor_hat.set_throttle(-1.0)
                    rospy.sleep(1)
                    self.kit.servo[0].angle = MIN_V
                    self.motor_hat.set_throttle(1.0)
                    rospy.sleep(1)

                elif self.angular_z < 0:
                    rospy.loginfo("Right Recovery: 제자리 회전")
                    self.kit.servo[0].angle = MIN_V
                    self.motor_hat.set_throttle(-1.0)
                    rospy.sleep(1)
                    self.kit.servo[0].angle = MAX_V
                    self.motor_hat.set_throttle(1.0)
                    rospy.sleep(1)

                self.recovering = False  # 리커버리 종료
                continue  # 리커버리 후 다시 루프 시작

            # ✅ 2. 조향 설정 (서보 모터) - 전진 시에만 조향 적용
            if self.linear_x > 0:
                if abs(self.angular_z) < 0.05:
                    self.pan = INIT_V  # 거의 회전하지 않으면 직진
                else:
                    # 전진 시에는 angular_z 반전하여 적용
                    effective_angular_z = -self.angular_z
                    angular_z_deg = math.degrees(effective_angular_z)
                    self.pan += dt * angular_z_deg * gain_factor
                    self.pan = max(min(self.pan, MAX_V), MIN_V)  # 서보 각도 제한
            else:
                if abs(self.angular_z) < 0.05:
                    self.pan = INIT_V  # 거의 회전하지 않으면 직진
                else:
                    #self.pan = INIT_V
                    effective_angular_z = self.angular_z
                    angular_z_deg = math.degrees(effective_angular_z)
                    self.pan += dt * angular_z_deg * gain_factor
                    self.pan = max(min(self.pan, MAX_V), MIN_V)  # 서보 각도 제한

            # 서보 모터 적용
            self.kit.servo[0].angle = self.pan
            rospy.loginfo(f"Servo angle updated: {self.pan:.2f} degrees")

            # ✅ 3. 전진/후진 제어 (DC 모터)
            if self.linear_x > 0:
                self.motor_hat.set_throttle(1)  # 전진
            elif self.linear_x < 0:
                self.motor_hat.set_throttle(-1)  # 후진
            else:
                self.motor_hat.set_throttle(0)  # 정지
            rospy.loginfo(f"Throttle set to: {self.linear_x}")

            #rospy.sleep(dt)


    def run(self):
        """제어 루프 실행"""
        self.control_loop()

if __name__ == '__main__':
    node = CmdVelSubscriber()
    node.run()
