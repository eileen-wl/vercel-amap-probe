export default async function handler(req, res) {
  const started = Date.now();

  try {
    const response = await fetch(
      'https://restapi.amap.com/v3/ip?key=invalid_probe_key',
      {
        signal: AbortSignal.timeout(8000),
        cache: 'no-store',
      }
    );

    const text = await response.text();

    let amapResponse;

    try {
      amapResponse = JSON.parse(text);
    } catch {
      amapResponse = {
        raw: text.slice(0, 500),
      };
    }

    return res.status(200).json({
      reachable: true,
      http_status: response.status,
      elapsed_ms: Date.now() - started,
      amap_response: amapResponse,
    });
  } catch (error) {
    return res.status(504).json({
      reachable: false,
      elapsed_ms: Date.now() - started,
      error_type: error?.name || 'UnknownError',
      error: String(error?.message || error),
    });
  }
}
