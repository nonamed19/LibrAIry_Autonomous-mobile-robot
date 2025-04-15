from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='localization',
            executable='ekf_node',
            name='ekf_filter_node',
            output='screen',
            parameters=['~/ros2_ws/src/my_robot_description/config/ekf.yaml']
        )
    ])
