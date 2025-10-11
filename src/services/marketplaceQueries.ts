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
          Logo {
            name
            source
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
        logoUrl
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
const BOOKMARK_SERVICE = gql`
mutation ToggleFavorite($productId: ID!) {
  toggleFavorite(productId: $productId) {
    items {
      id
      createdAt
      product {
        id
        name
        slug
      }
    }
    totalItems
  }
}
`
const GET_COURSE = gql`
  query GetCourse($id:ID!) {
  course(id:$id) {
    id
    name
    description
    topicTitle
    skillsGained
    prerequisite
    courseTimeline
    uponCompletion
    partner
    rating
    reviewCount
    startDate
    cost
    keyHighlights
    duration
    logoUrl
    businessStage
    pricingModel
    serviceCategory
    learningObjectives
    learningOutcomes
    resources    
    }    
  }
`
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

export { GET_PRODUCTS, GET_FACETS, GET_PRODUCT, GET_ALL_COURSES, GET_COURSE };
