# textstats

Word and character statistics for text, in TypeScript.

Checks (run in the `app` service of `compose.yml`):

    docker compose run --rm app npm ci
    docker compose run --rm app sh -c "npm test && npm run lint && npm run typecheck"

Report for a file (top words default to 3):

    npm run report -- FILE [--top N]
