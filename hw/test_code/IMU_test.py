# import smbus
# import time

# # MPU6050 I2C 주소
# MPU6050_ADDR = 0x68

# # 레지스터 주소
# PWR_MGMT_1 = 0x6B
# ACCEL_XOUT_H = 0x3B
# GYRO_XOUT_H = 0x43

# # I2C 버스 선택 (Jetson은 보통 1번 버스를 사용)
# bus = smbus.SMBus(1)

# def read_word(adr):
#     high = bus.read_byte_data(MPU6050_ADDR, adr)
#     low = bus.read_byte_data(MPU6050_ADDR, adr+1)
#     val = (high << 8) + low
#     if val >= 0x8000:  # 음수 처리
#         val = -((65535 - val) + 1)
#     return val

# def get_accel_data():
#     x = read_word(ACCEL_XOUT_H) / 16384.0  # 가속도 범위 ±2g
#     y = read_word(ACCEL_XOUT_H + 2) / 16384.0
#     z = read_word(ACCEL_XOUT_H + 4) / 16384.0
#     return x, y, z

# def get_gyro_data():
#     x = read_word(GYRO_XOUT_H) / 131.0  # 자이로 범위 ±250°/s
#     y = read_word(GYRO_XOUT_H + 2) / 131.0
#     z = read_word(GYRO_XOUT_H + 4) / 131.0
#     return x, y, z

# def main():
#     # MPU6050 초기화
#     bus.write_byte_data(MPU6050_ADDR, PWR_MGMT_1, 0)

#     while True:
#         accel_x, accel_y, accel_z = get_accel_data()
#         gyro_x, gyro_y, gyro_z = get_gyro_data()

#         print(f"Accel: X={accel_x:.2f}, Y={accel_y:.2f}, Z={accel_z:.2f} g")
#         print(f"Gyro: X={gyro_x:.2f}, Y={gyro_y:.2f}, Z={gyro_z:.2f} °/s")
#         print("-" * 40)
        
#         time.sleep(0.5)

# if __name__ == "__main__":
#     main()

import smbus
import time

# MPU6050 I2C 주소
MPU6050_ADDR = 0x68

# 레지스터 주소
PWR_MGMT_1 = 0x6B
ACCEL_XOUT_H = 0x3B
GYRO_XOUT_H = 0x43

# I2C 버스 선택 (Jetson은 보통 1번 버스를 사용)
bus = smbus.SMBus(1)

def read_word(adr):
    try:
        high = bus.read_byte_data(MPU6050_ADDR, adr)
        low = bus.read_byte_data(MPU6050_ADDR, adr+1)
        val = (high << 8) + low
        if val >= 0x8000:  # 음수 처리
            val = -((65535 - val) + 1)
        return val
    except OSError as e:  # I2C 오류 발생 시 예외 처리
        print(f"[Warning] I2C Read Error at 0x{adr:02X}: {e}")
        return 0  # 기본값 반환 (에러 발생 시)

def get_accel_data():
    try:
        x = read_word(ACCEL_XOUT_H) / 16384.0  # 가속도 범위 ±2g
        y = read_word(ACCEL_XOUT_H + 2) / 16384.0
        z = read_word(ACCEL_XOUT_H + 4) / 16384.0
        return x, y, z
    except Exception as e:
        print(f"[Warning] Failed to get Accel Data: {e}")
        return 0.0, 0.0, 0.0  # 기본값 반환

def get_gyro_data():
    try:
        x = read_word(GYRO_XOUT_H) / 131.0  # 자이로 범위 ±250°/s
        y = read_word(GYRO_XOUT_H + 2) / 131.0
        z = read_word(GYRO_XOUT_H + 4) / 131.0
        return x, y, z
    except Exception as e:
        print(f"[Warning] Failed to get Gyro Data: {e}")
        return 0.0, 0.0, 0.0  # 기본값 반환

def main():
    try:
        # MPU6050 초기화
        bus.write_byte_data(MPU6050_ADDR, PWR_MGMT_1, 0)
    except Exception as e:
        print(f"[Error] Failed to Initialize MPU6050: {e}")
        return  # 초기화 실패 시 종료

    while True:
        accel_x, accel_y, accel_z = get_accel_data()
        gyro_x, gyro_y, gyro_z = get_gyro_data()

        print(f"Accel: X={accel_x:.2f}, Y={accel_y:.2f}, Z={accel_z:.2f} g")
        print(f"Gyro: X={gyro_x:.2f}, Y={gyro_y:.2f}, Z={gyro_z:.2f} °/s")
        print("-" * 40)
        
        time.sleep(0.5)

if __name__ == "__main__":
    main()
