import { InteractionCreate } from "../../../src/discord/events/InteractionCreate";
import { container } from "tsyringe";
import { Interaction } from "discord.js";
import { Client } from "discordx";

describe("Interaction Create", function () {
    const mockClient = new (class {
        executeInteraction(...args: any) {}
    })() as Client;

    const mockInteraction = {} as Interaction;

    it("should call method after receiving event", () => {
        const spy = jest.spyOn(mockClient, "executeInteraction");

        const clientEvent = container.resolve(InteractionCreate);

        clientEvent.event([mockInteraction], mockClient);

        expect(spy).toHaveBeenCalled();
    });
});
