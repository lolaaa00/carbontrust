#!/usr/bin/env node
/**
 * Fetches the deployed contract's real schema via getContractSchema and checks
 * every functionName/arity used in src/lib/contract/{reads,writes}.ts against it.
 * Run before submitting — this is the guard the spec calls out as the single
 * thing that would have prevented a "frontend misaligned with contract" rejection.
 *
 * Usage: node scripts/verify-schema.mjs
 * Requires NEXT_PUBLIC_CONTRACT_ADDRESS (reads .env.local if present).
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

// Every functionName the frontend calls, with the arg count it always passes.
// Keep this in sync with src/lib/contract/reads.ts and src/lib/contract/writes.ts.
const EXPECTED_CALLS = [
  { functionName: "create_project", argCount: 9, kind: "write" },
  { functionName: "add_evidence", argCount: 8, kind: "write" },
  { functionName: "add_monitoring_record", argCount: 6, kind: "write" },
  { functionName: "request_review", argCount: 1, kind: "write" },
  { functionName: "get_project", argCount: 1, kind: "read" },
  { functionName: "get_project_evidence", argCount: 1, kind: "read" },
  { functionName: "get_project_assessment", argCount: 1, kind: "read" },
  { functionName: "get_assessment_history", argCount: 1, kind: "read" },
  { functionName: "get_monitoring_records", argCount: 1, kind: "read" },
  { functionName: "get_project_count", argCount: 0, kind: "read" },
  { functionName: "get_projects_by_owner", argCount: 1, kind: "read" },
];

async function main() {
  loadEnvLocal();

  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!address) {
    console.error("NEXT_PUBLIC_CONTRACT_ADDRESS is not set. Set it in .env.local or the environment.");
    process.exit(1);
  }

  const client = createClient({ chain: studionet });
  const schema = await client.getContractSchema(address);

  let failed = false;

  for (const expected of EXPECTED_CALLS) {
    const method = schema.methods[expected.functionName];
    if (!method) {
      console.error(`MISSING on-chain: ${expected.functionName} (used in frontend, not found in deployed contract)`);
      failed = true;
      continue;
    }

    const actualArity = method.params.length;
    if (actualArity !== expected.argCount) {
      console.error(
        `ARITY MISMATCH: ${expected.functionName} — frontend passes ${expected.argCount} args, contract expects ${actualArity}`,
      );
      failed = true;
      continue;
    }

    if (expected.kind === "read" && !method.readonly) {
      console.error(`KIND MISMATCH: ${expected.functionName} is called as a read but the contract marks it non-readonly`);
      failed = true;
      continue;
    }
    if (expected.kind === "write" && method.readonly) {
      console.error(`KIND MISMATCH: ${expected.functionName} is called as a write but the contract marks it readonly`);
      failed = true;
      continue;
    }

    console.log(`OK: ${expected.functionName} (${actualArity} args, ${method.readonly ? "read" : "write"})`);
  }

  const onChainOnly = Object.keys(schema.methods).filter(
    (name) => !EXPECTED_CALLS.some((e) => e.functionName === name),
  );
  if (onChainOnly.length > 0) {
    console.warn(`Note: contract exposes methods the frontend never calls: ${onChainOnly.join(", ")}`);
  }

  if (failed) {
    console.error("\nSchema verification FAILED. Fix src/lib/contract/{reads,writes}.ts before submitting.");
    process.exit(1);
  }

  console.log("\nSchema verification passed: every frontend call matches the deployed contract.");
}

main().catch((err) => {
  console.error("Schema verification errored:", err);
  process.exit(1);
});
