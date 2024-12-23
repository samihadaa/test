const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "products", url: "http://localhost:4001/graphql" },
      { name: "categories", url: "http://localhost:4002/graphql" },
    ],
  }),
});

// Authentication Middleware
const context = async ({ req }) => {
  const authHeader = req.headers.authorization || "";
  let role = "user";

  if (authHeader.startsWith("Bearer ")) {
    role = authHeader.split(" ")[1];
  }

  return { user: { role } };
};

// Start Gateway Server
async function startServer() {
  const server = new ApolloServer({
    gateway,
    subscriptions: false,
    context,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`Gateway running at ${url}`);
}

startServer();
