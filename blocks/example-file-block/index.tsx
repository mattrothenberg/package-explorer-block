import { FileBlockProps } from "@githubnext/blocks";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import useSWR from "swr";
import { AvatarStack, Avatar, Label as PrimerLabel } from "@primer/react";
import compareVersions from "compare-versions";

import { tw } from "twind";
import { styled } from "@stitches/react";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import * as Accordion from "@radix-ui/react-accordion";
import "./index.css";
import axios from "axios";
import { PackageDetailResponse } from "./types";
import React from "react";

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

  let versionDiff = compareVersions(data.collected.metadata.version, version);

  return (
    <div className={tw`grid grid-cols-12 gap-4`}>
      <div className={tw`col-span-4`}>
        <Label>Latest Version</Label>
        <div className={tw`mt-2 flex items-center space-x-2`}>
          <p className={tw`text-base font-mono`}>
            {data.collected.metadata.version}
          </p>
          <>
            {versionDiff === 1 && (
              <PrimerLabel variant="success">Update available</PrimerLabel>
            )}
            {versionDiff === -1 && (
              <PrimerLabel variant="danger">Older</PrimerLabel>
            )}
            {versionDiff === 0 && (
              <PrimerLabel variant="secondary">Same Version</PrimerLabel>
            )}
          </>
        </div>
      </div>
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
                    alt={maintainer.email}
                    src={`https://github.com/${maintainer.username}.png`}
                  ></Avatar>
                );
              })}
          </AvatarStack>
        </div>
      </div>
      <div className={tw`col-span-12`}>
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

function PackageItem({ name, version }: { name: string; version: string }) {
  const [animationParent] = useAutoAnimate<HTMLDivElement>();
  return (
    <>
      <Accordion.Trigger className={tw`w-full`}>
        <div className={tw`flex items-center justify-between w-full`}>
          <div className={tw`flex items-center space-x-1`}>
            <AccordionChevron />
            <span className={tw`font-mono text-sm text-gray-900`}>{name}</span>
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

export default function (props: FileBlockProps) {
  const { context, content, metadata, onUpdateMetadata } = props;

  if (context.file !== "package.json") {
    return <div>Sorry I only work on package.json</div>;
  }

  const parsed = JSON.parse(content);
  const { dependencies } = parsed;

  return (
    <div className={tw`p-4`}>
      <Accordion.Root className={tw`divide-y`} type="multiple">
        {Object.keys(dependencies).map((pkgName) => {
          return (
            <Accordion.Item
              className={tw`py-2 first:pt-0`}
              key={pkgName}
              value={pkgName}
            >
              <PackageItem name={pkgName} version={dependencies[pkgName]} />
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    </div>
  );
}
