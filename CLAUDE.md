# lab-portal

Next.js 16 + Supabase app. TypeScript, Tailwind CSS v4.

## Deploy Configuration (configured by /setup-deploy)
- Platform: Vercel
- Production URL: https://lab-portal.vercel.app
- Deploy workflow: auto-deploy on push to main
- Deploy status command: HTTP health check
- Merge method: squash
- Project type: web app (Next.js SSR)
- Post-deploy health check: https://lab-portal.vercel.app

### Custom deploy hooks
- Pre-merge: npm run build
- Deploy trigger: automatic on push to main (Vercel watches GitHub)
- Deploy status: poll production URL
- Health check: https://lab-portal.vercel.app

### Environment variables (set in Vercel dashboard — never commit)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

### GitHub repo
- https://github.com/shadymantequilla-cyber/lab-portal

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
