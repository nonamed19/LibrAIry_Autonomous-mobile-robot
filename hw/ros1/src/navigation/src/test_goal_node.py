import rospy
import math
import tf.transformations as tf
from geometry_msgs.msg import PoseStamped, Quaternion

rospy.init_node('send_goal_node')
pub = rospy.Publisher('/move_base_simple/goal', PoseStamped, queue_size=1)

x, y, w = 0.0, 0.0, 0.0

goal = PoseStamped()
goal.header.frame_id = "map"

while(1):
  x, y, w = map(float, input().split())
  if (x == -1.0 and y == -1.0 and w == -1.0):
    break
  else:
    goal.header.stamp = rospy.Time.now()
    
    goal.pose.position.x = x
    goal.pose.position.y = y
    goal.pose.orientation = Quaternion(*tf.quaternion_from_euler(0, 0, math.radians(w)))

    pub.publish(goal)
    rospy.sleep(1)
