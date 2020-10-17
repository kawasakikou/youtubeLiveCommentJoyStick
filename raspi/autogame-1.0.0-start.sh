#!/bin/bash
cd /home/pi/working/youtubeLiveCommentJoyStick
sudo yarn dev
echo $! > ${PID_FILE}
