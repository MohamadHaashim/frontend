import { gql } from '@apollo/client';

export const GETPROPERTY_LIST = gql`
  query landingpageExploreProperties(
      $accessToken: String!,
      $sort: String!,
      $billboard: String!
      $startDate: String!,
      $endDate: String!,
      $dspName: String!,
      $companyId: String!,
      $countryId: String!,
      $page: Int!,
      $size: Int!,
      $searchTerm: String!,
      $filterData: FilterInput!,
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
      size: $size,
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
      totalSize
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


//Explore Property
export const GET_LANDING_EXPLORATION = gql`
  query LandingExplorePropertiesNotoken(
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
    $filterData: FilterInput!
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