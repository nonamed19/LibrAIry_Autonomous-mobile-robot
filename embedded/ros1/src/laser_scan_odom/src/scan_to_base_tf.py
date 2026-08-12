#!/usr/bin/env python
import rospy
import tf2_ros
import geometry_msgs.msg

def publish_laser_transform():
    rospy.init_node('laser_tf_broadcaster')
    br = tf2_ros.TransformBroadcaster()
    rate = rospy.Rate(100)  # 100 Hz (더 부드러운 동작)

    while not rospy.is_shutdown():
        t = geometry_msgs.msg.TransformStamped()
        t.header.stamp = rospy.Time.now()
        t.header.frame_id = "base_link"
        t.child_frame_id = "laser"

        # Set translation (laser의 위치)
        t.transform.translation.x = 0.2
        t.transform.translation.y = 0.0
        t.transform.translation.z = 0.1

        # Set rotation (레이저가 항상 정면을 보도록 설정)
        t.transform.rotation.x = 0.0
        t.transform.rotation.y = 0.0
        t.transform.rotation.z = 0.0
        t.transform.rotation.w = 1.0

        br.sendTransform(t)
        rate.sleep()

if __name__ == "__main__":
    try:
        publish_laser_transform()
    except rospy.ROSInterruptException:
        pass
