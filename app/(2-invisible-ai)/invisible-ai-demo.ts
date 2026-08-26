import dotenvFlow from "dotenv-flow";
dotenvFlow.config();
import { generateText, Output } from "ai";
import { z } from "zod";

// Example: Smart form filling from natural language
async function smartFormFill(userInput: string) {
  console.log("\n🤖 Invisible AI: Smart Form Filling\n");
  console.log(`User types: "${userInput}"\n`);

  // TODO: Create a Zod schema for calendar event details
  // Include fields like: eventTitle, date, time, duration, location, attendees, notes
  const eventSchema = z.object({
    eventTitle: z.string().describe("The title of the event"),
    date: z.string().describe("The date of the event"),
    time: z.string().nullable().describe("The time of the event"),
    duration: z.string().nullable().describe("The duration of the event"),
    location: z.string().nullable().describe("The location of the event"),
    attendees: z.array(z.string()).nullable().describe("List of attendees"),
    notes: z.string().nullable().describe("Additional notes or agenda items"),
  });

  // TODO: Use generateText with Output.object() to extract structured data from userInput
  // The AI should parse the natural language and fill the form fields
  const { output: eventDetails } = await generateText({
    model: "openai/gpt-5-mini",
    prompt: `Extract structured event details from the following input: ${userInput}`,
    output: Output.object({ schema: eventSchema }),
  });

  // TODO: Display the extracted data in a user-friendly way
  // Show how this saves the user time and effort
  console.log("AI fills your forms for you");
  console.log(`Event: ${eventDetails.eventTitle}`);
  console.log(`Date: ${eventDetails.date}`);
  if (eventDetails.time) console.log(`Time: ${eventDetails.time}`);
  if (eventDetails.duration) console.log(`Duration: ${eventDetails.duration}`);
  if (eventDetails.location) console.log(`Location: ${eventDetails.location}`);
  if (eventDetails.attendees && eventDetails?.attendees.length > 0)
    console.log(`Attendees: ${eventDetails.attendees?.join(", ")}`);
  if (eventDetails.notes) console.log(`Notes: ${eventDetails.notes}`);
}

// Example: Smart email categorization
async function smartEmailTriage(emailSubject: string, emailPreview: string) {
  console.log("\n📧 Invisible AI: Email Smart Triage\n");

  // TODO: Create a Zod schema for email triage
  // Include: category (urgent/action-required/fyi/spam/newsletter)
  //          priority (high/medium/low)
  //          suggestedFolder, requiresResponse, estimatedResponseTime

  const emailTriageSchema = z.object({
    category: z
      .enum(["urgent", "action-required", "fyi", "spam", "newsletter"])
      .describe("The category of the email"),
    priority: z
      .enum(["high", "medium", "low"])
      .describe("The priority level of the email"),
    suggestedFolder: z
      .string()
      .nullable()
      .describe("The suggested folder for organizing the email"),
    requiresResponse: z
      .boolean()
      .describe("Whether the email requires a response"),
    estimatedResponseTime: z
      .string()
      .nullable()
      .describe("Estimated time to respond to the email"),
  });

  // TODO: Use generateText with Output.object() to analyze and categorize the email
  const { output: triageResult } = await generateText({
    model: "openai/gpt-5-mini",
    prompt: `Analyze the following email and categorize it: Subject: ${emailSubject}, Preview: ${emailPreview}`,
    output: Output.object({ schema: emailTriageSchema }),
  });
  // TODO: Display the triage results
  // Show how email gets automatically organized
  console.log(`Email Subject: ${emailSubject}`);
  console.log(`Category: ${triageResult.category}`);
  console.log(`Priority: ${triageResult.priority}`);
  if (triageResult.suggestedFolder)
    console.log(`Suggested Folder: ${triageResult.suggestedFolder}`);
  console.log(
    `Requires Response: ${triageResult.requiresResponse ? "Yes" : "No"}`,
  );
  if (triageResult.estimatedResponseTime)
    console.log(
      `Estimated Response Time: ${triageResult.estimatedResponseTime}`,
    );
}

async function runExamples() {
  // Smart form example
  await smartFormFill(
    "Coffee with John next Tuesday at 2pm at Starbucks on Market St, discuss Q4 roadmap",
  );

  console.log("\n" + "=".repeat(60));

  // Email triage example
  await smartEmailTriage(
    "Re: Q4 Budget Approval Needed by EOD",
    "Hi team, I need your approval on the attached Q4 budget proposal by end of day today. Please review the highlighted sections...",
  );
}

runExamples().catch(console.error);
