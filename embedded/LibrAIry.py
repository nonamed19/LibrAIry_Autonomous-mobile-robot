#!/usr/bin/env python3
"""Publish camera and RFID scans from a library robot over MQTT."""

import argparse
import datetime as dt
import json
import os
import threading

import cv2
import imutils
import numpy as np
import paho.mqtt.client as mqtt
from mfrc522 import SimpleMFRC522
from picamera2 import Picamera2
from pyzbar import pyzbar

MQTT_HOST = os.getenv("MQTT_HOST", "librairy.p-e.kr")
MQTT_PORT = int(os.getenv("MQTT_PORT", "443"))
MQTT_PATH = os.getenv("MQTT_PATH", "/mqtt")
ROBOT_ID = int(os.getenv("ROBOT_ID", "1"))

TOPIC_USER = "topic/user/borrow"
TOPIC_BOOK = "topic/book/borrow"
TOPIC_LOG = "topic/log/save"
SCAN_COOLDOWN_SECONDS = 3.0


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--log-dir", default="logs", help="Directory for separate QR/RFID CSV logs"
    )
    return parser.parse_args()


def crop_content(image, threshold=0):
    """Remove empty image borders without producing an invalid frame."""
    flat_image = np.max(image, axis=2) if image.ndim == 3 else image
    columns = np.where(np.max(flat_image, axis=0) > threshold)[0]
    rows = np.where(np.max(flat_image, axis=1) > threshold)[0]
    if not columns.size or not rows.size:
        return image[:1, :1]
    return image[rows[0] : rows[-1] + 1, columns[0] : columns[-1] + 1]


class RobotScanner:
    def __init__(self, log_dir):
        self.stop_event = threading.Event()
        self.log_dir = log_dir
        self.last_seen = {TOPIC_USER: {}, TOPIC_BOOK: {}}
        self.client = mqtt.Client(
            client_id=f"librairy-scanner-{ROBOT_ID}", transport="websockets"
        )
        self.client.ws_set_options(path=MQTT_PATH)
        self.client.tls_set()
        self.client.reconnect_delay_set(min_delay=1, max_delay=30)

    def publish_log(self, content, send_notice=0):
        self.publish(
            TOPIC_LOG,
            {"robotId": ROBOT_ID, "logContent": content, "sendNotice": send_notice},
        )

    def publish(self, topic, payload):
        result = self.client.publish(topic, json.dumps(payload), qos=1)
        if result.rc != mqtt.MQTT_ERR_SUCCESS:
            print(f"MQTT publish failed for {topic}: {result.rc}")
            return False
        return True

    def connect(self):
        while not self.stop_event.is_set():
            try:
                self.client.connect(MQTT_HOST, MQTT_PORT, keepalive=60)
                self.client.loop_start()
                self.publish_log("MQTT connection established")
                return
            except Exception as error:
                print(f"MQTT connection failed: {error}")
                self.stop_event.wait(5)

    def should_publish(self, topic, value):
        now = dt.datetime.now().timestamp()
        last_seen = self.last_seen[topic].get(value, 0)
        if now - last_seen < SCAN_COOLDOWN_SECONDS:
            return False
        self.last_seen[topic][value] = now
        return True

    def scan_qr_codes(self):
        camera = Picamera2()
        camera.configure(camera.create_preview_configuration(main={"size": (640, 480)}))
        camera.start()
        log_path = os.path.join(self.log_dir, "qr-scans.csv")
        print("QR scanner started")

        try:
            with open(log_path, "a", encoding="utf-8", buffering=1) as log_file:
                while not self.stop_event.is_set():
                    frame = camera.capture_array()
                    frame = imutils.resize(cv2.cvtColor(frame, cv2.COLOR_RGB2BGR), width=640)
                    for barcode in pyzbar.decode(crop_content(frame, 50)):
                        value = barcode.data.decode("utf-8").strip()
                        if value and self.should_publish(TOPIC_USER, value):
                            log_file.write(f"{dt.datetime.now().isoformat()},{value}\n")
                            if self.publish(TOPIC_USER, {"robotId": ROBOT_ID, "userCode": value}):
                                self.publish_log("User data sent to server")
                            else:
                                self.publish_log("User data could not be sent", send_notice=1)
        except Exception as error:
            self.publish_log(f"QR scanner stopped unexpectedly: {error}", send_notice=1)
            raise
        finally:
            camera.stop()
            camera.close()

    def scan_rfid_tags(self):
        reader = SimpleMFRC522()
        log_path = os.path.join(self.log_dir, "rfid-scans.csv")
        print("RFID scanner started")

        try:
            with open(log_path, "a", encoding="utf-8", buffering=1) as log_file:
                while not self.stop_event.is_set():
                    tag_id, _ = reader.read()
                    value = str(tag_id)
                    if self.should_publish(TOPIC_BOOK, value):
                        log_file.write(f"{dt.datetime.now().isoformat()},{value}\n")
                        if self.publish(TOPIC_BOOK, {"robotId": ROBOT_ID, "bookId": value}):
                            self.publish_log("Book data sent to server")
                        else:
                            self.publish_log("Book data could not be sent", send_notice=1)
        except Exception as error:
            self.publish_log(f"RFID scanner stopped unexpectedly: {error}", send_notice=1)
            raise

    def run(self):
        os.makedirs(self.log_dir, exist_ok=True)
        self.connect()
        if self.stop_event.is_set():
            return

        threads = [
            threading.Thread(target=self.scan_qr_codes, name="qr-scanner"),
            threading.Thread(target=self.scan_rfid_tags, name="rfid-scanner"),
        ]
        for thread in threads:
            thread.start()

        try:
            for thread in threads:
                thread.join()
        except KeyboardInterrupt:
            print("Stopping scanners...")
            self.stop_event.set()
            for thread in threads:
                thread.join(timeout=5)
        finally:
            self.stop_event.set()
            self.client.loop_stop()
            self.client.disconnect()


if __name__ == "__main__":
    RobotScanner(parse_args().log_dir).run()
