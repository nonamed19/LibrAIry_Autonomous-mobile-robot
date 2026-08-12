#!/usr/bin/env python3

import rospy
import numpy as np
import tf
from sensor_msgs.msg import LaserScan
from nav_msgs.msg import Odometry
from geometry_msgs.msg import Quaternion, TransformStamped
from math import cos, sin, atan2

class RF2O_LaserOdometry:
    def __init__(self):
        rospy.init_node('rf2o_laser_odometry', anonymous=True)

        # LiDAR 데이터 구독
        self.scan_sub = rospy.Subscriber("/scan", LaserScan, self.scan_callback)

        # 오도메트리 퍼블리셔
        self.odom_pub = rospy.Publisher("/odom", Odometry, queue_size=50)

        # TF 브로드캐스터
        self.tf_broadcaster = tf.TransformBroadcaster()

        # 초기값 설정
        self.first_scan_received = False
        self.prev_scan = None

        # 로봇 위치 (x, y, yaw)
        self.robot_pose = np.array([0.0, 0.0, 0.0])

    def scan_callback(self, scan_msg):
        if not self.first_scan_received:
            self.first_scan_received = True
            self.prev_scan = scan_msg
            return

        # 1️⃣ 현재 스캔과 이전 스캔 비교하여 이동량 계산
        odom_increment = self.compute_odometry(self.prev_scan, scan_msg)

        # 2️⃣ 로봇 위치 업데이트
        self.robot_pose[0] += odom_increment[0] * cos(self.robot_pose[2]) - odom_increment[1] * sin(self.robot_pose[2])
        self.robot_pose[1] += odom_increment[0] * sin(self.robot_pose[2]) + odom_increment[1] * cos(self.robot_pose[2])
        self.robot_pose[2] += odom_increment[2]

        # 3️⃣ 오도메트리 메시지 생성 및 퍼블리시
        self.publish_odometry(scan_msg.header.stamp)

        # 4️⃣ TF 브로드캐스트
        self.broadcast_tf(scan_msg.header.stamp)

        # 5️⃣ 현재 스캔을 이전 스캔으로 저장
        self.prev_scan = scan_msg

    def compute_odometry(self, prev_scan, curr_scan):
    # """
    # RF2O 알고리즘 기반 LiDAR 오도메트리 계산
    # - prev_scan: 이전 LiDAR 스캔 데이터
    # - curr_scan: 현재 LiDAR 스캔 데이터
    # - 반환값: odom_increment = [dx, dy, dtheta] (이동량)
    # """

        ranges_prev = np.array(prev_scan.ranges)
        ranges_curr = np.array(curr_scan.ranges)

        # ==========================
        # 1️⃣ 데이터 전처리 (유효 데이터만 사용)
        # ==========================
        # Inf 또는 NaN 값 제거 (LiDAR의 최대 범위를 초과한 값은 무시)
        valid_prev = (ranges_prev < prev_scan.range_max) & (ranges_prev > prev_scan.range_min)
        valid_curr = (ranges_curr < curr_scan.range_max) & (ranges_curr > curr_scan.range_min)

        ranges_prev = ranges_prev[valid_prev]
        ranges_curr = ranges_curr[valid_curr]

        # ==========================
        # 2️⃣ Coarse-to-Fine (다중 해상도 분석)
        # ==========================
        level = 3  # 피라미드 수준 (3단계 다운샘플링)
        ranges_prev_pyramid = [ranges_prev]
        ranges_curr_pyramid = [ranges_curr]

        for _ in range(level):
            ranges_prev_pyramid.append(ranges_prev_pyramid[-1][::2])  # 2배씩 다운샘플링
            ranges_curr_pyramid.append(ranges_curr_pyramid[-1][::2])

        # ==========================
        # 3️⃣ Optical Flow 기반 변위 계산
        # ==========================
        dx, dy, dtheta = 0, 0, 0  # 초기 이동량

        for i in reversed(range(level)):  # coarse → fine 순서로 처리
            prev = ranges_prev_pyramid[i]
            curr = ranges_curr_pyramid[i]

            # 이동 벡터 계산 (Flow-based estimation)
            d = curr - prev  # 거리 변화량 계산
            angle_step = (curr_scan.angle_max - curr_scan.angle_min) / len(curr)  # 각도 분해능

            vx = np.mean(d * np.cos(angle_step * np.arange(len(curr))))  # x축 이동량
            vy = np.mean(d * np.sin(angle_step * np.arange(len(curr))))  # y축 이동량
            omega = np.mean(np.diff(d)) * 0.1  # 회전량 (Heuristic 값 적용)

            # 이동량 업데이트
            dx += vx
            dy += vy
            dtheta += omega

        # ==========================
        # 4️⃣ 최종 이동량 반환
        # ==========================
        odom_increment = np.array([dx, dy, dtheta])
        return odom_increment

    def publish_odometry(self, timestamp):
        odom = Odometry()
        odom.header.stamp = timestamp
        odom.header.frame_id = "odom"
        odom.child_frame_id = "base_link"

        # 위치 설정
        odom.pose.pose.position.x = self.robot_pose[0]
        odom.pose.pose.position.y = self.robot_pose[1]
        quat = tf.transformations.quaternion_from_euler(0, 0, self.robot_pose[2])
        odom.pose.pose.orientation = Quaternion(*quat)

        # 퍼블리시
        self.odom_pub.publish(odom)

    def broadcast_tf(self, timestamp):
        transform = TransformStamped()
        transform.header.stamp = timestamp
        transform.header.frame_id = "odom"
        transform.child_frame_id = "base_link"

        transform.transform.translation.x = self.robot_pose[0]
        transform.transform.translation.y = self.robot_pose[1]
        quat = tf.transformations.quaternion_from_euler(0, 0, self.robot_pose[2])
        transform.transform.rotation = Quaternion(*quat)

        self.tf_broadcaster.sendTransform(
            (self.robot_pose[0], self.robot_pose[1], 0),
            quat,
            timestamp,
            "base_link",
            "odom"
        )

if __name__ == "__main__":
    rf2o_node = RF2O_LaserOdometry()
    rospy.spin()
