import "reflect-metadata";
import { HelpCommand } from "../../../src/discord/commands/HelpCommand";
import { container } from "tsyringe";

describe("Help Command", function () {
    it("should respond with the help message", () => {
        const helpCommand = container.resolve(HelpCommand);

        expect(typeof helpCommand.command("en")).toEqual("object");
    });
});
