import { CommandInteraction } from "discord.js";
import { BaseCommand } from "../../src/lib/BaseCommand";

describe("Base Command", function () {
    const tester = jest.fn();

    const mockInteraction = {
        reply: async (r: string) => {
            await tester(r);
        },
        locale: "en-US",
        isCommand: () => false,
        id: "test",
        commandName: "test"
    } as unknown as CommandInteraction;

    const mockCommandInteraction = {
        reply: async () => {
            await tester();
        },
        locale: "en-US",
        isCommand: () => true,
        id: "test",
        commandName: "test",
        options: {
            data: [{ name: "test", value: "test" }]
        }
    } as unknown as CommandInteraction;

    it("should respond to the interaction", async () => {
        await new BaseCommand().handleCommandInteraction(
            mockInteraction,
            new Promise((respond) => {
                respond("hello");
            })
        );

        await new BaseCommand().handleCommandInteraction(
            mockInteraction,
            new Promise((respond, error) => {
                error("error");
            })
        );

        expect(tester).toBeCalledTimes(2);
    });

    it("should return an error reply", () => {
        expect(new BaseCommand().errorReply("error", mockInteraction)).toBeDefined();
        expect(new BaseCommand().errorReply("error", mockCommandInteraction)).toBeDefined();
    });
});
