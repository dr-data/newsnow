import { defineEventHandler, readBody } from "h3";
import { z } from "zod";
import { _addSource } from "../utils/source";

const bodySchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, url } = bodySchema.parse(body);

  await _addSource(name, url);

  return {
    status: "ok",
  };
});
