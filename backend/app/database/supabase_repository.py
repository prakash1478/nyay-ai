"""
Supabase-backed repository implementation.

This keeps the existing service-layer contract intact while moving the
persistent data store from Firestore to Supabase Postgres.
"""
from __future__ import annotations

import datetime
from typing import Any, Optional

import requests

from app.config.settings import settings
from app.utils.exceptions import DatabaseError, NotFoundError
from app.utils.logger import logger


class SupabaseRepository:
    def __init__(self, collection_name: str):
        self.collection_name = collection_name
        self.base_url = settings.SUPABASE_URL.rstrip("/") if settings.SUPABASE_URL else ""
        self.service_key = settings.SUPABASE_SERVICE_ROLE_KEY
        self.headers = {
            "apikey": self.service_key,
            "Authorization": f"Bearer {self.service_key}",
            "Content-Type": "application/json",
        }

    def _require_config(self) -> None:
        if not self.base_url or not self.service_key:
            raise DatabaseError(
                "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file."
            )

    def _table_url(self) -> str:
        self._require_config()
        return f"{self.base_url}/rest/v1/{self.collection_name}"

    def _normalize_operators(self, op: str) -> str:
        mapping = {
            "==": "eq",
            ">": "gt",
            ">=": "gte",
            "<": "lt",
            "<=": "lte",
            "!=": "neq",
        }
        return mapping.get(op, op)

    def _build_query_params(
        self,
        filters: Optional[list[tuple[str, str, Any]]] = None,
        order_by: Optional[str] = None,
        descending: bool = True,
        limit: Optional[int] = None,
    ) -> list[tuple[str, str]]:
        params: list[tuple[str, str]] = []
        if filters:
            for field, op, value in filters:
                operator = self._normalize_operators(op)
                params.append((field, f"{operator}.{value}"))
        if order_by:
            direction = "desc" if descending else "asc"
            params.append(("order", f"{order_by}.{direction}"))
        if limit is not None:
            params.append(("limit", str(limit)))
        return params

    def _extract_first_result(self, payload: Any) -> Optional[dict]:
        if payload is None:
            return None
        if isinstance(payload, list):
            if not payload:
                return None
            return payload[0]
        return payload

    def create(self, data: dict, doc_id: Optional[str] = None) -> dict:
        try:
            payload = {**data}
            payload.setdefault("created_at", datetime.datetime.utcnow().isoformat())
            payload.setdefault("updated_at", datetime.datetime.utcnow().isoformat())
            if doc_id:
                payload["id"] = doc_id
            response = requests.post(self._table_url(), headers=self.headers, json=payload, timeout=20)
            response.raise_for_status()
            result = self._extract_first_result(response.json()) or {}
            result["id"] = result.get("id", payload.get("id", doc_id))
            return result
        except requests.HTTPError as exc:
            logger.error(f"Supabase create failed in '{self.collection_name}': {exc}")
            raise DatabaseError(f"Failed to create document in {self.collection_name}") from exc
        except Exception as exc:  # noqa: BLE001
            logger.error(f"Supabase create failed in '{self.collection_name}': {exc}")
            raise DatabaseError(f"Failed to create document in {self.collection_name}") from exc

    def get(self, doc_id: str) -> Optional[dict]:
        try:
            params = [("id", f"eq.{doc_id}")]
            response = requests.get(self._table_url(), headers=self.headers, params=params, timeout=20)
            response.raise_for_status()
            result = self._extract_first_result(response.json())
            if result is None:
                return None
            result["id"] = result.get("id", doc_id)
            return result
        except requests.HTTPError as exc:
            logger.error(f"Supabase get failed in '{self.collection_name}': {exc}")
            raise DatabaseError(f"Failed to fetch document from {self.collection_name}") from exc
        except Exception as exc:  # noqa: BLE001
            logger.error(f"Supabase get failed in '{self.collection_name}': {exc}")
            raise DatabaseError(f"Failed to fetch document from {self.collection_name}") from exc

    def get_or_404(self, doc_id: str) -> dict:
        data = self.get(doc_id)
        if data is None:
            raise NotFoundError(f"Document '{doc_id}' not found in {self.collection_name}")
        return data

    def update(self, doc_id: str, data: dict) -> dict:
        try:
            payload = {**data, "updated_at": datetime.datetime.utcnow().isoformat()}
            url = self._table_url()
            params = [("id", f"eq.{doc_id}")]
            response = requests.patch(url, headers=self.headers, params=params, json=payload, timeout=20)
            response.raise_for_status()
            result = self._extract_first_result(response.json()) or {}
            result["id"] = result.get("id", doc_id)
            return result
        except requests.HTTPError as exc:
            logger.error(f"Supabase update failed in '{self.collection_name}': {exc}")
            raise DatabaseError(f"Failed to update document in {self.collection_name}") from exc
        except Exception as exc:  # noqa: BLE001
            logger.error(f"Supabase update failed in '{self.collection_name}': {exc}")
            raise DatabaseError(f"Failed to update document in {self.collection_name}") from exc

    def delete(self, doc_id: str) -> None:
        try:
            params = [("id", f"eq.{doc_id}")]
            response = requests.delete(self._table_url(), headers=self.headers, params=params, timeout=20)
            response.raise_for_status()
        except requests.HTTPError as exc:
            logger.error(f"Supabase delete failed in '{self.collection_name}': {exc}")
            raise DatabaseError(f"Failed to delete document from {self.collection_name}") from exc
        except Exception as exc:  # noqa: BLE001
            logger.error(f"Supabase delete failed in '{self.collection_name}': {exc}")
            raise DatabaseError(f"Failed to delete document from {self.collection_name}") from exc

    def query(
        self,
        filters: Optional[list[tuple[str, str, Any]]] = None,
        order_by: Optional[str] = None,
        descending: bool = True,
        limit: Optional[int] = None,
    ) -> list[dict]:
        try:
            params = self._build_query_params(filters=filters, order_by=order_by, descending=descending, limit=limit)
            response = requests.get(self._table_url(), headers=self.headers, params=params, timeout=20)
            response.raise_for_status()
            rows = response.json() or []
            if not isinstance(rows, list):
                rows = [rows]
            results: list[dict] = []
            for row in rows:
                if isinstance(row, dict):
                    row = {**row}
                    row.setdefault("id", row.get("id"))
                    results.append(row)
            return results
        except requests.HTTPError as exc:
            logger.error(f"Supabase query failed in '{self.collection_name}': {exc}")
            raise DatabaseError(f"Failed to query {self.collection_name}") from exc
        except Exception as exc:  # noqa: BLE001
            logger.error(f"Supabase query failed in '{self.collection_name}': {exc}")
            raise DatabaseError(f"Failed to query {self.collection_name}") from exc
