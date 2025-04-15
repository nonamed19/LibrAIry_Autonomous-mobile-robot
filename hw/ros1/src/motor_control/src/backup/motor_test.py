# #!/usr/bin/env python3

# import rospy
# from geometry_msgs.msg import Twist
# from adafruit_motor import motor
# from adafruit_pca9685 import PCA9685
# from adafruit_servokit import ServoKit
# import board
# import busio

# class PWMThrottleHat:
#     def __init__(self, pwm, channel):
#         self.pwm = pwm
#         self.channel = channel
#         self.pwm.frequency = 60  # 주파수 설정

#     def set_throttle(self, throttle):
#         pulse = int(0xFFFF * abs(throttle))  # 16비트 듀티 사이클 계산

#         if throttle > 0:  # 전진
#             self.pwm.channels[self.channel + 5].duty_cycle = pulse
#             self.pwm.channels[self.channel + 4].duty_cycle = 0xFFFF
#             self.pwm.channels[self.channel + 3].duty_cycle = 0
#         elif throttle < 0:  # 후진
#             self.pwm.channels[self.channel + 5].duty_cycle = pulse
#             self.pwm.channels[self.channel + 4].duty_cycle = 0
#             self.pwm.channels[self.channel + 3].duty_cycle = 0xFFFF
#         else:  # 정지
#             self.pwm.channels[self.channel + 5].duty_cycle = 0
#             self.pwm.channels[self.channel + 4].duty_cycle = 0
#             self.pwm.channels[self.channel + 3].duty_cycle = 0

# class CmdVelSubscriber:
#     def __init__(self):
#         rospy.init_node('cmd_vel_subscriber', anonymous=True)
#         rospy.Subscriber('/cmd_vel', Twist, self.listener_callback)

#         # 모터 및 서보 컨트롤러 초기화
#         i2c = busio.I2C(board.SCL, board.SDA)
#         pca = PCA9685(i2c)
#         pca.frequency = 60
#         self.motor_hat = PWMThrottleHat(pca, channel=0)
#         self.kit = ServoKit(channels=16, i2c=i2c, address=0x60)
#         self.pan = 100
#         self.kit.servo[0].angle = self.pan
        
#         rospy.on_shutdown(self.shutdown_callback)
    
#     def shutdown_callback(self):
#         rospy.loginfo("Shutting down the node.")
        
#         # 서보모터와 DC모터를 종료 상태로 설정
#         self.motor_hat.set_throttle(0)  # DC모터 정지
#         self.kit.servo[0].angle = 100  # 서보모터 초기화 값 100 설정
        
#         rospy.loginfo("Motor stopped and Servo initialized to 100.")


#     def listener_callback(self, msg):
#         linear_x = msg.linear.x  # 전진/후진 속도
#         angular_z = msg.angular.z  # 회전 속도

#         # 속도 명령 로그 출력
#         rospy.loginfo(f"Received cmd_vel: linear_x={linear_x}, angular_z={angular_z}")

#         # 전진 및 후진
#         if(linear_x > 1):
#             {
#                 self.motor_hat.set_throttle(0.5)
#             }
#         elif(linear_x < -1):
#             {
#                 self.motor_hat.set_throttle(-1*0.5)
#             }
#         else : self.motor_hat.set_throttle(linear_x)  # linear.x 값으로 속도 조절

#         # 좌/우 회전 (서보모터 조작)
#         if angular_z > 0.1:  # 왼쪽 회전
#             rospy.loginfo("Turning Left")
#             self.pan -= 10
#             if self.pan < 70:
#                 self.pan = 70
#         elif angular_z < -0.1:  # 오른쪽 회전
#             rospy.loginfo("Turning Right")
#             self.pan += 10
#             if self.pan > 130:
#                 self.pan = 130
        
#         self.kit.servo[0].angle = self.pan
#         rospy.loginfo(f"Servo angle set to: {self.pan}")

#     def run(self):
        
#         rospy.spin()

# if __name__ == '__main__':
#     node = CmdVelSubscriber()
#     node.run()

#!/usr/bin/env python3

import rospy
import threading
import math
from geometry_msgs.msg import Twist
from adafruit_motor import motor
from adafruit_pca9685 import PCA9685
from adafruit_servokit import ServoKit
import board
import busio

INIT_V = 100
MIN_V = INIT_V - 30
MAX_V = INIT_V + 30

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
        
        # 스레드 제어를 위한 변수
        self.linear_x = 0
        self.angular_z = 0
        self.running = True

        # 전진/후진 스레드 시작
        self.motor_thread = threading.Thread(target=self.motor_control)
        self.motor_thread.start()

        # 좌/우 회전 스레드 시작
        self.servo_thread = threading.Thread(target=self.servo_control)
        self.servo_thread.start()


        rospy.on_shutdown(self.shutdown_callback)

    def shutdown_callback(self):
        rospy.loginfo("Shutting down the node.")
        self.running = False  # 스레드 종료 신호
        self.motor_thread.join()  # 모터 스레드 종료 대기
        self.servo_thread.join()  # 서보 스레드 종료 대기
        self.motor_hat.set_throttle(0)  # DC모터 정지
        self.kit.servo[0].angle = INIT_V  # 서보모터 초기화 값 80 설정
        rospy.loginfo("Motor stopped and Servo initialized to 80.")

    def listener_callback(self, msg):
        self.linear_x = msg.linear.x # 전진/후진 속도
        self.angular_z = msg.angular.z # 회전 속도
        if (self.linear_x < 0):
            self.angular_z *= -1
        rospy.loginfo(f"Received cmd_vel: linear_x={self.linear_x}, angular_z={self.angular_z}")

    def motor_control(self):
        """전진/후진 제어를 담당하는 스레드"""
        while self.running and not rospy.is_shutdown():
            if(self.linear_x == 0.0 and self.angular_z != 0.0):
                if self.angular_z > 0:
                    rospy.loginfo("Left Recovery")
                    for _ in range(3):
                        self.kit.servo[0].angle = MAX_V
                        for _ in range(2):
                            self.motor_hat.set_throttle(-1.0)
                            rospy.sleep(0.5)
                        self.kit.servo[0].angle = MIN_V
                        for _ in range(2):
                            self.motor_hat.set_throttle(1.0)
                            rospy.sleep(0.5)

                    self.motor_hat.set_throttle(0)
                    self.kit.servo[0].angle = INIT_V
                elif self.angular_z < 0:
                    rospy.loginfo("Right Recovery")
                    for _ in range(3):
                        self.kit.servo[0].angle = MIN_V
                        for _ in range(2):
                            self.motor_hat.set_throttle(-1.0)
                            rospy.sleep(0.5)
                        self.kit.servo[0].angle = MAX_V
                        for _ in range(2):
                            self.motor_hat.set_throttle(1.0)
                            rospy.sleep(0.5)

                    self.motor_hat.set_throttle(0)
                    self.kit.servo[0].angle = INIT_V

            if(self.pan == INIT_V):
                if self.linear_x > 0.5:
                    self.motor_hat.set_throttle(1.0)
                elif self.linear_x < -0.5:
                    self.motor_hat.set_throttle(-1.0)
                else:
                    self.motor_hat.set_throttle(self.linear_x)  # linear.x 값으로 속도 조절
                rospy.loginfo(f"Servo velo set to: {self.linear_x}")
                rospy.sleep(0.2)  # 50ms마다 업데이트
                
            else :
                if self.linear_x > 0:
                    self.motor_hat.set_throttle(1.0)
                elif self.linear_x < 0:
                    self.motor_hat.set_throttle(-1.0)
                else:
                    self.motor_hat.set_throttle(self.linear_x)  # linear.x 값으로 속도 조절
                rospy.loginfo(f"Servo velo set to: {self.linear_x}")
                rospy.sleep(0.2)
                
            

    def servo_control(self):
        """좌/우 회전 제어를 담당하는 스레드"""
        while self.running and not rospy.is_shutdown():
            if self.linear_x == 0.0:
                rospy.sleep(0.2)  # 주행하지 않을 때는 업데이트 속도 줄이기

            # `angular_z` 값을 `-1 ~ 1` 범위에서 `80 ~ 120` 범위로 매핑
            self.pan = INIT_V + (self.angular_z * (MAX_V - INIT_V+100))

            # 값 제한 (80 ~ 120도)
            if 0 > self.angular_z:
                self.pan = MIN_V
            elif 0 < self.angular_z:
                self.pan = MAX_V
            else : 
                self.pan = INIT_V

            # 서보모터 각도 적용
            self.kit.servo[0].angle = self.pan
            rospy.loginfo(f"Servo angle set to: {self.pan}")

            rospy.sleep(0.1)  # 100ms마다 업데이트

    def run(self):
        rospy.spin()

if __name__ == '__main__':
    node = CmdVelSubscriber()
    node.run()
