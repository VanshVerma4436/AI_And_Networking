from pydantic import BaseModel

class PacketIn(BaseModel):
    src_ip: str
    dst_ip: str
    protocol: str
    packet_size: int
