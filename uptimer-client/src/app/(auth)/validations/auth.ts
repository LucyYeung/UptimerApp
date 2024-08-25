import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string({ required_error: 'Username is required field' })
    .min(4, {
      message: 'Username must be at least 4 characters',
    })
    .optional(),
  email: z.string({ required_error: 'Email is required field' }).email({}),
  password: z
    .string({ required_error: 'Password is required field' })
    .min(4, {
      message: 'Password must be at least 4 characters',
    })
    .optional(),
});

export type RegisterType = z.infer<typeof registerSchema>;
