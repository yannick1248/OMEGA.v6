"""
Middleware LPD suisse (Loi sur la Protection des Données)
+ RGPD — Art. 25 : protection des données dès la conception
"""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import hashlib, time


class LPDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        t0 = time.monotonic()
        response = await call_next(request)
        ip = request.client.host if request.client else "unknown"
        await _log_access(
            user_id=request.headers.get("X-User-ID", "anonymous"),
            action=f"{request.method} {request.url.path}",
            ip_hash=_hash_ip(ip),
            status_code=response.status_code,
        )
        return response


def _hash_ip(ip: str) -> str:
    """Jamais stocker l'IP brute — hacher avec sel fixe par instance."""
    return hashlib.sha256(f"lpd-ip-salt:{ip}".encode()).hexdigest()[:12]


async def _log_access(user_id: str, action: str, ip_hash: str, status_code: int):
    """
    À brancher sur asyncpg :
    await db.execute(
        "INSERT INTO access_logs(user_id,action,ip_hash,status_code) VALUES($1,$2,$3,$4)",
        user_id, action, ip_hash, status_code
    )
    """
    pass
