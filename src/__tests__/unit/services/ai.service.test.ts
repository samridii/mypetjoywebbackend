jest.mock("axios");

import axios from "axios";
import { getPetRecommendation } from "../../../services/ai.service";

const mockAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => jest.clearAllMocks());

describe("AI Service — getPetRecommendation", () => {
  it("1. returns recommendation content from Groq", async () => {
    mockAxios.post.mockResolvedValue({
      data: { choices: [{ message: { content: "Get a cat!" } }] },
    });
    const result = await getPetRecommendation({ lifestyle: "calm" });
    expect(result).toBe("Get a cat!");
  });

  it("2. calls Groq API with correct model", async () => {
    mockAxios.post.mockResolvedValue({
      data: { choices: [{ message: { content: "Get a dog!" } }] },
    });
    await getPetRecommendation({ lifestyle: "active" });
    expect(mockAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("groq.com"),
      expect.objectContaining({ model: "llama-3.3-70b-versatile" }),
      expect.any(Object)
    );
  });

  it("3. calls Groq API with Authorization header", async () => {
    mockAxios.post.mockResolvedValue({
      data: { choices: [{ message: { content: "Get a bird!" } }] },
    });
    await getPetRecommendation({ lifestyle: "calm" });
    const callHeaders = mockAxios.post.mock.calls[0][2] as any;
    expect(callHeaders.headers["Authorization"]).toContain("Bearer");
  });

  it("4. stringifies object answers into prompt", async () => {
    mockAxios.post.mockResolvedValue({
      data: { choices: [{ message: { content: "Get a fish!" } }] },
    });
    await getPetRecommendation({ lifestyle: "busy", space: "small" });
    const body = mockAxios.post.mock.calls[0][1] as any;
    expect(body.messages[1].content).toContain("busy");
  });

  it("5. handles string answers directly", async () => {
    mockAxios.post.mockResolvedValue({
      data: { choices: [{ message: { content: "Get a rabbit!" } }] },
    });
    await getPetRecommendation("I am very active");
    const body = mockAxios.post.mock.calls[0][1] as any;
    expect(body.messages[1].content).toContain("I am very active");
  });
});