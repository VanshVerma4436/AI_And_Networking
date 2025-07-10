from pydantic import BaseModel
from typing import Optional

class TrafficRecord(BaseModel):
    src_ip: str
    dst_ip: str
    protocol: str
    packet_size: int
    label: Optional[str] = None
    timestamp: Optional[str] = None
