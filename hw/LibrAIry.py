from picamera2 import Picamera2
from pyzbar import pyzbar
from mfrc522 import SimpleMFRC522
import threading
import time
import json
import datetime
import cv2
import argparse
import paho.mqtt.client as mqtt
import imutils
import numpy as np

# SERVER URL (MQTT + Websocket protocol)
MQTT_BROKER_URL = "wss://librairy.p-e.kr/mqtt"  # WebSocket 지원하는 브로커
MQTT_PORT = 443
MQTT_TOPIC_USER = "topic/user/borrow"
MQTT_TOPIC_BOOK = "topic/book/borrow"
MQTT_TOPIC_LOG = "topic/log/save"

# Robot Identification
robotId = 1  # 로봇마다 코드를 다르게해서 ID 할당하기

# Argument parser
ap = argparse.ArgumentParser()
ap.add_argument("-o", "--output", type=str, default="logs.csv", help="Path to output CSV file for logs")
args = vars(ap.parse_args())

# MQTT 클라이언트 설정 (WebSocket)
client = mqtt.Client(transport="websockets")
client.tls_set()  # TLS 보안 설정

# MQTT 연결 함수
def connect_mqtt():
    try:
        client.connect("librairy.p-e.kr", MQTT_PORT)
        # 서버로 데이터 전송
        log_data = {
            "robotId": robotId,
            "logContent": f"MQTT connection success",
            "sendNotice": 0
        }
        json_logdata = json.dumps(log_data)
        client.publish(MQTT_TOPIC_LOG, json_logdata, qos=1)
        print("MQTT connection success")
    except Exception as e:
        # 서버로 데이터 전송
        log_data = {
            "robotId": robotId,
            "logContent": f"MQTT connection fail",
            "sendNotice": 1
        }
        json_logdata = json.dumps(log_data)
        client.publish(MQTT_TOPIC_LOG, json_logdata, qos=1)
        print(f"MQTT connection fail: {e}")
        time.sleep(5)
        connect_mqtt()  # Reconnect

# MQTT 연결 수행
connect_mqtt()

# image crop
def autocrop(image, threshold=0):
    """Crops any edges below or equal to threshold
    Crops blank image to 1x1.
    Returns cropped image.
    """
    if len(image.shape) == 3:
        flatImage = np.max(image, 2)
    else:
        flatImage = image
    assert len(flatImage.shape) == 2

    rows = np.where(np.max(flatImage, 0) > threshold)[0]
    if rows.size:
        cols = np.where(np.max(flatImage, 1) > threshold)[0]
        image = image[cols[0]: cols[-1] + 1, rows[0]: rows[-1] + 1]
    else:
        image = image[:1, :1]

    return image

# QR 코드 인식 함수
def qr_scanner():
    # initialize the PiCamera2
    picam2 = Picamera2()
    # Set camera resolution
    # [SunFounder] the camera is capable of 2592 x 1944 pixel static images, and also supports 1080p30, 720p60 and 640x480p90 video
    config = picam2.create_preview_configuration(main={"size": (640, 480)})
    # config = picam2.create_preview_configuration(main={"size": (1296, 976)})
    picam2.configure(config)
    picam2.start()
    
    csv = open(args["output"], "w")
    found = set()

    print("Place the QR Code in front of the camera :D")
    
    while not stop_event.is_set():
        # Capture frame from the camera
        frame = picam2.capture_array()
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        frame = imutils.resize(frame, width=640)

        # crop function
        crop = autocrop(frame, 50)

        # find barcodes in the frame and decode them
        barcodes = pyzbar.decode(crop)

        for barcode in barcodes:
            (x, y, w, h) = barcode.rect
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)

            # byte to text
            barcodeData = barcode.data.decode("utf-8")
            barcodeType = barcode.type
                
            # draw data and type on the image
            text = "{} ({})".format(barcodeData, barcodeType)
            cv2.putText(frame, text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

            # if barcodeData not in found:
            csv.write("{},{}\n".format(datetime.datetime.now(), barcodeData))
            csv.flush()
            found.add(barcodeData)
            print("{} Recognition Success: {}".format(barcodeType, barcodeData))

            data = {
                "robotId": robotId,
                "userCode": barcodeData
            }
            json_payload = json.dumps(data)
            result, _ = client.publish(MQTT_TOPIC_USER, json_payload, qos=1)
            
            if result == 0:            
                log_data = {
                    "robotId": robotId,
                    "logContent": f"User data successfully sent to server",
                    "sendNotice": 0
                }

                json_logdata = json.dumps(log_data)
                client.publish(MQTT_TOPIC_LOG, json_logdata, qos=1)

                print(f"User data successfully sent to server: {json_payload}")
            else:
                log_data = {
                    "robotId": robotId,
                    "logContent": f"User data sent to server failed",
                    "sendNotice": 1
                }

                json_logdata = json.dumps(log_data)
                client.publish(MQTT_TOPIC_LOG, json_logdata, qos=1)

                print(f"User data sent to server failed: {result}")
            
            time.sleep(3)

        # cv2.imshow("QR Code Scanner", frame)
        # if cv2.waitKey(1) & 0xFF == ord("q"):
        #     stop_event.set()
        #     break

    csv.close()
    picam2.close()
    cv2.destroyAllWindows()
    print("QR Scanner stopped.")

# RFID 인식 함수
def rfid_scanner():
    reader = SimpleMFRC522()
    csv = open(args["output"], "w")
    found = set()

    print("Tag the book you want to borrow :)")
    
    while not stop_event.is_set():
        id, _ = reader.read()
        csv.write("{},{}\n".format(datetime.datetime.now(), id))
        csv.flush()
        found.add(id)
        print(f"RFID Recognition Success: {id}")

        # MQTT 메시지 전송
        data = {
            "robotId": robotId,
            "bookId": str(id)
        }
        json_payload = json.dumps(data)
        result, _ = client.publish(MQTT_TOPIC_BOOK, json_payload, qos=1)

        if result == 0:
            log_data = {
                "robotId": robotId,
                "logContent": f"Book data successfully sent to server",
                "sendNotice": 0
            }

            json_logdata = json.dumps(log_data)
            client.publish(MQTT_TOPIC_LOG, json_logdata, qos=1)

            print(f"Book data successfully sent to server: {json_payload}")
        else:
            log_data = {
                    "robotId": robotId,
                    "logContent": f"Book data sent to server failed",
                    "sendNotice": 1
                }

            json_logdata = json.dumps(log_data)
            client.publish(MQTT_TOPIC_LOG, json_logdata, qos=1)
            
            print(f"Book data sent to server failed: {result}")

        time.sleep(3)  ## RFID 코드 인식 이후 3초 이후 재인식하도록 - 테스트하면서 time laps는 변경 가능
    
    csv.close()
    print("RFID Scanner stopped.")


# 프로그램 종료 이벤트
stop_event = threading.Event()

# 스레드 실행
qr_thread = threading.Thread(target=qr_scanner)
rfid_thread = threading.Thread(target=rfid_scanner)

qr_thread.start()
rfid_thread.start()

# 종료 감지
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\nStopping all processes...")
    stop_event.set()

qr_thread.join()
rfid_thread.join()
client.disconnect()
print("Program terminated.")
