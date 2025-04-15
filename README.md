# 👩‍🏫 LibrAIry(Library + AI + Robotics)

## 프로젝트 설명

- 주제
  - 도서관 내 자율주행 로봇을 이용한 도서 분류 및 회수 시스템
- 목적
  - 이용자가 도서를 아무 곳에나 두는 문제 해결
  - 사서의 도서 정리 업무 부담 경감
  - 도서관 관리 효율성 향상 및 사용자 편의성 증대
- 기능
  - 자율주행 및 도서 운반: 로봇이 도서관 내부를 자율주행하며 도서를 회수하고 지정된 장소로 운반
  - 도서 관리 시스템 통합: 로봇이 도서 정보를 관리 시스템을 통해 실시간 상태 업데이트
  - 효율적 도서 분류: 도서 정보를 스캔하여 원래의 분류 위치를 자동으로 식별
  - 작업 효율성 제공: 사서가 회수 구역에서 도서를 간단히 확인 및 최종 정리 가능
- 작동 프로세스
  - 로봇이 도서관 내부를 자율주행하며 순회
  - 이용자가 로봇 상단에 도서를 올려둠
  - 로봇이 도서 정보를 읽어 원래 위치를 파악
  - 해당 도서를 지정된 회수 구역으로 운반
  - 사서가 회수 구역의 도서를 확인하고 최종 정리.
- 추가 기능
  - 대출 : 로봇 위에 올려둔 도서 정보를 읽어 사용자에게 대출 처리
  - 반납 : 로봇 위에 올려둔 도서 정보를 읽어 사용자에게 반납 처리 후 도서 분류 및 회수
  - 위치 정보 : 음성을 통해 특정 도서의 위치를 문의하고, 로봇이 음성으로 응답하는 서비스(도서관이라는 특성상 음성으로 문의 및 응답하는 것이 제한될 수 있음)

## 프로젝트 특장점(기능 관점)

1. 자율주행 기반 도서 회수 및 분류
   - 로봇이 도서관 내를 자율주행하며 실시간으로 경로를 탐색하고 도서를 회수
   - 도서 정보를 스캔하여 정확한 위치에 분류 가능
2. 도서 관리 시스템 연동
   - 사서가 도서를 효율적으로 관리할 수 있도록, 로봇이 실시간으로 회수한 도서 정보를 시스템에 업데이트
   - 도서 분류 현황 및 정리 필요 도서를 시각적으로 확인 가능
3. 비효율 감소 및 자동화된 프로세스 제공
   - 사서의 반복적인 도서 정리 업무를 대폭 절감
   - 사용자가 도서를 로봇에 올리는 간단한 행위로 정리 작업이 진행

## 프로젝트의 차별점/독창성(기술 관점)

1. SLAM 기반 자율주행 기술
   - 로봇이 LiDAR 및 카메라 센서를 사용하여 실시간으로 도서관 지도를 생성하고, 장애물을 회피하며 효율적으로 이동.
   - 좁은 공간에서도 안정적인 경로 탐색 가능.
2. OCR 및 RFID 통합 도서 인식
   - OCR(Optical Character Recognition)로 도서 표지 정보를 읽거나, RFID를 활용해 도서 정보를 빠르게 식별.
   - 다양한 방식의 도서 인식 기술로 사용 환경에 유연하게 대응.
3. DB 기반 관리 시스템
   - 로봇에서 수집된 데이터를 DB에 저장하여 도서 분류 상태를 원격으로 모니터링 가능.

## 기술 스택

- FE: JavaScript, React
- BE: Java 17, Spring Boot
- DB: MySQL 8.0.40
- EM: ROS2 Foxy
- AI : SLAM, Yolov8
- Infra: Ubuntu 20.04, Docker

<!--
## 설치 방법
### 1. 웹 페이지 설치
웹 페이지 프로젝트 디렉토리에서 다음 명령어로 필요한 패키지를 설치합니다:
`npm install`

### 2. 백엔드 설치
백엔드 프로젝트 디렉토리에서 다음 명령어로 필요한 패키지를 설치합니다:
`pip install -r requirements.txt`

### 3. 하드웨어 설치
하드웨어 설치는 **Arduino** 또는 **Raspberry Pi**와 같은 장치가 필요합니다.
1. **필수 하드웨어**: [하드웨어 목록]
2. **하드웨어 연결**: 하드웨어를 연결한 후, `hardware/setup` 디렉토리 내의 `setup_hardware.sh` 스크립트를 실행하여 장치를 준비합니다.

## 실행 방법
### 1. 웹 페이지 실행
웹 페이지 서버를 실행하려면, 웹 페이지 프로젝트 디렉토리에서 다음 명령어를 실행합니다:
`npm run serve`

### 2. 백엔드 서버 실행
백엔드 서버를 실행하려면, 백엔드 프로젝트 디렉토리에서 다음 명령어를 실행합니다:
`python manage.py runserver`

### 3. 하드웨어 시스템 실행
하드웨어와 백엔드가 모두 실행되었으면, 하드웨어 시스템을 시작하려면 다음 명령어를 실행합니다:
`python hardware/run_hardware.py`

## 프로젝트 구조
- **/project-root**: 프로젝트의 루트 디렉토리
    - **/web**: 웹 페이지 관련 소스 코드 및 자원
    - **/backend**: 서버 관련 코드 (API, 데이터베이스 등)
    - **/hardware**: 하드웨어 제어 및 연결 코드

## 기여 방법
1. 프로젝트를 Fork합니다.
2. 새로운 기능을 구현하거나 버그를 수정합니다.
3. Pull Request를 생성하여 기여합니다.

## 라이선스
MIT 라이선스 (또는 해당 라이선스 명시)
-->

## 연락처

- 윤상민(BE): cinador3@gmail.com
- 김현희(FE): hh.hyunheekim@gmail.com
- 문예찬(AI/EM): dlsnditi7845@gmail.com
- 홍정주(EM): jellyt5345@gmail.com
- 이현정(AI): hjlee8461@gmail.com
- 김찬호(AI/EM): nonamed19@naver.com

## 코드 컨벤션

### 1. 웹 페이지 (HTML, CSS, JavaScript)

- **HTML**:

  - 모든 태그는 소문자로 작성합니다.
  - 태그 속성은 `=` 뒤에 공백 없이 작성합니다.
  - 들여쓰기는 2칸을 사용합니다.

- **CSS**:

  - 클래스 이름은 `kebab-case`를 사용합니다. 예: `.main-header`.
  - 각 속성은 1줄에 하나씩 작성하고, `;`를 빠뜨리지 않습니다.
  - 들여쓰기는 2칸을 사용합니다.

- **JavaScript (Vue.js) - ESlint**:
  - 변수명은 `camelCase`를 사용합니다.
  - 함수명은 `camelCase`로 작성하며, 일반적인 동작을 하는 함수에 대해 `get`, `set`을 사용하는 명명법을 적용합니다.
  - 파일 내에서는 한 번에 하나의 클래스나 컴포넌트를 내보냅니다.
  - `const`와 `let`을 사용하고, `var`는 사용하지 않습니다.

### 2. 백엔드 (Java)

- **Java:**

https://google.github.io/styleguide/javaguide.html

- 들여쓰기는 공백 4칸입니다.
- 나머지는 Google Java Style을 따릅니다.

### 3. 하드웨어 (C, Python)

- **C (Arduino, Raspberry Pi) - Clang-Format**:

  - 함수, 변수명, 네임스페이스 `snake_case`를 사용합니다.
  - 상수는 `Upper_Case`를 사용합니다.
  - 각 함수에 대해 주석을 작성하여 기능을 설명합니다.
  - 하드웨어 제어 코드는 가능한 한 모듈화하여 관리합니다
  - 코드 스타일은 google 스타일을 사용합니다.
  - clang-format -i -style=Google example.cpp

- **Python (하드웨어 제어) - Pylint + Black**:
  - 변수명과 함수명은 `snake_case`를 사용합니다.
  - 하드웨어 관련 코드도 `import` 구문을 모듈화하여 재사용 가능한 코드로 작성합니다.
  - 코드의 안정성을 위해 예외 처리를 적절히 사용합니다.

## Git Flow

### 1. 브랜치 전략

- **master**: 항상 최신 상태로 유지합니다.
- **`<domain>`**: 각 도메인 별로 브랜치를 나누어서 개발합니다. (FE, BE, HW)

  - **`/develop`**: 개발 작업이 진행되는 브랜치입니다. 모든 기능은 이 브랜치에서 개발되며, master 브랜치에 지속적으로 병합됩니다.
  - **`/feature/<기능 이름>`**: 새로운 기능 개발을 위한 브랜치입니다. `develop` 브랜치에서 분기하여 작업합니다.
  - **`/hotfix/<버전 번호>`**: `master` 브랜치에서 발생한 긴급 버그 수정 작업을 위한 브랜치입니다. 작업 후 `master`와 `develop`에 병합됩니다.

- **`<Jira issue code>`**: Jira issue와 연동된 브랜치입니다. 위의 `<domain>/feature/<기능 이름>` 브랜치와 같은 역할입니다.

  - ex)
    https://lab.ssafy.com/s12-webmobile3-sub1/S12P11A103/-/tree/S12P11A103-17-gitlab-%EC%97%B0%EB%8F%99-%ED%85%8C%EC%8A%A4%ED%8A%B8?ref_type=heads

### 2. 브랜치 관리 규칙

1. `feature` 브랜치와 `<Jira issue code>` 브랜치는, 기능이 완성되면 `develop` 브랜치에 Pull Request하고 브랜치를 삭제합니다.
2. `hotfix` 브랜치는 긴급 수정이 필요할 때 사용하며, `master`, `develop` 브랜치에 바로 병합하고 브랜치를 삭제합니다.
3. 절대 `master` 브랜치에서 개발 금지!!

### 3. Pull Request 규칙

1. `develop` 브랜치에 pull request을 한 이후에, 두 명 이상의 코드 리뷰 및 시연을 진행하고, `develop` 브랜치에 병합합니다.
2. 매일 종례 시간에 각 도메인의 `develop` 브랜치를 `master` 브랜치에 병합합니다.
3. 주말동안 변경 사항이 많다면 월요일 아침에 해당 도메인의 `develop` 브랜치를 `master` 브랜치에 병합합니다.

### 4. Git Commit 컨벤션

`<Jira issue code>` `<type>`: `<title>`
<br><br><br>
`<body>`

---

#### `<Jira issue code>`

Jira에서 issue를 만들면 Jira issue code 얻을 수 있음!!

ex) S12P11A103-17

branch 이름, commit message 앞에 Jira issue code를 넣어주면 자동으로 연동되어 Jira issue에 표시됩니다.

참조:

https://lab.ssafy.com/s12-webmobile3-sub1/S12P11A103/-/commit/05f04d920424a64a07932ba9a937ee50b144ff57

https://ssafy.atlassian.net/jira/software/c/projects/S12P11A103/boards/7718?selectedIssue=S12P11A103-17

#### `<type>` 종류

- feat : 새로운 기능 추가
- refactor : 코드 리팩토링
- fix : 버그 수정
- add : 단순 파일(사진, 문서 등) 추가
- remove : 기존의 코드 또는 파일 삭제
- test : 테스트 코드 추가

#### Git Commit 규칙

- 제목은 최대한 쉽고 간결하게
- 본문에는 '어떻게' 보다는 '무엇을', '왜'를 작성
- 기능별로, 최대한 작은 단위로 커밋

### 5. 충돌 방지 전략

#### 1. 각 도메인 브랜치는 해당 도메인의 폴더 내용만 commit, push 합니다.

로컬에서 해당 도메인의 폴더만 git 추적을 하기 위해서 `.git/info/exclude` 파일에 해당 도메인 이외의 폴더 이름을 넣어줍니다.

ex) `BE/develop` 브랜치를 이용하는 폴더에는 `.git/info/exclude` 파일에 `front/`, `hw/`, `ai/` 를 작성해주면, `back` 폴더의 변경점만 git에서 추적합니다.

#### 2. `master` 브랜치에서 기능 브랜치를 새로 만들거나, `master` 브랜치에 직접 push하지 않습니다.

`master` 브랜치는 `develop` 브랜치에서의 Pull Request만 진행하고 최대한 건드리지 않습니다.

<!--
### 4. 태깅
- 배포 준비가 완료된 후, `master` 브랜치에 태그를 추가합니다. 태그는 **버전 번호** 형식으로 작성합니다 (예: `v1.0.0`).
-->

---

이 Git Flow를 통해 프로젝트를 효율적으로 관리하고, 여러 명이 동시에 작업할 때 발생할 수 있는 충돌을 최소화하며, 안정적인 배포가 가능합니다.
# LibrAIry__Library_AI_Robotics
