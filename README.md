# renovate-approve-bot

A job to approve Pull Requests from [Renovate Bot](https://github.com/renovatebot/renovate) on GitHub. This enables you to require Pull Request approvals on your repository while also utilising Renovate's "automerge" feature.

This was designed to be used with a GitHub user account to approve PRs requiring review from a code owner.

For simpler use cases, please see [renovatebot/renovate-approve-bot](https://github.com/renovatebot/renovate-approve-bot).

[![build](https://github.com/maxbrunet/renovate-approve-job/actions/workflows/build.yml/badge.svg)](https://github.com/maxbrunet/renovate-approve-job/actions/workflows/build.yml)

## How it works

On each run, the bot will:

1. Search for all the open PRs from the Renovate Bot user which have auto-merge enabled and require review
2. Check if PRs are not already approved
3. Approve the unapproved PRs

## Usage

1. Create a GitHub account for the renovate-approve-job
2. Grant it access to your repository
3. Add it to your code owners
4. [Create a personnel access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
5. Set the environment variables:
   - `GITHUB_TOKEN`: GitHub token created in step 4
   - `RENOVATE_PR_QUALIFIERS`:
     [GitHub Search qualifiers](https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests)
     matching the Renovate pull-requests (e.g. `author:app/renovate owner:maxbrunet`)
6. Run the bot (on a schedule similarly to self-hosted Renovate Bot, e.g. as a [Cron](https://en.wikipedia.org/wiki/Cron) job):

   - With Docker:

     ```shell
     docker run --rm \
       --env GITHUB_TOKEN \
       --env RENOVATE_PR_QUALIFIERS \
       ghcr.io/maxbrunet/renovate-approve-job:latest
     ```

   - From source:

     ```shell
     pnpm install --production
     node ./index.js
     ```
