import os
from typing import List, Optional, TYPE_CHECKING, Any
from app.config.settings import settings
from app.utils.logger import logger

if TYPE_CHECKING:
    from langchain_community.vectorstores import FAISS
    from langchain_core.documents import Document

_embeddings = None
_vectorstore = None

LEGAL_SYSTEM_PROMPT = """You are an AI Legal Assistant for users in India, able to converse in \
English, Tamil, Hindi, Malayalam and Telugu.

Rules you must always follow:
1. Only answer questions related to law, legal rights, legal procedures, consumer protection, \
employment law, tenant rights, cyber crime, women's safety laws, student rights, workers' rights, \
senior citizens' rights, or closely related legal topics.
2. If the user's question is NOT related to law or legal rights, politely decline and say you can \
only help with legal questions, then suggest they rephrase with a legal angle.
3. Always give practical, easy-to-understand answers. Avoid unnecessary legal jargon; when you use \
a legal term, briefly explain it.
4. When relevant, mention applicable Indian laws, acts, or sections (e.g. Consumer Protection Act 2019, \
IT Act 2000, Industrial Disputes Act) but make clear you are not a substitute for a licensed advocate.
5. Be empathetic and clear. Structure longer answers with short paragraphs or bullet points.
6. Never provide advice that facilitates illegal activity.
"""


def _get_embeddings():
    global _embeddings
    if _embeddings is None:
        from langchain_community.embeddings import HuggingFaceEmbeddings
        logger.info("Loading embedding model (first call only)...")
        _embeddings = HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL)
    return _embeddings


def get_llm(temperature: float = 0.3):
    provider = settings.LLM_PROVIDER.lower()
    if provider == "anthropic":
        from langchain_community.chat_models import ChatAnthropic
        return ChatAnthropic(
            model="claude-sonnet-4-6",
            temperature=temperature,
            anthropic_api_key=settings.ANTHROPIC_API_KEY,
        )
    elif provider == "gemini":
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=temperature,
            google_api_key=settings.GEMINI_API_KEY,
        )
    from langchain_community.chat_models import ChatOpenAI
    return ChatOpenAI(
        model="gpt-4o-mini",
        temperature=temperature,
        openai_api_key=settings.OPENAI_API_KEY,
    )


def build_or_load_vectorstore(documents: Optional[List[Any]] = None):
    global _vectorstore
    from langchain_community.vectorstores import FAISS
    from langchain_core.documents import Document
    from langchain_text_splitters import RecursiveCharacterTextSplitter

    index_dir = settings.FAISS_INDEX_DIR
    os.makedirs(index_dir, exist_ok=True)
    embeddings = _get_embeddings()

    index_file = os.path.join(index_dir, "index.faiss")
    if os.path.exists(index_file):
        _vectorstore = FAISS.load_local(index_dir, embeddings, allow_dangerous_deserialization=True)
        return _vectorstore

    if not documents:
        documents = [Document(page_content="Indian legal system overview.", metadata={"source": "seed"})]

    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    chunks = splitter.split_documents(documents)
    _vectorstore = FAISS.from_documents(chunks, embeddings)
    _vectorstore.save_local(index_dir)
    logger.info(f"Built new FAISS index with {len(chunks)} chunks at {index_dir}")
    return _vectorstore


def add_documents_to_index(documents: List[Any]):
    global _vectorstore
    from langchain_text_splitters import RecursiveCharacterTextSplitter

    if _vectorstore is None:
        build_or_load_vectorstore(documents)
        return
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    chunks = splitter.split_documents(documents)
    _vectorstore.add_documents(chunks)
    _vectorstore.save_local(settings.FAISS_INDEX_DIR)


def similarity_search(query: str, k: int = 4) -> List[Any]:
    global _vectorstore
    if _vectorstore is None:
        build_or_load_vectorstore()
    return _vectorstore.similarity_search(query, k=k)
