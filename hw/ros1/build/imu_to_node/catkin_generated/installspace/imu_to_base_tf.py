#!/usr/bin/env python3
import rospy
import tf2_ros
import geometry_msgs.msg

def publish_transform():
    rospy.init_node('dynamic_tf_broadcaster')
    br = tf2_ros.TransformBroadcaster()
    rate = rospy.Rate(10)  # 10 Hz

    while not rospy.is_shutdown():
        t = geometry_msgs.msg.TransformStamped()
        t.header.stamp = rospy.Time.now()
        t.header.frame_id = "base_link"
        t.child_frame_id = "imu_link"

        # Set translation
        t.transform.translation.x = 0.1
        t.transform.translation.y = 0.0
        t.transform.translation.z = 0.05

        # Set rotation (quaternion)
        t.transform.rotation.x = 0.0
        t.transform.rotation.y = 0.0
        t.transform.rotation.z = 0.0
        t.transform.rotation.w = 1.0

        br.sendTransform(t)
        rate.sleep()

if __name__ == "__main__":
    try:
        publish_transform()
    except rospy.ROSInterruptException:
        pass
