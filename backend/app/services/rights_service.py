"""
Know Your Rights service: seeds and serves structured legal-rights content
across categories (women, employment, consumer, cyber crime, tenant,
students, workers, senior citizens), with optional translation.
"""
from typing import Optional
from app.database.collections import rights_repo
from app.services.translation_service import translate_text
from app.utils.constants import RIGHTS_CATEGORIES
from app.utils.exceptions import ValidationError, NotFoundError
from app.utils.logger import logger

DEFAULT_RIGHTS_SEED = [
    {
        "category": "women",
        "title": "Protection Against Domestic Violence",
        "description": "Women in India are protected against domestic violence under the Protection of Women from Domestic Violence Act, 2005, which covers physical, emotional, sexual and economic abuse.",
        "key_points": [
            "You can file a complaint with the police, a Protection Officer, or directly in court.",
            "You can seek a protection order, residence order, and monetary relief.",
            "Domestic violence includes physical, verbal, emotional, sexual and economic abuse.",
        ],
        "relevant_laws": ["Protection of Women from Domestic Violence Act, 2005", "IPC Section 498A"],
    },
    {
        "category": "employment",
        "title": "Right to Timely Salary Payment",
        "description": "Employees have a legal right to receive their salary on time as per the Payment of Wages Act, 1936.",
        "key_points": [
            "Wages must be paid before the 7th or 10th of the following month depending on establishment size.",
            "Unauthorized deductions from salary are restricted by law.",
            "You can approach the labour commissioner for unpaid wages.",
        ],
        "relevant_laws": ["Payment of Wages Act, 1936", "Industrial Disputes Act, 1947"],
    },
    {
        "category": "consumer",
        "title": "Right to Refund and Replacement",
        "description": "Consumers are entitled to a refund, replacement, or repair for defective goods or deficient services under the Consumer Protection Act, 2019.",
        "key_points": [
            "You can file a complaint in the Consumer Commission for defective products or services.",
            "E-commerce platforms are also liable under the Consumer Protection (E-Commerce) Rules, 2020.",
            "There is no minimum claim amount to approach a consumer forum.",
        ],
        "relevant_laws": ["Consumer Protection Act, 2019"],
    },
    {
        "category": "cyber_crime",
        "title": "Reporting Online Fraud and Harassment",
        "description": "Victims of cyber crime such as online fraud, hacking, or harassment can report incidents under the Information Technology Act, 2000.",
        "key_points": [
            "File a complaint at cybercrime.gov.in or your nearest cyber cell.",
            "Preserve screenshots, transaction IDs and chat logs as evidence.",
            "Financial fraud should also be reported to your bank immediately.",
        ],
        "relevant_laws": ["Information Technology Act, 2000", "IPC Sections 419, 420"],
    },
    {
        "category": "tenant",
        "title": "Protection from Illegal Eviction",
        "description": "Tenants cannot be evicted without due legal process under state Rent Control Acts.",
        "key_points": [
            "A landlord must provide written notice and follow due process to evict a tenant.",
            "Security deposits must be returned as per the agreed terms.",
            "Tenants can approach the Rent Controller for disputes.",
        ],
        "relevant_laws": ["State Rent Control Acts", "Model Tenancy Act, 2021"],
    },
    {
        "category": "students",
        "title": "Right Against Ragging",
        "description": "Students are protected against ragging in educational institutions under UGC regulations and state anti-ragging laws.",
        "key_points": [
            "Ragging is a criminal offence and can lead to expulsion and criminal prosecution.",
            "Every institution must have an Anti-Ragging Committee and helpline.",
            "You can call the national anti-ragging helpline 1800-180-5522.",
        ],
        "relevant_laws": ["UGC Anti-Ragging Regulations, 2009"],
    },
    {
        "category": "workers",
        "title": "Right to Minimum Wages",
        "description": "Workers, including unorganized sector workers, are entitled to minimum wages under the Minimum Wages Act, 1948.",
        "key_points": [
            "Minimum wage rates vary by state and category of employment.",
            "Employers who fail to pay minimum wages can be penalized.",
            "Complaints can be filed with the labour inspector.",
        ],
        "relevant_laws": ["Minimum Wages Act, 1948", "Code on Wages, 2019"],
    },
    {
        "category": "senior_citizens",
        "title": "Right to Maintenance from Children",
        "description": "Senior citizens have the legal right to claim maintenance from their children or relatives under the Maintenance and Welfare of Parents and Senior Citizens Act, 2007.",
        "key_points": [
            "Senior citizens can approach a Maintenance Tribunal for a maintenance order.",
            "Neglect or abandonment of senior citizens can attract penalties.",
            "Property transferred can be revoked if the recipient fails to provide maintenance.",
        ],
        "relevant_laws": ["Maintenance and Welfare of Parents and Senior Citizens Act, 2007"],
    },
]


def seed_rights_if_empty():
    existing = rights_repo.query(limit=1)
    if existing:
        return
    for entry in DEFAULT_RIGHTS_SEED:
        rights_repo.create({**entry, "language": "en"})
    logger.info(f"Seeded {len(DEFAULT_RIGHTS_SEED)} default 'Know Your Rights' entries.")


def list_categories() -> list:
    return RIGHTS_CATEGORIES


def get_rights_by_category(category: str, language: str = "en") -> list:
    if category not in RIGHTS_CATEGORIES:
        raise ValidationError(f"Unknown rights category '{category}'. Valid: {RIGHTS_CATEGORIES}")

    entries = rights_repo.query(filters=[("category", "==", category)])
    if language != "en":
        for entry in entries:
            try:
                entry["title"] = translate_text(entry["title"], language, "en")["translated_text"]
                entry["description"] = translate_text(entry["description"], language, "en")["translated_text"]
                entry["key_points"] = [
                    translate_text(point, language, "en")["translated_text"] for point in entry["key_points"]
                ]
                entry["language"] = language
            except Exception as exc:  # noqa: BLE001
                logger.warning(f"Rights translation failed for entry {entry.get('id')}: {exc}")
    return entries


def search_rights(query: str, language: str = "en") -> list:
    """Simple keyword search across title/description (Firestore has no full-text search)."""
    all_entries = rights_repo.query()
    lowered = query.lower()
    matches = [
        e for e in all_entries
        if lowered in e.get("title", "").lower() or lowered in e.get("description", "").lower()
    ]
    if language != "en":
        for entry in matches:
            try:
                entry["title"] = translate_text(entry["title"], language, "en")["translated_text"]
                entry["description"] = translate_text(entry["description"], language, "en")["translated_text"]
            except Exception:  # noqa: BLE001
                pass
    return matches
