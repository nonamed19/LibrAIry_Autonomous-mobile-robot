import cv2

# /dev/video0 ~ /dev/video7 테스트
for i in range(8):
    cap = cv2.VideoCapture(i)
    if cap.isOpened():
        print(f"✅ /dev/video{i}가 열렸습니다.")
        ret, frame = cap.read()
        if ret:
            print(f"🎥 /dev/video{i}에서 프레임을 읽을 수 있습니다.")
        else:
            print(f"⚠️ /dev/video{i}에서 프레임을 읽을 수 없습니다.")
        cap.release()
    else:
        print(f"❌ /dev/video{i}를 열 수 없습니다.")

