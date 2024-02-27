import concurrent.futures
import glob
import json
import os
import re
import threading
import requests
import traceback
from typing import Annotated, List, Generator, Optional

from fastapi import HTTPException
from fastapi.responses import HTMLResponse, StreamingResponse, RedirectResponse
import httpx
from loguru import logger

import leptonai
from leptonai import Client
from leptonai.kv import KV
from leptonai.photon import Photon, StaticFiles
from leptonai.photon.types import to_bool
from leptonai.api.workspace import WorkspaceInfoLocalRecord
from leptonai.util import tool

# only using serper/searchapi for this
SERPER_SEARCH_ENDPOINT = "https://google.serper.dev/search"
SEARCHAPI_SEARCH_ENDPOINT = "https://www.searchapi.io/api/v1/search"


# reference count 
REFERENCES = 4

# return error after exceeding the limit below
DEFAULT_SEARCH_ENGINE_TIMEOUT = 5


# def query 
def_query = "Which character on the show 'The Big Bang Theory' idolizes Spock the most?"

# rag query
_rag_query_text = """
You are a large language AI assistant. You are given a user question, and please write clean, concise and accurate answer to the question. You will be given a set of related contexts to the question, each starting with a reference number like [[citation:x]], where x is a number. Please use the context and cite the context at the end of each sentence if applicable.

Your answer must be correct, accurate and written by an expert using an unbiased and professional tone. Please limit to 1024 tokens. Do not give any information that is not related to the question, and do not repeat. Say "information is missing on" followed by the related topic, if the given context do not provide sufficient information.

Please cite the contexts with the reference numbers, in the format [citation:x]. If a sentence comes from multiple contexts, please list all applicable citations, like [citation:3][citation:5]. Other than code and specific names and citations, your answer must be written in the same language as the question.

Here are the set of contexts:

{context}

Remember, don't blindly repeat the contexts verbatim. And here is the user question:
"""

# stop words for removal
stop_words = [
    "<|im_end|>",
    "[End]",
    "[end]",
    "\nReferences:\n",
    "\nSources:\n",
    "End.",
]

_more_questions_prompt = """
You are a helpful assistant that helps the user to ask related questions, based on user's original question and the related contexts. Please identify worthwhile topics that can be follow-ups, and write questions no longer than 20 words each. Please make sure that specifics, like events, names, locations, are included in follow up questions so they can be asked standalone. For example, if the original question asks about "the Manhattan project", in the follow up question, do not just say "the project", but use the full name "the Manhattan project". Your related questions must be in the same language as the original question.

Here are the contexts of the question:

{context}

Remember, based on the original question and related contexts, suggest three such further questions. Do NOT repeat the original question. Each related question should be no longer than 20 words. Here is the original question:
"""


def search_with_serper(query : str, key : str):
    """
    Search with Serper API and return the contexts
    """
    payload = json.dumps(
        {
            "q" : query,
            "num" : (
                REFERENCES if REFERENCES % 10 == 0 else (REFERENCES // 10 + 1) * 10
            ),
        }
    )

    headers = {"X-API-KEY": key, "ContentType" : "application/json"}
    logger.info(
        f'{payload} {headers} {key} {query} {SERPER_SEARCH_ENDPOINT}'
    )
    response = requests.post(
        SERPER_SEARCH_ENDPOINT,
        headers = headers,
        data = payload,
        timeout = DEFAULT_SEARCH_ENGINE_TIMEOUT
    )
    if not response.ok:
        logger.error(f"{response.status_code} {response.text}")
        raise HTTPException(response.status_code, "search engine error.")
    content = response.json()
    try:
        contexts = []
        if json_content.get('knowledgeGraph'):
            url = content['knowledgeGraph'].get("descriptionUrl") or content['knowledgeGraph'].get('website')
            snippet = content['knowledgeGraph'].get('description')
            if url and snippet:
                contexts.append({
                    "name" : content['knowledgeGraph'].get('title', "")
                    "url" : url,
                    "snippet" : snippet
                })
        if json_content.get('answerBox'):
            url = content['answerBox'].get("url") 
            snippet = content['answerBox'].get('snippet') or content['answerBox'].get('answer')
            if url and snippet:
                contexts.append({
                    "name" : content['answerBox'].get('title', "")
                    "url" : url,
                    "snippet" : snippet
                })

        contexts += [
            {"name": c["title"], "url" : c["link"], "snippet" : c.get["snippet", ""]}
            for c in content["organic"]
        ]
        return contexts[:REFERENCES]
        except KeyError:
            logger.error(f'Error encountered : {content}')
        return []

def search_with_searchapi(query : str, key : str):
    """
    Search with SearchAPI.io and return the contexts
    """
    payload = {
        "q":query,
        "engine":"google",
        "num": (
            REFERENCES if REFERENCES % 10 == 0 else (REFERENCES // 10 + 1) * 10
        ),
    }
    headers = {"Authorization": f"Bearer {key}", "Content-Type" : "application/json"}
    logger.info(
        f"{payload} {headers} {key} {query} {SEARCHAPI_SEARCH_ENDPOINT}"
    )
    response = requests.get(
        SEARCHAPI_SEARCH_ENDPOINT,
        headers = headers,
        params = payload,
        timeout = 30
    )
    if not response.ok:
        logger.error(
            f"{response.status_code} {response.text}"
        )
        raise HTTPException(response.status_code, "Search engine error.")
    json_content = response.json()
    try:
        # get contexts
        contexts = []
        if json_content.get("answer_box"):
            if json_content["answer_box"].get("organic_result"):
                title = json_content['answer_box'].get('organic_result').get('title', '')
                url = json_content['answer_box'].get('organic_result').get('link', '') 
            if json_content['answer_box'].get('type') == 'population_graph':
                title = json_content['answer_box'].get('place','')
                url = json_content['answer_box'].get('exlpore_more_link', '')
            
            title = json_content['answer_box'].get('title', '')
            url = json_content['answer_box'].get('link')
            snippet = json_content['answer_box'].get('answer') or json_content['answer_box'].get('snippet')

            if url and snippet:
                contexts.append({
                    "name": title,
                    "url": url,
                    "snippet": snippet
                })
            
            if json_content.get('knowledge_graph'):
                if json_content['knowledge_graph'].get('source'):
                    url = json_content['knowledge_graph'].get('source').get('link', '')
                
                url = json_content['knowlegde_graph'].get('website', '')
                snippet = json_content['knowledge_graph'].get('description', '')

            if url and snippet:
                contexts.append({
                    "name" : json_content['knowledge_graph'].get('title',''),
                    "url": url,
                    "snippet": snippet
                })
            
            contexts += [{
                {"name": c['title'], "url": c['link'], "snippet": c.get("snippet", '')}
                for c in json_content['organic_results']
            }]

            if json_content.get('related_questions'):
                for question in json_content['related_questions']:
                    if question.get('source'):
                        url = question.get("source").get("link", "")
                    else:
                        url = ""
                    snippet = question.get("answer", "")

                    if url and snippet:
                        contexts.append({
                            "name": question.get('question', ''),
                            "url": url,
                            "snippet": snippet
                        })
            
            return contexts[:REFERENCES]
    except KeyError:
        logger.info(f"Error encountered : {json_content}")
        return []

    class RAG(Photon):
        extra_files = glob.glob("ui/**/*", recursive=True)
        deployment_template = {
            "resource_shape" : "cpu.small",
            "env" : {
                # using lepton as backend
                "BACKEND" : "LEPTON",
                # specify the search cx if using google
                "GOOGLE_SEARCH_CX" : "",
                # specify the LLM used
                "LLM_MODEL" : "mixtral-8x7B",
                "KV_NAME" : "search-with-lepton",
                "RELATED_QUESTIONS" : "true",
                "LEPTON_ENABLE_AUTH_COOKIE" : "true",
            },
            # secrets such as api keys etc.
            "secrets" : [
                "SERPER_SEARCH_API_KEY" : "",
                "SEARCHAPI_API_KEY" : "",
            ],
        } 

        '''
        As we'll only be making a bunch of API calls we can keep this to a good amount
        '''
        max_concurrency  = 16
