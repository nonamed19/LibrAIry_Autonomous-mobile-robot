from mfrc522 import SimpleMFRC522
import argparse
import datetime
import time
import cv2
import requests

# SERVER URL (HTTP protocol)
SERVER_URL = "http://43.200.7.229:8080/api/book/robot/save"

# Robot Identification
robotId = 1  # 로봇마다 코드를 다르게해서 ID 할당하기

# argument parser
ap = argparse.ArgumentParser()
ap.add_argument("-o", "--output", type=str, default="rfids.csv", help="path to output CSV file containing rfids")
args = vars(ap.parse_args())

# Wait for RFID to warm up
time.sleep(2.0)

# Open output CSV file for writing and initialize the set of found barcodes
csv = open(args["output"], "w")
found = set()

while True:
    print('Tag your Card')
    id = SimpleMFRC522().read()[0]
    
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
        
        headers = {
            "accept": "*/*",
            "Content-Type": "application/json"
        }

        response = requests.post(SERVER_URL, json=data, headers=headers)
        if response.status_code == 200:
            print(f"RFID to Server Success: {response.json()}")
        else:
            print(f"RFID to Server Fail: {response.status_code} - {response.text}")
    
    else:
        print("Already Recognized RFID: {}".format(id))
        isComplete = True
    
    time.sleep(1)  ## RFID 코드 인식 이후 1초 이후 재인식하도록 - 테스트하면서 time laps는 변경 가능
    # break  # Stop scanning once RFID is found

    key = cv2.waitKey(1) & 0xFF

    # if 'q' is pressed, break the loop
    if key == ord("q"):
        break

# close the output CSV file and clean up
print("Cleaning up...")
csv.close()
cv2.destroyAllWindows()
