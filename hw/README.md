<h1>Activity Log - Hardware</h1>

### 2025/01/13 ~ 2025/01/14

라즈베리파이5 초기 세팅 및 장비 점검 완<br>
젯슨나노보드 초기 세팅 및 장비 점검 완<br>

<hr>

### 2025/01/15

기존 프로젝트 진행 시 구성한 HW Specification :

<li>차체 제외 약 4kg로 하드웨어를 구성</li>
<li>스텝업(전압 UP) 사용 시 차체 구동 가능</li>
<hr>

### 2025/01/16

ROS2, ubuntu 20.04 기준 설치 및 테스트 진행 예정정<br>
NAV2 활용 공부 예정<br>

<hr>

### 2025/01/17

Jetson Nano Orin board를 통해 Orin Car 제작 완료<br>
Jetson Nano Orin board 내 기본적인 구동 관련 python code 작성 완료<br>

<hr>

### 2025/01/20

하드웨어 선정 및 배치<br>
하드웨어 요구사항 정의 및 선정<br>

<hr>

### 2025/01/21

Autodesk Fusion360을 통해 3D Modeling rev.1 작성완 - Original<br>
Autodesk Fusion360을 통해 3D Modeling rev.2 작성중 - My Design<br>

<hr>

### 2025/01/22

Fusion 360으로 금일자 Orin Car 도면 작성 완료 - Design<br>
Fusion 360으로 금일자 Orin Car 도면 작성 완료 - Render<br>

**_도면 배포_**
`https://cad.onshape.com/documents/92ce2639b003bfd5207e8a05/w/511428cfee50f7d9496141b8/e/f243950038d66cfa9ae130f5`

<hr>

### 2025/01/23

라즈베리파이 초기 설정<br>
하드웨어 제작 및 조립 - 1<br>

**_[Detail] 하드웨어 제작 및 조립 - 1_**<br>

<ul>
<li>bottom부는 테이프 + 볼트로 고정</li>
<li>middle부는 작일 마크해둔 120 mm 기준으로 접합</li>
<li>top부는 그대로 접합</li>
<li>front부 높이 계산해서 책 1.5개 정도 나갈 수 있도록 절단 후 접합</li>
</ul>
<hr>

### 2025/01/24

하드웨어 모듈/센서 배선 설계<br>
하드웨어 모델 상세 설계 - 2<br>

**_[Detail] 하드웨어 모델 상세 설계 - 2_**<br>

<li>컨베이어 벨트 중간부에 체인같은 서포트 구성해서 강성 확보 필요할듯</li>
<ul>
<li>3D 프린터를 통해 서포트 제작하여 적용할 예정</li>
<li>Diagonal Groove Pattern 적용해서 롤러와 벨트의 밀착력 확보</li>
<li>Crowned shape 적용하여 중앙 정렬 및 밀착력 확보 가능하나, 제작 및 형상의 어려움 존재</li>
</ul>
<li>컨베이어 벨트 재질 변경(고무재질)을 통해 강성 확보 가능할듯
</li>
<ul>
<li>고무 재질 1T 고무판 구매 후 제단 및 적용 예정</li>
<li>EPDM, NBR, Silicon 中 Silicon 택(저렴함 & 0.5T, 1T 선택 가능)</li>
<li>Silicon 0.5T & 1T 주문 완료(2025/02/01 도착 예정)</li>
</ul>
<hr>

### 2025/01/27

Fusion360 roller 8 EA 형상 설계 완료<br>
Onshape를 통해서 3D printer 제작 시작하기(9AM, 10th floor)<br>

**_도면 배포_**
`https://cad.onshape.com/documents/1615b9fdeb343a202a16a148/w/402510b74b5d78ff1c863279/e/373a083f04da26e89391ac09`

<hr>

### 2025/01/31

3D PRINTER : 컨베이어 벨트 中 roller부 8 EA 제작 및 조립<br>
3D Printer를 통해 제작한 conveyor belt의 roller 형상을 위치시키기 위해 roller 양단에 hole 가공<br>
젯슨 오린 카(하부)와 도서 대출/반납함(상부) 양면 테이프를 통해 결합(피스를 통해 체결하려 했으나, 제공된 피스의 길이가 짧아서 상부-하부까지의 거리가 부족함)<br>

<hr>

### 2025/02/01

[ROS1] Ubuntu(20.04 LTS) & ROS1(Noetic) version 통일<br>
[ROS2] Ubuntu(22.04 LTS) & ROS2(Humble) version 통일<br>

<hr>

### 2025/02/02

[ROS1] 추가 필수 프레임워크 및 라이브러리<br>
① 개발 도구 및 ROS 빌드 도구<br>
② Gazebo (로봇 시뮬레이션)<br>
③ RViz (로봇 시각화 도구)<br>
④ MoveIt! (로봇 경로 계획)<br>
⑤ Navigation Stack (자율 주행)<br>
⑥ URDF 및 로봇 모델링 도구<br>
⑦ Sensor Interface (LIDAR, 카메라)<br>

[ROS2] 추가 필수 프레임워크 및 라이브러리<br>
① 개발 도구 및 기본 라이브러리<br>
② ROS2 패키지 관리 및 의존성 해결<br>
③ DDS 미들웨어 (RTPS 통신)<br>
④ Gazebo (로봇 시뮬레이션)<br>
⑤ RViz2 (로봇 시각화 도구)<br>
⑥ MoveIt 2 (로봇 경로 계획)<br>
⑦ Nav2 (자율 주행 패키지)<br>
⑧ URDF 및 로봇 모델링 도구<br>
⑨ Sensor Interface (LIDAR, 카메라)<br>

<hr>

### 2025/02/03

#### 하드웨어 제작 및 조립 - 4

<ul>
<li>컨베이어 벨트 中 roller부 8 EA 교체
<li>컨베이어 벨트 中 belt부 재질 변경 (전)Fabric → (후)Silicon
</ul>

#### 컨베이어 벨트 테스트 - 모터 드라이브

아래의 모터 드라이브의 기능 참고

<ul>
<li>전력 증폭: 마이크로컨트롤러(MCU)나 프로세서는 낮은 전류·전압을 출력하므로, 모터를 직접 구동할 수 없음. 모터 드라이버가 전압·전류를 증폭하여 모터에 공급.
<li>방향 제어: H-브리지 회로를 이용해 DC 모터의 회전 방향을 제어 가능.
<li>속도 조절: PWM(Pulse Width Modulation) 신호를 통해 모터 속도를 제어.
<li>전류 보호: 과전류, 과열 보호 기능 포함된 경우가 많아 모터와 회로 보호 가능.
</ul>

<hr>

### 2025/02/04

#### 하드웨어 제작 및 조립 - 5

<ul>
<li>컨베이어 벨트 中 roller부 4 EA(Resin) + 4 EA(Wood) 적용
<li>컨베이어 벨트 中 belt부 재질 변경 (전)Fabric → (중)Silicon → (후)Silicon + Fabric
<li>Fabric만 적용 시, roller부에 대한 마찰력 ↓
<li>Fabric만 적용 시, 제품에 대한 마찰력 ↓
<li>Silicon만 적용 시, 중간 정렬되지 않는 경우 비틀림 발생으로 인해 과다한 측면 저항력 발생
<li>Fabric + Silicon 적용 시, Fabric부를 통해 중간 정렬 수행 및 Silicon부를 통해 roller에 대한 마찰력 확보 가능 
</ul>

#### 컨베이어 벨트 테스트 - 젯슨 오린 나노

<hr>

### 2025/02/05

#### 라즈베리파이 카메라 테스트

<li>라즈베리파이 카메라 테스트(사용자 인증 방식 : QR인식)

#### 라즈베리파이 RFID Reader 테스트

<li>라즈베리파이 rfid 테스트(+아크릴판 뚫고 rfid 인식 되는지 확인)

#### 추가 HW 업무

- 각 센서별 연결 testcode 작성 및 테스트 완료 배포
- RFID, IMU, MotorDriver, 주행 테스트, 조이스틱 주행

<hr>

### 20205/02/06

#### Raspberry Pi 대출 알고리즘 구축 - 1

<ul>
<li>라즈베리 파이 카메라 : 사용자 QR 인식 코드 작성
<li>라즈베리 파이 RFID : 도서 RFID 인식 코드 작성
</ul>

#### Raspberry Pi 대출 알고리즘 구축 - 2

<ul>
<li>라즈베리 파이 카메라 : 사용자 QR 인식 코드 통합
<li>라즈베리 파이 RFID : 도서 RFID 인식 코드 통합
<li>라즈베리 파이 ↔︎ BACKEND SERVER 통신 코드 작성
</ul>

#### 추가 HW 업무

- DC 및 서보모터 제어를 위한 ROS_pak 추가
<hr>

### 20205/02/07

#### Raspberry Pi 대출 알고리즘 구축 - 3

<ul>
<li>라즈베리 파이 카메라&RFID ↔︎ BACKEND SERVER 통신(HTTP) 코드 통합
<li>라즈베리 파이 카메라&RFID ↔︎ BACKEND SERVER 통신(HTTP) 테스트 완료
</ul>

#### Raspberry Pi 대출 알고리즘 구축 - 4

<ul>
<li>라즈베리 파이 카메라&RFID ↔︎ BACKEND SERVER 통신(WEBSOCKET) 코드 통합
<li>라즈베리 파이 카메라&RFID ↔︎ BACKEND SERVER 통신(WEBSOCKET) 테스트 필요(FRONT & BACK)
<li>FRONTEND WEBSOCKET & BACKEND WEBSOCKET 주소 및 로직 적용 필요
</ul>

<hr>

### 20205/02/08

#### 하드웨어 제작 및 조립 - 5.5

<ul>
<li>캐터필러 형태 바퀴 새로 구매 완료(2월 8일 / 2월 11일 도착 예정)
<li>조립 후 결합을 위한 서포트 구조 생각해보기(아크릴 or 레진)
</ul>

<hr>

### 20205/02/10

#### 하드웨어 제작 및 조립 - 6

<ul>
<li>HW 1층 센서/모듈 배치 및 선정리
<li>HW 2층 프레임 고정하기(A/S)
</ul>

#### 하드웨어 제작 및 조립 - 7

<ul>
<li>(NEW) 캐터필러 형태 컨베이어 벨트 제작
<li>(해리포터 도서 기준) 2권까지는 컨베이어 벨트가 작동하지만, 3권 이상부터는 어려움을 보임(구조 변경 필요)
<li>(Original) AA배터리 x 2 EA / 1 DC motor → (Modified) AA배터리 x 4 EA / 1 DC motor // overload 주의 !!!
</ul>

<hr>

### 20205/02/11

#### 하드웨어 제작 및 조립 - 8

<ul>
<li>캐터필러 형태 컨베이어 벨트 구조 최적화
<li>도서 적재량 증가를 위해 컨베이어 벨트 높이 변경
<li>모터 드라이브 및 배터리 팩과 컨베이어 벨트 연결
</ul>

#### 하드웨어 제작 및 조립 - 9

<ul>
<li>도서 배출을 위한 컨베이어 벨트 사이 가이드(아크릴) 제작
<li>컨베이어 벨트, 모터 드라이브, 배터리 팩 위치 고정을 위한 프레임(아크릴) 제작
<li>모터 - ROD 탈락으로 인해 재부착
<li>모터 - 배터리팩 간 전선 탈락으로 인한 납땜 수행
</ul>

<hr>

### 20205/02/12

#### 하드웨어 제작 및 조립 - 10

<ul>
<li>Jetson Orin Nano 및 Raspberry Pi 위치 최적화
<li>컨베이어 벨트 위치 최적화
<li>Raspberry Pi Monitor, RFID Reader, Camera 위치 고정(상단)
<li>컨베이어 벨트 모터 x 2 EA 적용되는 모터 드라이브 위치 고정(2층)
<li>모터 - 배터리팩 간 전선 탈락으로 인한 납땜 재수행 및 글루건 고정
</ul>

#### Raspberry Pi 대출 알고리즘 구축 - 5

<ul>
<li>라즈베리 파이 카메라&RFID ↔︎ BACKEND SERVER 통신(MQTT) 코드 작성
<li>라즈베리 파이 카메라&RFID ↔︎ BACKEND SERVER 통신(MQTT) 통합 및 테스트 완료
<li>FRONTEND MQTT 통신 적용 필요
</ul>

<hr>

### 20205/02/13

#### 하드웨어 제작 및 조립 - 11

<ul>
<li>NEW 컨베이어 벨트에 맞추어 전단부 프레임(아크릴) 제작
<li>NEW 컨베이어 벨트에 맞추어 2.5층 프레임(아크릴) 제작
<li>컨베이어벨트 위치 수정/고정
<li>카메라 방향 수정/고정
</ul>

#### Raspberry Pi 대출 알고리즘 구축 - 6

<ul>
<li>라즈베리파이 RFID, Camera 코드 MQTT + websocket 통신 프로토콜 추가
<li> 라즈베리파이 frontend {test page} 테스트 완료
</ul>

<hr>

### 20205/02/14

#### Jetson Orin Nano 컨베이어 벨트 알고리즘 구축 - 1

<li>DC 모터 x 2 EA에 대해서 다음의 알고리즘에 따라 속도 조절 코드 수정

```
SPEED_DELAY = 0.05  # 값을 키우면 더 천천히 돌고, 줄이면 빨라짐
...
while True:
    motor_forward()
    time.sleep(SPEED_DELAY)  # 모터가 켜진 상태 유지
    stop_motor()
    for _ in range(5):
        time.sleep(SPEED_DELAY)  # 모터를 껐다가 다시 켬
```

#### Raspberry Pi 대출 알고리즘 구축 - 7

[메시지 보내는 곳: topic/log/save]<br>

[메시지 받는 곳: queue/log/save/{robotId}]<br>

<ul>
<li>라즈베리파이 RFID, Camera 코드 DB에 log 내역 추가 로직 구현
<li>상기 내용 Swagger UI를 통해 테스트 완료
</ul>

<hr>

### ROS1 and ROS2 를 함꼐 사용한 자율주행 구축 -1

<ul>
<li>주행 로직 추가 및 amcl odom 정확도 테스트 향상
<li>rivz 기반의 시각화로 확인 
</ul>

### 20205/02/17

#### 하드웨어 제작 및 조립 - 12

<ul>
<li>외부 프레임 꾸미기 : 시트지 & 스티커
<li>상단(모니터부) 등 UX를 고려하여 서포트 필요하면 제작하기(가림막 용도도 가능)
</ul>

#### 하드웨어 제작 및 조립 - 13

<ul>
<li>라즈베리파이 관련 센서 위치 최종 설정 및 선 정리
<li>젯슨 오린 나노 관련 센서 위치 최종 설정 및 선 정리
</ul>

<hr>

### 20205/02/18

#### Raspberry Pi 대출 알고리즘 구축 - 8

<li>라즈베리파이 코드 하나로 합치기

```
MQTT 연결 함수 : def connect_mqtt()
QR 코드 인식 함수 : def qr_scanner()
RFID 인식 함수 : def rfid_scanner()
```

#### Raspberry Pi 대출 알고리즘 구축 - 9

<li>`thread library`를 통해 `try & error logic` 적용하여 예외 발생 시에도 통신 및 기능 유지하도록 설정함

```
import threading

def qr_scanner():
  ...
  while not stop_event.is_set():
    ...

def rfid_scanner():
  ...
  while not stop_event.is_set():
    ...

stop_event = threading.Event()
```

<hr>

### 20205/02/19

#### Raspberry Pi RFID 최종 테스트 & CAMERA 최종 테스트

<ul>
<li>Raspberry Pi Touch Screen 오작동으로 인해 cable 변경(data 용도 ↔︎ 충전 용도)
<li>최종 시연 환경(보조배터리 → Raspberry Pi & Jetson Orin Nano)에서 테스트 완료 : OK
</ul>

<hr>
