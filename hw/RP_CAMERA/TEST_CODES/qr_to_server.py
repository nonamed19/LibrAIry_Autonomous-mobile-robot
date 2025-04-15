import cv2
import requests
from pyzbar.pyzbar import decode

SERVER_URL = "http://43.200.7.229:8080/api/user/save?userCode="

cap = cv2.VideoCapture("/dev/video0", cv2.CAP_V4L2)

cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*"YUYV"))  # YUYV 포맷 설정

if not cap.isOpened():
    print("❌ 카메라를 열 수 없습니다.")
    exit()

print("📷 QR 코드 인식을 시작합니다... (Ctrl+C로 종료)")

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            print("⚠️ 카메라 프레임을 읽을 수 없습니다.")
            continue

        # YUYV를 BGR로 변환
        frame = cv2.cvtColor(frame, cv2.COLOR_YUV2BGR_YUYV)

        # QR 코드 디코딩
        codes = decode(frame)
        for code in codes:
            user_code = code.data.decode('utf-8')
            print(f"✅ QR 코드 인식 완료: {user_code}")

            # 서버로 데이터 전송
            response = requests.get(f"{SERVER_URL}{user_code}")
            if response.status_code == 200:
                print(f"📤 서버 전송 성공: {response.text}")
            else:
                print(f"❌ 서버 전송 실패: {response.status_code}")

        cv2.imshow("QR 코드 스캐너", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

except KeyboardInterrupt:
    print("🚪 프로그램을 종료합니다...")

finally:
    cap.release()
    cv2.destroyAllWindows()
