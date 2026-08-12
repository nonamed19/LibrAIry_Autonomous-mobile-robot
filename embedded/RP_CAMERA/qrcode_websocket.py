import asyncio
import websockets
import json
from picamera2 import Picamera2
from pyzbar import pyzbar
import argparse
import datetime
import imutils
import time
import cv2
import numpy as np

# SERVER URL (WEBSOCKET protocol)
SERVER_URL = "ws://43.200.7.229:8080"  # 임시로 작성함

# Robot Identification
robotId = 1  # 로봇마다 코드를 다르게해서 ID 할당하기

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

# argument parser
ap = argparse.ArgumentParser()
ap.add_argument("-o", "--output", type=str, default="qrcodes.csv", help="path to output CSV file containing barcodes")
args = vars(ap.parse_args())

# initialize the PiCamera2
print("[INFO] Starting video stream...")
picam2 = Picamera2()

# Set camera resolution
# [SunFounder] the camera is capable of 2592 x 1944 pixel static images, and also supports 1080p30, 720p60 and 640x480p90 video
config = picam2.create_preview_configuration(main={"size": (640, 480)})
# config = picam2.create_preview_configuration(main={"size": (1296, 976)})
picam2.configure(config)
picam2.start()

# Wait for camera to warm up
time.sleep(2.0)

# Open output CSV file for writing and initialize the set of found barcodes
csv = open(args["output"], "w")
found = set()

# bool _
isComplete = False

# WebSocket 클라이언트 연결 함수
async def send_data(websocket, data):
    try:
        await websocket.send(json.dumps(data))
        response = await websocket.recv()
        print(f"Server Response: {response}")
    except Exception as e:
        print(f"[ERROR] WebSocket send error: {e}")

# WebSocket 연결 및 QR 코드 전송 루프
async def scan_qr_code():
    async with websockets.connect(SERVER_URL) as websocket:
        while True:
            # Capture frame from the camera
            frame = picam2.capture_array()
            frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)  # Convert from RGB to BGR for OpenCV
            frame = imutils.resize(frame, width=640)

            # Crop function
            crop = autocrop(frame, 50)

            # Find barcodes in the frame and decode them
            barcodes = pyzbar.decode(crop)

            for barcode in barcodes:
                # Draw red box
                (x, y, w, h) = barcode.rect
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)

                # Byte to text
                barcodeData = barcode.data.decode("utf-8")
                barcodeType = barcode.type

                # Draw data and type on the image
                text = "{} ({})".format(barcodeData, barcodeType)
                cv2.putText(frame, text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

                # If barcodeData not found, write it in the CSV file
                if barcodeData not in found:
                    csv.write("{},{}\n".format(datetime.datetime.now(), barcodeData))
                    csv.flush()
                    found.add(barcodeData)
                    print("{} Recognition Success: {}".format(barcodeType, barcodeData))
                    
                    # 서버로 데이터 전송
                    data = {
                        "robotId": robotId,
                        "userCode": barcodeData
                    }
                    
                    await send_data(websocket, data)
                
                else:
                    print("Already Recognized {}: {}".format(barcodeType, barcodeData))
                
                time.sleep(3.0)  ## QR 코드 인식 이후 3초 이후 재인식하도록
                break  # Stop scanning once barcode is found

            # show output image
            cv2.imshow("Barcode Scanner", frame)
            key = cv2.waitKey(1) & 0xFF

            # if 'q' is pressed, break the loop
            if key == ord("q"):
                break

# Run the WebSocket client
asyncio.run(scan_qr_code())

# Close the output CSV file and clean up
print("Cleaning up...")
csv.close()
cv2.destroyAllWindows()
picam2.close()
