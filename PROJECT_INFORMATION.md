# LibrAIry — 도서관 자율주행 로봇 시스템

> 포트폴리오 CMS에 바로 옮겨 적을 수 있도록 스키마 순서에 맞춰 정리한 프로젝트 기술 노트입니다. 확인할 수 없는 개인 정보와 이미지 업로드 필드는 비워 두었습니다.

## title · Project Name

**LibrAIry — 도서관 자율주행 로봇 시스템**  
*LibrAIry — Autonomous Mobile Robot System for Libraries*

## slug · URL Slug

`librairy-autonomous-mobile-robot`

## summary · Summary

도서관의 반복적인 대출·반납·회수 업무를 줄이기 위해, 자율주행 로봇과 웹 서비스를 하나의 흐름으로 연결한 스마트 라이브러리 프로젝트입니다. 사용자는 웹에서 도서를 검색하고 대출·반납을 진행하며, 로봇은 QR 코드와 RFID 태그를 읽어 이용자와 도서를 식별합니다. 인식 결과와 로봇 로그는 MQTT를 통해 백엔드로 전달되고, 관리자 화면에서는 도서·회수 구역·로봇 상태를 확인할 수 있습니다.

*A smart-library system that connects an autonomous mobile robot with a web service to automate book borrowing, returns, collection-area management, and operational notifications.*

## type · Project Type

`engineering`

## status · Status

`completed`

## period · Period

| Field | Value |
| --- | --- |
| `startDate` | `2025-01` |
| `endDate` | `2025-02` |

개발 기간: 2025.01.06–2025.02.21 (7주)

## role · My Role



## highlights · Key Highlights

- 자율주행 로봇, 웹 애플리케이션, 백엔드를 연결해 도서 대출·반납과 회수 업무를 하나의 서비스 흐름으로 구현했습니다.
- Raspberry Pi 기반 QR/RFID 스캔 데이터를 MQTT로 전송하고, Spring Boot가 이를 도서·이용자·로봇 로그 데이터로 처리하도록 구성했습니다.
- ROS 1 기반 SLAM, 위치 추정, 내비게이션 패키지를 분리해 실내 지도 기반 이동과 로봇 기능을 모듈화했습니다.
- 이용자용 도서 검색·서재와 관리자용 로봇·도서·회수 구역 관리 화면을 React 웹 애플리케이션으로 제공했습니다.
- Docker Compose, Nginx, Mosquitto, MySQL, Redis를 조합하여 서비스 배포와 실시간 통신 환경을 구성했습니다.

## body · Detailed Content

### 1. 문제를 ‘도서 이동’이 아닌 ‘업무 흐름’으로 바라보기

도서관에서 반납된 책은 단순히 반납 처리하는 것만으로 끝나지 않습니다. 이용자 확인, 도서 식별, 회수 장소 이동, 상태 갱신, 사서의 최종 정리까지 여러 단계가 이어집니다. LibrAIry는 이 사이의 단절을 줄이기 위해 로봇의 물리적 동작과 웹 기반 관리 기능을 함께 설계했습니다. 로봇은 도서를 운반하는 장치를 넘어, 현장의 이벤트를 서비스 데이터로 바꾸는 접점이 됩니다.

### 2. 이용자·도서·로봇을 실시간으로 연결한 처리 흐름

로봇에 탑재된 카메라는 이용자 QR 코드를, RFID 리더는 도서 태그를 인식합니다. 임베디드 Python 프로그램은 중복 스캔을 짧은 쿨다운으로 방지하고, 인식 데이터와 장애 로그를 MQTT 메시지로 발행합니다. Spring Boot 백엔드는 MQTT와 WebSocket을 연결해 대출·반납 상태, 도서 정보, 로봇 로그를 처리하고 웹 화면에 전달합니다.

```text
User QR / Book RFID
        ↓
Raspberry Pi scanner (Python)
        ↓ MQTT over WebSocket / TLS
Mosquitto → Spring Boot API → MySQL · Redis
        ↓                         ↓
ROS robot control           React user/admin web
```

이 구조 덕분에 로봇에서 발생한 스캔과 운행 이벤트를 서비스의 상태 변화로 다룰 수 있었고, 관리자는 별도 장비 없이 웹에서 현황을 확인할 수 있습니다.

### 3. 로봇 소프트웨어를 기능 단위로 나누기

ROS 1 워크스페이스는 로봇 본체, 모터 제어, IMU 변환, 레이저 스캔 기반 오도메트리, 위치 추정, 내비게이션, RFID 제어 패키지로 구성했습니다. 지도 파일과 costmap·local planner 설정을 함께 관리해, 실내 도서관 환경에서 위치를 추정하고 목표 지점으로 이동하는 기반을 마련했습니다. 수동 하드웨어 점검 스크립트도 별도로 두어 카메라, RFID, IMU, 모터를 개별적으로 검증할 수 있게 했습니다.

### 4. 웹 서비스에서 완성되는 운영 경험

이용자 화면은 회원 인증, 도서 검색·상세 조회, 대출·반납, 내 서재를 제공합니다. 관리자는 도서 등록과 편집, 회수 구역 상태, 로봇 등록·상세·운영 로그, 알림을 관리할 수 있습니다. Kakao 도서 검색 API 연동과 QR 코드 기능을 더해, 실제 도서관 업무 흐름에 가까운 입력 경험을 만들었습니다.

### 5. 배포와 운영을 고려한 구성

프런트엔드와 백엔드는 각각 Vite/React와 Spring Boot로 구성하고, MySQL·Redis·Mosquitto를 Docker Compose로 함께 운영하도록 설계했습니다. Nginx와 HTTPS를 앞단에 두고, 로봇 통신은 TLS가 적용된 MQTT WebSocket 경로를 사용합니다. 환경 변수로 메일, 도메인, MQTT 브로커 등 배포 환경별 값을 분리해 두었습니다.

### 결과와 배운 점 · Outcome & Learning

LibrAIry는 하드웨어, ROS, 메시지 브로커, 백엔드, 웹 UI가 함께 동작해야 비로소 가치가 생기는 프로젝트였습니다. 각 기술을 따로 구현하는 데서 그치지 않고, **센서의 한 번의 인식이 사용자 경험과 운영 데이터까지 자연스럽게 이어지도록 만드는 일**이 핵심이었습니다. 특히 메시지 기반 통신과 모듈화된 ROS 패키지 구조는 기능을 독립적으로 점검하고 통합하는 데 도움이 되었습니다.

*The project demonstrates end-to-end integration: a physical robot event becomes a reliable service event, then a visible operational update for users and librarians.*

## thumbnail · Thumbnail Image



## gallery · Image·Video Gallery



## techStack · Tech Stack

- `React`
- `TypeScript`
- `Vite`
- `Tailwind CSS`
- `TanStack Query`
- `Spring Boot 3.4`
- `Java 17`
- `Spring Data JPA`
- `MySQL 8`
- `Redis 7`
- `MQTT (Mosquitto)`
- `WebSocket`
- `ROS 1`
- `Python`
- `Raspberry Pi 4B`
- `Jetson Orin Nano`
- `RFID (MFRC522)`
- `QR Code / OpenCV`
- `LiDAR`
- `Docker Compose`
- `Nginx`

## team · Team Composition

| Field | Value |
| --- | --- |
| `type` | `team` |
| `size` | `6` |

## contributions · Key Contributions



## links · Related Links

- **서비스:** https://librairy.p-e.kr
- **Repository:** https://github.com/nonamed19/LibrAIry__Library_AI_Robotics

## featured · Featured

`false`
