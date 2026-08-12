from time import sleep
import sys
import Jetson.GPIO as GPIO  # Jetson GPIO 라이브러리 import
from Jetson_MFRC522 import SimpleMFRC522  # 적절한 라이브러리 import
#reader = SimpleMFRC522(spi_device="/dev/spidev0.0")
# GPIO 초기화
GPIO.setmode(GPIO.BOARD)  # 핀 번호를 물리적 핀 번호로 설정
reader = SimpleMFRC522()

try:
    while True:
        print("Hold a tag near the reader")
        id, text = reader.read()
        print("ID: %s\nText: %s" % (id, text))
        sleep(5)
except KeyboardInterrupt:
    print("\nExiting program.")
finally:
    GPIO.cleanup()  # GPIO 리소스 해제

