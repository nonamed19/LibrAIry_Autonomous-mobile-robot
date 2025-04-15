#!/usr/bin/env python3
import rospy
import tf
import numpy as np
import open3d as o3d  # Open3D for ICP
from sensor_msgs.msg import LaserScan
from nav_msgs.msg import Odometry
from geometry_msgs.msg import Quaternion
from tf.transformations import quaternion_from_euler

class LiDARScanMatchingOdom:
    def __init__(self):
        rospy.init_node('lidar_scan_matching_odom', anonymous=True)

        # 퍼블리셔 (Odometry 데이터 퍼블리시)
        self.odom_pub = rospy.Publisher('/odom', Odometry, queue_size=10)

        # TF 브로드캐스터 (odom → base_link)
        self.tf_broadcaster = tf.TransformBroadcaster()

        # 센서 데이터 구독 (Scan만 사용)
        rospy.Subscriber('/scan', LaserScan, self.scan_callback)

        # 초기 위치 및 회전각
        self.x, self.y, self.theta = 0.0, 0.0, 0.0  

        # 이전 프레임 저장
        self.prev_scan = None  
        self.last_time = rospy.Time.now()

        # Kalman Filter 변수
        self.P = np.eye(3) * 0.01  # 초기 공분산 행렬 (작은 오차 허용)
        self.Q = np.eye(3) * 0.001  # 프로세스 노이즈
        self.R = np.eye(3) * 0.05   # 측정 노이즈 (너무 작으면 튀는 문제 발생)

        # Noise Threshold 설정
        self.noise_threshold = 0.001  # 너무 작은 이동량 제거

    def scan_callback(self, msg):
        """Scan Matching을 통해 위치 및 선속도를 계산"""
        current_time = rospy.Time.now()
        dt = (current_time - self.last_time).to_sec()
        self.last_time = current_time

        if self.prev_scan is None or dt <= 0:
            self.prev_scan = msg
            return

        # 🚀 Scan Matching 수행하여 이동량(dx, dy, dtheta) 계산
        dx, dy, dtheta = self.perform_scan_matching(self.prev_scan, msg)

        # 🚀 Noise Threshold 적용 (작은 값 제거)
        if abs(dx) < self.noise_threshold:
            dx = 0.0
        if abs(dy) < self.noise_threshold:
            dy = 0.0
        if abs(dtheta) < 0.0005:
            dtheta = 0.0

        # ✅ Kalman Filter 보정
        X = np.array([[self.x], [self.y], [self.theta]])  # 이전 상태
        Z = np.array([[self.x + dx], [self.y + dy], [self.theta + dtheta]])  # 측정값

        # 예측 단계
        X_pred = X  # 현재 상태를 그대로 사용
        P_pred = self.P + self.Q  # 예측 공분산 증가

        # 보정 단계
        K = P_pred @ np.linalg.inv(P_pred + self.R)  # Kalman Gain
        X = X_pred + K @ (Z - X_pred)  # 상태 보정
        self.P = (np.eye(3) - K) @ P_pred  # 공분산 갱신

        # 최종 값 업데이트
        self.x, self.y, self.theta = X.flatten()

        # 🚀 Quaternion 변환 (Yaw 값만 사용)
        quaternion = quaternion_from_euler(0, 0, self.theta)

        # 🚀 Odometry 메시지 생성 및 발행
        odom_msg = Odometry()
        odom_msg.header.stamp = current_time
        odom_msg.header.frame_id = "odom"
        odom_msg.child_frame_id = "base_link"
        odom_msg.pose.pose.position.x = self.x
        odom_msg.pose.pose.position.y = self.y
        odom_msg.pose.pose.orientation = Quaternion(*quaternion)

        self.odom_pub.publish(odom_msg)

        # 🚀 TF 변환 (odom → base_link)
        self.tf_broadcaster.sendTransform(
            (self.x, self.y, 0),
            quaternion,
            current_time,
            "base_link",
            "odom"
        )

        rospy.loginfo("📌 Odom 업데이트: x=%.4f, y=%.4f, theta=%.4f", self.x, self.y, self.theta)

    def perform_scan_matching(self, prev_scan, current_scan):
        prev_points = self.scan_to_pointcloud(prev_scan)
        curr_points = self.scan_to_pointcloud(current_scan)
        if prev_points is None or curr_points is None:
            return 0.0, 0.0, 0.0

        source = o3d.geometry.PointCloud()
        target = o3d.geometry.PointCloud()
        source.points = o3d.utility.Vector3dVector(curr_points)
        target.points = o3d.utility.Vector3dVector(prev_points)

        reg_p2p = o3d.pipelines.registration.registration_icp(
            source, target, 0.1, np.identity(4),
            o3d.pipelines.registration.TransformationEstimationPointToPoint()
        )

        dx, dy = reg_p2p.transformation[0, 3], reg_p2p.transformation[1, 3]
        dtheta = np.arctan2(reg_p2p.transformation[1, 0], reg_p2p.transformation[0, 0])

        return dx, dy, dtheta

    def scan_to_pointcloud(self, scan_msg):
        """ LaserScan 데이터를 Point Cloud로 변환 """
        angle_min = scan_msg.angle_min
        angle_increment = scan_msg.angle_increment
        ranges = np.array(scan_msg.ranges)

        # 🚀 NaN 및 inf 값 제거
        ranges = np.nan_to_num(ranges, nan=0.0, posinf=0.0, neginf=0.0)

        # 🚀 필터링 조건 완화 (더 많은 포인트 사용)
        valid = (ranges > scan_msg.range_min + 0.01) & (ranges < scan_msg.range_max - 0.01)
        angles = angle_min + np.arange(len(ranges)) * angle_increment

        x = ranges * np.cos(angles)
        y = ranges * np.sin(angles)

        # 유효한 데이터만 필터링
        points = np.vstack((x[valid], y[valid], np.zeros_like(x[valid]))).T  

        return points if points.shape[0] > 5 else None  

if __name__ == "__main__":
    try:
        LiDARScanMatchingOdom()
        rospy.spin()
    except rospy.ROSInterruptException:
        pass
