from picamera2 import Picamera2
from pyzbar import pyzbar
import argparse
import datetime
import imutils
import time
import cv2
import numpy as np
import requests

# SERVER URL (HTTP protocol)
SERVER_URL = "http://43.200.7.229:8080/api/user/save"

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

# capturing + processing frame
while True:
    # Capture frame from the camera
    frame = picam2.capture_array()
    frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)  # Convert from RGB to BGR for OpenCV
    frame = imutils.resize(frame, width=640)

    # crop function
    crop = autocrop(frame, 50)

    # find barcodes in the frame and decode them
    barcodes = pyzbar.decode(crop)

    # loop over the detected barcodes
    for barcode in barcodes:
        # draw red box
        (x, y, w, h) = barcode.rect
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)

        # byte to text
        barcodeData = barcode.data.decode("utf-8")
        barcodeType = barcode.type

        # draw data and type on the image
        text = "{} ({})".format(barcodeData, barcodeType)
        cv2.putText(frame, text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

        # if barcodeData not found, write it in the CSV file
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
            
            headers = {
                "accept": "*/*",
                "Content-Type": "application/json"
            }

            response = requests.post(SERVER_URL, json=data, headers=headers)
            if response.status_code == 200:
                print(f"QRCode to Server Success: {response.json()}")
            else:
                print(f"QRCode to Server Fail: {response.status_code} - {response.text}")
        
        else:
            print("Already Recognized {}: {}".format(barcodeType, barcodeData))
            isComplete = True
        
        time.sleep(3.0)  ## QR 코드 인식 이후 3초 이후 재인식하도록 - 테스트하면서 time laps는 변경 가능
        break  # Stop scanning once barcode is found

    # # close if complete
    # if isComplete:
    #     print("Recognition complete")
    #     break

    # show output image
    cv2.imshow("Barcode Scanner", frame)
    key = cv2.waitKey(1) & 0xFF

    # if 'q' is pressed, break the loop
    if key == ord("q"):
        break

# close the output CSV file and clean up
print("Cleaning up...")
csv.close()
cv2.destroyAllWindows()
picam2.close()
