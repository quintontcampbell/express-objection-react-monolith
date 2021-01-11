const getDatabaseUrl = (nodeEnv) => {
  return (
    {
      development: "postgres://postgres:postgres@localhost:5432/express-objection-react-monolith_development",
      test: "postgres://postgres:postgres@localhost:5432/express-objection-react-monolith_test",
    }[nodeEnv] || process.env.DATABASE_URL
  );
};

module.exports = getDatabaseUrl;
