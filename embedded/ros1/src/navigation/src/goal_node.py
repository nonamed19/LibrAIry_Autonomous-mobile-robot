import rospy
from geometry_msgs.msg import PoseStamped

GOAL_FRAME = "map"
X_ADDRESS = "/x_topic"
Y_ADDRESS = "/y_topic"
W_ADDRESS = "/w_topic"

class GOAL_NODE:

    def __init__(self):
        self.pub = rospy.Publisher('/move_base_simple/goal', PoseStamped, queue_size=1)
        self.goal = PoseStamped()
        self.goal.header.frame_id = GOAL_FRAME

    def get_single_data(self, address):
        # Replace this with actual data retrieval logic from the server
        num = 0.0
        rospy.loginfo(f"Getting data from {address}: {num}")
        return num

    def get_xyw_data(self):
        self.goal.header.stamp = rospy.Time.now()

        self.goal.pose.position.x = self.get_single_data(X_ADDRESS)
        self.goal.pose.position.y = self.get_single_data(Y_ADDRESS)
        self.goal.pose.orientation.w = self.get_single_data(W_ADDRESS)

    def send_goal_data(self):
        self.get_xyw_data()
        self.pub.publish(self.goal)
        rospy.loginfo(f"Published Goal: x={self.goal.pose.position.x}, y={self.goal.pose.position.y}, w={self.goal.pose.orientation.w}")

if __name__ == "__main__":
    rospy.init_node('send_goal_node')
    goal_node = GOAL_NODE()

    rate = rospy.Rate(1)  # Adjust the rate as needed
    while not rospy.is_shutdown():
        goal_node.send_goal_data()
        rate.sleep()
