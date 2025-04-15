#!/usr/bin/env python

import rospy
from geometry_msgs.msg import Pose2D
from nav_msgs.msg import Odometry

def pose_callback(msg):
    odom = Odometry()
    odom.header.stamp = rospy.Time.now()
    odom.header.frame_id = "odom"
    odom.child_frame_id = "base_link"
    
    odom.pose.pose.position.x = msg.x
    odom.pose.pose.position.y = msg.y
    odom.pose.pose.position.z = 0
    odom.pose.pose.orientation.x = 0
    odom.pose.pose.orientation.y = 0
    odom.pose.pose.orientation.z = 0
    odom.pose.pose.orientation.z = msg.theta


    odom.twist.twist.linear.x = 0
    odom.twist.twist.linear.y = 0
    odom.twist.twist.linear.z = 0
    
    odom.twist.twist.angular.x = 0
    odom.twist.twist.angular.y = 0
    odom.twist.twist.angular.z = 0
    pub.publish(odom)

rospy.init_node("pose2D_to_odom")
pub = rospy.Publisher("/scan_odom", Odometry, queue_size=10)
rospy.Subscriber("/pose2D", Pose2D, pose_callback)

rospy.spin()
