"""
Generic Firestore repository providing reusable CRUD operations for all
collections. Concrete services build on top of this instead of talking to
Firestore directly, keeping data-access logic in one place.
"""
import datetime
from typing import Any, Optional
from google.cloud.firestore_v1 import FieldFilter
from app.config.firebase_config import get_firestore_client
from app.utils.exceptions import DatabaseError, NotFoundError
from app.utils.logger import logger


class FirestoreRepository:
    def __init__(self, collection_name: str):
        self.collection_name = collection_name

    @property
    def db(self):
        return get_firestore_client()

    @property
    def collection(self):
        return self.db.collection(self.collection_name)

    def create(self, data: dict, doc_id: Optional[str] = None) -> dict:
        try:
            data = {**data}
            data.setdefault("created_at", datetime.datetime.utcnow().isoformat())
            data.setdefault("updated_at", datetime.datetime.utcnow().isoformat())
            if doc_id:
                ref = self.collection.document(doc_id)
                ref.set(data)
            else:
                ref = self.collection.document()
                data["id"] = ref.id
                ref.set(data)
            doc = ref.get()
            result = doc.to_dict() or {}
            result["id"] = ref.id
            return result
        except Exception as exc:  # noqa: BLE001
            logger.error(f"Firestore create failed in '{self.collection_name}': {exc}")
            raise DatabaseError(f"Failed to create document in {self.collection_name}") from exc

    def get(self, doc_id: str) -> Optional[dict]:
        try:
            doc = self.collection.document(doc_id).get()
            if not doc.exists:
                return None
            data = doc.to_dict() or {}
            data["id"] = doc.id
            return data
        except Exception as exc:  # noqa: BLE001
            logger.error(f"Firestore get failed in '{self.collection_name}': {exc}")
            raise DatabaseError(f"Failed to fetch document from {self.collection_name}") from exc

    def get_or_404(self, doc_id: str) -> dict:
        data = self.get(doc_id)
        if data is None:
            raise NotFoundError(f"Document '{doc_id}' not found in {self.collection_name}")
        return data

    def update(self, doc_id: str, data: dict) -> dict:
        try:
            data = {**data, "updated_at": datetime.datetime.utcnow().isoformat()}
            ref = self.collection.document(doc_id)
            ref.update(data)
            doc = ref.get()
            result = doc.to_dict() or {}
            result["id"] = doc.id
            return result
        except Exception as exc:  # noqa: BLE001
            logger.error(f"Firestore update failed in '{self.collection_name}': {exc}")
            raise DatabaseError(f"Failed to update document in {self.collection_name}") from exc

    def delete(self, doc_id: str) -> None:
        try:
            self.collection.document(doc_id).delete()
        except Exception as exc:  # noqa: BLE001
            logger.error(f"Firestore delete failed in '{self.collection_name}': {exc}")
            raise DatabaseError(f"Failed to delete document in {self.collection_name}") from exc

    def query(
        self,
        filters: Optional[list[tuple[str, str, Any]]] = None,
        order_by: Optional[str] = None,
        descending: bool = True,
        limit: Optional[int] = None,
    ) -> list[dict]:
        try:
            ref = self.collection
            if filters:
                for field, op, value in filters:
                    ref = ref.where(filter=FieldFilter(field, op, value))
            if order_by:
                direction = "DESCENDING" if descending else "ASCENDING"
                ref = ref.order_by(order_by, direction=direction)
            if limit:
                ref = ref.limit(limit)
            docs = ref.stream()
            results = []
            for doc in docs:
                d = doc.to_dict() or {}
                d["id"] = doc.id
                results.append(d)
            return results
        except Exception as exc:  # noqa: BLE001
            logger.error(f"Firestore query failed in '{self.collection_name}': {exc}")
            raise DatabaseError(f"Failed to query {self.collection_name}") from exc
