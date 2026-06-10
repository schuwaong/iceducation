from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass
from typing import Any

import requests


DEFAULT_BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
DEFAULT_MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-flash")


class DeepSeekError(RuntimeError):
    pass


def parse_json_object(text: str) -> dict[str, Any]:
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, flags=re.DOTALL)
        if not match:
            raise DeepSeekError(f"DeepSeek did not return JSON: {text[:500]}")
        try:
            parsed = json.loads(match.group(0))
        except json.JSONDecodeError as exc:
            raise DeepSeekError(f"DeepSeek returned invalid JSON: {text[:500]}") from exc
    if not isinstance(parsed, dict):
        raise DeepSeekError("DeepSeek JSON response was not an object.")
    return parsed


def _compact_error_message(response_text: str) -> str:
    text = (response_text or "").strip()
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            error_obj = parsed.get("error")
            if isinstance(error_obj, dict):
                text = str(error_obj.get("message") or text)
    except json.JSONDecodeError:
        pass
    compact = " ".join(text.split())
    return compact[:317].rstrip() + "..." if len(compact) > 320 else compact


@dataclass
class DeepSeekClient:
    api_key: str
    base_url: str = DEFAULT_BASE_URL
    model: str = DEFAULT_MODEL
    timeout_seconds: int = 90

    def __post_init__(self) -> None:
        self.base_url = self.base_url.rstrip("/")
        if not self.api_key:
            raise DeepSeekError("Missing DeepSeek API key. Set DEEPSEEK_API_KEY.")

    def chat_json(self, messages: list[dict[str, Any]], *, temperature: float = 0.0) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "response_format": {"type": "json_object"},
        }
        response = requests.post(
            f"{self.base_url}/chat/completions",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=self.timeout_seconds,
        )
        if response.status_code >= 400:
            raise DeepSeekError(f"DeepSeek API error {response.status_code}: {_compact_error_message(response.text)}")
        try:
            content = response.json()["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError, json.JSONDecodeError) as exc:
            raise DeepSeekError(f"Unexpected DeepSeek response: {response.text[:1000]}") from exc
        return parse_json_object(content)
