import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { Login, User } from "src/interfaces";
import apiService from "src/service/api.service";

export const auth = {
  login: defineAction({
    input: z.object({
      email: z.string(),
      password: z.string(),
    }),
    accept: "form",
    handler: async (input): Promise<Login> => {
      console.log(input);
      return await apiService.post("/auth/login", {
        body: input,
      });
    },
  }),
  signUp: defineAction({
    input: z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    }),
    accept: "form",
    handler: async (input): Promise<User> => {
      return await apiService.post("/auth/sign-up", {
        body: input,
      });
    },
  }),
};
