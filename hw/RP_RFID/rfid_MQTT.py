from mfrc522 import SimpleMFRC522
import argparse
import datetime
import time
import cv2
import paho.mqtt.client as mqtt
import json

# SERVER URL (MQTT + Websocket protocol)
MQTT_BROKER_URL = "wss://librairy.p-e.kr/mqtt"  # WebSocket 지원하는 브로커
MQTT_PORT = 443
MQTT_TOPIC_BOOK = "topic/book/borrow"

# Robot Identification
robotId = 1  # 로봇마다 코드를 다르게해서 ID 할당하기

# argument parser
ap = argparse.ArgumentParser()
ap.add_argument("-o", "--output", type=str, default="rfids.csv", help="Path to output CSV file containing RFIDs")
args = vars(ap.parse_args())

# RFID 리더기 초기화 (한 번만 생성)
reader = SimpleMFRC522()

# MQTT 클라이언트 설정 (WebSocket)
client = mqtt.Client(transport="websockets")
client.tls_set()  # TLS 보안 설정

# MQTT 연결 함수
def connect_mqtt():
    try:
        client.connect("librairy.p-e.kr", MQTT_PORT)
        print("MQTT connection success")
    except Exception as e:
        print(f"MQTT connection fail: {e}")
        time.sleep(5)
        connect_mqtt()  # Reconnect

# MQTT 연결 수행
connect_mqtt()

# CSV 파일 저장
csv = open(args["output"], "w")
found = set()

while True:
    print("Tag the book you want to borrow :)")
    id, _ = reader.read()

    # if id not in found:
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    csv.write("{},{}\n".format(datetime.datetime.now(), id))
    csv.flush()
    found.add(id)
    print(f"RFID Recognition Success: {id}")

    # MQTT 메시지 전송
    data = {
        "robotId": robotId,
        "bookId": str(id)  # backend에서 설정한 type 통일
    }
    json_payload = json.dumps(data)

    result, _ = client.publish(MQTT_TOPIC_BOOK, json_payload, qos=1)
    if result == 0:
        print(f"Book data successfully sent to server: {json_payload}")
    else:
        print(f"Book data sent to server failed: {result}")

    # else:
    #     print(f"⚠️ 이미 인식된 RFID: {id}")

    time.sleep(1)  # 1초 대기 후 다시 RFID 인식

    key = cv2.waitKey(1) & 0xFF
    
    # if 'q' is pressed, break the loop
    if key == ord("q"):
        break

# close the output CSV file and clean up
print("Cleaning up...")
csv.close()
cv2.destroyAllWindows()
client.disconnect()
