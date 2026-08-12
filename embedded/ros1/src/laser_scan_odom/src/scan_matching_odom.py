#!/usr/bin/env python3
import rospy
import numpy as np
import open3d as o3d
from nav_msgs.msg import Odometry
from sensor_msgs.msg import LaserScan
from geometry_msgs.msg import Quaternion
from tf.transformations import quaternion_from_euler

class ScanToOdom:
    def __init__(self):
        rospy.init_node('scan_to_odom', anonymous=True, log_level=rospy.DEBUG)

        # 퍼블리셔 (EKF에서 사용할 수 있도록 변환한 데이터를 퍼블리시)
        self.odom_pub = rospy.Publisher('/odom', Odometry, queue_size=10)

        # 센서 데이터 구독
        rospy.Subscriber('/scan', LaserScan, self.scan_callback)

        # 이전 Scan 데이터 저장
        self.prev_scan = None  
        self.last_time = rospy.Time.now()

        rospy.loginfo("🚀 ScanToOdom 노드가 시작되었습니다!")

    def scan_callback(self, msg):
        """ Scan 데이터를 가공하여 Odometry 메시지 형식으로 변환하여 퍼블리시 """
        current_time = rospy.Time.now()
        dt = (current_time - self.last_time).to_sec()
        self.last_time = current_time

        if self.prev_scan is None or dt <= 0:
            self.prev_scan = msg
            return

        # ICP를 수행하여 dx, dy, dtheta 계산
        dx, dy, dtheta = self.perform_scan_matching(self.prev_scan, msg)
        self.prev_scan = msg  # 이전 Scan 업데이트

        # 속도 계산
        vx = dx / dt if dt > 0 else 0.0
        vy = dy / dt if dt > 0 else 0.0
        omega = dtheta / dt if dt > 0 else 0.0

        # Odometry 메시지 생성
        odom_msg = Odometry()
        odom_msg.header.stamp = rospy.Time.now()
        odom_msg.header.frame_id = "odom"
        odom_msg.child_frame_id = "base_link"  # 로봇의 중심을 기준으로 설정

        # 위치 정보 (현재는 누적 X, EKF에서 보정 가능)
        odom_msg.pose.pose.position.x = 0.0
        odom_msg.pose.pose.position.y = 0.0

        # Orientation (Yaw 값 적용)
        quaternion = quaternion_from_euler(0, 0, dtheta)
        odom_msg.pose.pose.orientation = Quaternion(*quaternion)

        # Velocity 정보 (Scan Matching 기반으로 설정)
        odom_msg.twist.twist.linear.x = vx
        odom_msg.twist.twist.linear.y = vy
        odom_msg.twist.twist.angular.z = omega

        # 퍼블리시
        self.odom_pub.publish(odom_msg)

        rospy.loginfo(f"📌 Scan -> Odometry 변환 완료: vx={vx:.4f}, vy={vy:.4f}, omega={omega:.4f}")

    def perform_scan_matching(self, prev_scan, current_scan):
        """ Open3D의 ICP를 사용하여 Scan Matching 수행 """
        prev_points = self.scan_to_pointcloud(prev_scan)
        curr_points = self.scan_to_pointcloud(current_scan)

        if prev_points is None or curr_points is None:
            return 0.0, 0.0, 0.0  # Scan 데이터가 유효하지 않으면 0 반환

        # Open3D Point Cloud 객체 생성
        source = o3d.geometry.PointCloud()
        target = o3d.geometry.PointCloud()
        source.points = o3d.utility.Vector3dVector(curr_points)
        target.points = o3d.utility.Vector3dVector(prev_points)

        threshold = 0.05  # ICP 허용 오차
        trans_init = np.identity(4)  # 초기 변환 행렬

        # ICP 실행
        reg_p2p = o3d.pipelines.registration.registration_icp(
            source, target, threshold, trans_init,
            o3d.pipelines.registration.TransformationEstimationPointToPoint()
        )

        transformation = reg_p2p.transformation  # 최적화된 변환 행렬 (4x4)

        # 변환 행렬에서 이동량(dx, dy, dtheta) 추출
        dx, dy = transformation[0, 3], transformation[1, 3]
        dtheta = np.arctan2(transformation[1, 0], transformation[0, 0])  # 회전각 추출

        rospy.loginfo(f"📌 ICP 결과: dx={dx:.4f}, dy={dy:.4f}, dtheta={dtheta:.4f}")
        return dx, dy, dtheta
    
    def scan_to_pointcloud(self, scan_msg):
        """ LaserScan 데이터를 Point Cloud로 변환 """
        angles = np.linspace(scan_msg.angle_min, scan_msg.angle_max, len(scan_msg.ranges))
        x = np.array(scan_msg.ranges) * np.cos(angles)
        y = np.array(scan_msg.ranges) * np.sin(angles)
        points = np.vstack((x, y, np.zeros_like(x))).T

        return points if points.shape[0] > 0 else None

if __name__ == "__main__":
    try:
        scan_to_odom = ScanToOdom()
        rospy.spin()
    except rospy.ROSInterruptException:
        pass
