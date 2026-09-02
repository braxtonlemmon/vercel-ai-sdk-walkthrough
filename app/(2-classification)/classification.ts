import dotenvFlow from "dotenv-flow";
dotenvFlow.config();

import supportRequests from "./support_requests_multilanguage.json";
import { z } from "zod";
import { generateText, Output } from "ai";

async function main() {
  console.log("Asking AI to classify support requests...");

  // TODO: Define the schema for a single classified request
  const classificationSchema = z.object({
    request: z.string(),
    category: z.enum([
      "billing",
      "product_issues",
      "enterprise_sales",
      "account_issues",
      "product_feedback",
    ]),
    urgency: z
      .enum(["low", "medium", "high"])
      .describe("The probable urgency of the support request."),
    language: z
      .string()
      .describe(
        "The full name of the language the support request is in (e.g., English, Spanish, German).",
      ),
  });

  // TODO: Use generateText with Output.object() to classify the requests
  const { output: classifiedRequests } = await generateText({
    model: "openai/gpt-4.1",
    prompt: `Classify the following support requests based on the defined categories.\n\n${JSON.stringify(supportRequests)}`,
    output: Output.array({ element: classificationSchema }),
  });
  // - Model: 'openai/gpt-4.1'
  // - Prompt: Instruct to classify based on categories
  // - Output: Output.object({ schema: yourSchema, mode: 'array' })
  // - Access results via the 'output' property

  // TODO: Display the classified results
  console.log("\n--- AI Response (Structured JSON) ---");
  // Output the validated, structured array
  console.log(JSON.stringify(classifiedRequests, null, 2));
  console.log("-----------------------------------");
}

main().catch(console.error);
