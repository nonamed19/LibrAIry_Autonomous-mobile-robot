from adafruit_motor import motor
from adafruit_pca9685 import PCA9685
from adafruit_servokit import ServoKit
import board
import busio
import time
from pynput import keyboard

class PWMThrottleHat:
    def __init__(self, pwm, channel):
        self.pwm = pwm
        self.channel = channel
        self.pwm.frequency = 60  # 주파수 설정

    def set_throttle(self, throttle):
        pulse = int(0xFFFF * abs(throttle))  # 16비트 듀티 사이클 계산
        
        if throttle > 0:  # 전진
            # self.pwm.channels[self.channel + 5].duty_cycle = pulse
            # self.pwm.channels[self.channel + 4].duty_cycle = 0
            # self.pwm.channels[self.channel + 3].duty_cycle = 0xFFFF
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

i2c = busio.I2C(board.SCL, board.SDA)
pca = PCA9685(i2c)
pca.frequency = 60

motor_hat = PWMThrottleHat(pca, 0)
kit = ServoKit(channels=16, i2c=i2c, address=0x60)
pan = 100
kit.servo[0].angle = pan

def i2c_scan(i2c):
    while not i2c.try_lock():
        pass
    try:
        devices = i2c.scan()
        return devices
    finally:
        i2c.unlock()

def on_press(key):
    global pan
    try:
        if key.char == 'w':
            print("Motor forward")
            motor_hat.set_throttle(0.8)  # 전진 50% 속도
            #time.sleep(0.5)  # 0.5초 유지
        elif key.char == 's':
            print("Motor backward")
            motor_hat.set_throttle(-0.8)  # 후진 50% 속도
            #time.sleep(0.5)  # 0.5초 유지
        elif key.char == 'a':
            print("Servo left")
            pan -= 10  # 서보모터 왼쪽으로 이동
            if pan < 0:
                pan = 0
            kit.servo[0].angle = pan
            print(f"Servo angle set to: {pan}")
        elif key.char == 'd':
            print("Servo right")
            pan += 10  # 서보모터 오른쪽으로 이동
            if pan > 180:
                pan = 180
            kit.servo[0].angle = pan
            print(f"Servo angle set to: {pan}")
    except AttributeError:
        if key == keyboard.Key.esc:
            return False

def on_release(key):
    if key.char in ['w', 's']:
        print("Motor stop")
        motor_hat.set_throttle(0)  # 모터 정지

# 키보드 리스너 설정
listener = keyboard.Listener(on_press=on_press, on_release=on_release)
listener.start()
listener.join()

# 프로그램 종료 및 정리
try:
    while True:
        pass
    time.sleep(0.1)

except KeyboardInterrupt:
    pass

finally:
    motor_hat.set_throttle(0)  # 모터 정지
    kit.servo[0].angle = 100  # 서보모터 초기 위치로 리셋
    pca.deinit()  # PCA9685 정리
    print("Program stopped and motor stopped.")

