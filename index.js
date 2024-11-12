import bunyan from 'bunyan';
// https://github.com/octokit/rest.js/issues/446
// eslint-disable-next-line import/no-unresolved
import { Octokit } from '@octokit/rest';

const { GITHUB_TOKEN, RENOVATE_PR_QUALIFIERS } = process.env;
const AUTOMERGE_MESSAGE = '**Automerge**: Enabled.';
const PR_RE =
  /\/(?<owner>[\w-.]+)\/(?<repo>[\w-.]+)\/pull\/(?<pull_number>\d+)$/;

const log = bunyan.createLogger({
  name: 'renovate-approve-job',
  serializers: {
    res: bunyan.stdSerializers.res,
  },
});

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
  log: {
    debug: log.debug.bind(log),
    info: log.info.bind(log),
    warn: log.warn.bind(log),
    error: log.error.bind(log),
  },
});

async function getPullRequests() {
  let prs = [];

  await octokit
    .paginate(octokit.rest.search.issuesAndPullRequests, {
      q: `${RENOVATE_PR_QUALIFIERS} "${AUTOMERGE_MESSAGE}" archived:false in:body review:required state:open type:pr`,
    })
    .then((items) => {
      prs = prs.concat(items);
      return;
    });

  return prs;
}

function parsePullRequestURL(url) {
  return PR_RE.exec(url).groups;
}

async function isApprovedByUser(user, owner, repo, pull_number) {
  let approved = false;

  await octokit
    .paginate(octokit.rest.pulls.listReviews, {
      owner,
      repo,
      pull_number,
    })
    .then((reviews) => {
      for (const review of reviews) {
        if (review.user.id === user.id) {
          // The latest approved or dismissed review is the one that counts
          switch (review.state) {
            case 'APPROVED':
              approved = true;
              break;
            case 'DISMISSED':
              approved = false;
              break;
          }
        }
      }
      return;
    });

  return approved;
}

function approvePullRequest(owner, repo, pull_number) {
  return octokit.rest.pulls.createReview({
    owner,
    repo,
    pull_number,
    event: 'APPROVE',
  });
}

async function main() {
  if (!GITHUB_TOKEN || !RENOVATE_PR_QUALIFIERS) {
    log.fatal(
      'At least one of GITHUB_TOKEN, RENOVATE_PR_QUALIFIERS environement variables is not set.'
    );
    process.exit(1);
  }

  let prs;
  try {
    prs = await getPullRequests();
  } catch (error) {
    log.fatal(error);
    process.exit(1);
  }

  if (prs.length) {
    let resp;
    try {
      resp = await octokit.rest.users.getAuthenticated();
    } catch (error) {
      log.fatal(error);
      process.exit(1);
    }
    const user = resp.data;

    for await (const pr of prs) {
      try {
        const { owner, repo, pull_number } = parsePullRequestURL(pr.html_url);
        if (await isApprovedByUser(user, owner, repo, pull_number)) {
          log.info(
            'PR %s/%s#%d is already approved. Skipping',
            owner,
            repo,
            pull_number
          );
          continue;
        }

        log.info('Approving PR %s/%s#%d...', owner, repo, pull_number);
        approvePullRequest(owner, repo, pull_number);
      } catch (error) {
        log.fatal(error);
      }
    }
  }
}

main();
