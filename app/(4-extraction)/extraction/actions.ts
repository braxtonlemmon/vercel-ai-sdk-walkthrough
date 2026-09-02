"use server";

import { z } from "zod";
import { generateText, Output } from "ai";

const appointmentDetailsSchema = z.object({
  title: z
    .string()
    .describe(
      "The title of the event. Should be the main purpose, concise, without names. Capitalize properly.",
    ),
  startTime: z
    .string()
    .nullable()
    .describe("Appointment start time in HH:MM format (e.g., 14:00 for 2pm)."),
  endTime: z
    .string()
    .nullable()
    .describe(
      "Appointment end time in HH:MM format. If not specified, assume a 1-hour duration after startTime.",
    ),
  attendees: z
    .array(z.string())
    .nullable()
    .describe(
      "List of attendee names. Extract first and last names if available.",
    ),
  location: z.string().nullable(),
  date: z
    .string()
    .describe(
      `The date of the appointment. Today's date is ${new Date().toISOString().split("T")[0]}. Use YYYY-MM-DD format.`,
    ),
});

export type AppointmentDetails = z.infer<typeof appointmentDetailsSchema>;

export const extractAppointmentDetails = async (
  input: string,
): Promise<AppointmentDetails> => {
  const { output: extractedDetails } = await generateText({
    model: "openai/gpt-5-mini",
    prompt: `Extract the appointment details from the following text: ${input}`,
    output: Output.object({ schema: appointmentDetailsSchema }),
  });
  console.log(`Extracted appointment details: ${extractedDetails}`);
  return extractedDetails;
};
