import { test, describe, expect } from "vitest";
import { validateData } from "../utils/validateData.js";


describe("validate journey row", () => {
  test("rejects if departure time is not a parseable DateTime", () => {
    const journeyRow = {
      Departure: "not a valid date",
      Return: "2023-05-09T01:23:45Z",
      "Departure station id": "123",
      "Return station id": "456",
      "Covered distance (m)": "1000",
      "Duration (sec)": "30",
    };
    expect(validateData(journeyRow)).toBe(false);
  });

  test("rejects if arrival happens before departure", () => {
    const journeyRow = {
      Departure: "2023-05-09T01:23:45Z",
      Return: "2023-05-08T23:45:01Z",
      "Departure station id": "123",
      "Return station id": "456",
      "Covered distance (m)": "1000",
      "Duration (sec)": "30",
    };
    expect(validateData(journeyRow)).toBe(false);
  });

  test("rejects if departure station id is not a positive integer", () => {
    const journeyRow = {
      Departure: "2023-05-09T01:23:45Z",
      Return: "2023-05-09T01:53:45Z",
      "Departure station id": "-1",
      "Return station id": "456",
      "Covered distance (m)": "1000",
      "Duration (sec)": "30",
    };
    expect(validateData(journeyRow)).toBe(false);
  });

  test("accepts a valid trip", () => {
    const journeyRow = {
      Departure: "2023-05-09T01:23:45Z",
      Return: "2023-05-09T01:53:45Z",
      "Departure station id": "123",
      "Return station id": "456",
      "Covered distance (m)": "1000",
      "Duration (sec)": "30",
    };
    expect(validateData(journeyRow)).toBe(true);
  });

  test("rejects a trip that is less than 10 seconds", () => {
    const journeyRow = {
      Departure: "2023-05-09T01:23:45Z",
      Return: "2023-05-09T01:24:01Z",
      "Departure station id": "123",
      "Return station id": "456",
      "Covered distance (m)": "1000",
      "Duration (sec)": "5",
    };
    expect(validateData(journeyRow)).toBe(false);
  });
});
