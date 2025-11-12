import { gql } from '@apollo/client';

// export const ADD_TO_CART_SUBMIT = gql`
//     mutation Addtocart(
//         $accessToken: String!,
//         $userId: String!,
//         $campaignName: String!,
//         $startDate: String!,
//         $endDate: String!,
//         $cartItemName: String!,
//         $cartItemId: String!,
//         $cartItemReferenceId: String!,
//         $cartItemType: String!,
//         $cartItemCountry: String!,
//         $cartItemVenueType: String!,
//         $cartItemResolution: String!,
//         $cartItemThumbnailUrl: String!,
//         $cartItemLatitude: Float!,
//         $cartItemLongitude: Float!,
//         $packageDetails: String!,
//     ) {
//         addtocart(input: { 
//             accessToken: $accessToken,
//             userId: $userId,
//             campaignName: $campaignName,
//             startDate: $startDate,
//             endDate: $endDate,
//             cartItemName: $cartItemName,
//             cartItemId: $cartItemId,
//             cartItemReferenceId: $cartItemReferenceId,
//             cartItemType: $cartItemType,
//             cartItemCountry: $cartItemCountry,
//             cartItemVenueType: $cartItemVenueType,
//             cartItemResolution: $cartItemResolution,
//             cartItemThumbnailUrl: $cartItemThumbnailUrl,
//             cartItemLatitude: $cartItemLatitude,
//             cartItemLongitude: $cartItemLongitude,
//             packageDetails: $packageDetails
//         }) {
//             itemData {
//                 success
//                 message
//                 statusCode
//                 id
//                 sourceId
//                 dealId
//             }
//         }   
//     }
// `;
export const ADD_TO_CART_SUBMIT = gql`
  mutation AddToCart($input: [Cartinput!]!) {
    addtocart(input: $input) {
      itemData {
        success
        message
        statusCode
        id
        sourceId
        dealId
      }
    }
  }
`;

export const GET_MY_CART_ITEMS = gql`
  query  CartpageItem(
      $accessToken: String!,
      $userId: String!,
    ){
    cartpageItem(
      accessToken: $accessToken,
      userId: $userId,
    ) {
         id
        userId
        startDate
        endDate
        cartItemName
        cartItemId
        cartItemReferenceId
        cartItemDeviceId
        cartItemType
        cartItemCountry
        cartItemVenueType
        cartItemResolutions
        cartItemThumbnailUrl
        cartItemLatitude
        cartItemLongitude
        availableBooking
        nextAvailableDate
        spotsAvailability
        clientsAvailability
    }
  }
`;

export const GET_CART_ITEMS = gql`
  query  CartPageItem(
      $accessToken: String!,
      $edit: Boolean!,
      $campaignId: String!,
      $userId: String!,
      $startDate: String!,
      $endDate: String!,
    ){
    cartPageItem(
      accessToken: $accessToken,
      userId: $userId,
      campaignId: $campaignId,
      startDate: $startDate,
      endDate: $endDate,
      edit: $edit
    ) {
         id
        userId
        agencyId
        agencyName
        companyId
        companyName
        countryId
        countryName
        campaignName
        startDate
        endDate
        inventoriesSummary{
          classicInventories 
          digitalInventories
          packages
        }
        overAlltotalNet
        overAlltotalTax
        overAlltotalPrice
        overAlltotalUniqueReach
        overAlltotalPotentialViews
        overAlltotalAverageFrequency
        totalDuration
        campaignInventories{
          billboardPotentialViews
          cartItemId
          billboardId
          billboardName
          billboardType
          billboardAddress
          billboardCountry
          billboardDeviceId
          billboardReferenceId
          billboardLatitude
          billboardVenueType
          billboardFrequency
          billboardLongitude
          billboardUniqueReach
          billboardResolutionWidth
          billboardResolutionHeight
          billboardtotalPrice
          billboardThumbnailUrl
          billboardCurrencyCode
          isDraft
          availableBooking
        }
    }
  }
`;

export const DELETE_CART_SUBMIT = gql`
mutation deleteCartItem($accessToken: String!, $deleteItemId: ID!, $itemType: String!) {
  deleteCartItem(accessToken: $accessToken, deleteItemId: $deleteItemId, itemType: $itemType) {
    success
    message
    statusCode
  }
}
`;