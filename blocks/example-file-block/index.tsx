import { FileBlockProps } from "@githubnext/blocks";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import useSWR from "swr";
import { AvatarStack, Avatar, Label as PrimerLabel } from "@primer/react";
import compareVersions from "compare-versions";
import { matchSorter } from "match-sorter";
import Highlighter from "react-highlight-words";
import stubYarnLock from "./stublock.json";

import { tw } from "twind";
import { styled } from "@stitches/react";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import * as Accordion from "@radix-ui/react-accordion";
import "./index.css";
import axios from "axios";
import { PackageDetailResponse } from "./types";
import React, { useEffect, useState } from "react";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const AccordionChevron = styled(ChevronDownIcon, {
  "[data-state=open] &": { transform: "rotate(180deg)" },
});

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
    <div className={tw`grid grid-cols-12 gap-4`}>
      <div className={tw`col-span-12 flex`}>
        <div className={tw`flex items-center space-x-6`}>
          <div>
            <Label>Latest Version</Label>
            <div className={tw`mt-2 flex items-center space-x-2`}>
              <p className={tw`text-base font-mono`}>
                {data.collected.metadata.version}
              </p>
            </div>
          </div>
          {lockFileEntry && (
            <div>
              <Label>Resolved Version</Label>
              <div className={tw`mt-2 flex items-center space-x-2`}>
                <p className={tw`text-base font-mono`}>
                  {lockFileEntry.version}
                </p>
                <>
                  {versionDiff === 1 && (
                    <PrimerLabel variant="success">
                      Update available
                    </PrimerLabel>
                  )}
                  {versionDiff === 0 && (
                    <PrimerLabel variant="secondary">
                      Latest Version
                    </PrimerLabel>
                  )}
                </>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={tw`col-span-3`}>
        <Label>Downloads</Label>
        <div className={tw`mt-2`}>
          <p className={tw`text-base font-mono`}>
            {data.evaluation.popularity.downloadsCount.toLocaleString()}
          </p>
        </div>
      </div>
      <div className={tw`col-span-5`}>
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
      <div className={tw`col-span-3`}>
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
  );
};

function PackageItem({
  name,
  version,
  search,
}: {
  name: string;
  version: string;
  search: string;
}) {
  const [animationParent] = useAutoAnimate<HTMLDivElement>();
  return (
    <>
      <Accordion.Trigger className={tw`w-full`}>
        <div className={tw`flex items-center justify-between w-full`}>
          <div className={tw`flex items-center space-x-1`}>
            <AccordionChevron />
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
      </Accordion.Trigger>
      <Accordion.Content ref={animationParent}>
        <div className={tw`p-4`}>
          <PackageDetail name={name} version={version} />
        </div>
      </Accordion.Content>
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
    <Accordion.Root
      ref={animationParent}
      className={tw`divide-y`}
      type="multiple"
    >
      {packages.map((pkgName) => {
        return (
          <Accordion.Item
            className={tw`py-2 first:pt-0`}
            key={pkgName}
            value={pkgName}
          >
            <PackageItem
              search={search}
              name={pkgName}
              // @ts-ignore
              version={dependencies[pkgName]}
            />
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
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

  // useEffect(() => {
  //   const getYarnLock = async () => {
  //     try {
  //       const res = await onRequestGitHubData(
  //         `/repos/${owner}/${repo}/contents/yarn.lock`
  //       );
  //       const { content } = res;
  //       const decoded = atob(content);
  //       const parsedLock = lockfile.parse(decoded);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };
  //   getYarnLock();
  // }, []);

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
      <div className={tw`p-4`}>
        {filteredDependencies.length > 0 && (
          <PackageList
            search={search}
            dependencies={dependencies}
            packages={filteredDependencies}
          />
        )}
        {filteredDependencies.length === 0 && (
          <p className={tw`text-sm text-gray-600`}>
            No packages found matching "{search}"
          </p>
        )}
      </div>
    </div>
  );
}
