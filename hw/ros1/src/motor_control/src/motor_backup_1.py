
import rospy
import threading
from geometry_msgs.msg import Twist
from adafruit_motor import motor
from adafruit_pca9685 import PCA9685
from adafruit_servokit import ServoKit
import board
import busio

INIT_V = 110

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
            if(self.pan == INIT_V):
                if self.linear_x > 0.5:
                    self.motor_hat.set_throttle(0.8)
                elif self.linear_x < -0.5:
                    self.motor_hat.set_throttle(-0.8)
                else:
                    self.motor_hat.set_throttle(self.linear_x)  # linear.x 값으로 속도 조절
                rospy.loginfo(f"Servo velo set to: {self.linear_x}")
                rospy.sleep(0.2)  # 50ms마다 업데이트

            else :
                if self.linear_x > 0:
                    self.motor_hat.set_throttle(0.8)
                elif self.linear_x < 0:
                    self.motor_hat.set_throttle(-0.8)
                else:
                    self.motor_hat.set_throttle(self.linear_x)  # linear.x 값으로 속도 조절
                rospy.loginfo(f"Servo velo set to: {self.linear_x}")
                rospy.sleep(0.2)



    def servo_control(self):
        """좌/우 회전 제어를 담당하는 스레드"""
        while self.running and not rospy.is_shutdown():
            if self.angular_z > 0:  # 왼쪽 회전
                rospy.loginfo("Turning Left")
                #self.pan = INIT_V-10
                self.pan -= 10
                if self.pan < INIT_V-20:
                    self.pan = INIT_V-20
            elif self.angular_z < 0:  # 오른쪽 회전
                rospy.loginfo("Turning Right")
                #self.pan = INIT_V+10
                self.pan += 10
                if self.pan > INIT_V+20:
                    self.pan = INIT_V+20

            self.kit.servo[0].angle = self.pan
            rospy.loginfo(f"Servo angle set to: {self.pan}")
            rospy.sleep(0.2)  # 50ms마다 업데이트

    def run(self):
        rospy.spin()

if __name__ == '__main__':
    node = CmdVelSubscriber()
    node.run()