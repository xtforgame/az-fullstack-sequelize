import { ApolloServer, gql } from 'apollo-server-koa';
import RouterBase from '../core/router-base';

const libraries = [
  {
    branch: 'downtown',
  },
  {
    branch: 'riverside',
  },
];

// The branch field of a book indicates which library has it in stock
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    branch: 'riverside',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    branch: 'downtown',
  },
];

// Schema definition
const typeDefs = gql`
# A library has a branch and books
type Library {
  branch: String!
  books: [Book!]
}

# A book has a title and author
type Book {
  title: String!
  author: Author!
}

# An author has a name
type Author {
  id: String!
  name: String!
}

# Queries can fetch a list of libraries
type Query {
  library(branch: String!): Library
  libraries: [Library]
}
`;

const printDeepSelections = (selections, prefix = '') => {
  selections.forEach((fieldNode) => {
    const name = fieldNode.name.value;
    const fullname = prefix ? `${prefix}.${name}` : name;

    // console.log('name :', fullname);
    if (fieldNode.selectionSet && fieldNode.selectionSet.selections) {
      printDeepSelections(fieldNode.selectionSet.selections, fullname);
    }
  });
};

// Resolver map
const resolvers = {
  Query: {
    library(parent, args) {
      return libraries.filter(library => library.branch === args.branch)[0];
    },
    libraries(parent, args, ctx, info) {
      // Return our hardcoded array of libraries
      printDeepSelections(info.fieldNodes);
      return libraries;
    },
  },
  Library: {
    books(parent, args, ctx, info) {
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return books.filter(book => book.branch === parent.branch);
    },
  },
  Book: {

    // The parent resolver (Library.books) returns an object with the
    // author's name in the "author" field. Return a JSON object containing
    // the name, because this field expects an object.
    author(parent) {
      return {
        id: parent.author,
        name: parent.author,
      };
    },
  },

  // Because Book.author returns an object with a "name" field,
  // Apollo Server's default resolver for Author.name will work.
  // We don't need to define one.
};


const getContext = async ({ ctx, connection }) => {
  if (connection) {
    // check connection for metadata
    return connection.context;
  } else {
    // check from request
    const token = ctx.request.headers.authorization || '';
    return { token };
  }
};

// query:
// http://localhost:8080/graphiql?query=%7Blibraries%7Bbooks%7Bauthor%7Bname%7D%7D%7D%7D
// or
// {
//   library(branch: "downtown"){
//     branch
//     books {
//       title
//     }
//   }
//   libraries {
//     branch
//     books {
//       author {
//         name
//       }
//     }
//   }
// }


export default class GraphQLRouter extends RouterBase {
  setupRoutes({ router }) {
    const qlServer = new ApolloServer({
      context: getContext,
      typeDefs,
      resolvers,
      introspection: false,
      playground: false,
    });

    const iqlServer = new ApolloServer({
      context: getContext,
      typeDefs,
      resolvers,
    });
    this.httpApp.app.use(qlServer.getMiddleware({ path: '/api/graphql' }));
    this.httpApp.app.use(iqlServer.getMiddleware({ path: '/api/graphiql' }));
  }
}
