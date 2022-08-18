import { FileBlockProps } from "@githubnext/blocks";
import useSWR from "swr";
import { AvatarStack, Avatar } from "@primer/react";

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

// @ts-ignore
const STUB_RESPONSE = {
  analyzedAt: "2022-08-17T17:10:52.714Z",
  collected: {
    metadata: {
      name: "react",
      scope: "unscoped",
      version: "18.2.0",
      description:
        "React is a JavaScript library for building user interfaces.",
      keywords: ["react"],
      date: "2022-06-14T19:46:38.369Z",
      publisher: { username: "gnoff", email: "jcs.gnoff@gmail.com" },
      maintainers: [
        { username: "gaearon", email: "dan.abramov@gmail.com" },
        { username: "acdlite", email: "npm@andrewclark.io" },
        { username: "gnoff", email: "jcs.gnoff@gmail.com" },
        { username: "fb", email: "opensource+npm@fb.com" },
        { username: "trueadm", email: "dg@domgan.com" },
        { username: "sophiebits", email: "npm@sophiebits.com" },
        { username: "lunaruan", email: "lunaris.ruan@gmail.com" },
      ],
      repository: {
        type: "git",
        url: "git+https://github.com/facebook/react.git",
        directory: "packages/react",
      },
      links: {
        npm: "https://www.npmjs.com/package/react",
        homepage: "https://reactjs.org/",
        repository: "https://github.com/facebook/react",
        bugs: "https://github.com/facebook/react/issues",
      },
      license: "MIT",
      dependencies: { "loose-envify": "^1.1.0" },
      releases: [
        {
          from: "2022-07-18T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 28,
        },
        {
          from: "2022-05-19T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 97,
        },
        {
          from: "2022-02-18T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 213,
        },
        {
          from: "2021-08-17T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 445,
        },
        {
          from: "2020-08-17T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 719,
        },
      ],
      hasSelectiveFiles: true,
    },
    npm: {
      downloads: [
        {
          from: "2022-08-16T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 3069346,
        },
        {
          from: "2022-08-10T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 15404677,
        },
        {
          from: "2022-07-18T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 66618476,
        },
        {
          from: "2022-05-19T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 197466426,
        },
        {
          from: "2022-02-18T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 391477825,
        },
        {
          from: "2021-08-17T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 720019490,
        },
      ],
      starsCount: 789,
    },
    github: {
      homepage: "https://reactjs.org",
      starsCount: 193337,
      forksCount: 39945,
      subscribersCount: 6659,
      issues: {
        count: 24154,
        openCount: 1096,
        distribution: {
          "3600": 4976,
          "10800": 2368,
          "32400": 2374,
          "97200": 3065,
          "291600": 2205,
          "874800": 2111,
          "2624400": 1687,
          "7873200": 1411,
          "23619600": 1746,
          "70858800": 1638,
          "212576400": 573,
        },
        isDisabled: false,
      },
      contributors: [
        { username: "jstejada", commitsCount: 39 },
        { username: "aweary", commitsCount: 61 },
        { username: "wincent", commitsCount: 9 },
        { username: "bvaughn", commitsCount: 301 },
        { username: "bgw", commitsCount: 14 },
        { username: "kassens", commitsCount: 8 },
        { username: "SanderSpies", commitsCount: 8 },
        { username: "trueadm", commitsCount: 429 },
        { username: "keyz", commitsCount: 26 },
        { username: "aickin", commitsCount: 18 },
        { username: "AnSavvides", commitsCount: 9 },
        { username: "acdlite", commitsCount: 1105 },
        { username: "yangshun", commitsCount: 10 },
        { username: "raphamorim", commitsCount: 15 },
        { username: "jgebhardt", commitsCount: 8 },
        { username: "Simek", commitsCount: 15 },
        { username: "motiz88", commitsCount: 10 },
        { username: "elas7", commitsCount: 13 },
        { username: "DarkScorpion", commitsCount: 10 },
        { username: "SimenB", commitsCount: 19 },
        { username: "hristo-kanchev", commitsCount: 9 },
        { username: "sophiebits", commitsCount: 875 },
        { username: "iamdustan", commitsCount: 17 },
        { username: "joshduck", commitsCount: 21 },
        { username: "Daniel15", commitsCount: 18 },
        { username: "sebmarkbage", commitsCount: 868 },
        { username: "marocchino", commitsCount: 45 },
        { username: "mondaychen", commitsCount: 19 },
        { username: "jeffmo", commitsCount: 111 },
        { username: "zpao", commitsCount: 822 },
        { username: "philipp-spiess", commitsCount: 18 },
        { username: "petehunt", commitsCount: 205 },
        { username: "fabiomcosta", commitsCount: 15 },
        { username: "koba04", commitsCount: 67 },
        { username: "josephsavona", commitsCount: 10 },
        { username: "KonstHardy", commitsCount: 7 },
        { username: "arkist", commitsCount: 14 },
        { username: "sompylasar", commitsCount: 15 },
        { username: "lunaruan", commitsCount: 115 },
        { username: "sun1one", commitsCount: 8 },
        { username: "dittos", commitsCount: 8 },
        { username: "vjeux", commitsCount: 140 },
        { username: "andrewdavey", commitsCount: 7 },
        { username: "yiminghe", commitsCount: 9 },
        { username: "benjamn", commitsCount: 68 },
        { username: "subtleGradient", commitsCount: 110 },
        { username: "mroch", commitsCount: 12 },
        { username: "zertosh", commitsCount: 8 },
        { username: "RaitoBezarius", commitsCount: 7 },
        { username: "hramos", commitsCount: 7 },
        { username: "bhamodi", commitsCount: 8 },
        { username: "syranide", commitsCount: 69 },
        { username: "jaredly", commitsCount: 9 },
        { username: "raunofreiberg", commitsCount: 9 },
        { username: "necolas", commitsCount: 92 },
        { username: "taneliang", commitsCount: 9 },
        { username: "gaearon", commitsCount: 1573 },
        { username: "nhunzaker", commitsCount: 94 },
        { username: "fxxkscript", commitsCount: 9 },
        { username: "iamchenxin", commitsCount: 13 },
        { username: "rickhanlonii", commitsCount: 88 },
        { username: "jimfb", commitsCount: 116 },
        { username: "yungsters", commitsCount: 93 },
        { username: "gnoff", commitsCount: 23 },
        { username: "lucasecdb", commitsCount: 10 },
        { username: "Biki-das", commitsCount: 8 },
        { username: "kmeht", commitsCount: 10 },
        { username: "andreypopp", commitsCount: 9 },
        { username: "waldreiter", commitsCount: 14 },
        { username: "flarnie", commitsCount: 67 },
        { username: "cpojer", commitsCount: 56 },
        { username: "ianobermiller", commitsCount: 7 },
        { username: "kohei-takata", commitsCount: 39 },
        { username: "camsong", commitsCount: 8 },
        { username: "dependabot[bot]", commitsCount: 13 },
        { username: "alexmckenley", commitsCount: 6 },
        { username: "hzoo", commitsCount: 8 },
        { username: "NE-SmallTown", commitsCount: 22 },
        { username: "JoshuaGross", commitsCount: 9 },
        { username: "TheSavior", commitsCount: 30 },
        { username: "rickbeerendonk", commitsCount: 9 },
        { username: "bl00mber", commitsCount: 14 },
        { username: "jquense", commitsCount: 18 },
        { username: "ivanzotov", commitsCount: 11 },
        { username: "tomocchino", commitsCount: 13 },
        { username: "chenglou", commitsCount: 126 },
        { username: "RReverser", commitsCount: 9 },
        { username: "chicoxyzzy", commitsCount: 29 },
        { username: "Andarist", commitsCount: 10 },
        { username: "clemmy", commitsCount: 9 },
        { username: "behnammodi", commitsCount: 8 },
        { username: "salazarm", commitsCount: 24 },
        { username: "mcsheffrey", commitsCount: 21 },
        { username: "joecritch", commitsCount: 9 },
        { username: "eps1lon", commitsCount: 55 },
        { username: "NMinhNguyen", commitsCount: 6 },
        { username: "jddxf", commitsCount: 9 },
        { username: "DenrizSusam", commitsCount: 7 },
        { username: "fisherwebdev", commitsCount: 10 },
        { username: "threepointone", commitsCount: 16 },
      ],
      commits: [
        {
          from: "2022-08-10T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 2,
        },
        {
          from: "2022-07-18T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 18,
        },
        {
          from: "2022-05-19T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 131,
        },
        {
          from: "2022-02-18T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 337,
        },
        {
          from: "2021-08-17T00:00:00.000Z",
          to: "2022-08-17T00:00:00.000Z",
          count: 702,
        },
      ],
      statuses: [
        { context: "ci/circleci: test_fuzz", state: "success" },
        { context: "ci/circleci: setup", state: "success" },
        {
          context: "ci/circleci: Publish to Experimental channel",
          state: "success",
        },
        { context: "ci/circleci: Publish to Next channel", state: "success" },
      ],
    },
    source: {
      files: { readmeSize: 1162, testsSize: 381150, hasChangelog: true },
      badges: [
        {
          urls: {
            original: "https://img.shields.io/npm/v/react.svg?style=flat",
            shields: "https://img.shields.io/npm/v/react.svg",
            content: "https://img.shields.io/npm/v/react.json",
          },
          info: { service: "npm", type: "version", modifiers: { type: "v" } },
        },
        {
          urls: {
            original:
              "https://circleci.com/gh/facebook/react.svg?circle-token=:circle-token",
            service: "https://circleci.com/gh/facebook/react.svg",
            shields:
              "https://img.shields.io/circleci/project/github/facebook/react.svg",
            content:
              "https://img.shields.io/circleci/project/github/facebook/react.json",
          },
          info: { service: "circleci", type: "build" },
        },
      ],
      linters: ["editorconfig", "eslint", "prettier"],
      coverage: 0.86,
    },
  },
  evaluation: {
    quality: {
      carefulness: 0.9999999999999999,
      tests: 0.679,
      health: 1,
      branding: 0.7,
    },
    popularity: {
      communityInterest: 240830,
      downloadsCount: 65822142,
      downloadsAcceleration: 112545.09956240491,
      dependentsCount: 0,
    },
    maintenance: {
      releasesFrequency: 1,
      commitsFrequency: 1,
      openIssues: 1,
      issuesDistribution: 0.3499872376616103,
    },
  },
  score: {
    final: 0.9296215002155315,
    detail: {
      quality: 0.902269335310431,
      popularity: 0.9158908847875538,
      maintenance: 0.9667968284193095,
    },
  },
} as PackageDetailResponse;

const Label = (props: { children: React.ReactNode }) => {
  return (
    <p
      className={tw`text-gray-600 font-medium uppercase tracking-widest text-xs`}
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
  let data = STUB_RESPONSE;
  // const { data, error } = useSWR(
  //   `https://api.npms.io/v2/package/${name}`,
  //   fetcher
  // );

  if (!data) {
    return (
      <p className={tw`text-sm p-4 text-gray-600`}>
        Loading package details...
      </p>
    );
  }

  return (
    <div className={tw`p-4 grid grid-cols-4 gap-4`}>
      <div className={tw`col-span-1`}>
        <Label>Latest Version</Label>
        <div className={tw`mt-2`}>
          <p className={tw`text-lg font-mono`}>
            {data.collected.metadata.version}
          </p>
        </div>
      </div>
      <div className={tw`col-span-3`}>
        <Label>Maintainers</Label>
        <div className={tw`mt-2`}>
          <AvatarStack>
            {data.collected.metadata.maintainers.map((maintainer) => {
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
    </div>
  );
};

function PackageItem({ name, version }: { name: string; version: string }) {
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
      <Accordion.Content>
        <PackageDetail name={name} version={version} />
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
