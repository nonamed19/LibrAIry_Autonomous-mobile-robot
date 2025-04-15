#!/usr/bin/env python3
import rospy
import numpy as np
import open3d as o3d
from sensor_msgs.msg import Imu, LaserScan
from nav_msgs.msg import Odometry
from geometry_msgs.msg import Quaternion, PoseWithCovarianceStamped
from tf.transformations import euler_from_quaternion, quaternion_from_euler
import tf2_ros
from geometry_msgs.msg import TransformStamped

class IMUScanMatchingOdom:
    def __init__(self):
        rospy.init_node('imu_scan_matching_odom', anonymous=True)

        # Publishers
        self.odom_pub = rospy.Publisher('/odom', Odometry, queue_size=10)

        # TF Broadcaster
        self.tf_broadcaster = tf2_ros.TransformBroadcaster()

        # Subscribers
        rospy.Subscriber('/imu/data', Imu, self.imu_callback)
        rospy.Subscriber('/scan', LaserScan, self.scan_callback)
        rospy.Subscriber('/amcl_pose', PoseWithCovarianceStamped, self.amcl_callback)

        # State Variables
        self.x, self.y, self.theta = 0.0, 0.0, 0.0
        self.vx, self.vy = 0.0, 0.0
        self.imu_yaw = 0.0
        self.imu_angular_z = 0.0

        self.prev_scan = None
        self.last_time = rospy.Time.now()
        self.amcl_received = False

    def amcl_callback(self, msg):
        self.x = msg.pose.pose.position.x
        self.y = msg.pose.pose.position.y
        q = msg.pose.pose.orientation
        _, _, yaw = euler_from_quaternion([q.x, q.y, q.z, q.w])
        self.theta = yaw
        self.amcl_received = True

    def imu_callback(self, msg):
        q = msg.orientation
        _, _, imu_yaw = euler_from_quaternion([q.x, q.y, q.z, q.w])
        self.imu_yaw = imu_yaw
        self.imu_angular_z = msg.angular_velocity.z

    def scan_callback(self, msg):
        current_time = rospy.Time.now()
        dt = (current_time - self.last_time).to_sec()
        self.last_time = current_time

        if self.prev_scan is None or dt <= 0:
            self.prev_scan = msg
            return

        dx, dy = self.perform_scan_matching(self.prev_scan, msg)
        self.vx = dx / dt
        self.vy = dy / dt

        # Use IMU yaw
        self.theta = self.imu_yaw

        if not self.amcl_received:
            self.x += dx
            self.y += dy

        quaternion = quaternion_from_euler(0, 0, self.theta)

        odom_msg = Odometry()
        odom_msg.header.stamp = current_time
        odom_msg.header.frame_id = 'odom'
        odom_msg.child_frame_id = 'base_link'

        odom_msg.pose.pose.position.x = self.x
        odom_msg.pose.pose.position.y = self.y
        odom_msg.pose.pose.orientation = Quaternion(*quaternion)

        odom_msg.twist.twist.linear.x = self.vx
        odom_msg.twist.twist.linear.y = self.vy
        odom_msg.twist.twist.angular.z = self.imu_angular_z

        self.odom_pub.publish(odom_msg)

        t = TransformStamped()
        t.header.stamp = current_time
        t.header.frame_id = 'odom'
        t.child_frame_id = 'base_link'
        t.transform.translation.x = self.x
        t.transform.translation.y = self.y
        t.transform.translation.z = 0.0
        t.transform.rotation.x = quaternion[0]
        t.transform.rotation.y = quaternion[1]
        t.transform.rotation.z = quaternion[2]
        t.transform.rotation.w = quaternion[3]

        self.tf_broadcaster.sendTransform(t)

        self.prev_scan = msg

    def perform_scan_matching(self, prev_scan, current_scan):
        prev_points = self.scan_to_pointcloud(prev_scan)
        curr_points = self.scan_to_pointcloud(current_scan)

        if prev_points is None or curr_points is None:
            return 0.0, 0.0

        source = o3d.geometry.PointCloud()
        target = o3d.geometry.PointCloud()
        source.points = o3d.utility.Vector3dVector(curr_points)
        target.points = o3d.utility.Vector3dVector(prev_points)

        threshold = 0.05
        trans_init = np.identity(4)

        reg_p2p = o3d.pipelines.registration.registration_icp(
            source, target, threshold, trans_init,
            o3d.pipelines.registration.TransformationEstimationPointToPoint()
        )

        transformation = reg_p2p.transformation
        dx, dy = transformation[0, 3], transformation[1, 3]
        return dx, dy

    def scan_to_pointcloud(self, scan_msg):
        angle_min = scan_msg.angle_min
        angle_increment = scan_msg.angle_increment
        ranges = np.array(scan_msg.ranges)

        angles = angle_min + np.arange(len(ranges)) * angle_increment
        x = ranges * np.cos(angles)
        y = ranges * np.sin(angles)

        valid = (ranges > scan_msg.range_min) & (ranges < scan_msg.range_max)
        points = np.vstack((x[valid], y[valid], np.zeros_like(x[valid]))).T

        return points if points.shape[0] > 0 else None

if __name__ == '__main__':
    try:
        IMUScanMatchingOdom()
        rospy.spin()
    except rospy.ROSInterruptException:
        pass
