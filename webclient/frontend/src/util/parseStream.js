import { fetchStream } from "./fetch";

const LLM_SPLIT = "__LLM_RESPONSE__";
const RELATED_SPLIT = "__RELATED_QUESTIONS__";

export const parseStreaming = async (
  controller ,
  query,
  search_uuid,
  onSources,
  onMarkdown,
  onRelates,
  onError ,
) => {
  const decoder = new TextDecoder();
  let uint8Array = new Uint8Array();
  let chunks = "";
  let sourcesEmitted = false;
  const response = await fetch('/query',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    signal : controller?.signal,
    body:JSON.stringify({
      query:query,
      search_uuid:search_uuid
    })
  })
  if (!response.ok){
    console.log(response)
    onError?.(response.status);
    return;
  }


  // if (response.status !== 200) {
  //   console.log(response)
  //   onError?.(response.status);
  //   return;
  // }

  const markdownParse = (text) => {
    onMarkdown(
      text
        .replace(/\[\[([cC])itation/g, "[citation")
        .replace(/[cC]itation:(\d+)]]/g, "citation:$1]")
        .replace(/\[\[([cC]itation:\d+)]](?!])/g, `[$1]`)
        .replace(/\[[cC]itation:(\d+)]/g, "[citation]($1)"),
    );
  };
  fetchStream(
    response,
    (chunk) => {
      uint8Array = new Uint8Array([...uint8Array, ...chunk]);
      chunks = decoder.decode(uint8Array, { stream: true });
      
      if (chunks.includes(LLM_SPLIT)) {
        const [sources, rest] = chunks.split(LLM_SPLIT);

        if (!sourcesEmitted) {
          try {
            const obj  = JSON.parse(sources);
            onSources(obj);
          } catch (e) {
            onSources([]);
          }
        }
        sourcesEmitted = true;
        if (rest.includes(RELATED_SPLIT)) {
          const [md] = rest.split(RELATED_SPLIT);
          markdownParse(md);
        } else {
          markdownParse(rest);
        }
      }
    },
    () => {
      const [_, relates] = chunks.split(RELATED_SPLIT);
      try {
        onRelates(JSON.parse(relates));
      } catch (e) {
        onRelates([]);
      }
    },
  );
};