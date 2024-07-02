import type { NodeRenderer } from "@myst-theme/providers";
import { request } from "@octokit/request";
import { useEffect, useState } from "react";

type PRdata = {
  owner: string;
  repo: string;
  PRNumber: number;
};

function getPRInfosfromURL(URL: string): PRdata {
  const githubBaseUrl = "https://github.com/";
  const minLength = githubBaseUrl.length;
  if (!URL) {
    return { owner: "", repo: "", PRNumber: null };
  } else {
    if (!URL.includes(githubBaseUrl) || URL.length < minLength) {
      return { owner: "", repo: "", PRNumber: null };
    } else {
      const pieces1 = URL.split(githubBaseUrl);
      const pieces2 = pieces1[1].split("/");
      const owner = pieces2[0];
      const repo = pieces2[1];
      const PRNumber = Number(pieces2[3]);

      const PRdata: PRdata = { owner: owner, repo: repo, PRNumber: PRNumber };
      return PRdata;
    }
  }
}

interface PRLinkProps {
  pullRequestURL: string;
}

function PRLinkComponent(props: PRLinkProps) {
  const handleClick = () => {
    window.open(props.pullRequestURL);
  };
  return (
    <div>
      <div className="PR-link" onClick={handleClick}>
        {props.pullRequestURL}
      </div>
    </div>
  );
}

interface PRCardProps {
  imageURL: string;
}
export function PRCard(props: PRCardProps) {
  return (
    <div className="PR-card">
      <img src={props.imageURL} alt={"PR card"} width={"200px"}></img>
    </div>
  );
}

interface PRDescriptionProps {
  description: string;
}
function PRDescription(props: PRDescriptionProps) {
  return (
    <div className="PR-description">
      <div> {props.description}</div>
    </div>
  );
}
interface PRComponentProps {
  pullRequestURL: string;
}
function PullRequestComponent(props: PRComponentProps): JSX.Element {
  const [pullRequestURLImage, setpullRequestURLImage] = useState("");
  const [pullRequestDescription, setpullRequestDescription] = useState("");
  const [pullRequestSummary, setpullRequestSummary] = useState("");

  const searchPR = async (pullRequestURL: string) => {
    let imageURL = "";
    if (pullRequestURL) {
      const PRInfos = getPRInfosfromURL(pullRequestURL);
      if (PRInfos.owner && PRInfos.repo) {
        const response = await request("GET /repos/{owner}/{repo}/pulls", {
          owner: PRInfos.owner,
          repo: PRInfos.repo,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });

        response.data.forEach((data, index) => {
          if (data.number === PRInfos.PRNumber) {
            const sha = data.head.sha;
            imageURL =
              "https://opengraph.githubassets.com/" +
              sha +
              "/" +
              PRInfos.owner +
              "/" +
              PRInfos.repo +
              "/pull/" +
              PRInfos.PRNumber;
            const title =
              data.title +
              " by " +
              data.user.login +
              " . Pull Request #" +
              data.number +
              " . " +
              PRInfos.owner +
              "/" +
              PRInfos.repo +
              " - Github";
            setpullRequestURLImage(imageURL);
            setpullRequestDescription(data.body);
            setpullRequestSummary(title);
          }
        });
      }
    }
  };

  useEffect(() => {
    searchPR(props.pullRequestURL);
  });
  return (
    <div className="PR-component-container">
      <PRLinkComponent pullRequestURL={props.pullRequestURL}></PRLinkComponent>
      <div className="PR-component-grid">
        <div className="PR-component-left-column">
          <PRCard imageURL={pullRequestURLImage}></PRCard>
        </div>
        <div className="PR-component-right-column">
          <div className="PR-summary">{pullRequestSummary}</div>
          <PRDescription
            description={pullRequestDescription.substring(0, 200) + "..."}
          ></PRDescription>
        </div>
      </div>
    </div>
  );
}

const PullRequestRenderer: NodeRenderer = ({ node }) => {
  if (node.type === "pullrequest") {
    return (
      <div>
        <PullRequestComponent
          pullRequestURL={node.value}
        ></PullRequestComponent>
      </div>
    );
  }
};

export const PULLREQUEST_RENDERERS = {
  pullrequest: PullRequestRenderer,
};
