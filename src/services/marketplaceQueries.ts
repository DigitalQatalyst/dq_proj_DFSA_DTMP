import { gql } from "@apollo/client";

// GraphQL Query for Products
const GET_PRODUCTS = gql`
  query GetProducts($take: Int!) {
    products(options: { take: $take }) {
      items {
        id
        createdAt
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
          Industry
          BusinessStage
          ProcessingTime
          RegistrationValidity
          Cost
          Steps
          KeyTermsOfService
          AdditionalTermsOfService
          Logo {
            name
            source
          }
          RequiredDocuments {
            id
            name
            source
          }
          RelatedServices {
            id
            name
            slug
          }
        }
      }
      totalItems
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
        Industry
        ProcessingTime
        Cost
        RequiredDocuments {
          id
          name
          source
          tags {
            id
          }
        }
        KeyHighlights
        ServiceApplication
        Eligibility
        KeyTermsOfService
        AdditionalTermsOfService
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
