import Image from "next/image";
import localFont from "next/font/local";
import { clsx } from "clsx";
import { Fira_Code } from "next/font/google";
import { Dot, ExternalLinkIcon, GithubIcon } from "lucide-react";
import { Balancer } from "react-wrap-balancer";
import Link from "next/link";
import z from "zod";

import BackgroundImage from "../../public/imgs/EscapeFromTarkov 2022-12-15 19-51-22.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/accordion";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const firaCode = Fira_Code({ subsets: ["latin"] });
const tasaOrbiter = localFont({
  src: "../../public/fonts/TASAOrbiterVF.woff2",
});

const format = new Intl.NumberFormat().format;

const topggSchema = z.object({
  server_count: z.number(),
});

export const getStaticProps: GetStaticProps<
  z.infer<typeof topggSchema>
> = async () => {
  const res = await fetch("https://top.gg/api/bots/797600238449590334", {
    headers: {
      Authorization: process.env.TOPGG_TOKEN!,
    },
  });

  const data = topggSchema.parse(await res.json());

  return {
    props: data,
    // Revalidate every 30 minutes
    revalidate: 60 * 30,
  };
};

export default function Home(
  botData: InferGetStaticPropsType<typeof getStaticProps>,
) {
  return (
    <main
      className={clsx(
        "flex min-h-screen flex-col items-center bg-neutral-950 text-stone-50",
        firaCode.className,
      )}
    >
      <div className="flex h-[32rem] w-full max-w-[111rem] flex-col items-center justify-center">
        <div className="z-10 flex w-full flex-col justify-center gap-4 px-16 text-center md:justify-start md:text-left">
          <h1
            className={clsx(
              "text-7xl font-bold tracking-wider",
              tasaOrbiter.className,
            )}
          >
            Tarkov Helper
          </h1>
          <div className="w-full">
            <Balancer className="text-stone-100">
              A Discord bot that gives instantaneous access to information in
              Escape from Tarkov
            </Balancer>
          </div>

          <div className="flex w-full flex-col justify-center gap-4 md:flex-row md:justify-start">
            <Link
              className="justify-center md:justify-start"
              href="https://top.gg/bot/797600238449590334/invite"
              target="__blank"
            >
              <button className="min-w-72 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-black/10 px-4 py-2 outline outline-1 outline-white/20 backdrop-blur-sm hover:bg-white/5">
                <ExternalLinkIcon />
                <p>Invite to Your Server</p>
              </button>
            </Link>
            <div className="flex h-12 items-center justify-center gap-2 rounded-md bg-black/10 px-4 py-2 outline outline-1 outline-white/20 backdrop-blur-sm">
              <span className="font-semibold">
                {format(botData.server_count)}
              </span>
              servers
            </div>
          </div>

          <div className="flex justify-center gap-4 md:justify-start">
            <Link
              href="https://github.com/BetrixDev/Tarkov-Helper"
              target="__blank"
            >
              <GithubIcon className="h-12 w-12 rounded-md bg-black/10 p-2 outline outline-1 outline-white/20 backdrop-blur-sm hover:bg-white/5" />
            </Link>
          </div>
        </div>
        <Image
          className="fade-image absolute left-0 top-0 h-[32rem] w-full object-cover brightness-50 md:brightness-100"
          src={BackgroundImage}
          alt="Background image"
          quality={100}
          placeholder="blur"
        />
      </div>
      <div className="flex flex-col items-center gap-4">
        <h1
          className={clsx(
            "text-5xl font-bold tracking-wider",
            tasaOrbiter.className,
          )}
        >
          Commands
        </h1>
        <div className="flex w-full flex-col items-center justify-center gap-1">
          <Balancer className="text-center">
            Tarkov Helper exposes 10+ quality commands using data updated within
            minutes of the live client to give the most accurate responses
          </Balancer>
          <Balancer className="text-center text-sm italic text-stone-50/50 hover:text-white">
            {
              "(All commands are accessed via Discord's slash command interface)"
            }
          </Balancer>
        </div>
      </div>

      <div className="mt-8 flex w-full max-w-6xl flex-col items-center gap-8 text-center">
        <div className="mb-32 w-full">
          <Accordion
            type="single"
            collapsible
            className="mx-2 flex flex-col gap-4"
          >
            <AccordionItem
              value="item"
              className="rounded-md outline outline-1 outline-white/20"
            >
              <AccordionTrigger className="">
                /Item
                <Dot />
                <p
                  className={clsx(
                    "font-light text-stone-50/80",
                    firaCode.className,
                  )}
                >
                  Lists every possible statistic for an item along with its
                  spawning locations, quest involvements and barters
                </p>
              </AccordionTrigger>
              <AccordionContent>PLACEHOLDER TEXT</AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="barter"
              className="rounded-md outline outline-1 outline-white/20"
            >
              <AccordionTrigger className="">
                /Barter
                <Dot />
                <p
                  className={clsx(
                    "font-light text-stone-50/80",
                    firaCode.className,
                  )}
                >
                  Lists every barter for the specified item and the barters the
                  item is used in
                </p>
              </AccordionTrigger>
              <AccordionContent>PLACEHOLDER TEXT</AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="bitcoinfarm"
              className="rounded-md outline outline-1 outline-white/20"
            >
              <AccordionTrigger className="">
                /BitcoinFarm
                <Dot />
                <p
                  className={clsx(
                    "font-light text-stone-50/80",
                    firaCode.className,
                  )}
                >
                  Calculates the amount of bitcoins and roubles made per day for
                  a specified amount of GPUs in the farm
                </p>
              </AccordionTrigger>
              <AccordionContent>PLACEHOLDER TEXT</AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="dogtag"
              className="rounded-md outline outline-1 outline-white/20"
            >
              <AccordionTrigger className="">
                /Dogtag
                <Dot />
                <p
                  className={clsx(
                    "font-light text-stone-50/80",
                    firaCode.className,
                  )}
                >
                  Calculates the cost of a dogtag given its level
                </p>
              </AccordionTrigger>
              <AccordionContent>PLACEHOLDER TEXT</AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="exchangerate"
              className="rounded-md outline outline-1 outline-white/20"
            >
              <AccordionTrigger className="">
                /ExchangeRate
                <Dot />
                <p
                  className={clsx(
                    "font-light text-stone-50/80",
                    firaCode.className,
                  )}
                >
                  Converts the specified currency and the amount to the other
                  two currencies in the game
                </p>
              </AccordionTrigger>
              <AccordionContent>PLACEHOLDER TEXT</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* <div className="mb-32 flex flex-wrap justify-center gap-8">
          <CommandCard
            name="Experience"
            description="Calculates the amount of xp needed to reach a specified level from a starting level or xp amount"
          />
          <CommandCard
            name="Map"
            description="Returns basic information about the specified location and some useful map images to view"
          />
          <CommandCard
            name="Quest"
            description="Returns basic information about the specified quest as well as the step-by-step instructions from the wiki"
          />
          <CommandCard
            name="Restocks"
            description="Lists the time until every trader will restock their inventory"
          />
          <CommandCard
            name="Stat"
            description="Returns every possible statistic for the specified item (even the hidden stats)"
          />
          <CommandCard
            name="Status"
            description="Returns the current server status given from status.escapefromtarkov.com"
          />
        </div> */}
      </div>
    </main>
  );
}
