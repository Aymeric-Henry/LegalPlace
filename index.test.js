import fs from "fs";
import path from "path";

jest.mock("fs", () => ({ ...jest.requireActual("fs"), writeFile: jest.fn() }));

const runSimulation = () => {
  jest.isolateModules(() => {
    require("./index");
  });
  return fs.writeFile.mock.calls[0];
};

describe("index.js simulation", () => {
  let consoleLog;

  beforeEach(() => {
    fs.writeFile.mockReset();
    consoleLog = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLog.mockRestore();
  });

  it("writes the result to output.json once", () => {
    runSimulation();

    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(fs.writeFile.mock.calls[0][0]).toBe("output.json");
  });

  it("produces exactly the content of the reference output.json", () => {
    const [, content] = runSimulation();
    const reference = fs.readFileSync(
      path.join(__dirname, "output.json"),
      "utf8",
    );

    expect(content).toBe(reference);
  });

  it("logs one snapshot per day for 30 days, each with the 4 drugs", () => {
    const [, content] = runSimulation();
    const { result } = JSON.parse(content);

    expect(result).toHaveLength(30);
    result.forEach((day) => {
      expect(day.map((drug) => drug.name)).toEqual([
        "Doliprane",
        "Herbal Tea",
        "Fervex",
        "Magic Pill",
      ]);
    });
  });

  it("stores a copy of each day instead of the live drugs", () => {
    const [, content] = runSimulation();
    const { result } = JSON.parse(content);

    expect(result[0]).toEqual([
      { name: "Doliprane", expiresIn: 19, benefit: 29 },
      { name: "Herbal Tea", expiresIn: 9, benefit: 6 },
      { name: "Fervex", expiresIn: 11, benefit: 36 },
      { name: "Magic Pill", expiresIn: 15, benefit: 40 },
    ]);
    expect(result[29]).not.toEqual(result[0]);
  });

  it("logs success when the file is written", () => {
    const [, , callback] = runSimulation();

    callback(null);

    expect(consoleLog).toHaveBeenCalledWith("success");
  });

  it("logs error when the file cannot be written", () => {
    const [, , callback] = runSimulation();

    callback(new Error("disk full"));

    expect(consoleLog).toHaveBeenCalledWith("error");
  });
});
