import { gql } from '@apollo/client';

// Define the GraphQL query
export const EXPLORE_PROPERTY_BUTTON = gql`
  query landingpageExploreButton(
      $companyId: String!,
      $countryId: String!
      ){
      landingpageExploreButton(
      companyId: $companyId,
      countryId: $countryId
      ){
        id
        foreignBillboardId
        name
        displayName
        deviceId
        latitude
        longitude
        category
        type
        resolutionWidth
        resolutionHeight
        panelWidth
        panelHeight
        panelSize
        venueType
        facingDirection
        format
        group
        formattedAddress
        spotsPerHour
        mediaOwnerId
        mediaOwnerName
        publisherDomain
        countryId
        countryName
        countryIso2
        stateId
        stateName
        districtId
        districtName
        timezone
        active
        availableBooking
        subscription
        thumbnailPath
        googleMapUrl
        programmaticEnabled
        loopDuration
        spotDuration
        clients
        displayOnTime
        displayOffTime
        totalSpots
        totalBookedSpots
        spotsAvailability
        clientsAvailability
        nextAvailableDate
        spotAvailabilityPerc
        sellingRate {
          dsp
          standard
          daily
          weekly
          spots
          monthly {
            month3
            month6
            month1
            month12
          }
         
        }
        freqModel {
          id
          coef
          intercept
        }
        monthlySummary {
          id
          childPercentage
          childVisitors
          adultPercentage
          adultVisitors
          youngAdultPercentage
          youngAdultVisitors
          femalePercentage
          femaleVisitors
          malePercentage
          maleVisitors
          seniorPercentage
          seniorVisitors
          totalVisitors
          uniqueVisitors
          reach
          frequency
          circulation
        }
        createdBy
        createdDate
        lastModifiedBy
        lastModifiedDate
        count
        specification {
          id
          specificationId
          description
          panel
          screens
          manufacturer
          playerSoftware
          playerSoftwareModule {
            id
            name
            shortName
            description
            apiUrl
            accessToken
            active
            integratedWithLmx
            allowedPushToContentTypes
            creativeConfiguration
          }
          otherPlayer
          resolution1Width
          resolution1Height
          panel1Width
          panel1Height
          panel1Size
          resolution2Width
          resolution2Height
          panel2Width
          panel2Height
          panel2Size
          resolution3Width
          resolution3Height
          panel3Width
          panel3Height
          panel3Size
          resolution4Width
          resolution4Height
          panel4Width
          panel4Height
          panel4Size
          resolution5Width
          resolution5Height
          panel5Width
          panel5Height
          panel5Size
          resolution6Width
          resolution6Height
          panel6Width
          panel6Height
          panel6Size
          age
          totalSquareResolution
          ledPitch
          videoSupport
          imageSupport
          audioSupport
          audioFormats
          contentApproval
          featureSupport
          availableHours
          leadTime
          exclusiveTo
          language
          creativeResolutionWidth
          creativeResolutionHeight
          sellAsNetwork
          roadSideBoard
          heightFromFloor
          billboardSize
          supportedMediaType
          motionAndStatic
          panel1Id
          panel2Id
          panel3Id
          panel4Id
          panel5Id
          panel6Id
          frameId
          panelSizeList
        }
        price {
          id
          priceId
          screenOnTime
          screenOffTime
          displayOnTime
          displayOffTime
          spotDuration
          contentFrequencyPerHour
          clients
          localCurrencies {
            id
            currencyId
            iso
            country
            currency
            code
            symbol
            numcode
            decimals
            locale
          }
          localStandardRates
          internationalStandardRates
          buyingLocalMonthlyRates
          buyingInternationalMonthlyRates
          sellingLocalMonthlyRates
          sellingInternationalMonthlyRates
          fullDay
          daypart
          daypartEntries
          minimumSpotDurationPerDay
          maximumSpotDurationPerDay
          localContentManagementCost
          internationalContentManagementCost
          modeOfOperation
          loopDurationInSeconds
          loopLocalBuyingRates
          loopLocalSellingRates
          loopInternationalBuyingRates
          loopInternationalSellingRates
          spotLocalBaseRates
          spotInternationalBaseRates
          spotMediaOperatorPercentage
          spotInternalPercentage
          screenDuration
          loopDuration
          movingWallsSpot
          nearbyPOI
          viewability
          programmaticEnabled
          availableForBuying
          customizeSellingTerms
          digitalBillboardDayMinimumValue
          enableDigitalDay
          digitalBillboardHourMinimumValue
          enableDigitalHour
          sellingTermsPrice
          rateCardType
          reason
          spotMapping
          apiIntegration
          htmlPlayable
          spotBasedPrice
          floorPrice
          creativeType
          openAuctionType
          openAuctionMinimumSpots
          openAuctionMinimumPercentage
          openAuctionCurrency
          openAuctionSpotDuration
          auctionType
          impMultiplier
          fillerContentUrl
          creativeServerUrl
          manufacturingCost
          constructionCost
          maintenanceCost
          otherCosts
          availableHoursStart
          availableHoursEnd
          offlinePath
          spotAllocations
          totalSquareResolution
          spotAllocationArr
          availabilityPerc
          spotsAvailability
          clientsAvailability
          nextAvailableDate
          spotAvailabilityPerc
        }
        trTimeZone
        trCountryName
        trStateName
        trDistrictName
        tags {
          id
          companyId
          companyName
          name
          swatches
          integrations
        }
        filteringFields
      }
    }

`;

export const PROPERTY_LIST = gql`
  query LandingpageExploreProperties(
      $accessToken: String!,
      $sort: String!,
      $billboard: String!
      $startDate: String!,
      $endDate: String!,
      $dspName: String!,
      $companyId: String!,
      $countryId: String!,
      $page: Int!,
      $size: Int!
    ){
    landingpageExploreProperties(
      accessToken: $accessToken,
      sort: $sort,
      billboard: $billboard,
      startDate: $startDate,
      endDate: $endDate,
      dspName: $dspName,
      companyId: $companyId,
      countryId: $countryId,
      page: $page,
      size: $size
    ) {
      id
      name
      displayName
      referenceId
      latitude
      longitude
      category
      type
      panelWidth
      panelHeight
      resolutionWidth
      resolutionHeight
      panelSize
      formattedAddress
      facingDirection
      group
      venueType
      mediaOwnerId
      specification {
        screens
      }
      mediaOwnerName
      countryId
      countryName
      stateId
      stateName
      districtId
      districtName
      active
      availableBooking
      subscription
      thumbnailPath
      googleMapUrl
      timezone
      totalSpots
      totalBookedSpots
      spotsAvailability
      spotAvailabilityPerc
      clientsAvailability
      nextAvailableDate
      createdBy
      createdDate
      lastModifiedBy
      lastModifiedDate
      count
      trTimeZone
      trCountryName
      trStateName
      trDistrictName
      sellingRate {
        dsp
        daily
        weekly
        spots
        monthly {
          month1
        }
      }
      monthlySummary {
        id
        childPercentage
        uniqueVisitors
        totalVisitors
      }
    }
  }
`;
//PropertyList VenueType
export const PROPERTY_LIST_VENUE_TYPE_LIST = gql`
  query GetVenueTypeList {
    venueTypes {
      id
      name
      value
      child {
        id
        name
        value
        child {
          id
          name
          value
        }
      }
    }
  }
`;
// Register
export const REGISTER_MUTATION = gql`
  mutation RegisterUser($input: CreateUserInput!) {
    adduser(input: $input) {
      message
    }
  }
`;

// State List Dropdown 
export const GET_STATE_LIST = gql`
  query GetStateList($countryId: String!) {
    stateList(countryId: $countryId) {
      stateId
      name
    }
  }
`;

// Currency_code
export const Get_Currency_Code_Details = gql `

    query GetCurrencyCodeDetails($countryCurrencyCode: String!) {
      currencyCodeDetails(countryCurrencyCode: $countryCurrencyCode) {
        country
        currencyCode
      }
    }
`;

// Media_id
  export const Media_Id = gql`
  mutation GetMediaOwnerByDomain($domainName: String!) {
    mediaOwnerByDomain(input: { domainName: $domainName }) {
      mediaOwner {
        id
        domainName
        mediaOwnerCompanyId
      }
    }
  }
`;

// Country_id
export const Get_Country_Code = gql`
  query GetCountryCodeExplore($ownerId: String!) {
    getCountryCodeNoToken(ownerId: $ownerId) {
      countryId
      countryName
    }
  }
`;

// Home3_billboard
export const Get_ThreeBillboard = gql`
  query topThreeBillboard($companyId: String!) {
    topThreeBillboard(companyId: $companyId) {
      id
      stateId
      stateName
      displayName
      priceRates
      thumbnailPath
      billboardType
      billboardObjectId
    }
  }
`;

// Explore_Property VenueType
export const EXPLORE_PROPERTY_VENUE_TYPE_LIST = gql`
  query GetVenueTypeList($countryId: String!) {
    venueTypes(countryId: $countryId) {
      id
      name
      value
      child {
        id
        name
        value
        child {
          id
          name
          value
        }
      }
    }
  }
`;

// Explore_PropertyDetails
export const EXPLORE_PROPERTY_DETAILS =gql`
query PropertyDetailsWithoutLogin(
  $companyId: String!,
  $countryId: String!,
  $id: String!,
  $billboardType: String!
) {
  propertyDetailsWithoutLogin(
    companyId: $companyId,
    countryId: $countryId,
    id: $id,
    billboardType: $billboardType
  ) {
    id
    billboardObjectId
    referenceId
    billboardName
    billboardType
    billboardDisplayName
    billboardCategory
    totalVisitors
    uniqueVisitors
    maleVisitors
    femaleVisitors
    childVisitors
    youngAdultVisitors
    adultVisitors
    seniorVisitors
    circulation
    reach
    frequency
    malePercentage
    femalePercentage
    childPercentage
    youngAdultPercentage
    adultPercentage
    seniorPercentage
    percentage10To19
    percentage18To24
    percentage20To29
    percentage25To34
    percentage30To39
    percentage35To44
    percentage40To49
    percentage45To54
    percentage50To59
    percentage55To64
    percentage60Plus
    percentage65Plus
    genderSpecificAgeGroups
    ethnicity {
      malayCount
      chineseCount
      indianCount
      othersCount
      malayPercentage
      chinesePercentage
      indianPercentage
      othersPercentage
    }
    country {
      id
      name
      iso
      countryId
      countryObjectId
      trCountryName
      nameJa
    }
    totalBillboardCount
    summaryMonth
  }
}
`;

//Explore Property
export const GET_LANDING_EXPLORATION = gql`
  query LandingExploreProperties(
    $billboard: String!,
    $page: Int!,
    $size: Int!,
    $sort: String!,
    $startDate: String!,
    $endDate: String!,
    $dspName: String!,
    $companyId: String!,
    $countryId: String!,
    $searchTerm: String!,
    $filterData: FilterDataInput!
  ) {
    landingpageExplorePropertiesNotoken(
      billboard: $billboard,
      page: $page,
      size: $size,
      sort: $sort,
      startDate: $startDate,
      endDate: $endDate,
      dspName: $dspName,
      companyId: $companyId,
      countryId: $countryId,
      searchTerm: $searchTerm,
      filterData: $filterData
    ) {
      id
      name
      displayName
      referenceId
      latitude
      longitude
      category
      type
      panelWidth
      panelHeight
      resolutionWidth
      resolutionHeight
      panelSize
      formattedAddress
      facingDirection
      group
      venueType
      totalSize
      mediaOwnerId
      nextAvailableDate
      format
      specification {
        id
        specificationId
        description
        panel
        screens
        manufacturer
        playerSoftware
        playerSoftwareModule {
          id
          name
          shortName
          description
          apiUrl
          accessToken
          active
          integratedWithLmx
          allowedPushToContentTypes
          creativeConfiguration
        }
        otherPlayer
        resolution1Width
        resolution1Height
        panel1Width
        panel1Height
        panel1Size
        resolution2Width
        resolution2Height
        panel2Width
        panel2Height
        panel2Size
        resolution3Width
        resolution3Height
        panel3Width
        panel3Height
        panel3Size
        resolution4Width
        resolution4Height
        panel4Width
        panel4Height
        panel4Size
        resolution5Width
        resolution5Height
        panel5Width
        panel5Height
        panel5Size
        resolution6Width
        resolution6Height
        panel6Width
        panel6Height
        panel6Size
        age
        totalSquareResolution
        ledPitch
        videoSupport
        imageSupport
        audioSupport
        audioFormats
        contentApproval
        featureSupport
        availableHours
        leadTime
        exclusiveTo
        language
        creativeResolutionWidth
        creativeResolutionHeight
        sellAsNetwork
        roadSideBoard
        heightFromFloor
        billboardSize
        supportedMediaType
        motionAndStatic
        panel1Id
        panel2Id
        panel3Id
        panel4Id
        panel5Id
        panel6Id
        frameId
        panelSizeList
      }
      price {
        id
        priceId
        screenOnTime
        screenOffTime
        displayOnTime
        displayOffTime
        spotDuration
        contentFrequencyPerHour
        clients
        localCurrencies {
          id
          currencyId
          iso
          country
          currency
          code
          symbol
          numcode
          decimals
          locale
        }
        localStandardRates
        internationalStandardRates
        buyingLocalMonthlyRates
        buyingInternationalMonthlyRates
        sellingLocalMonthlyRates
        sellingInternationalMonthlyRates
        fullDay
        daypart
        daypartEntries
        minimumSpotDurationPerDay
        maximumSpotDurationPerDay
        localContentManagementCost
        internationalContentManagementCost
        modeOfOperation
        loopDurationInSeconds
        loopLocalBuyingRates
        loopLocalSellingRates
        loopInternationalBuyingRates
        loopInternationalSellingRates
        spotLocalBaseRates
        spotInternationalBaseRates
        spotMediaOperatorPercentage
        spotInternalPercentage
        screenDuration
        loopDuration
        movingWallsSpot
        nearbyPOI
        viewability
        programmaticEnabled
        availableForBuying
        customizeSellingTerms
        digitalBillboardDayMinimumValue
        enableDigitalDay
        digitalBillboardHourMinimumValue
        enableDigitalHour
        sellingTermsPrice
        rateCardType
        reason
        spotMapping
        apiIntegration
        htmlPlayable
        spotBasedPrice
        floorPrice
        creativeType
        openAuctionType
        openAuctionMinimumSpots
        openAuctionMinimumPercentage
        openAuctionCurrency
        openAuctionSpotDuration
        auctionType
        impMultiplier
        fillerContentUrl
        creativeServerUrl
        manufacturingCost
        constructionCost
        maintenanceCost
        otherCosts
        availableHoursStart
        availableHoursEnd
        offlinePath
        spotAllocations
        totalSquareResolution
        spotAllocationArr
        availabilityPerc
        spotsAvailability
        clientsAvailability
        nextAvailableDate
        spotAvailabilityPerc
      }
      mediaOwnerName
      countryId
      countryName
      stateId
      stateName
      districtId
      districtName
      active
      availableBooking
      subscription
      thumbnailPath
      googleMapUrl
      timezone
      totalSpots
      totalBookedSpots
      spotsAvailability
      spotAvailabilityPerc
      clientsAvailability
      nextAvailableDate
      currency
      createdBy
      createdDate
      lastModifiedBy
      lastModifiedDate
      count
      trTimeZone
      trCountryName
      trStateName
      trDistrictName
      sellingRate {
        dsp
        daily
        weekly
        spots
        monthly {
          month1
          month3
          month6
          month12
        }
      }
      monthlySummary {
        id
        childPercentage
        childVisitors
        adultPercentage
        adultVisitors
        youngAdultPercentage
        youngAdultVisitors
        femalePercentage
        femaleVisitors
        malePercentage
        maleVisitors
        seniorPercentage
        seniorVisitors
        totalVisitors
        uniqueVisitors
        reach
        frequency
        circulation
      }
    }
  }
`;

// Country_list
export const GET_COUNTRY_LIST = gql`
  query {
      countryList {
        countryId
        name
        iso
        dialingCode
        id
      }
    }

`;

// Login
export const AUTHENTICATE_MUTATION = gql`
    mutation Authenticate($username: String!, $password: String!) {
        authenticate(input: { username: $username, password: $password }) {
            authData {
                accessToken
                expiresIn
                scope
                tokenType
            }
        }   
    }
`;

// Forgot Query
export const FORGET_PASSWORD = gql`
  mutation forgetPassword($email: String!, $platformSource: String!, $platformBaseUrl: String!, $publisherId: String!) {
    forgetPassword(email: $email, platformSource: $platformSource, platformBaseUrl: $platformBaseUrl, publisherId: $publisherId) {
      message
    }
  }
`;

// Mycampaign_list
export const MYCAMPAIGN_LIST = gql`
    query mycampaignList($accessToken: String!,
    $page: Int!,
    $size: Int!,
    $sort: String!,
    $companyId: String!,
    $campaignStatus: String,
    $userId: String!,
    $name: String!
    ) {
        mycampaignList(accessToken: $accessToken,
        page: $page,
        size:$size,
        sort:  $sort,
        companyId: $companyId,
        campaignStatus: $campaignStatus,
        userId: $userId,
        name: $name
        ) {
            content {
                id
                dealId
                name
                bookingSource
                startDate {
                  date
                  dateStr
                  dateFmt
                }
                endDate {
                  date
                  dateStr
                  dateFmt
                }
                dsp
                campaignStatus
                priceSummary {
                  subTotal
                  netTotal
                  currency {
                    country
                    symbol
                    code
                  }
                  tax {
                    name
                    value
                    percent
                  }
                  pcrEnable
                }
                inventoriesSummary {
                  classicInventories
                  digitalInventories
                  packages
                }
                packages
                campaignInventories {
                  id
                  dsp
                  startDate
                  endDate
                  companyId
                  inventoryName
                  inventoryId
                  inventoryReferenceId
                  deviceId
                  foreignBillboardId
                  networkId
                  inventoryType
                  inventoryAddress
                  inventoryVenueType
                  inventoryResolutions
                  inventoryThumbnailUrl
                  packageDetails
                  inventoryPrice
                  inventoryReports {
                    totalPotentialViews
                    averageFrequency
                    cpm
                    totalReach
                  }
                  inventoryLatitude
                  inventoryLongitude
                  inventoryFormat
                  nowPayPrice
                  discount
                  spotDuration
                  negotiationSummary
                }
                agency {
                  id
                  name
                }
                company {
                  id
                  name
                }
                user {
                  id
                  name
                }
                summaryReport {
                  potentialViews
                  uniqueReach
                  cpm
                  averageFrequency
                  totalSpots
                }
                externalCampaignId
                madCampaignId
                reasonForRejection
                reporting
                negotiationSummary
                mediaBookingOrdersInvoiceId
            }
            pageable {
                sort {
                    sorted
                    unsorted
                }
                offset
                pageSize
                pageNumber
                unpaged
                paged
            }
            last
            totalElements
            totalPages
            size
            number
            first
            sort {
                sorted
                unsorted
            }
            numberOfElements
        }
    }
`;

// Get_campaign
export const GET_CAMPAIGNS = gql`
query getCampaigns($campaignId: String!){
  getCampaigns(campaignId: $campaignId) {
    id
    campaignName
    startDate
    endDate
    state
    district
    createdAt
  }
}
`;

// Get_district
export const GET_DISTRICT_LIST = gql`
  query GetDistrictList($stateid: String!) {
    districtList(stateid: $stateid) {
      districtId
      name
    }
  }
`;

// cartPageItem
export const CART_PAGE_ITEM = gql`
  query cartPageItem($accessToken: String!, $userId: String!,$edit:Boolean!, $campaignId: String!, $startDate: String!, $endDate: String!) {
    cartPageItem(
      accessToken: $accessToken,
      userId: $userId,
      edit: $edit,
      campaignId: $campaignId,
      startDate: $startDate,
      endDate: $endDate
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
          billboardPeriodSubTotalPrice
          billboardThumbnailUrl
          billboardCurrencyCode
          isDraft
          availableBooking
        }
      }
  }
`;

//Delete Query
export const DELETE_CART_PAGE = gql`
  mutation deleteCartItem($accessToken: String!, $deleteItemId: ID!, $itemType: String!) {
    deleteCartItem(accessToken: $accessToken, deleteItemId: $deleteItemId, itemType: $itemType) {
      success
      message
      statusCode
    }
  }
`;

// Request Query
export const REQUEST_FOR_APPROVAL = gql`
    mutation requestForApproval(  
        $campaignType: String!,
        $campaignId: String!,
        $input: CampaignInput!
    ) {
        requestForApproval(
            campaignType: $campaignType,
            campaignId: $campaignId,
            input: $input
        ) {
            campaign {
                id
                dealId
                name
                bookingSource
                startDate
                endDate
                campaignStatus
            }
        }
    }
`;

// Mycart
export const MY_CART_ITEM_LIST = gql`
  query mycartItemList($accessToken: String!, $id: String!) {
    mycartItemList(accessToken: $accessToken, id: $id) {
      id
      group
      resolutionWidth
      thumbnailPath
      resolutionHeight
      name
      displayName
      type
      sellingRate {
        monthly {
          month1
        }
      }
      monthlySummary {
        id
        totalVisitors
        uniqueVisitors
        reach
        frequency
      }
    }
  }
`;

// Added for account detail on 25-07-2024 by tejashree
export const ACCOUNT = gql`
query($accessToken: String!) {
  userAccount(accessToken: $accessToken){
    id
    email
    companyId
    countryId
    username
    email
    companyName
    countryName
    taxPercent
    taxLabel   
    dsp
    latitude
    longitude
    firstName
    lastName
  }
}`

// Query for Property details added by Tejashree on 13-08-2024
export const GET_PROPERTY_DETAILS = gql`
  query GetPropertyDetails(
    $accessToken: String!, 
    $id: String!, 
    $countryId: String!, 
    $companyId: String!, 
    $billboardType: String!
  ) {
    propertyDetails(
      accessToken: $accessToken, 
      id: $id, 
      countryId: $countryId, 
      companyId: $companyId, 
      billboardType: $billboardType
    ) {
      referenceId
      latitude
      longitude
      deviceId
      name
      displayName
      company
      facingDirection
      cardinalPoint
      category
      subCategory
      group
      type
      stateName
      format
      venueType
      mediaOwnerName
      loopDuration
      displayOnTime
      displayOffTime
      nextAvailableDate
      sellingRate {
        dsp
        daily
        weekly
        spots
        monthly {
          month1
          month3
          month6
          month12
        }
      }
      venueTypeItems {
        parents
        childs
        grandChilds
      }
      venueTypeLocale {
        en
      }
      district {
        id
        districtId
        name
        nameJa
        type
        state {
          id
          stateId
          name
          nameJa
          type
          country {
            id
            countryId
            name
            nameJa
            latitude
            longitude
            zoom
            mediaOwnerTermsAndConditions
            buyerTermsAndConditions
            population
            iso
            postalformat
            postalname
            geopc
            active
            dialingCode
            timezone
            miDataSensorStatus
            tax {
              label
              percent
            }
          }
        }
        trDistrictName
        miDataSensorStatus
      }
      formattedAddress
      specification {
        panel
        screens
        resolution1Width
        resolution1Height
        panel1Size
        playerSoftwareModule {
          id
          description
          apiUrl
          accessToken
          active
          integratedWithLmx
          allowedPushToContentTypes
          creativeConfiguration
        }
        ledPitch
        videoSupport
        imageSupport
        audioSupport
        audioFormats
        contentApproval
        featureSupport
        availableHours
        billboardSize
        panels
      }
      monthlySummary {
        id
        totalVisitors
        uniqueVisitors
        reach
        frequency
        circulation
        childPercentage
        childVisitors
        adultPercentage
        adultVisitors
        youngAdultPercentage
        youngAdultVisitors
        femalePercentage
        femaleVisitors
        malePercentage
        maleVisitors
        seniorPercentage
        seniorVisitors
      }
      price {
        screenOnTime
        screenOffTime
        openAuctionCurrency
        spotDuration
        contentFrequencyPerHour
        clients
        modeOfOperation
        maximumSpotDurationPerDay
        minimumSpotDurationPerDay
        
      }
      thumbnailPath
      companyId {
        id
        companyId
        name
        companyType
        registrationNumber
        registrationAddress {
          street
          city
          state
          country
          district
          postCode
          building
          trCountryName
          trStateName
          trDistrictName
          concatenatedAddress
        }
      }
      phone
      timezone
      dataSource
      supportedMediaType
    }
  }
`;

//Landing-Contact-us
export const CONTACT_US_MUTATION = gql`
  mutation ContactUs($body: String!, $template: String) {
    contactUs(body: $body, template: $template) {
      status
    }
  }
`;

// Delivery-Report
export const DELIVERY_REPORTS_QUERY = gql`
    query DeliveryReports(
        $accessToken: String!,
        $campaignId: String!,
        $page: Int,
        $size: Int,
        $sort: String,
        $search: String
    ) {
        deliveryReports(
            accessToken: $accessToken,
            campaignId: $campaignId,
            page: $page,
            size: $size,
            sort: $sort,
            search: $search
        ) {
            id
            campaignName
            campaignId
            campaignStatus
            dealId
            dsp
            agency {
                id
                name
            }
            startDate {
                date
                dateStr
                dateFmt
            }
            endDate {
                date
                dateStr
                dateFmt
            }
            totalPages
            companyId
            inventoryName
            inventoryId
            inventoryReferenceId
            deviceId
            inventoryType
            inventoryAddress
            inventoryVenueType
            inventoryResolutions
            inventoryLocation
            inventoryReports {
                totalPotentialViews
                averageFrequency
                cpm
                totalReach
            }
            inventoryThumbnailUrl
            inventoryLatitude
            inventoryLongitude
            inventoryPrice
            availableBooking
            nextAvailableDate
            spotsAvailability
            clientsAvailability
            inventoryDetails {
                id
                billboardId
                referenceId
                deviceId
                name
                displayName
                company
                facingDirection
                category
                group
                type
                format
                venueType
                latitude
                longitude
                active
                country {
                    id
                    countryId
                    name
                    latitude
                    longitude
                    population
                    iso
                    postalformat
                    postalname
                    geopc
                    active
                    dialingCode
                    timezone
                    miDataSensorStatus
                    tax {
                        label
                        percent
                    }
                }
                city
                companyId {
                    id
                    companyId
                    name
                    companyType
                    registrationNumber
                }
            }
        }
    }
`;

//Content-Hub
export const CONTENT_HUB_QUERY = gql`
  query ContentHub(
    $accessToken: String!,
    $page: Int!,
    $size: Int!,
    $metadatatype: String!,
    $metadatacampaign: Boolean!,
    $companyId: String!,
    $creatives: Boolean!,
    $userId: String!,
    $sort: String!,
    $fileName: String!,
    $resolution: String!,
    $mimeType: String!,
  ) {
    contentHub(
      accessToken: $accessToken,
      page: $page,
      size: $size,
      metadatatype: $metadatatype,
      metadatacampaign: $metadatacampaign,
      companyId: $companyId,
      creatives: $creatives,
      userId: $userId,
      sort: $sort,
      fileName: $fileName,
      resolution: $resolution,
      mimeType: $mimeType
    ) {
      id
      fileName
      mimeType
      duration
      filePath
      userId
      companyId
      countryId
      status
      resolution
      userCountry
      thumbnail
      totalPages
    }
  }
`;

// Upload Query
export const UPLOAD_CONTENT_MUTATION = gql`
mutation UploadContent($accessToken: String!, $file: Upload!, $mediaOwnerId: String!, $filetype: String!, $source: String!, $userId: String!) {
          uploadcontent(
            accessToken: $accessToken,
            file: $file,
            mediaOwnerId: $mediaOwnerId,
            filetype: $filetype,
            source: $source,
            userId: $userId
          ) {
            success
            message
          }
        }
`;

// Delete_content
export const DELETE_CONTENT_MUTATION = gql`
  mutation DeleteContent($accessToken: String!, $contentIds: [ID!]!) {
    deleteContent(accessToken: $accessToken, contentIds: $contentIds) {
      message
    }
  }
`;

// Mycampaign_list
export const MY_CAMPAIGN_LIST_QUERY = gql`
  query MyCampaignList(
    $accessToken: String!,
    $userId: String!,
    $companyId: String!,
    $sort: String!,
    $name: String!,
    $campaignStatus: String,
    $page: Int!,
    $size: Int!
  ) {
    mycampaignList(
      accessToken: $accessToken,
      userId: $userId,
      companyId: $companyId,
      sort: $sort,
      name: $name,
      campaignStatus: $campaignStatus,
      page: $page,
      size: $size
    ) {
      content {
        id
        dealId
        name
        bookingSource
        startDate {
          date
          dateStr
          dateFmt
        }
        endDate {
          date
          dateStr
          dateFmt
        }
        dsp
        campaignStatus
        priceSummary {
          subTotal
          netTotal
          currency {
            country
            symbol
            code
          }
          tax {
            name
            value
            percent
          }
          pcrEnable
        }
        inventoriesSummary {
          classicInventories
          digitalInventories
          packages
        }
        reporting {
        proofOfPlay
        deliveryReports
        }
        packages
        campaignInventories {
          id
          dsp
          startDate
          endDate
          companyId
          inventoryName
          inventoryId
          inventoryReferenceId
          deviceId
          foreignBillboardId
          networkId
          inventoryType
          inventoryAddress
          inventoryVenueType
          inventoryResolutions
          inventoryThumbnailUrl
          packageDetails
          inventoryPrice
          inventoryReports {
            totalPotentialViews
            averageFrequency
            cpm
            totalReach
          }
          inventoryLatitude
          inventoryLongitude
          inventoryFormat
          nowPayPrice
          discount
          spotDuration
          negotiationSummary {
            buyerPreferredPrice {
              totalPrice
              savingsPrice
              savingsPerc
              nowPayPrice
              dailyPrice
              subTotal
            }
            mediaOwnerPreferredPrice {
              totalPrice
              savingsPrice
              savingsPerc
              nowPayPrice
              dailyPrice
              subTotal
            }
            contentManagementFeePerc
            platformFeePerc
            taxPerc
            discountPerc
            status
            accountType
            summaryReport {
              potentialViews
              uniqueReach
              cpm
              averageFrequency
              totalSpots
            }
          }
        }
        agency {
          id
          name
        }
        company {
          id
          name
        }
        user {
          id
          name
        }
        summaryReport {
          potentialViews
          uniqueReach
          cpm
          averageFrequency
          totalSpots
        }
        externalCampaignId
        madCampaignId
        reasonForRejection
        mediaBookingOrdersInvoiceId
        negotiationSummary {
          buyerPreferredPrice {
            totalPrice
            savingsPrice
            savingsPerc
            nowPayPrice
            dailyPrice
            subTotal
          }
          mediaOwnerPreferredPrice {
            totalPrice
            savingsPrice
            savingsPerc
            nowPayPrice
            dailyPrice
            subTotal
          }
          contentManagementFeePerc
          platformFeePerc
          taxPerc
          discountPerc
          status
          accountType
          summaryReport {
            potentialViews
            uniqueReach
            cpm
            averageFrequency
            totalSpots
          }
        }
      }
      pageable {
        sort {
          sorted
          unsorted
        }
        offset
        pageSize
        pageNumber
        unpaged
        paged
      }
      last
      totalElements
      totalPages
      size
      number
      first
      sort {
        sorted
        unsorted
      }
      numberOfElements
    }
  }
`;

// Invoice
export const INVOICE = gql`
  query Invoice($accessToken: String!, $campId: String!) {
    paymentInvoice(
      accessToken: $accessToken
      campID: $campId
    ) 
     {
        id
        dealId
        name
        bookingSource
        startDate {
          date
          dateStr
          dateFmt
        }
        endDate {
          date
          dateStr
          dateFmt
        }
        dsp
        campaignStatus
        priceSummary {
          subTotal
          netTotal
          currency {
            country
            symbol
            code
          }
          tax {
            name
            value
            percent
          }
          pcrEnable
        }
        inventoriesSummary {
          classicInventories
          digitalInventories
          packages
        }
        packages
        campaignInventories {
          id
          dsp
          startDate
          endDate
          companyId
          inventoryName
          inventoryId
          inventoryReferenceId
          deviceId
          foreignBillboardId
          networkId
          inventoryType
          inventoryAddress
          inventoryVenueType
          inventoryResolutions
          inventoryThumbnailUrl
          packageDetails
          inventoryPrice
          inventoryReports {
            totalPotentialViews
            averageFrequency
            cpm
            totalReach
          }
          inventoryLatitude
          inventoryLongitude
          inventoryFormat
          nowPayPrice
          discount
          spotDuration
          negotiationSummary {
            buyerPreferredPrice {
              totalPrice
              savingsPrice
              savingsPerc
              nowPayPrice
              dailyPrice
              subTotal
            }
            mediaOwnerPreferredPrice {
              totalPrice
              savingsPrice
              savingsPerc
              nowPayPrice
              dailyPrice
              subTotal
            }
            contentManagementFeePerc
            platformFeePerc
            taxPerc
            discountPerc
            customFees
            summaryReport {
              potentialViews
              uniqueReach
              cpm
              totalSpots
            }
            status
            accountType
            requestFrom
          }
        }
        agency {
          id
          name
        }
        company {
          id
          name
        }
        user {
          id
          name
        }
        summaryReport {
          potentialViews
          uniqueReach
          cpm
          averageFrequency
          totalSpots
        }
        externalCampaignId
        madCampaignId
        reasonForRejection
         reporting {
          proofOfPlay
          deliveryReports
        }
        negotiationSummary {
          buyerPreferredPrice {
            totalPrice
            savingsPrice
            savingsPerc
            nowPayPrice
            dailyPrice
            subTotal
          }
          mediaOwnerPreferredPrice {
            totalPrice
            savingsPrice
            savingsPerc
            nowPayPrice
            dailyPrice
            subTotal
          }
          contentManagementFeePerc
          platformFeePerc
          taxPerc
          discountPerc
          customFees
          summaryReport {
            potentialViews
            uniqueReach
            cpm
            totalSpots
          }
          status
          accountType
          requestFrom
        }
        mediaBookingOrdersInvoiceId {
          invoiceId
        }
      }

  }
`;

// Edit campaign
export const EDIT_CAMPAIGN = gql`
  query editCampaignList($accessToken: String!, $campaignId: String!, $userId : String!,$edit:Boolean!) {
      editPageItem(
      accessToken: $accessToken,
      edit: $edit,
      campaignId: $campaignId,
      userId: $userId
      ){
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
          billboardPeriodSubTotalPrice
          billboardThumbnailUrl
          billboardCurrencyCode
          isDraft
        }
      }
  }
`;

// Assign-creative list
export const ASSIGN_CREATIVES_ITEM_QUERY = gql`
query AssignCreativesItem($accessToken: String!, $id: String!, $searchTerm: String!, $page: String!) {
  assignCreativesItem(accessToken: $accessToken, id: $id, searchTerm: $searchTerm, page: $page) {
    id
    campaignName
    campaignId
    campaignStatus
    dealId
    dsp
    totalPages
    agency {
      id
      name
    }
    startDate {
      date
      dateStr
      dateFmt
    }
    endDate {
      date
      dateStr
      dateFmt
    }
    companyId
    inventoryName
    inventoryId
    inventoryReferenceId
    deviceId
    inventoryType
    inventoryAddress
    inventoryVenueType
    inventoryResolutions
    inventoryLocation
    duration
    inventoryReports {
      totalPotentialViews
      averageFrequency
      cpm
      totalReach
    }
    inventoryDetails {
      resolution1Width
      resolution1Height
      panel1Width
      panel1Height
      panel1Size
      videoSupport
      imageSupport
    }
    inventoryThumbnailUrl
    inventoryLatitude
    inventoryLongitude
    inventoryPrice
  }
}
`;

// Get_assign
export const GET_ASSIGNED_CONTENT = gql`
query AssignedContent(
  $accessToken: String!,
  $billboardId: String!,
  $campaignId: String!,
  $companyId: String!
) {
  assignedContent(
    accessToken: $accessToken,
    billboardId: $billboardId,
    campaignId: $campaignId,
    companyId: $companyId
  ) {
    id
    masterCreativeId
    status
    resolution
    fileName
    thumbnail
  }
}
`;

// Get Assign Count
export const ASSIGNED_CONTENT_COUNT = gql`
  query AssignedContentCount(
    $accessToken: String!,
    $billboardIds: [String!]!,
    $companyId: String!,
    $campaignId: String!
  ) {
    assignedContentCount(
      accessToken: $accessToken,
      billboardIds: $billboardIds,
      companyId: $companyId,
      campaignId: $campaignId
    ) {
      count
      id
    }
  }
`;

// Get Ecommerce Assets
export const GET_ASSIGN_ECOMMERCE_ASSETS = gql`
query EcommerceAssets(
  $accessToken: String!,
  $companyId: String!,
  $userId: String!,
  $page: Int!,
   $resolution: String,
) {
  ecommerceAssets(
    accessToken: $accessToken,
    companyId: $companyId,
    userId: $userId,
    page: $page,
    resolution: $resolution,
  ) {
    id
    creativeRefId
    masterCreativeId
    fileName
    mimeType
    fileSize
    duration
    filePath
    thumbnail
    thumbnailAvailable
    userId
    companyId
    countryId
    source
    status
    metadata {
      type
      dealId
      campaignId
      billboardId
      mediaOwnerId
      agencyId
      comments
      folder
      approvedBy
      rejectedBy
      maxStatus
      campaign
      buyerCreativeId
      brandId
      productId
      tagIds
    }
    resolution
    comments
    maxAssignedCreativeId
    proofOfPlayStatus
    rejectMessage
    title
    totalPages
    description
    creativeName
    creativeAdType
    callToActionUrl
    callToActionText
    createdBy
    createdDate
    lastModifiedBy
    lastModifiedDate
  }
}
`;

// Gallery Assets
export const GALLERY_IMAGE_ASSETS_QUERY = gql`
  query GetGalleryImageAssets(
    $sort: String!,
    $metadataBillboardId: String!,
    $metadataType: String!
  ) {
    galleryImageAssets(
      sort: $sort
      metadataBillboardId: $metadataBillboardId
      metadataType: $metadataType
    ) {
      id
      fileName
      mimeType
      fileSize
      duration
      filePath
      thumbnail
      thumbnailAvailable
      userId
      companyId
      countryId
      source
      status
      metaData {
        type
        billboardId
        mediaOwnerId
        tagged
        latitude
        longitude
        comments
        tags
        primary
        secondary
        source
        uploadedBy
        falcon
      }
      resolution
      comments
      maxAssignedCreativeId
      proofOfPlayStatus
      rejectMessage
      title
      description
      creativeName
      creativeAdType
      callToActionUrl
      callToActionText
      createdBy
      createdDate
      lastModifiedBy
      lastModifiedDate
    }
  }
`;

// User Account
export const USER_ACCOUNT_QUERY = gql`
    query userAccount($accessToken: String!) {
    userAccount(accessToken: $accessToken) {
      id
      login
      password
      firstName
      lastName
      phone
      email
      activated
      langKey
      authorities
      accountType
      companyName
      companyId
      companyType
      country {
        id
        countryId
        name
        nameJa
        latitude
        longitude
        tax {
          label
          percent
        }
      }
      lastModifiedBy
      lastModifiedDate
      ecommerceDomainName
      userCompanyName
      userCompanyId
      userCompanyAddress
      userCompanyPhoneNumber
      platform
      userCountry
      
    }
  }
`;

// export const ASSIGNED_ASSETS_TOCAMPAIGN = gql`
//  mutation AssignAssetToCampaign(
//   $accessToken: String!,
//   $assetId: ID!,
//   $dealId: String!,
//   $campaignId: String!,
//   $billboardId: String!,
//   $inventoryType: String!,
//   $mediaOwnerId: String!,
//   $playInSequence: Boolean!,
//   $landingUrl: String,
//   $mobileInventory: Boolean!,
//   $skippable: Boolean!,
//   $schedule: [ScheduleInput!]!
// ) {
//   assignAssetToCampaign(
//     accessToken: $accessToken,
//     assetId: $assetId,
//     dealId: $dealId,
//     campaignId: $campaignId,
//     billboardId: $billboardId,
//     inventoryType: $inventoryType,
//     mediaOwnerId: $mediaOwnerId,
//     playInSequence: $playInSequence,
//     landingUrl: $landingUrl,
//     mobileInventory: $mobileInventory,
//     skippable: $skippable,
//     schedule: $schedule
//   ) {
//     message
//     statusCode
//     description
//   }
// }
// `;

// Proof Of Play

export const ASSIGNED_ASSETS_TOCAMPAIGN = gql`
  mutation AssignAssetsToCampaign($inputs: [AssignAssetToCampaignInput!]!) {
    assignAssetToCampaign(inputs: $inputs) {
      message
      statusCode
      description
    }
  }
`;
// Proof of Play
export const PROOF_OF_PLAY = gql`
  query ProofOfPlay(
  $accessToken: String!,
  $page: Int!,
  $campaignId: String!,
  $metadataType: String!,
  $metadataCampaignId: String!,
  $metadataMediaOwnerId: String!,
  $source: String!,
  $startDate: String!,
  $endDate: String!,
  $size: Int!,
  $sort: String!
) {
  proofOfPlay(
    accessToken: $accessToken,
    page: $page,
    campaignId: $campaignId,
    metadataType: $metadataType,
    metadataCampaignId: $metadataCampaignId,
    metadataMediaOwnerId: $metadataMediaOwnerId,
    source: $source,
    startDate: $startDate,
    endDate: $endDate,
    size: $size,
    sort: $sort
  ) {
    id
    name
    dealId
    dsp
    bookingSource
    startDate {
      date
    }
    endDate {
      date
    }
    campaignStatus
    packages
    campaignInventories {
      id
      dsp
      startDate
      endDate
      companyId
      inventoryName
      inventoryId
      inventoryReferenceId
      inventoryType
      inventoryAddress
      inventoryVenueType
      inventoryThumbnailUrl
      inventoryPrice
      inventoryReports {
        totalPotentialViews
        averageFrequency
        cpm
        totalReach
      }
      inventoryLatitude
      inventoryLongitude
    }
  }
}

`;

// Proof Of Play Asserts
export const PROOF_OF_PLAY_ASSERTS = gql`
  query ProofOfPlayAssets(
    $accessToken: String!,
    $page: Int,
    $metadataType: String,
    $metadataCampaignId: String,
    $metadataMediaOwnerId: String,
    $source: String,
    $startDate: String,
    $endDate: String,
    $size: Int,
    $sort: String,
    $billboardId: String
  ) {
    proofOfPlayAssets(
      accessToken: $accessToken,
      page: $page,
      metadataType: $metadataType,
      metadataCampaignId: $metadataCampaignId,
      metadataMediaOwnerId: $metadataMediaOwnerId,
      source: $source,
      startDate: $startDate,
      endDate: $endDate,
      size: $size,
      sort: $sort,
      billboardId: $billboardId
    ) {
      id
      creativeRefId
      masterCreativeId
      fileName
      mimeType
      fileSize
      duration
      filePath
      thumbnail
      thumbnailAvailable
      userId
      companyId
      countryId
      source
      status
      createdDate
       metadata{
      billboardId
    }

    }
  }
`;
// Property Details
export const PROPERTY_DETAILS = gql`
  query PropertyDetails($accessToken: String!, $id:  String!, $countryId: String!, $companyId: String!,$billboardType:String!) {
  propertyDetails(accessToken: $accessToken, id: $id, countryId: $countryId, companyId: $companyId,billboardType:$billboardType) {
    referenceId
    latitude
    longitude
    deviceId
    name
    displayName
    company
    facingDirection
    cardinalPoint
    category
    subCategory
    group
    type
    stateName
    format
    venueType
    mediaOwnerName
    loopDuration
    displayOnTime
    displayOffTime
    nextAvailableDate
    sellingRate {
      dsp
      daily
      weekly
      spots
      monthly {
        month1
        month3
        month6
        month12
      }
    }
    venueTypeItems {
      parents
      childs
      grandChilds
    }
    venueTypeLocale {
      en
    }
    district {
      id
      districtId
      name
      nameJa
      type
      state {
        id
        stateId
        name
        nameJa
        type
        country {
          id
          countryId
          name
          nameJa
          latitude
          longitude
          zoom
          mediaOwnerTermsAndConditions
          buyerTermsAndConditions
          population
          iso
          postalformat
          postalname
          geopc
          active
          dialingCode
          timezone
          miDataSensorStatus
          tax {
            label
            percent
          }
        }
      }
      trDistrictName
      miDataSensorStatus
    }
    formattedAddress
    specification {
      panel
      screens
      resolution1Width
      resolution1Height
      panel1Size
      playerSoftwareModule {
        id
        description
        apiUrl
        accessToken
        active
        integratedWithLmx
        allowedPushToContentTypes
        creativeConfiguration
      }
      ledPitch
      videoSupport
      imageSupport
      audioSupport
      audioFormats
      contentApproval
      featureSupport
      availableHours
      billboardSize
      panels
    }
    monthlySummary {
      id
      totalVisitors
      uniqueVisitors
      reach
      frequency
    }
    price {
      screenOnTime
      screenOffTime
      openAuctionCurrency
      spotDuration
      contentFrequencyPerHour
      clients
      modeOfOperation
      maximumSpotDurationPerDay
      minimumSpotDurationPerDay
    }
    thumbnailPath
    companyId {
      id
      companyId
      name
      companyType
      registrationNumber
      registrationAddress {
        street
        city
        state
        country
        district
        postCode
        building
        trCountryName
        trStateName
        trDistrictName
        concatenatedAddress
      }
    }
    phone
    timezone
    dataSource
    supportedMediaType
  }
}

`;
// Propertydetails_Chart
export const PROPERTY_DETAILS_CHART_QUERY = gql`
  query BubbleChart(
    $accessToken: String!,
    $companyId: String!,
    $countryId: String!,
    $id: String!,
    $rankLimit: String!
  ) {
    bubbleChartData(
      accessToken: $accessToken,
      companyId: $companyId,
      countryId: $countryId,
      id: $id,
      rankLimit: $rankLimit
    ) {
      segments {
        name
        firstLevel {
          name
          value
          secondLevel
        }
      }
    }
  }
`;
// Negotiaition_Request_campaign
export const NEGOTIATE_CAMPAIGN_SEND_REQUEST = gql`
mutation Negotiate($negotiationData: NegotiateInput!, $accessToken: String!, $campaignId: String!) {
    negotiate(
        negotiationData: $negotiationData,
        accessToken: $accessToken,
        campaignId: $campaignId
    ) {
        response {
            success
            statusCode
            message
            id
        }
    }
}

`;
//Negotiaition_Campaign
export const NEGOTIATE_CAMPAIGN_QUERY = gql`
  query negotiateCampaign($accessToken: String!, $campaignId: String!) {
    negotiateCampaign(accessToken: $accessToken, campaignId: $campaignId) {
      id
      dealId
      name
      bookingSource
      startDate {
        date
        dateStr
        dateFmt
      }
      endDate {
        date
        dateStr
        dateFmt
      }
      dsp
      campaignStatus
      priceSummary {
        subTotal
        netTotal
        currency {
          country
          symbol
          code
        }
        tax {
          name
          value
          percent
        }
        pcrEnable
      }
      inventoriesSummary {
        classicInventories
        digitalInventories
        packages
      }
      packages
      campaignInventories {
        id
        dsp
        startDate
        endDate
        inventoryName
        inventoryId
        inventoryThumbnailUrl
        inventoryType
        inventoryReports {
          totalPotentialViews
          averageFrequency
          cpm
          totalReach
        }
        discount
        negotiationSummary {
          buyerPreferredPrice {
            totalPrice
            savingsPrice
            savingsPerc
            nowPayPrice
            dailyPrice
            subTotal
          }
          mediaOwnerPreferredPrice {
            totalPrice
            savingsPrice
            savingsPerc
            nowPayPrice
            dailyPrice
            subTotal
          }
          contentManagementFeePerc
          platformFeePerc
          taxPerc
          discountPerc
          customFees
          summaryReport {
            potentialViews
            uniqueReach
            cpm
            totalSpots
          }
          status
          accountType
          requestFrom
        }
      }
      agency {
        id
        name
      }
      company {
        id
        name
      }
      user {
        id
        name
      }
      summaryReport {
        potentialViews
        uniqueReach
        cpm
        averageFrequency
        totalSpots
      }
      externalCampaignId
      madCampaignId
      reasonForRejection
      reporting {
        proofOfPlay
        deliveryReports
      }
      negotiationSummary {
        buyerPreferredPrice {
          totalPrice
          savingsPrice
          savingsPerc
          nowPayPrice
          dailyPrice
          subTotal
        }
        mediaOwnerPreferredPrice {
          totalPrice
          savingsPrice
          savingsPerc
          nowPayPrice
          dailyPrice
          subTotal
        }
        contentManagementFeePerc
        platformFeePerc
        taxPerc
        discountPerc
        customFees
        summaryReport {
          potentialViews
          uniqueReach
          cpm
          totalSpots
        }
        status
        accountType
        requestFrom
      }
    }
  }
`;
// Change Password
export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($accessToken: String!, $newPassword: String!, $userId: String!) {
    changePassword(
      accessToken: $accessToken,
      newPassword: $newPassword,
      userId: $userId
    ) {
      response {
        success
        message
      }
    }
  }
`;
//Update_Profile
export const UPDATE_PROFILE_MUTATION = gql`
mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    message
  }
}
`;
// Cart page Initaial Qurey
export const CART_INITIAL_QUERY = gql`
  query($accessToken: String!, $userId: String!) {
    cartpageItem(accessToken: $accessToken, userId: $userId) {
      id
      userId
      campaignName
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
// Payment Pending
export const CREATE_CHECKOUT_SESSION = gql`
  mutation CreateCheckoutSession(
    $basket: BasketInput!,
    $payPublicKey: String!,
    $paySecretKey: String!,
    $siteType: String!,
    $currentDomain: String!
  ) {
    createCheckoutSession(
      basket: $basket,
      payPublicKey: $payPublicKey,
      paySecretKey: $paySecretKey,
      siteType: $siteType,
      currentDomain: $currentDomain
    ) {
      id
      url
      requiresAction
      clientSecret
      error
    }
  }
`;
// Payment Success
export const UPDATESTATUSMUTATION = gql`
  mutation UPDATESTATUSMUTATION(
    $accessToken: String!,
    $campaignId: String!,
    $reasonForRejection: String,
    $campaignStatus: String!
  ) {
    updateCampaignStatus(
      accessToken: $accessToken,
      campaignId: $campaignId,
      reasonForRejection: $reasonForRejection,
      campaignStatus: $campaignStatus
    ) {
      success
      message
    }
  }
`;
// Submit Enquiry
export const SUBMIT_ENQUIRY=gql`
mutation SubmitEnquiry(
  $name: String!,
  $companyName: String!,
  $email: String!,
  $phone: String!,
  $address: String!,
  $startDate: String!,
  $endDate: String!,
  $addedBillboardIds: [ID!]!,
  $companyId: String!,
  $countryId: String!
) {
  submitEnquiry(
    name: $name,
    companyName: $companyName,
    email: $email,
    phone: $phone,
    address: $address,
    startDate: $startDate,
    endDate: $endDate,
    addedBillboardIds: $addedBillboardIds,
    companyId: $companyId,
    countryId: $countryId
  ) {
    message
  }
}
`;