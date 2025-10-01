import { gql } from '@apollo/client';

// GraphQL Query for Products
const GET_PRODUCTS = gql`
  query getProducts {
    products(options:{sort:{id:DESC}}) {
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
          KeyTermsOfService
          RequiredDocuments {
            id
            customFields
          }
          EmpowermentandLeadership
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
    facets {
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

export { GET_PRODUCTS, GET_FACETS };