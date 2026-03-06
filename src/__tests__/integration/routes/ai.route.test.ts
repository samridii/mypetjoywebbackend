jest.mock("axios");

import request  from "supertest";
import express  from "express";
import axios    from "axios";
import aiRouter from "../../../routes/ai.route";

const mockAxios = axios as jest.Mocked<typeof axios>;
const app = express();
app.use(express.json());
app.use("/api/ai", aiRouter);

beforeEach(() => jest.clearAllMocks());

describe("AI Route Integration", () => {
  it("19. POST /api/ai/quiz — 200 with recommendation on valid answers", async () => {
    mockAxios.post.mockResolvedValue({
      data: { choices: [{ message: { content: "Get a cat!" } }] },
    });
    const res = await request(app).post("/api/ai/quiz").send({ answers: "I am calm and indoors" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.recommendation).toBe("Get a cat!");
  });

  it("20. POST /api/ai/quiz — 400 when answers field is missing", async () => {
    const res = await request(app).post("/api/ai/quiz").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain("answers");
  });
});