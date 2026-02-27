import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import type { AuthConfig } from '@auth/core';

export default {
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // TODO: Add database adapter when payment is integrated
  // For now, JWT sessions (no DB needed)
} satisfies AuthConfig;
