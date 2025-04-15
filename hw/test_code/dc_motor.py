from adafruit_motor import motor
from adafruit_pca9685 import PCA9685
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
            self.pwm.channels[self.channel + 4].duty_cycle = 0
            self.pwm.channels[self.channel + 3].duty_cycle = 0xFFFF
        elif throttle < 0:  # 후진
            self.pwm.channels[self.channel + 5].duty_cycle = pulse
            self.pwm.channels[self.channel + 4].duty_cycle = 0xFFFF
            self.pwm.channels[self.channel + 3].duty_cycle = 0
        else:  # 정지
            self.pwm.channels[self.channel + 5].duty_cycle = 0
            self.pwm.channels[self.channel + 4].duty_cycle = 0
            self.pwm.channels[self.channel + 3].duty_cycle = 0

# 예제 사용법
i2c = busio.I2C(board.SCL, board.SDA)
pca = PCA9685(i2c)
pca.frequency = 60

throttle_hat = PWMThrottleHat(pca, 0)


try:
    while True:
        throttle_hat.set_throttle(1)  # 전진
        time.sleep(2)
        throttle_hat.set_throttle(-1)  # 후진
        time.sleep(2)
        throttle_hat.set_throttle(0)  # 정지
        time.sleep(2)
except KeyboardInterrupt:
    pass
finally :
    throttle_hat.set_throttle(0)  # 정지
