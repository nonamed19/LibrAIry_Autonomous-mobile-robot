from mfrc522 import SimpleMFRC522
from time import sleep

while True:
    print('Tag your Card!')
    id = SimpleMFRC522().read()[0]
    print(id)
    sleep(0.3)