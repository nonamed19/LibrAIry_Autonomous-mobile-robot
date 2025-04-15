from adafruit_pca9685 import PCA9685
from adafruit_servokit import ServoKit
import board
import busio
import time

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

# I2C 및 모터 설정
i2c = busio.I2C(board.SCL, board.SDA)
pca = PCA9685(i2c)
pca.frequency = 60
motor_hat = PWMThrottleHat(pca, channel=0)
kit = ServoKit(channels=16, i2c=i2c, address=0x60)

# 조향각 설정
CENTER_ANGLE = 100  # 정면
LEFT_ANGLE = 80  # 최대 좌회전
RIGHT_ANGLE = 120  # 최대 우회전

pan = CENTER_ANGLE
kit.servo[0].angle = pan

def control_loop():
    global pan
    while True:
        cmd = input("명령 입력 (w: 전진, s: 후진, a: 좌회전, d: 우회전, z: 좌측 제자리 회전, x: 우측 제자리 회전, q: 종료): ").strip()
        
        if cmd == 'w':  # 전진
            print("Motor forward")
            motor_hat.set_throttle(1)
            time.sleep(0.5)
            motor_hat.set_throttle(0)  # 정지
        elif cmd == 's':  # 후진
            print("Motor backward")
            motor_hat.set_throttle(-1)
            time.sleep(0.5)
            motor_hat.set_throttle(0)  # 정지
        elif cmd == 'a':  # 좌회전 (서보모터 조작)
            print("Servo left")
            pan -= 10
            if pan < LEFT_ANGLE:
                pan = LEFT_ANGLE
            kit.servo[0].angle = pan
            print(f"Servo angle set to: {pan}")
        elif cmd == 'd':  # 우회전 (서보모터 조작)
            print("Servo right")
            pan += 10
            if pan > RIGHT_ANGLE:
                pan = RIGHT_ANGLE
            kit.servo[0].angle = pan
            print(f"Servo angle set to: {pan}")

        elif cmd == 'z':  # 좌측 제자리 회전 (전진 시 좌회전 / 후진 시 우회전)
            print("Rotating left (Turn & Reverse)")
            for _ in range(10):  # 전후진 반복
                kit.servo[0].angle = LEFT_ANGLE  # 전진 시 왼쪽 조향
                for _ in range(2):
                    motor_hat.set_throttle(-1)  # 전진
                    time.sleep(0.5)
                #time.sleep(0.5)

                kit.servo[0].angle = RIGHT_ANGLE  # 후진 시 오른쪽 조향
                for _ in range(2):
                    motor_hat.set_throttle(1)  # 후진진
                    time.sleep(0.5)
                #time.sleep(0.5)
            
            motor_hat.set_throttle(0)  # 정지
            kit.servo[0].angle = CENTER_ANGLE  # 조향각 초기화

        elif cmd == 'x':  # 우측 제자리 회전 (전진 시 우회전 / 후진 시 좌회전)
            print("Rotating right (Turn & Reverse)")
            for _ in range(3):  # 전후진 반복
                kit.servo[0].angle = RIGHT_ANGLE  # 전진 시 오른쪽 조향
                motor_hat.set_throttle(-1)  # 전진
                time.sleep(0.5)

                kit.servo[0].angle = LEFT_ANGLE  # 후진 시 왼쪽 조향
                motor_hat.set_throttle(1)  # 후진
                time.sleep(0.5)
            
            motor_hat.set_throttle(0)  # 정지
            kit.servo[0].angle = CENTER_ANGLE  # 조향각 초기화

        elif cmd == 'q':  # 종료
            print("프로그램 종료")
            break
        else:
            print("잘못된 입력입니다.")

# 프로그램 실행
try:
    control_loop()
except KeyboardInterrupt:
    pass
finally:
    motor_hat.set_throttle(0)  # 모터 정지
    kit.servo[0].angle = CENTER_ANGLE  # 서보모터 초기 위치로 리셋
    pca.deinit()  # PCA9685 정리
    print("Program stopped and motor stopped.")
