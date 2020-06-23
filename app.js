const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

// graphqlHttp can be used as a middleware function for express. 
// In turn, it will funnel request to the graphQL query parser and forward them to right resolvers.
const graphqlHttp = require('express-graphql');

const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-hf2vb.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});


