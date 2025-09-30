import { gql } from '@apollo/client';

// GraphQL Query for Products
const GET_PRODUCTS = gql`
  query getProducts {
    products {
      items {
        id
        assets {
          name
        }
        name
        slug
        description
        facetValues {
          facet {
            id
            name
            code
          }
          id
          name
          code
        }
        customFields {
          Logo {
            name
            source
          }
          CustomerType
          BusinessStage
          Nationality
          LegalStructure
          Industry
          ProcessingTime
          RegistrationValidity
          Cost
          Steps
          TermsOfService
          RequiredDocuments {
            id
            name
            source
          }
          RelatedServices {
            id
          }
        }
      }
    }
  }
`;

// GraphQL Query for Facets
const GET_FACETS = gql`
  query GetFacets {
    facets(options: { take: 100 }) {
      items {
        id
        name
        code
        values {
          id
          name
          code
        }
      }
    }
  }
`;

// GraphQL Query for a single Product by ID
const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      assets {
        name
      }
      name
      slug
      description
      customFields {
        Logo {
          name
          source
        }
        CustomerType
        BusinessStage
        Nationality
        LegalStructure
        CustomerType
        Industry
        ProcessingTime
        RegistrationValidity
        Cost
        Steps
        TermsOfService
        RequiredDocuments {
          id
          name
          source
        }
        EmpowermentandLeadership
        RelatedServices {
          id
          name
          description
          slug
        }
      }
    }
  }
`;

export { GET_PRODUCTS, GET_FACETS, GET_PRODUCT };