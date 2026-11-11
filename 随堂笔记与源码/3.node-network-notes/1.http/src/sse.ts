import http from "node:http";

const app = http.createServer((req, res) => {
  // SSE 必须的响应头
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    // 允许跨域（如需）
    "Access-Control-Allow-Origin": "*",
  });

  // 立即 flush 头部
  res.write(": connected\n\n");

  let id = 1;
  // 定时推送事件
  const timer = setInterval(() => {
    const payload = {
      time: new Date().toISOString(),
      count: id,
      msg: `hello event #${id}`,
    };
    // SSE 字段格式：event / id / data，以 \n\n 结束
    res.write(`id: ${id}\n`);
    res.write(`event: tick\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
    id += 1;
  }, 1000);

  // 客户端断开时清理定时器，避免内存泄漏
  req.on("close", () => {
    clearInterval(timer);
    res.end();
  });
});

app.listen(3000, () => {
  console.log("SSE server running at http://localhost:3000");
});



interface SSEEvent {
  id?: string;
  event?: string;
  data: string;
}

interface ReadSSEOptions {
  onOpen?: () => void;
  onEvent?: (event: SSEEvent) => void;
  onError?: (err: unknown) => void;
  signal?: AbortSignal;
}

/**
 * 前端通过 fetch 订阅并解析 SSE 流
 * - 使用 ReadableStream 按块读取，避免一次性 await res.text()
 * - 用 TextDecoder 拼接跨 chunk 的半行
 * - 按 \n\n 切分完整事件，解析 data / event / id 字段
 */
async function readSSE(
  url: string,
  options: ReadSSEOptions = {}
): Promise<void> {
  const { onOpen, onEvent, onError, signal } = options;

  const init: RequestInit = {};
  if (signal) init.signal = signal;
  const res = await fetch(url, init);

  if (!res.ok) {
    throw new Error(`SSE request failed: ${res.status} ${res.statusText}`);
  }
  if (!res.body) {
    throw new Error("SSE response has no body stream");
  }

  onOpen?.();

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      // stream: true 保证多字节字符跨 chunk 时不丢字
      buffer += decoder.decode(value, { stream: true });

      // SSE 事件以空行 (\n\n) 分隔，循环切出所有完整事件
      let sepIndex = buffer.indexOf("\n\n");
      while (sepIndex !== -1) {
        const raw = buffer.slice(0, sepIndex);
        buffer = buffer.slice(sepIndex + 2);

        const event: SSEEvent = { data: "" };
        const dataLines: string[] = [];

        for (const line of raw.split("\n")) {
          if (!line || line.startsWith(":")) continue; // 空行 / 注释
          const idx = line.indexOf(":");
          const field = idx === -1 ? line : line.slice(0, idx);
          let val = idx === -1 ? "" : line.slice(idx + 1);
          if (val.startsWith(" ")) val = val.slice(1); // 去前导空格

          if (field === "data") dataLines.push(val);
          else if (field === "event") event.event = val;
          else if (field === "id") event.id = val;
        }

        event.data = dataLines.join("\n");
        if (event.data || event.event || event.id) {
          onEvent?.(event);
        }

        sepIndex = buffer.indexOf("\n\n");
      }
    }
  } catch (err) {
    if ((err as Error).name === "AbortError") return;
    onError?.(err);
    throw err;
  } finally {
    reader.releaseLock();
  }
}