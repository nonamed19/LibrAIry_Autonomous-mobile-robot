# import the necessary packages
from picamera2 import Picamera2
from pyzbar import pyzbar
import argparse
import datetime
import imutils
import time
import cv2

# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-o", "--output", type=str, default="barcodes.csv",
    help="path to output CSV file containing barcodes")
args = vars(ap.parse_args())

# Initialize the PiCamera2
print("[INFO] starting video stream...")
picam2 = Picamera2()

# Set camera resolution
config = picam2.create_preview_configuration(main={"size": (640, 480)})
picam2.configure(config)
picam2.start()

# Wait for camera to warm up
time.sleep(2.0)

# Open the output CSV file for writing and initialize the set of found barcodes
csv = open(args["output"], "w")
found = set()

# loop over the frames from the video stream
while True:
    # Capture frame from the camera
    frame = picam2.capture_array()
    frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)  # Convert from RGB to BGR for OpenCV
    frame = imutils.resize(frame, width=400)

    # find the barcodes in the frame and decode each of the barcodes
    barcodes = pyzbar.decode(frame)

    # loop over the detected barcodes
    for barcode in barcodes:
        # Extract the bounding box location of the barcode and draw it on the image
        (x, y, w, h) = barcode.rect
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)

        # Convert barcode data to string
        barcodeData = barcode.data.decode("utf-8")
        barcodeType = barcode.type

        # Draw barcode data and type on the image
        text = "{} ({})".format(barcodeData, barcodeType)
        cv2.putText(frame, text, (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

        # If barcode data is not yet in CSV file, write it and update the set
        if barcodeData not in found:
            csv.write("{},{}\n".format(datetime.datetime.now(), barcodeData))
            csv.flush()
            found.add(barcodeData)

    # Show the output frame
    cv2.imshow("Barcode Scanner", frame)
    key = cv2.waitKey(1) & 0xFF

    # If the `q` key was pressed, break from the loop
    if key == ord("q"):
        break

# Cleanup
print("[INFO] cleaning up...")
csv.close()
cv2.destroyAllWindows()
picam2.close()
