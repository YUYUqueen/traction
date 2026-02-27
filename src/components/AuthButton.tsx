import { signIn, signOut } from 'auth-astro/client';

interface Props {
  user?: { name?: string | null; email?: string | null; image?: string | null } | null;
}

export default function AuthButton({ user }: Props) {
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-stone-600">{user.name || user.email}</span>
        <button
          onClick={() => signOut()}
          className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => signIn('github')}
        className="text-sm font-medium border border-stone-300 text-stone-700 px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
