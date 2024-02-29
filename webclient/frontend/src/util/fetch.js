async function pump(reader, controller, onChunk, onDone) {
  const { done, value } = await reader.read();
  if (done) {
    onDone && onDone();
    controller.close();
    return;
  }
  onChunk && onChunk(value);
  controller.enqueue(value);
  return pump(reader, controller, onChunk, onDone);
}

export const fetchStream = (response, onChunk, onDone) => {
  const reader = response.body?.getReader();
  return new ReadableStream({
    start: (controller) => pump(reader, controller, onChunk, onDone),
  });
};
