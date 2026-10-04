#!/usr/bin/env python3
"""Build lossless, native-size scene artwork from the supplied local reference.

Frames remain separate scene assets: no video is shipped or decoded at runtime.
A chunk is LD01, frame count (uint32 LE), byte lengths (uint32 LE), then WebP bytes.
Dependencies: numpy and opencv-python. No smoothing or palette quantization.
"""
from bisect import bisect_right
from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path
import argparse
import json
import struct
import time
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SIDE, LEFT, TOP, PITCH = 830, 545, 40, 885
ENTRIES = [4.65] + [8.75 + i * 3.75 for i in range(19)]
CAMERA = json.loads((ROOT / 'scripts/reference-camera.json').read_text())
TIMES = [point[0] for point in CAMERA]


def camera(t):
    n = max(0, bisect_right(TIMES, t) - 1)
    a, b = CAMERA[n], CAMERA[min(n + 1, len(CAMERA) - 1)]
    return a[1] if a[0] == b[0] else a[1] + (b[1] - a[1]) * min(1, max(0, (t-a[0])/(b[0]-a[0])))


def crop(frame, x):
    return cv2.warpAffine(frame, np.array([[1,0,-x],[0,1,-TOP]], np.float32), (SIDE,SIDE), flags=cv2.INTER_LINEAR)


def encode(image):
    ok, encoded = cv2.imencode('.webp', image, [cv2.IMWRITE_WEBP_QUALITY, 101])
    if not ok:
        raise RuntimeError('Lossless WebP encoding failed')
    return encoded.tobytes()


def chunk(path, images):
    with path.open('wb') as file:
        file.write(b'LD01')
        file.write(struct.pack('<I', len(images)))
        file.write(struct.pack('<' + 'I'*len(images), *map(len,images)))
        for image in images:
            file.write(image)


def build(index, source, out, fps, resume=False):
    started = time.time()
    cv2.setNumThreads(1)
    first = int(np.ceil(max(4.85, ENTRIES[index]-4.1)*fps))
    last = int(np.floor(min(81.15, ENTRIES[index]+7)*fps))
    track = {'first':first/fps,'fps':fps,'count':last-first+1,'chunkSize':fps}
    if resume and (out/f'{index:02}-base.webp').exists():
        total = 0
        complete = True
        for n in range((track['count']+fps-1)//fps):
            path = out/f'{index:02}-motion-{n:02}.frames'
            if not path.exists(): complete=False; break
            with path.open('rb') as file:
                head=file.read(8)
                count=min(fps,track['count']-n*fps)
                lengths=file.read(count*4)
                if head!=b'LD01'+struct.pack('<I',count) or len(lengths)!=count*4:
                    complete=False; break
                size=8+count*4+sum(struct.unpack('<'+'I'*count,lengths))
                if size!=path.stat().st_size: complete=False; break
                total+=size
        if complete: return index,track,total,0
    cap = cv2.VideoCapture(source)
    anchor = 6 + index * 3.75
    cap.set(cv2.CAP_PROP_POS_MSEC, anchor*1000)
    ok, frame = cap.read()
    if not ok: raise RuntimeError(f'Missing preview {index}')
    (out/f'{index:02}-base.webp').write_bytes(encode(crop(frame, LEFT)))
    first = int(np.ceil(max(4.85, ENTRIES[index]-4.1)*fps))
    last = int(np.floor(min(81.15, ENTRIES[index]+7)*fps))
    cap.set(cv2.CAP_PROP_POS_MSEC, first/fps*1000)
    source_fps = cap.get(cv2.CAP_PROP_FPS)
    source_frame = int(round(first/fps*source_fps))
    count, images, total = 0, [], 0
    while count <= last-first:
        ok, frame = cap.read()
        if not ok: raise RuntimeError(f'Missing frame in scene {index}')
        t = source_frame/source_fps
        source_frame += 1
        if t + .51/source_fps < (first+count)/fps: continue
        x = LEFT + (index-camera(t))*PITCH
        images.append(encode(crop(frame,x)))
        count += 1
        if len(images) == fps or count == last-first+1:
            path = out/f'{index:02}-motion-{(count-1)//fps:02}.frames'
            chunk(path,images)
            total += path.stat().st_size
            images = []
    cap.release()
    return index, {'first': first/fps, 'fps': fps, 'count':count, 'chunkSize':fps}, total, round(time.time()-started,1)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', default=str(ROOT/'ssstwitter.com_1791105709702.mp4'))
    parser.add_argument('--workers', type=int, default=3)
    parser.add_argument('--fps', type=int, choices=[15,30,60], default=30)
    parser.add_argument('--resume', action='store_true')
    args = parser.parse_args()
    out = ROOT/'public/art'
    out.mkdir(parents=True, exist_ok=True)
    scenes = [None]*20
    with ProcessPoolExecutor(max_workers=args.workers) as pool:
        jobs = [pool.submit(build,i,args.source,out,args.fps,args.resume) for i in range(20)]
        for job in as_completed(jobs):
            i, track, size, elapsed = job.result()
            scenes[i] = track
            print('Scene',i,'frames',track['count'],'bytes',size,'seconds',elapsed,flush=True)
    (out/'manifest.json').write_text(json.dumps({'version':1,'width':SIDE,'fps':args.fps,'camera':CAMERA,'scenes':scenes},separators=(',',':')))

if __name__ == '__main__': main()
