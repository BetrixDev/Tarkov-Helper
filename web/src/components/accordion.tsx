import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const titleFont = Montserrat({ subsets: ["latin"], weight: "700" });

import { clsx } from "clsx";
import { Fira_Code, Montserrat } from "next/font/google";
import { Dot } from "lucide-react";

const firaCode = Fira_Code({ subsets: ["latin"] });

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={clsx("border-b", className)}
    {...props}
  />
));

AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={clsx(
        "relative ml-4 flex flex-1 items-center justify-start gap-2 py-4 text-sm font-medium transition-all [&[data-state=open]>svg]:rotate-180",
        className,
        titleFont.className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="text-muted-foreground absolute right-0 h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={clsx(
      "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className,
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

interface AccordionChildProps {
  commandName: string;
  commandDescription: string;
  children: React.ReactNode | string;
}

const AccordionChild: React.FC<AccordionChildProps> = ({
  commandDescription,
  commandName,
  children,
}) => {
  return (
    <AccordionItem
      value={commandName}
      className="rounded-md outline outline-1 outline-white/20"
    >
      <AccordionTrigger>
        /{commandName}
        <Dot />
        <p className={clsx("font-light text-stone-50/80", firaCode.className)}>
          {commandDescription}
        </p>
      </AccordionTrigger>
      <AccordionContent className="flex items-center justify-center gap-2">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionChild,
};
