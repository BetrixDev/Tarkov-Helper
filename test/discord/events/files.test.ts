import { readJson } from "../../../src/lib/util/files";

describe("Files", function () {
    it("should read from a json file", () => {
        expect(readJson("package.json")).toBeDefined();
    });
});
