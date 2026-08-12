#!/usr/bin/env python3
import rospy
from nav_msgs.msg import Odometry
from sensor_msgs.msg import Imu
from geometry_msgs.msg import Quaternion

imu_orientation = Quaternion()

def imu_callback(msg):
    global imu_orientation
    imu_orientation = msg.orientation

def publish_fake_odom():
    rospy.init_node('fake_odom_with_imu')
    odom_pub = rospy.Publisher('/odom', Odometry, queue_size=10)
    imu_sub = rospy.Subscriber('/imu/data', Imu, imu_callback)

    rate = rospy.Rate(10)
    while not rospy.is_shutdown():
        odom = Odometry()
        odom.header.stamp = rospy.Time.now()
        odom.header.frame_id = 'odom'
        odom.child_frame_id = 'base_link'

        odom.pose.pose.position.x = 0.0
        odom.pose.pose.position.y = 0.0
        odom.pose.pose.orientation = imu_orientation

        odom_pub.publish(odom)
        rate.sleep()

if __name__ == '__main__':
    publish_fake_odom()
