import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import RegisterController from "../controllers/RegisterController";
import { Register } from "../core/User/service/Register";
import RepositoryPrismaPg from "../external/prisma/RepositoryPrismaPg";
import { Authenticate } from "../core/User/service/Authenticate";
import AuthenticateController from "../controllers/AuthenticateController";
import { EnsureAuthenticated } from "../Middleware/ensureAuthenticated";
import { RefreshTokenController } from "../controllers/RefreshTokenController";
import { RefreshTokenUser } from "../core/Tokens/RefreshToken";

export async function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  const repository = new RepositoryPrismaPg();
  const register = new Register(repository);
  const authenticate = new Authenticate(repository);
  const refreshToken = new RefreshTokenUser(repository);

  fastify.post(
    "/register-user",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new RegisterController(register).handle(request, reply);
    }
  );
  fastify.post(
    "/authenticate-user",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new AuthenticateController(authenticate).handle(request, reply);
    }
  );
  fastify.get(
    "/view-invoices",
    { preHandler: EnsureAuthenticated },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.send("bem vindo usuario");
    }
  );
  fastify.post(
    "/refresh-token",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new RefreshTokenController(refreshToken).handle(request, reply);
    }
  );
}
