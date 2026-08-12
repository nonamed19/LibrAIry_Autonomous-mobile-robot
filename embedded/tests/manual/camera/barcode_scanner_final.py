# import the necessary packages
from picamera2 import Picamera2
from pyzbar import pyzbar
import argparse
import datetime
import imutils
import time
import cv2
import numpy as np
import subprocess  # MP3 재생을 위한 subprocess 사용

# 함수 오토 크롭 : 이미지 사이즈 조절
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


# MP3 재생 함수 (`playsound` 대신 `mpg321` 사용)
def play_sound():
    subprocess.run(["mpg321", "barcode_beep.mp3"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# argument parser
ap = argparse.ArgumentParser()
ap.add_argument("-o", "--output", type=str, default="barcodes.csv", help="path to output CSV file containing barcodes")
args = vars(ap.parse_args())

# initialize the PiCamera2
print("[INFO] Starting video stream...")
picam2 = Picamera2()

# Set camera resolution
config = picam2.create_preview_configuration(main={"size": (1296, 976)})
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
    frame = imutils.resize(frame, width=1200)

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
            print("인식 성공:", barcodeData)
            play_sound()  # MP3 재생
        else:
            print("이미 인식된 코드 [INFO] Found {} barcode: {}".format(barcodeData, barcodeType))
            play_sound()  # MP3 재생
            isComplete = True

        break  # Stop scanning once barcode is found

    # close if complete
    if isComplete:
        print("Recognition complete")
        break

    # show output image
    cv2.imshow("Barcode Scanner", frame)
    key = cv2.waitKey(1) & 0xFF

    # if 'q' is pressed, break the loop
    if key == ord("q"):
        break

# close the output CSV file and clean up
print("[INFO] Cleaning up...")
csv.close()
cv2.destroyAllWindows()
picam2.close()
