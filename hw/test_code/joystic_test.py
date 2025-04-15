import os
import struct
import array
import threading
import time
from fcntl import ioctl
import board
import busio
from adafruit_pca9685 import PCA9685
from adafruit_servokit import ServoKit
from adafruit_motor import motor

# 🎮 조이스틱 장치 찾기
print('Available joystick devices:')
for fn in os.listdir('/dev/input'):
    if fn.startswith('js'):
        print(f'  /dev/input/{fn}')

# 조이스틱 장치 열기
fn = '/dev/input/js0'
print(f'Opening {fn}...')
jsdev = open(fn, 'rb')

# 🕹️ 장치 이름 가져오기
buf = array.array('B', [0] * 64)
ioctl(jsdev, 0x80006a13 + (0x10000 * len(buf)), buf)
js_name = buf.tobytes().rstrip(b'\x00').decode('utf-8')
print(f'Device name: {js_name}')

# 🎛️ 조이스틱 버튼 & 축 매핑
axis_names = {
    0x00: 'x', 0x01: 'y', 0x02: 'z', 0x03: 'rx',
    0x04: 'ry', 0x05: 'rz', 0x06: 'trottle', 0x07: 'rudder',
    0x08: 'wheel', 0x09: 'gas', 0x0a: 'brake', 0x10: 'lr',
    0x11: 'fb', 0x12: 'hat1x', 0x13: 'hat1y'
}

# 버튼 매핑 (생략 가능)
button_names = {
    0x130: 'a', 0x131: 'b', 0x132: 'c', 0x133: 'x',
    0x134: 'y', 0x135: 'z', 0x136: 'tl', 0x137: 'tr'
}

# 🎚️ 축 & 버튼 개수 확인
buf = array.array('B', [0])
ioctl(jsdev, 0x80016a11, buf)
num_axes = buf[0]

buf = array.array('B', [0])
ioctl(jsdev, 0x80016a12, buf)
num_buttons = buf[0]

# 🎯 축 & 버튼 맵 생성
buf = array.array('B', [0x00] * 0x40)
ioctl(jsdev, 0x80406a32, buf)  # JSIOCGAXMAP
axis_map = [axis_names.get(axis, f'unknown({axis})') for axis in buf[:num_axes]]

buf = array.array('H', [0] * 200)
ioctl(jsdev, 0x80406a34, buf)  # JSIOCGBTNMAP
button_map = [button_names.get(btn, f'unknown({btn})') for btn in buf[:num_buttons]]

print(f'{num_axes} axes found: {", ".join(axis_map)}')
print(f'{num_buttons} buttons found: {", ".join(button_map)}')

# 🚗 차량 제어 코드 (PWM 기반)
i2c = busio.I2C(board.SCL, board.SDA)
pca = PCA9685(i2c)
pca.frequency = 60
kit = ServoKit(channels=16, i2c=i2c, address=0x60)

class PWMThrottleHat:
    def __init__(self, pwm, channel):
        self.pwm = pwm
        self.channel = channel
        self.pwm.frequency = 60

    def set_throttle(self, throttle):
        pulse = int(0xFFFF * abs(throttle))
        if throttle > 0:
            self.pwm.channels[self.channel + 5].duty_cycle = pulse
            self.pwm.channels[self.channel + 4].duty_cycle = 0xFFFF
            self.pwm.channels[self.channel + 3].duty_cycle = 0
        elif throttle < 0:
            self.pwm.channels[self.channel + 5].duty_cycle = pulse
            self.pwm.channels[self.channel + 4].duty_cycle = 0
            self.pwm.channels[self.channel + 3].duty_cycle = 0xFFFF
        else:
            self.pwm.channels[self.channel + 5].duty_cycle = 0
            self.pwm.channels[self.channel + 4].duty_cycle = 0
            self.pwm.channels[self.channel + 3].duty_cycle = 0

motor_hat = PWMThrottleHat(pca, 0)

# 🎮 조이스틱 입력을 처리하는 스레드
class JoystickThread(threading.Thread):
    def __init__(self):
        super().__init__()
        self.running = True

    def stop(self):
        self.running = False

    def run(self):
        global motor_hat
        pan = 100  # 서보모터 초기 위치
        kit.servo[0].angle = pan

        while self.running:
            evbuf = jsdev.read(8)
            if evbuf:
                time_, value, type_, number = struct.unpack('IhBB', evbuf)

                if type_ & 0x02:  # 축(Axis) 입력
                    if number < len(axis_map):
                        axis = axis_map[number]
                        print(f"Axis {axis}: {value}")

                        if axis == 'y':  # 전후진 (예제: y축 사용)
                            if value < -10000:  # 전진
                                print("Moving Forward")
                                motor_hat.set_throttle(0.8)
                            elif value > 10000:  # 후진
                                print("Moving Backward")
                                motor_hat.set_throttle(-0.8)
                            else:
                                print("Stopping")
                                motor_hat.set_throttle(0)

                        elif axis == 'x':  # 좌우 이동 (예제: x축 사용)
                            if value < -10000:  # 좌회전
                                print("Turning Left")
                                pan = max(0, pan - 10)
                            elif value > 10000:  # 우회전
                                print("Turning Right")
                                pan = min(180, pan + 10)

                            kit.servo[0].angle = pan
                            print(f"Servo angle set to: {pan}")

                    else:
                        print(f"Warning: Invalid axis number {number} (Max: {len(axis_map)-1})")

                elif type_ & 0x01:  # 버튼(Button) 입력
                    if number < len(button_map):
                        button = button_map[number]
                        print(f"Button {button} {'Pressed' if value else 'Released'}")
                    else:
                        print(f"Warning: Invalid button number {number} (Max: {len(button_map)-1})")

# 🚀 스레드 시작
joystick_thread = JoystickThread()
joystick_thread.start()

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\nStopping program...")
    joystick_thread.stop()
    joystick_thread.join()
    motor_hat.set_throttle(0)  # 모터 정지
    kit.servo[0].angle = 100  # 서보모터 초기화
    pca.deinit()  # PWM 해제
    print("Program stopped and motor stopped.")
