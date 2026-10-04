#!/bin/sh
set -eu
project_dir=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
reference_path=${1:-"$project_dir/ssstwitter.com_1791105709702.mp4"}
mkdir -p "$project_dir/docs/reference/frames"
ffprobe -v quiet -print_format json -show_format -show_streams "$reference_path" > "$project_dir/docs/reference/metadata.json"
ffmpeg -hide_banner -loglevel error -y -i "$reference_path" -vf 'fps=2,scale=960:-1' "$project_dir/docs/reference/frames/%03d.jpg"
ffmpeg -hide_banner -loglevel error -y -i "$reference_path" -vf 'fps=1/2,scale=480:-1,tile=4x3' -frames:v 4 "$project_dir/docs/reference/sheet-%02d.jpg"
