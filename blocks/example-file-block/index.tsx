import { FileBlockProps } from "@githubnext/blocks";
import { Disclosure } from "@headlessui/react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Avatar, AvatarStack, Label as PrimerLabel } from "@primer/react";
import compareVersions from "compare-versions";
import { matchSorter } from "match-sorter";
import Highlighter from "react-highlight-words";
import { Sparklines, SparklinesLine } from "react-sparklines";
import useSWR from "swr";
import stubYarnLock from "./stublock.json";

import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import axios from "axios";
import React, { useState } from "react";
import { tw } from "twind";
import "./index.css";
import { PackageDetailResponse } from "./types";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Label = (props: { children: React.ReactNode }) => {
  return (
    <p
      className={tw`text-gray-500 font-medium uppercase tracking-widest text-xs`}
    >
      {props.children}
    </p>
  );
};

const PackageDetail = ({
  name,
  version,
}: {
  name: string;
  version: string;
}) => {
  // @ts-ignore
  const lockFileEntry = stubYarnLock[`${name}@${version}`];

  const { data, error } = useSWR<PackageDetailResponse>(
    `https://api.npms.io/v2/package/${encodeURIComponent(name)}`,
    fetcher
  );

  if (!data) {
    return (
      <p className={tw`text-sm text-gray-600 animate-pulse`}>
        Loading package details...
      </p>
    );
  }

  if (error || data.error) {
    let message = error?.message ?? data.error?.message;
    return (
      <p className={tw`text-sm text-red-600`}>
        {message ?? "An unexpected error occurred."}
      </p>
    );
  }

  let versionDiff = compareVersions(
    data.collected.metadata.version,
    lockFileEntry?.version
  );

  return (
    <div className={tw`flex divide-x`}>
      <div className={tw`flex-shrink-0 w-52 space-y-4 pr-4`}>
        <div>
          <Label>Latest Version</Label>
          <div className={tw`mt-2 flex items-center space-x-2`}>
            <p className={tw`text-sm font-mono`}>
              {data.collected.metadata.version}
            </p>
          </div>
        </div>
        {lockFileEntry && (
          <div>
            <Label>Resolved Version</Label>
            <div className={tw`mt-2 flex items-center space-x-2`}>
              <p className={tw`text-sm font-mono`}>{lockFileEntry.version}</p>
              <>
                {versionDiff === 1 && (
                  <PrimerLabel variant="success">Update available</PrimerLabel>
                )}
                {versionDiff === 0 && (
                  <PrimerLabel variant="secondary">Latest Version</PrimerLabel>
                )}
              </>
            </div>
          </div>
        )}
        <div>
          <Label>Links</Label>
          <div className={tw`mt-1`}>
            <ul className={tw`overflow-ellipsis truncate`}>
              <li className={tw`overflow-ellipsis truncate`}>
                <a
                  className={tw`text-sm hover:underline overflow-ellipsis truncate`}
                  target="_blank"
                  href={`https://npmjs.com/package/${name}`}
                >
                  https://npmjs.com/package/{name}
                </a>
              </li>
              <li className={tw`overflow-ellipsis truncate`}>
                <a
                  className={tw`text-sm hover:underline overflow-ellipsis truncate`}
                  target="_blank"
                  href={data.collected.github?.homepage}
                >
                  {data.collected.github?.homepage}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={tw`flex-1 pl-4 grid grid-cols-12 gap-6`}>
        <div className={tw`col-span-4`}>
          <Label>Downloads</Label>
          <div className={tw`mt-2`}>
            <p className={tw`text-base font-mono`}>
              {data.evaluation.popularity.downloadsCount.toLocaleString()}
            </p>
          </div>
        </div>
        <div className={tw`col-span-4`}>
          <Label>Maintainers</Label>
          <div className={tw`mt-2 overflow-auto`}>
            <AvatarStack>
              {data.collected.metadata.maintainers
                .slice(0, 6)
                .map((maintainer) => {
                  return (
                    <Avatar
                      key={maintainer.username}
                      alt={maintainer.email}
                      src={`https://github.com/${maintainer.username}.png`}
                    ></Avatar>
                  );
                })}
            </AvatarStack>
          </div>
        </div>
        <div className={tw`col-span-4 row-start-2`}>
          <Label>Downloads</Label>
          <Sparklines
            data={data.collected.npm.downloads.map((datum) => datum.count)}
            limit={data.collected.npm.downloads.length}
            height={40}
          >
            <SparklinesLine color="blue" />
          </Sparklines>
        </div>
        <div className={tw`col-span-4 row-start-2`}>
          <Label>Releases</Label>
          <Sparklines
            data={data.collected.metadata.releases.map((datum) => datum.count)}
            limit={data.collected.metadata.releases.length}
            height={40}
          >
            <SparklinesLine color="blue" />
          </Sparklines>
        </div>
      </div>
    </div>
  );
};

function PackageItem({
  name,
  version,
  search,
  open,
}: {
  name: string;
  version: string;
  search: string;
  open: boolean;
}) {
  const [animationParent] = useAutoAnimate<HTMLDivElement>();
  return (
    <>
      <Disclosure.Button className={tw`p-4 w-full border-b`}>
        <div className={tw`flex items-center justify-between w-full`}>
          <div className={tw`flex items-center space-x-1`}>
            {/* <AccordionChevron /> */}
            {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
            <span className={tw`font-mono text-sm text-gray-900`}>
              <Highlighter
                highlightClassName={tw`bg-yellow-100 text-yellow-900`}
                searchWords={[search]}
                textToHighlight={name}
              ></Highlighter>
            </span>
          </div>
          <span className={tw`font-mono text-sm text-gray-600`}>{version}</span>
        </div>
      </Disclosure.Button>
      <Disclosure.Panel
        className={tw`bg-gray-100 p-4 border-b`}
        ref={animationParent}
      >
        <div className={tw`p-4 bg-white rounded-lg border`}>
          <PackageDetail name={name} version={version} />
        </div>
      </Disclosure.Panel>
    </>
  );
}

function PackageList({
  dependencies,
  packages,
  search,
}: {
  dependencies: object;
  packages: string[];
  search: string;
}) {
  const [animationParent] = useAutoAnimate<HTMLDivElement>();
  return (
    <div ref={animationParent} className={tw``}>
      {packages.map((pkgName) => {
        return (
          <Disclosure key={pkgName}>
            {({ open }) => (
              <PackageItem
                open={open}
                search={search}
                name={pkgName}
                // @ts-ignore
                version={dependencies[pkgName]}
              />
            )}
          </Disclosure>
        );
      })}
    </div>
  );
}

type FileContentParams = { path: string } & Pick<
  FileBlockProps,
  "context" | "onRequestGitHubData"
>;

function useFileContent(params: FileContentParams) {
  const { context, onRequestGitHubData, path } = params;
  const { owner, repo } = context;
  return useSWR(
    `/repos/${owner}/${repo}/contents/${path}`,
    onRequestGitHubData
  );
}

export default function (props: FileBlockProps) {
  const [search, setSearch] = useState("");

  const { context, content, metadata, onUpdateMetadata, onRequestGitHubData } =
    props;
  const { repo, owner } = context;

  if (context.file !== "package.json") {
    return <div>Sorry I only work on package.json</div>;
  }

  const { data, error } = useFileContent({
    context,
    onRequestGitHubData,
    path: "yarn.lock",
  });

  const parsed = JSON.parse(content);
  const { dependencies } = parsed;

  const filteredDependencies = matchSorter(Object.keys(dependencies), search);

  return (
    <div className={tw`relative`}>
      <div className={tw`relative sticky top-0 z-10`}>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Filter by package name"
          className={tw` sticky top-0 z-10 w-full text-sm p-4 bg-gray-50 border-b focus:outline-none focus:border-blue-600 transition-all focus:bg-white`}
        ></input>
      </div>
      <div>
        {filteredDependencies.length > 0 && (
          <PackageList
            search={search}
            dependencies={dependencies}
            packages={filteredDependencies}
          />
        )}
        {filteredDependencies.length === 0 && (
          <p className={tw`text-sm text-gray-600 p-4`}>
            No packages found matching "{search}"
          </p>
        )}
      </div>
    </div>
  );
}
