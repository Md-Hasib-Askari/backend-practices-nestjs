#!/usr/bin/env node

const DEFAULT_URL = 'http://127.0.0.1:3000/';
const REQUESTS_PER_MINUTE_LIMIT = 10;
const FIRST_BURST_SIZE = 5;
const SECOND_BURST_SIZE = 5;
const FIRST_BURST_SECOND = 59;
const SECOND_BURST_OFFSET_MS = 2_000;

const baseUrl = process.argv[2] ?? DEFAULT_URL;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatTimestamp(milliseconds) {
  return `${new Date(milliseconds).toISOString()} (${milliseconds})`;
}

function getBurstSchedule(nowMs = Date.now()) {
  const minuteStart = Math.floor(nowMs / 60_000) * 60_000;
  let firstBurstAt = minuteStart + FIRST_BURST_SECOND * 1_000;

  // If we are too close to second 59, schedule the next minute to avoid jitter.
  if (firstBurstAt - nowMs < 1_200) {
    firstBurstAt += 60_000;
  }

  const secondBurstAt = firstBurstAt + SECOND_BURST_OFFSET_MS;
  return { firstBurstAt, secondBurstAt };
}

async function waitUntil(targetMs, label) {
  const waitMs = targetMs - Date.now();
  if (waitMs <= 0) {
    return;
  }

  console.log(`${label} in ${(waitMs / 1_000).toFixed(3)}s`);
  await sleep(waitMs);
}

async function sendRequest(burstLabel, index, url) {
  const sentAt = Date.now();

  try {
    const response = await fetch(url);
    const responseBody = await response.text();
    const receivedAt = Date.now();

    return {
      burstLabel,
      index,
      sentAt,
      receivedAt,
      status: response.status,
      ok: response.ok,
      limit: response.headers.get('x-ratelimit-limit'),
      remaining: response.headers.get('x-ratelimit-remaining'),
      reset: response.headers.get('x-ratelimit-reset'),
      body: responseBody,
    };
  } catch (error) {
    const receivedAt = Date.now();

    return {
      burstLabel,
      index,
      sentAt,
      receivedAt,
      status: 'ERR',
      ok: false,
      limit: null,
      remaining: null,
      reset: null,
      body: error instanceof Error ? error.message : String(error),
    };
  }
}

async function sendBurst(label, count, url) {
  const dispatchTime = Date.now();
  const dispatchSecond = new Date(dispatchTime).getSeconds();
  console.log(
    `\n[${label}] dispatching ${count} requests at second ${dispatchSecond} (${formatTimestamp(dispatchTime)})`,
  );

  const pending = Array.from({ length: count }, (_, i) =>
    sendRequest(label, i + 1, url),
  );
  const results = await Promise.all(pending);

  for (const result of results) {
    const durationMs = result.receivedAt - result.sentAt;
    console.log(
      `[${result.burstLabel}-${result.index}] sent=${formatTimestamp(result.sentAt)} status=${result.status} ` +
        `remaining=${result.remaining ?? '-'} reset=${result.reset ?? '-'} duration=${durationMs}ms`,
    );
  }

  return results;
}

function printSummary(results) {
  const totalRequests = results.length;
  const okRequests = results.filter((result) => result.ok).length;

  const firstSentAt = Math.min(...results.map((result) => result.sentAt));
  const lastSentAt = Math.max(...results.map((result) => result.sentAt));
  const measuredSpanSeconds = (lastSentAt - firstSentAt) / 1_000;

  const effectiveRpsMeasured =
    measuredSpanSeconds > 0 ? totalRequests / measuredSpanSeconds : Number.POSITIVE_INFINITY;

  const theoreticalSeconds = 2;
  const theoreticalRps = totalRequests / theoreticalSeconds;
  const configuredRps = REQUESTS_PER_MINUTE_LIMIT / 60;
  const burstVsSmoothMultiplier = theoreticalRps / configuredRps;

  console.log('\n===== Summary =====');
  console.log(`Successful responses: ${okRequests}/${totalRequests}`);
  console.log(`First request sent at: ${formatTimestamp(firstSentAt)}`);
  console.log(`Last request sent at:  ${formatTimestamp(lastSentAt)}`);
  console.log(`Measured burst span: ${measuredSpanSeconds.toFixed(3)}s`);
  console.log(
    `Measured effective throughput: ${Number.isFinite(effectiveRpsMeasured) ? effectiveRpsMeasured.toFixed(2) : 'inf'} req/s`,
  );
  console.log(
    `Exercise throughput metric: ${totalRequests} req / 2 sec = ${theoreticalRps.toFixed(2)} req/s (~"5x" burst shorthand)`,
  );
  console.log(
    `Compared to 10 req/min smooth pace (${configuredRps.toFixed(3)} req/s), burst speed is ${burstVsSmoothMultiplier.toFixed(1)}x`,
  );

  console.log('\nWhy sliding window or token bucket helps:');
  console.log(
    '- Sliding window counts requests over the rolling last 60 seconds, so pre-boundary and post-boundary bursts are evaluated together.',
  );
  console.log(
    '- Token bucket refills continuously instead of resetting at hard boundaries, which prevents instant quota refills at minute rollover.',
  );
}

async function main() {
  const { firstBurstAt, secondBurstAt } = getBurstSchedule();

  console.log(`Target URL: ${baseUrl}`);
  console.log('Configured fixed-window limit: 10 requests per minute');
  console.log(`Burst #1 target: second 59 => ${formatTimestamp(firstBurstAt)}`);
  console.log(`Burst #2 target: second 61 => ${formatTimestamp(secondBurstAt)}`);

  await waitUntil(firstBurstAt, 'Waiting for burst #1');
  const firstResults = await sendBurst('T59', FIRST_BURST_SIZE, baseUrl);

  await waitUntil(secondBurstAt, 'Waiting for burst #2');
  const secondResults = await sendBurst('T61', SECOND_BURST_SIZE, baseUrl);

  const allResults = [...firstResults, ...secondResults].sort(
    (a, b) => a.sentAt - b.sentAt,
  );

  printSummary(allResults);
}

main().catch((error) => {
  console.error('Burst demo failed:', error);
  process.exitCode = 1;
});
