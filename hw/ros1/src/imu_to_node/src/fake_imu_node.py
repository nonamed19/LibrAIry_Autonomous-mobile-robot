import rospy
import numpy as np
from sensor_msgs.msg import Imu
from std_msgs.msg import Header
from tf.transformations import quaternion_from_euler

def generate_fake_imu_data():
    rospy.init_node('fake_imu_publisher', anonymous=True)
    imu_pub = rospy.Publisher('imu/data', Imu, queue_size=10)
    rate = rospy.Rate(100) # 100 Hz publishing rate

    while not rospy.is_shutdown():
        imu_msg = Imu()
        imu_msg.header = Header()
        imu_msg.header.stamp = rospy.Time.now()
        imu_msg.header.frame_id = "imu_link"

        # Simulated orientation (roll, pitch, yaw) with noise
        roll, pitch, yaw = np.random.normal(0, 0.01, 3) # Small random noise
        q = quaternion_from_euler(roll, pitch, yaw)
        imu_msg.orientation.x = q[0]
        imu_msg.orientation.y = q[1]
        imu_msg.orientation.z = q[2]
        imu_msg.orientation.w = q[3]

        # Simulated angular velocity
        imu_msg.angular_velocity.x = np.random.normal(0, 0.1)
        imu_msg.angular_velocity.y = np.random.normal(0, 0.1)
        imu_msg.angular_velocity.z = np.random.normal(0, 0.1)

        # Simulated linear acceleration
        imu_msg.linear_acceleration.x = np.random.normal(0, 0.2)
        imu_msg.linear_acceleration.y = np.random.normal(0, 0.2)
        imu_msg.linear_acceleration.z = np.random.normal(9.81, 0.2)

        imu_pub.publish(imu_msg)
        rate.sleep()

if __name__ == '__main__':
    try:
        generate_fake_imu_data()
    except rospy.ROSInterruptException:
        pass
