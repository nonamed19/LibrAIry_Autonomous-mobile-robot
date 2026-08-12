import asyncio
import websockets
import json
from mfrc522 import SimpleMFRC522
import argparse
import datetime
import time
import cv2

# SERVER URL (WEBSOCKET protocol)
SERVER_URL = "ws://43.200.7.229:8080"

# Robot Identification
robotId = 1  # 로봇마다 코드를 다르게해서 ID 할당하기

# argument parser
ap = argparse.ArgumentParser()
ap.add_argument("-o", "--output", type=str, default="rfids.csv", help="path to output CSV file containing rfids")
args = vars(ap.parse_args())

# Wait for RFID to warm up
time.sleep(2.0)

# Open output CSV file for writing and initialize the set of found RFIDs
csv = open(args["output"], "w")
found = set()

# WebSocket 클라이언트 연결 함수
async def send_data(websocket, data):
    try:
        await websocket.send(json.dumps(data))
        response = await websocket.recv()
        print(f"Server Response: {response}")
    except Exception as e:
        print(f"[ERROR] WebSocket send error: {e}")

# WebSocket 연결 및 RFID 데이터 전송 루프
async def scan_rfid():
    async with websockets.connect(SERVER_URL) as websocket:
        reader = SimpleMFRC522()

        while True:
            print('Tag your Card')
            id = reader.read()[0]
            
            if id not in found:
                csv.write("{},{}\n".format(datetime.datetime.now(), id))
                csv.flush()
                found.add(id)
                print("RFID Recognition Success: {}".format(id))
                
                # 서버로 데이터 전송
                data = {
                    "robotId": robotId,
                    "bookId": id
                }
                
                await send_data(websocket, data)
            
            else:
                print("Already Recognized RFID: {}".format(id))
                isComplete = True

            time.sleep(1)  ## RFID 코드 인식 이후 1초 이후 재인식하도록 - 테스트하면서 time laps는 변경 가능
            # break  # Stop scanning once RFID is found

            key = cv2.waitKey(1) & 0xFF
            
            # if 'q' is pressed, break the loop
            if key == ord("q"):
                break

# Run the WebSocket client
asyncio.run(scan_rfid())

# close the output CSV file and clean up
print("Cleaning up...")
csv.close()
cv2.destroyAllWindows()
