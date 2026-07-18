import os
from typing import List, Optional, TYPE_CHECKING, Any
from openai import OpenAI
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
        from sentence_transformers import SentenceTransformer
        logger.info("Loading embedding model (first call only)...")
        _model = SentenceTransformer(settings.EMBEDDING_MODEL)
        class _EmbeddingWrapper:
            def embed_documents(self, texts):
                return _model.encode(texts, show_progress_bar=False).tolist()
            def embed_query(self, text):
                return _model.encode(text, show_progress_bar=False).tolist()
            def __call__(self, text):
                return self.embed_query(text)
        _embeddings = _EmbeddingWrapper()
    return _embeddings


def _format_messages(messages: list) -> str:
    texts = []
    for m in messages:
        role = getattr(m, "type", "human").capitalize()
        texts.append(f"{role}: {m.content}")
    return "\n".join(texts)


class _LLMWrapper:
    def __init__(self, provider: str, temperature: float):
        self.provider = provider
        self.temperature = temperature

    def invoke(self, messages: list):
        prompt = _format_messages(messages)
        provider = self.provider

        if provider == "groq":
            from groq import Groq
            client = Groq(api_key=settings.GROQ_API_KEY)
            resp = client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=self.temperature,
                timeout=settings.LLM_TIMEOUT,
            )
            return _LLMResponse(resp.choices[0].message.content)

        if provider == "gemini":
            from google import genai
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            resp = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config={"temperature": self.temperature},
            )
            return _LLMResponse(resp.text)

        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=self.temperature,
            timeout=settings.LLM_TIMEOUT,
        )
        return _LLMResponse(resp.choices[0].message.content)


class _LLMResponse:
    def __init__(self, content: str):
        self.content = content


def get_llm(temperature: float = 0.3):
    return _LLMWrapper(settings.LLM_PROVIDER.lower(), temperature)


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
