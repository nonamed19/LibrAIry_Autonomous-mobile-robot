cmake_minimum_required(VERSION 3.0.2)
project(l298n_motor_control)

find_package(catkin REQUIRED COMPONENTS
  roscpp
  rospy
  std_msgs
)

catkin_package()

include_directories(
  include
  ${catkin_INCLUDE_DIRS}
)


catkin_install_python(PROGRAMS
  src/l298n_motor_node.py
  DESTINATION ${CATKIN_PACKAGE_BIN_DESTINATION}
)

