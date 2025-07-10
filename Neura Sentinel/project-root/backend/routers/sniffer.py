from fastapi import APIRouter
from multiprocessing import Process, Value
from typing import Optional
import subprocess
import time
import os
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# === Globals ===
sniffer_process: Optional[Process] = None
ping_process: Optional[subprocess.Popen] = None
run_flag = Value('b', True)

# === Sniffer entrypoint ===
def run_sniffer():
    from services.sniffer import capture_packets, set_running_flag
    set_running_flag(run_flag)
    capture_packets(interface='Wi-Fi', batch_interval=10)

# === Start Sniffer ===
@router.post("/start-sniffer")
def start_sniffer():
    global sniffer_process, ping_process, run_flag

    if sniffer_process and sniffer_process.is_alive():
        return {
            "status": "already_running",
            "message": "Sniffer is already running."
        }

    try:
        run_flag.value = True
        sniffer_process = Process(target=run_sniffer)
        sniffer_process.start()
        logger.info("Sniffer process started.")

        # Optional ping to generate network traffic
        if os.name == "nt":  # Windows
            ping_process = subprocess.Popen(
                ["ping", "8.8.8.8", "-t"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            logger.info("Ping process started on Windows.")

        return {
            "status": "started",
            "message": "Sniffer and ping started."
        }

    except Exception as e:
        logger.error(f"Failed to start sniffer: {e}")
        return {
            "status": "error",
            "message": str(e)
        }

# === Stop Sniffer ===
@router.post("/stop-sniffer")
def stop_sniffer():
    global sniffer_process, ping_process, run_flag
    stopped = False

    try:
        if sniffer_process and sniffer_process.is_alive():
            run_flag.value = False
            sniffer_process.terminate()
            sniffer_process.join()
            sniffer_process = None
            logger.info("Sniffer process stopped.")
            stopped = True

        if ping_process and ping_process.poll() is None:
            ping_process.terminate()
            ping_process = None
            logger.info("Ping process stopped.")
            stopped = True

        return {
            "status": "stopped" if stopped else "not_running",
            "message": "Processes stopped." if stopped else "No active process."
        }

    except Exception as e:
        logger.error(f"Failed to stop sniffer: {e}")
        return {
            "status": "error",
            "message": str(e)
        }

# === Restart Sniffer ===
@router.post("/restart-sniffer")
def restart_sniffer():
    stop_sniffer()
    time.sleep(1)
    return start_sniffer()
