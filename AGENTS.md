<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deployment rules — ALWAYS follow these

Vercel deploys from `main`. After every commit, you MUST:

1. `cd C:\Users\titan\Desktop\my_website` (the real repo root, not the worktree)
2. `git merge --ff-only <worktree-branch>`
3. `git push origin main`

Never leave commits only on a worktree branch — the site will not update until they reach `main`.
