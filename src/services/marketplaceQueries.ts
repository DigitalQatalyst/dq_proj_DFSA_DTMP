import { gql } from "@apollo/client";

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
          CustomerType
          BusinessStage
          Nationality
          LegalStructure
          Industry
          Partner
          ProcessingTime
          RegistrationValidity
          Cost
          Steps
          KeyTermsOfService
          AdditionalTermsOfService
          RequiredDocuments {
            id
            name
            source
          }
          RelatedServices {
            id
          }
         formUrl
         logoUrl
         Addtags
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

// GraphQL Query for a single Product by ID
const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id

      name
      slug
      description
      customFields {
        Logo {
          name
          source
        }
        Partner
        CustomerType
        BusinessStage
        Nationality
        LegalStructure
        Industry
        ProcessingTime
        Steps
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
        formUrl
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

// GraphQL Query for Courses
const GET_ALL_COURSES = gql`
  query GetAllCourses {
    courses(options: { take: 10, skip: 0, sort: { rating: DESC } }) {
      items {
        id
        name
        description
        partner
        rating
        reviewCount
        cost
        duration
        logoUrl
        businessStage
        pricingModel
        serviceCategory
      }
      totalItems
    }
  }
`;

export { GET_PRODUCTS, GET_FACETS, GET_PRODUCT, GET_ALL_COURSES };
