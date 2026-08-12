import time
import smbus
import rospy
import numpy as np
from sensor_msgs.msg import Imu
from geometry_msgs.msg import Twist
from tf.transformations import quaternion_from_euler

IMU_FRAME = "imu_link"

class MPU6050:
    GRAVITY_MS2 = 9.80665
    address = None
    bus = smbus.SMBus(1)

    ACCEL_SCALE_MODIFIER_2G = 16384.0
    GYRO_SCALE_MODIFIER_250DEG = 131.0

    PWR_MGMT_1 = 0x6B
    ACCEL_XOUT0 = 0x3B
    GYRO_XOUT0 = 0x43

    def __init__(self, address):
        self.address = address
        try:
            self.bus = smbus.SMBus(1)
            self.bus.write_byte_data(self.address, self.PWR_MGMT_1, 0x00)
            rospy.loginfo("MPU6050 initialized successfully.")
        except Exception as e:
            rospy.logerr(f"Failed to initialize MPU6050: {e}")
            self.bus = None  # 센서 사용 불가 상태

        #self.bus.write_byte_data(self.address, self.PWR_MGMT_1, 0x00)

    def read_i2c_word(self, register):
        # high = self.bus.read_byte_data(self.address, register)
        # low = self.bus.read_byte_data(self.address, register + 1)
        # value = (high << 8) + low
        # if value >= 0x8000:
        #     return -((65535 - value) + 1)
        # else:
        #     return value
        if self.bus is None:
            raise RuntimeError("MPU6050 not initialized")  # 예외 발생
        try:
            high = self.bus.read_byte_data(self.address, register)
            low = self.bus.read_byte_data(self.address, register + 1)
            value = (high << 8) + low
            if value >= 0x8000:
                return -((65535 - value) + 1)
            else:
                return value
        except OSError as e:
            rospy.logwarn(f"I2C Read Error at register 0x{register:02X}: {e}")
            raise  # 예외를 다시 발생시켜 상위 코드에서 처리하도록 함


    def get_accel_data(self):
        x = self.read_i2c_word(self.ACCEL_XOUT0) / self.ACCEL_SCALE_MODIFIER_2G * self.GRAVITY_MS2
        y = self.read_i2c_word(self.ACCEL_XOUT0 + 2) / self.ACCEL_SCALE_MODIFIER_2G * self.GRAVITY_MS2
        z = self.read_i2c_word(self.ACCEL_XOUT0 + 4) / self.ACCEL_SCALE_MODIFIER_2G * self.GRAVITY_MS2
        return {'x': x, 'y': y, 'z': z}

    def get_gyro_data(self):
        x = self.read_i2c_word(self.GYRO_XOUT0) / self.GYRO_SCALE_MODIFIER_250DEG
        y = self.read_i2c_word(self.GYRO_XOUT0 + 2) / self.GYRO_SCALE_MODIFIER_250DEG
        z = self.read_i2c_word(self.GYRO_XOUT0 + 4) / self.GYRO_SCALE_MODIFIER_250DEG
        return {'x': x, 'y': y, 'z': z}

# ✅ 상보 필터 적용
def complementary_filter(accel_data, gyro_data, prev_angle, alpha=0.98, dt=0.2):
    accel_roll = np.arctan2(accel_data['y'], accel_data['z'])
    accel_pitch = np.arctan2(-accel_data['x'], np.sqrt(accel_data['y']**2 + accel_data['z']**2))

    gyro_roll = gyro_data['x'] * dt
    gyro_pitch = gyro_data['y'] * dt
    gyro_yaw = gyro_data['z'] * dt

    accel_yaw = np.arctan2(accel_data['y'], accel_data['x'])

    roll = alpha * (prev_angle['roll'] + gyro_roll) + (1 - alpha) * accel_roll
    pitch = alpha * (prev_angle['pitch'] + gyro_pitch) + (1 - alpha) * accel_pitch
    yaw = alpha * (prev_angle['yaw'] + gyro_yaw) + (1 - alpha) * accel_yaw

    return roll, pitch, yaw

def calibrate_imu(mpu, num_samples=1000):
    print("Calibrating IMU... Hold IMU still!")

    accel_bias = {'x': 0, 'y': 0, 'z': 0}
    gyro_bias = {'x': 0, 'y': 0, 'z': 0}

    for _ in range(num_samples):
        accel_data = mpu.get_accel_data()
        gyro_data = mpu.get_gyro_data()

        for axis in ['x', 'y', 'z']:
            accel_bias[axis] += accel_data[axis]
            gyro_bias[axis] += gyro_data[axis]

        time.sleep(0.01)

    for axis in ['x', 'y', 'z']:
        accel_bias[axis] /= num_samples
        gyro_bias[axis] /= num_samples

    accel_bias['z'] -= 9.80665  

    print(f"Calibration complete!\n"
          f"Accel Bias: {accel_bias}\n"
          f"Gyro Bias: {gyro_bias}")

    return accel_bias, gyro_bias


if __name__ == "__main__":
    rospy.init_node('imu_node')
    mpu = MPU6050(0x68)
    
    if mpu.bus is None:
        rospy.logerr("MPU6050 initialization failed. Shutting down node.")
        exit(1)  # 종료

    
    imu_pub = rospy.Publisher('imu/data', Imu, queue_size=10)
    rate = rospy.Rate(100)

    # ✅ 센서 보정 수행
    accel_bias, gyro_bias = calibrate_imu(mpu)

    roll, pitch, yaw = 0.0, 0.0, 0.0

    while not rospy.is_shutdown():
        
        
        
        # accel_data = mpu.get_accel_data()
        # gyro_data = mpu.get_gyro_data()
        
        try:
            accel_data = mpu.get_accel_data()
            gyro_data = mpu.get_gyro_data()
        except Exception as e:
            rospy.logwarn(f"IMU data read failed: {e}")
            continue  # 🔥 에러 발생 시 메시지 발행하지 않고 다음 루프로 넘어감


        # ✅ 데이터 스케일 다운 (10으로 나누기)
        for axis in ['x', 'y', 'z']:
            accel_data[axis] = (accel_data[axis] - accel_bias[axis])
            gyro_data[axis] = (gyro_data[axis] - gyro_bias[axis]) 

        # ✅ 상보 필터 적용
        roll, pitch, yaw = complementary_filter(
            accel_data, gyro_data, {'roll': roll, 'pitch': pitch, 'yaw': yaw}, alpha=0.996, dt=0.02
        )

        # ✅ Yaw 복구 로직 추가 (정지 시 보정)
        if abs(gyro_data['x']) < 0.1 and abs(gyro_data['y']) < 0.1 and abs(gyro_data['z']) < 0.1:
            yaw *= 0.7  # 더 빠르게 복구

        # ✅ 쿼터니언 변환 및 IMU 메시지 발행
        quaternion = quaternion_from_euler(roll, pitch, yaw)
        imu_msg = Imu()
        imu_msg.header.frame_id = IMU_FRAME
        imu_msg.header.stamp = rospy.Time.now()
        imu_msg.orientation.x = quaternion[0]
        imu_msg.orientation.y = quaternion[1]
        imu_msg.orientation.z = quaternion[2]
        imu_msg.orientation.w = quaternion[3]

        imu_msg.linear_acceleration.x = accel_data['x']
        imu_msg.linear_acceleration.y = accel_data['y']
        imu_msg.linear_acceleration.z = accel_data['z']

        imu_msg.angular_velocity.x = gyro_data['x']
        imu_msg.angular_velocity.y = gyro_data['y']
        imu_msg.angular_velocity.z = gyro_data['z']

        imu_msg.orientation_covariance = [0.02, 0.0, 0.0, 0.0, 0.02, 0.0, 0.0, 0.0, 0.02]
        imu_msg.angular_velocity_covariance = [0.01, 0.0, 0.0, 0.0, 0.01, 0.0, 0.0, 0.0, 0.01]
        imu_msg.linear_acceleration_covariance = [0.04, 0.0, 0.0, 0.0, 0.04, 0.0, 0.0, 0.0, 0.04]

        imu_pub.publish(imu_msg)
        rate.sleep()

