import { GETPROPERTY_LIST } from "./PropertyListQueries";
import {
    EXPLORE_PROPERTY_BUTTON,
    MY_CAMPAIGN_LIST_QUERY,
    CONTENT_HUB_QUERY,
    DELIVERY_REPORTS_QUERY,
    INVOICE,
    CART_PAGE_ITEM,
    PROPERTY_DETAILS,
    PROPERTY_DETAILS_CHART_QUERY,
    CART_INITIAL_QUERY,
} from "./Queries";
import { faker } from "@faker-js/faker";

const timeZones = [
    'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney', 'America/Los_Angeles'
];

const getRandomElement = (array: any) => {
    return array[Math.floor(Math.random() * array.length)];
};

// Mock data generation function for EXPLORE_PROPERTY_BUTTON
function getLandingPageData() {

    const mockData = {
        data: {
            landingpageExploreButton: Array.from({ length: 5 }, () => ({
                id: faker.string.uuid(),
                foreignBillboardId: null,
                name: faker.location.city(), // Random city name
                displayName: faker.person.firstName(),
                deviceId: null,
                latitude: faker.location.latitude(),
                longitude: faker.location.longitude(),
                category: getRandomElement(['INDOOR', 'OUTDOOR']),
                type: getRandomElement(['DIGITAL', 'STATIC']),
                resolutionWidth: faker.number.float({ min: 720, max: 3840, fractionDigits: 2 }),
                resolutionHeight: faker.number.float({ min: 1080, max: 2160, fractionDigits: 2 }),
                panelWidth: faker.number.float({ min: 5, max: 20, fractionDigits: 2 }),
                panelHeight: faker.number.float({ min: 5, max: 10, fractionDigits: 2 }),
                panelSize: faker.number.float({ min: 50, max: 200, fractionDigits: 2 }),
                venueType: getRandomElement(['Transit', 'Airports', 'Shopping Area']),

                facingDirection: getRandomElement(['PUBLIC', 'PRIVATE']),
                format: null,
                group: faker.company.name(),
                formattedAddress: null,
                availableDays: faker.number.int({ min: 0, max: 365 }),
                spotsPerHour: faker.number.int({ min: 0, max: 100 }),
                mediaOwnerId: faker.string.uuid(),
                mediaOwnerName: faker.company.name(),
                publisherDomain: null,
                countryId: faker.string.uuid(),
                countryName: faker.location.country(),
                countryIso2: faker.location.countryCode(),
                stateId: faker.string.uuid(),
                stateName: faker.location.state(),
                districtId: faker.string.uuid(),
                districtName: faker.location.city(),
                timezone: faker.location.timeZone(),
                active: faker.datatype.boolean(),
                availableBooking: faker.datatype.boolean(),
                subscription: faker.datatype.boolean(),
                thumbnailPath: faker.image.urlLoremFlickr({ width: 1920, height: 1080, category: 'business' }),
                googleMapUrl: null,
                programmaticEnabled: faker.datatype.boolean(),
                loopDuration: faker.number.float({ min: 0, max: 60, fractionDigits: 2 }),
                spotDuration: null,
                clients: null,
                displayOnTime: null,
                displayOffTime: null,
                totalSpots: faker.number.int({ min: 1000, max: 100000 }),
                totalBookedSpots: faker.number.int({ min: 0, max: 10000 }),
                spotsAvailability: faker.number.float({ min: 0, max: 100 }),
                clientsAvailability: faker.number.float({ min: 0, max: 100 }),
                nextAvailableDate: faker.date.soon().toISOString().split('T')[0],
                spotAvailabilityPerc: faker.number.float({ min: 0, max: 100 }),
                currency: faker.finance.currencyCode(),
                sellingRate: {
                    dsp: null,
                    standard: null,
                    daily: faker.number.float({ min: 10, max: 50 }),
                    weekly: faker.number.float({ min: 50, max: 200 }),
                    spots: faker.number.float({ min: 0.01, max: 0.1 }),
                    monthly: {
                        month3: null,
                        month6: null,
                        month1: faker.number.float({ min: 500, max: 1000 }),
                        month12: null
                    },
                    timeOfDay: null,
                    usdStandard: null,
                    usdDaily: null,
                    usdSpots: null,
                    expiryDate: null,
                    discounts: null
                },
                freqModel: null,
                monthlySummary: {
                    id: faker.string.uuid(),
                    childPercentage: faker.number.float({ min: 0, max: 100 }),
                    childVisitors: faker.number.int({ min: 0, max: 1000 }),
                    adultPercentage: faker.number.float({ min: 0, max: 100 }),
                    adultVisitors: faker.number.int({ min: 0, max: 100000 }),
                    youngAdultPercentage: faker.number.float({ min: 0, max: 100 }),
                    youngAdultVisitors: faker.number.int({ min: 0, max: 100000 }),
                    femalePercentage: faker.number.float({ min: 0, max: 100 }),
                    femaleVisitors: faker.number.int({ min: 0, max: 100000 }),
                    malePercentage: faker.number.float({ min: 0, max: 100 }),
                    maleVisitors: faker.number.int({ min: 0, max: 100000 }),
                    seniorPercentage: faker.number.float({ min: 0, max: 100 }),
                    seniorVisitors: faker.number.int({ min: 0, max: 100000 }),
                    totalVisitors: faker.number.int({ min: 1000, max: 2000000 }),
                    uniqueVisitors: faker.number.int({ min: 1000, max: 500000 }),
                    reach: faker.number.float({ min: 0, max: 100 }),
                    frequency: faker.number.float({ min: 0, max: 10 }),
                    circulation: faker.number.int({ min: 0, max: 1000 })
                },
                createdBy: faker.internet.displayName(),
                createdDate: faker.date.past().toISOString(),
                lastModifiedBy: faker.internet.displayName(),
                lastModifiedDate: faker.date.recent().toISOString(),
                count: 0,
                specification: null,
                price: null,
                trTimeZone: getRandomElement(timeZones),
                trCountryName: faker.location.country(),
                trStateName: faker.location.state(),
                trDistrictName: faker.location.county(),
                tags: null,
                filteringFields: null
            })),
        },
        errors: null, // Optional: add mock errors if needed
    };
    return mockData;
}

function getCampaignListData() {
    // Generate a list of mock campaigns
    const campaigns = Array.from({ length: 9 }, () => ({
        id: faker.string.uuid(),
        dealId: faker.string.uuid(),
        name: faker.commerce.productName(),
        bookingSource: getRandomElement(['ONLINE', 'OFFLINE']),
        startDate: {
            date: faker.date.past().toISOString().split('T')[0],
            dateStr: faker.date.past().toISOString().split('T')[0],
            dateFmt: 'yyyy-MM-dd'
        },
        endDate: {
            date: faker.date.future().toISOString().split('T')[0],
            dateStr: faker.date.future().toISOString().split('T')[0],
            dateFmt: 'yyyy-MM-dd'
        },
        dsp: faker.lorem.word(),
        campaignStatus: getRandomElement(['REQUESTED', 'GENERATED', 'APPROVED', 'REJECTED', 'LIVE']),
        priceSummary: {
            subTotal: faker.commerce.price({ min: 1000, max: 50000 }),
            netTotal: faker.commerce.price({ min: 1000, max: 50000 }),
            currency: {
                country: faker.location.country(),
                symbol: faker.finance.currencySymbol(),
                code: faker.finance.currencyCode()
            },
            tax: {
                name: faker.finance.transactionType(),
                value: faker.commerce.price({ min: 100, max: 2000 }),
                percent: faker.number.int({ min: 5, max: 20 })
            },
            pcrEnable: faker.datatype.boolean()
        },
        inventoriesSummary: {
            classicInventories: faker.number.int(),
            digitalInventories: faker.number.int(),
            packages: null
        },
        packages: null,
        campaignInventories: Array.from({ length: 3 }, () => ({
            id: faker.string.uuid(),
            dsp: faker.lorem.word(),
            startDate: faker.date.past().toISOString().split('T')[0],
            endDate: faker.date.future().toISOString().split('T')[0],
            companyId: faker.string.uuid(),
            inventoryName: faker.company.name(),
            inventoryId: faker.string.uuid(),
            inventoryReferenceId: faker.string.uuid(),
            deviceId: null,
            foreignBillboardId: null,
            networkId: null,
            inventoryType: 'DIGITAL_BILLBOARD',
            inventoryAddress: faker.location.state(),
            inventoryVenueType: faker.lorem.words(3),
            inventoryResolutions: null,
            inventoryThumbnailUrl: faker.image.urlLoremFlickr({ width: 1920, height: 1080, category: 'business' }),
            packageDetails: null,
            inventoryPrice: faker.commerce.price({ min: 100, max: 5000 }),
            inventoryReports: {
                totalPotentialViews: faker.number.int(),
                averageFrequency: faker.number.float({ min: 1, max: 10 }),
                cpm: faker.number.float({ min: 0.01, max: 10 }),
                totalReach: faker.number.int()
            },
            inventoryLatitude: faker.location.latitude(),
            inventoryLongitude: faker.location.longitude(),
            inventoryFormat: null,
            nowPayPrice: null,
            discount: null,
            spotDuration: null,
            negotiationSummary: null
        })),
        agency: {
            id: faker.string.uuid(),
            name: faker.company.name()
        },
        company: {
            id: faker.string.uuid(),
            name: faker.company.name()
        },
        user: {
            id: faker.string.uuid(),
            name: faker.internet.displayName()
        },
        summaryReport: {
            potentialViews: faker.number.int(),
            uniqueReach: faker.number.int(),
            cpm: faker.number.float({ min: 0, max: 100 }),
            averageFrequency: faker.number.float({ min: 1, max: 10 }),
            totalSpots: faker.number.int()
        },
        externalCampaignId: null,
        madCampaignId: null,
        reasonForRejection: null,
        reporting: null,
        negotiationSummary: null,
        mediaBookingOrdersInvoiceId: null
    }));



    return {
        data: {
            mycampaignList: {
                content: campaigns,
                pageable: {
                    sort: {
                        sorted: true,
                        unsorted: false
                    },
                    offset: 0.0,
                    pageSize: 10.0,
                    pageNumber: 0.0,
                    unpaged: false,
                    paged: true
                },
                last: false,
                totalElements: 197.0,
                totalPages: 20.0,
                size: 10.0,
                number: 0.0,
                first: true,
                sort: {
                    sorted: true,
                    unsorted: false
                },
                numberOfElements: 10.0
            }
        }
    };
}

function getContentHubData() {
    const mockData = {
        data: {
            contentHub: Array.from({ length: 6 }, () => ({
                id: faker.string.uuid(),
                fileName: `${faker.system.fileName()}.mp4`,
                mimeType: "video/mp4",
                filePath: `https://test-cdn.movingwalls.com/lmx-ecommerce/lmx_creative_${faker.number.int({ min: 1000000000000, max: 9999999999999 })}_${faker.system.fileName()}.mp4}`,
                userId: faker.string.uuid(),
                companyId: faker.string.uuid(),
                countryId: faker.string.uuid(),
                status: getRandomElement(["PENDING", "APPROVED", "REJECTED"]),
                resolution: `${faker.number.int({ min: 1280, max: 1920 })}x${faker.number.int({ min: 720, max: 1080 })}`,
                userCountry: null,
                thumbnail: faker.image.urlLoremFlickr({ width: 1920, height: 1080, category: 'business'}),

            })),
        },
        errors: null,
    }
    return mockData
}

function getDeliveryReportData() {
    const mockData = {
        data: {
            deliveryReports: Array.from({ length: 2 }, () => ({
                id: faker.string.uuid(),
                campaignName: faker.commerce.productName(),
                campaignId: faker.string.uuid(),
                campaignStatus: getRandomElement(["APPROVED", "PENDING", "REJECTED"]),
                dealId: `AU-BIG-OSS-${faker.date.future().toISOString().split('T')[0].replace(/-/g, '')}`,
                dsp: faker.lorem.word(),
                agency: {
                    id: faker.string.uuid(),
                    name: faker.company.name()
                },
                startDate: {
                    date: faker.date.future().toISOString().split('T')[0],
                    dateStr: faker.date.future().toISOString().split('T')[0],
                    dateFmt: "yyyy-MM-dd"
                },
                endDate: {
                    date: faker.date.future().toISOString().split('T')[0],
                    dateStr: faker.date.future().toISOString().split('T')[0],
                    dateFmt: "yyyy-MM-dd"
                },
                companyId: faker.string.uuid(),
                inventoryName: faker.location.streetAddress(),
                inventoryId: faker.string.uuid(),
                inventoryReferenceId: `AUS-BIG-D-00000-${faker.number.int({ min: 10000, max: 99999 })}`,
                deviceId: null,
                inventoryType: getRandomElement(["DIGITAL_BILLBOARD", "POSTER", "STATIC"]),
                inventoryAddress: faker.location.state(),
                inventoryVenueType: null,
                inventoryResolutions: null,
                inventoryLocation: null,
                inventoryReports: null,
                inventoryThumbnailUrl: faker.image.urlLoremFlickr({ width: 1920, height: 1080, category: 'business'}),
                inventoryLatitude: faker.location.latitude(),
                inventoryLongitude: faker.location.longitude(),
                inventoryPrice: faker.finance.amount({min:10000, max:50000, dec:2}),
                availableBooking: faker.datatype.boolean(),
                nextAvailableDate: faker.date.future().toISOString().split('T')[0],
                spotsAvailability: faker.number.float({ min: 0, max: 100 }),
                clientsAvailability: faker.number.float({ min: 0, max: 100 }),
                inventoryDetails: {
                    id: faker.string.uuid(),
                    billboardId: null,
                    referenceId: `AUS-BIG-D-00000-${faker.number.int({ min: 10000, max: 99999 })}`,
                    deviceId: null,
                    name: faker.person.firstName(),
                    displayName: faker.person.firstName(),
                    company: faker.company.name(),
                    facingDirection: getRandomElement(["NORTH", "SOUTH", "EAST", "WEST", "PUBLIC"]),
                    category: getRandomElement(["OUTDOOR", "INDOOR"]),
                    group: null,
                    type: getRandomElement(["DIGITAL", "STATIC"]),
                    format: getRandomElement(["BUNTING", "SIGNBOARD"]),
                    venueType: null,
                    latitude: faker.location.latitude(),
                    longitude: faker.location.longitude(),
                    active: faker.datatype.boolean(),
                    country: {
                        id: faker.string.uuid(),
                        countryId: faker.location.countryCode().toLowerCase(),
                        name: faker.location.country(),
                        latitude: faker.location.latitude(),
                        longitude: faker.location.longitude(),
                        population: faker.number.int({ min: 1000000, max: 100000000 }),
                        iso: faker.location.countryCode(),
                        postalformat: "9999",
                        postalname: "Postal code",
                        geopc: faker.number.int({ min: 1, max: 10 }),
                        active: faker.datatype.boolean(),
                        dialingCode: `+${faker.number.int({ min: 1, max: 999 })}`,
                        timezone: faker.location.timeZone(),
                        miDataSensorStatus: null,
                        tax: {
                            label: "GST",
                            percent: faker.number.float({ min: 5, max: 20 })
                        }
                    },
                    city: null,
                    companyId: {
                        id: faker.string.uuid(),
                        companyId: faker.company.name().toLowerCase(),
                        name: faker.company.name(),
                        companyType: getRandomElement(["MEDIA_OPERATOR", "ADVERTISER"]),
                        registrationNumber: faker.number.int({ min: 100000000, max: 999999999 }).toString()
                    }
                }
            })),
        },
        errors: null,
    };
    return mockData
}

function getInvoiceData() {
    const campaignInventories = Array.from({ length: 2 }, () => ({
        id: faker.string.uuid(),
        dsp: faker.company.name(),
        startDate: faker.date.future().toISOString().split('T')[0],
        endDate: faker.date.future().toISOString().split('T')[0],
        companyId: faker.string.uuid(),
        inventoryName: faker.location.streetAddress(),
        inventoryId: faker.string.uuid(),
        inventoryReferenceId: `AUS-BIG-D-${faker.number.int(5)}`,
        deviceId: null,
        foreignBillboardId: null,
        networkId: null,
        inventoryType: getRandomElement(['DIGITAL_BILLBOARD', 'STATIC_BILLBOARD']),
        inventoryAddress: faker.location.state(),
        inventoryVenueType: null,
        inventoryResolutions: null,
        inventoryThumbnailUrl: faker.image.urlLoremFlickr({ width: 1920, height: 1080, category: 'business'}),
        packageDetails: null,
        inventoryPrice: faker.finance.amount({min:20000, max:40000, dec:2}),
        inventoryReports: {
            totalPotentialViews: faker.number.int({ min: 5000, max: 50000 }),
            averageFrequecy: faker.number.float({ min: 1, max: 20 }),
            cpm: faker.number.float({ min: 100, max: 300 }),
            totalReach: faker.number.int({ min: 100, max: 1000 })
        },
        inventoryLatitude: faker.location.latitude(),
        inventoryLongitude: faker.location.longitude(),
        inventoryFormat: null,
        nowPayPrice: null,
        discount: null,
        spotDuration: null,
        negotiationSummary: null
    }));

    const mockData = {
        data: {
            paymentInvoice: {
                id: faker.string.uuid(),
                dealId: `AU-BIG-OSS-${faker.number.int(15)}`,
                name: faker.commerce.productName(),
                bookingSource: "ONLINE",
                startDate: {
                    date: faker.date.future().toISOString().split('T')[0], // Random future date
                    dateStr: faker.date.future().toISOString().split('T')[0],
                    dateFmt: "yyyy-MM-dd"
                },
                endDate: {
                    date: faker.date.future().toISOString().split('T')[0],
                    dateStr: faker.date.future().toISOString().split('T')[0],
                    dateFmt: "yyyy-MM-dd"
                },
                dsp: faker.company.name(),
                campaignStatus: "LIVE",
                priceSummary: {
                    subTotal: faker.finance.amount({min:200000, max:300000, dec:2}),
                    netTotal: faker.finance.amount({min:220000, max:350000, dec:2}),
                    currency: {
                        country: faker.location.country(),
                        symbol: faker.finance.currencySymbol(),
                        code: faker.finance.currencyCode()
                    },
                    tax: {
                        name: "GST",
                        value: faker.finance.amount({min:20000, max:50000, dec:2}),
                        percent: faker.number.int({ min: 5, max: 20 })
                    },
                    pcrEnable: faker.datatype.boolean()
                },
                inventoriesSummary: {
                    classicInventories: 0.0,
                    digitalInventories: faker.number.int({ min: 1, max: 5 }),
                    packages: null
                },
                packages: null,
                campaignInventories: campaignInventories,
                agency: {
                    id: faker.string.uuid(),
                    name: faker.company.name()
                },
                company: {
                    id: faker.string.uuid(),
                    name: faker.company.name()
                },
                user: {
                    id: faker.string.uuid(),
                    name: faker.person.firstName()
                },
                summaryReport: {
                    potentialViews: faker.number.int({ min: 10000, max: 50000 }),
                    uniqueReach: faker.number.int({ min: 100, max: 500 }),
                    cpm: faker.number.float({ min: 400, max: 500 }),
                    averageFrequency: faker.number.float({ min: 1, max: 20 }),
                    totalSpots: faker.number.int({ min: 10, max: 50 })
                },
                externalCampaignId: null,
                madCampaignId: null,
                reasonForRejection: "",
                reporting: null,
                negotiationSummary: null,
                mediaBookingOrdersInvoiceId: {
                    invoiceId: `INV-AU-BIG-OSS-${faker.number.int(12)}`
                }
            }
        }
    };
    return mockData
}

function getCartItemData() {
    const campaigns = Array.from({ length: 5 }, () => ({
        billboardPotentialViews: faker.number.int({ min: 1000, max: 2000000 }),
        billboardId: faker.string.uuid(),
        billboardName: faker.company.name(),
        billboardType: getRandomElement(['digital', 'classic']),
        billboardCountry: faker.location.country(),
        billboardDeviceId: faker.string.uuid(),
        billboardReferenceId: "AUS-OUT-D-" + faker.number.int({ min: 10000, max: 99999 }).toString().padStart(5, '0'),
        billboardLatitude: faker.number.float({ min: -90, max: 90, fractionDigits: 4 }),
        billboardVenueType: getRandomElement(['Outdoor', 'Indoor']),
        billboardFrequency: faker.number.float({ min: 1, max: 10, fractionDigits: 4 }),
        billboardLongitude: faker.number.float({ min: -180, max: 180, fractionDigits: 4 }),
        billboardUniqueReach: faker.number.int({ min: 1000, max: 1000000 }),
        billboardResolutionWidth: faker.number.int({ min: 720, max: 1920 }).toString(), // Random resolution width between 720 and 1920, converted to string
        billboardResolutionHeight: faker.number.int({ min: 1080, max: 2160 }).toString(),
        billboardtotalPrice: faker.commerce.price({min:100, max:1000, dec:2}),
        billboardThumbnailUrl: faker.image.urlLoremFlickr({ width: 1920, height: 1080, category: 'business'}),
    }));
    const mockData = {
        data: {
            cartPageItem: Array.from({ length: 1 }, () => ({
                userId: faker.string.uuid(), // random UUID for user ID
                agencyId: faker.string.uuid(), // random UUID for agency ID
                agencyName: faker.company.name(), // random agency name
                companyId: faker.string.uuid(), // random UUID for company ID
                companyName: faker.company.name(), // random company name
                countryId: faker.string.uuid(), // random UUID for country ID
                countryName: faker.location.country(), // random country name
                campaignName: faker.lorem.words(3), // random campaign name with 3 words
                startDate: faker.date.soon({ days: 10 }).toISOString().split('T')[0], // random start date within 10 days
                endDate: faker.date.future({years: 0.1}).toISOString().split('T')[0], // random end date soon after start date
                inventoriesSummary: {
                    classicInventories: faker.number.int({ min: 1, max: 5 }),
                    digitalInventories: faker.number.int({ min: 1, max: 5 }),
                    packages: null
                },
                overAlltotalNet: faker.commerce.price({min:500, max:1000, dec:2}), // random price with 2 decimal places for net total
                overAlltotalTax: faker.commerce.price({min:50, max:100, dec:2}), // random tax price with 2 decimal places
                overAlltotalPrice: faker.commerce.price({min:600, max:1100, dec:2}), // random total price with 2 decimal places
                overAlltotalUniqueReach: faker.number.int({ min: 10000, max: 500000 }), // random unique reach
                overAlltotalPotentialViews: faker.number.int({ min: 1000000, max: 5000000 }), // random potential views
                overAlltotalAverageFrequency: faker.number.float({ min: 5, max: 20, fractionDigits: 2 }),
                campaignInventories: campaigns
            })),
        },
        errors: null, // Optional: add mock errors if needed
    };
    return mockData;
}

function getPropertyListData() {
    const mockData = {
        data: {
            landingpageExploreProperties: Array.from({ length: 10 }, () => ({
                id: faker.string.uuid(),
                name: faker.location.city().toLowerCase(),
                displayName: faker.person.firstName(),
                referenceId: `AUS-OUT-D-00000-${faker.number.int({ min: 10000, max: 99999 })}`,
                latitude: faker.location.latitude(),
                longitude: faker.location.longitude(),
                category: getRandomElement(["INDOOR", "OUTDOOR"]),
                type: getRandomElement(["DIGITAL", "STATIC"]),
                panelWidth: faker.number.float({ min: 5, max: 15 }),
                panelHeight: faker.number.float({ min: 5, max: 10 }),
                resolutionWidth: faker.number.int({ min: 720, max: 2160 }),
                resolutionHeight: faker.number.int({ min: 1280, max: 3840 }),
                panelSize: faker.number.float({ min: 50, max: 100 }),
                formattedAddress: faker.location.streetAddress(),
                facingDirection: getRandomElement(["NORTH", "SOUTH", "EAST", "WEST", "PUBLIC"]),
                group: faker.commerce.department(),
                venueType: getRandomElement(["Transit,Airports,Shopping Area", "Retail,Commercial"]),

                mediaOwnerId: faker.string.uuid(),
                specification: null,
                mediaOwnerName: faker.company.name(),
                countryId: faker.string.uuid(),
                countryName: faker.location.country(),
                stateId: faker.string.uuid(),
                stateName: faker.location.state(),
                districtId: faker.string.uuid(),
                districtName: faker.location.city(),
                active: faker.datatype.boolean(),
                availableBooking: faker.datatype.boolean(),
                subscription: faker.datatype.boolean(),
                thumbnailPath: faker.image.urlLoremFlickr({ width: 1920, height: 1080, category: 'business'}),
                googleMapUrl: faker.internet.url(),
                timezone: faker.location.timeZone(),
                totalSpots: faker.number.int({ min: 0, max: 100 }),
                totalBookedSpots: faker.number.int({ min: 0, max: 100 }),
                spotsAvailability: faker.number.float({ min: 0, max: 1 }),
                spotAvailabilityPerc: faker.number.float({ min: 0, max: 1 }),
                clientsAvailability: faker.number.float({ min: 0, max: 1 }),
                nextAvailableDate: faker.date.future().toISOString().split('T')[0],
                currency: faker.finance.currencyCode(),
                createdBy: faker.internet.displayName(),
                createdDate: faker.date.past().toISOString(),
                lastModifiedBy: faker.internet.displayName(),
                lastModifiedDate: faker.date.recent().toISOString(),
                count: faker.number.int({ min: 0, max: 100 }),
                trTimeZone: faker.location.timeZone(),
                trCountryName: faker.location.country(),
                trStateName: faker.location.state(),
                trDistrictName: faker.location.city(),
                sellingRate: {
                    dsp: null,
                    daily: faker.finance.amount({min:10, max:100}),
                    weekly: faker.finance.amount({min:100, max:1000}),
                    spots: faker.finance.amount({min:0.01, max:0.1}),
                    monthly: {
                        month1: faker.finance.amount({min:500, max:1500}),
                        month3: null,
                        month6: null,
                        month12: null
                    },
                    usdStandard: null,
                    usdDaily: null,
                    usdSpots: null,
                    expiryDate: null,
                    discounts: null
                },
                monthlySummary: {
                    id: faker.string.uuid(),
                    childPercentage: faker.number.float({ min: 0, max: 1 }),
                    totalVisitors: faker.number.int({ min: 10000, max: 2000000 })
                }
            })),
        },
        errors: null,
    };
    return mockData
}

function getPropertyDetailsData() {
    const mockData = {
        data: {
            propertyDetails: {
                referenceId: `AUS-OUT-D-${faker.number.int({ min: 10000, max: 99999 })}-${faker.number.int({ min: 10000, max: 99999 })}`,
                latitude: faker.location.latitude(),
                longitude: faker.location.longitude(),
                deviceId: null,
                name: faker.location.city(),
                displayName: `${faker.location.city()}${faker.number.int({ min: 1, max: 100 })}`,
                company: faker.company.name(),
                facingDirection: getRandomElement(["PUBLIC", "PRIVATE"]),
                cardinalPoint: null,
                category: getRandomElement(["INDOOR", "OUTDOOR"]),
                subCategory: null,
                group: getRandomElement(["WORK", "LEISURE"]),
                type: getRandomElement(["DIGITAL", "STATIC"]),
                stateName: faker.location.state(),
                format: getRandomElement(["LED TV", "Digital Billboard"]),
                venueType: getRandomElement(["Transit", "Airports", "Shopping Area"]),
                mediaOwnerName: faker.company.name(),
                loopDuration: faker.number.int({ min: 30, max: 120 }), // Duration in seconds
                displayOnTime: faker.date.recent().toISOString().substring(11, 16),
                displayOffTime: faker.date.recent().toISOString().substring(11, 16),
                nextAvailableDate: faker.date.future().toISOString().substring(0, 10),
                sellingRate: {
                    dsp: null,
                    daily: faker.commerce.price({min:10, max:50, dec:2}),
                    weekly: faker.commerce.price({min:100, max:200, dec:2}),
                    spots: null,
                    monthly: {
                        month1: faker.commerce.price({min:600, max:700, dec:2}),
                        month3: getRandomElement([null, faker.commerce.price({min:1700, max:1900, dec:2})]),
                        month6: getRandomElement([null, faker.commerce.price({min:3000, max:3500, dec:2})]),
                        month12: getRandomElement([null, faker.commerce.price({min:6000, max:7000, dec:2})])
                    }
                },
                venueTypeItems: null,
                venueTypeLocale: null,
                district: null,
                formattedAddress: faker.location.streetAddress(),
                specification: {
                    panel: faker.number.int(),
                    screens: faker.number.int(),
                    resolution1Width: faker.number.int({ min: 720, max: 3840 }).toString(),
                    resolution1Height: faker.number.int({ min: 480, max: 2160 }).toString(),
                    panel1Size: faker.number.float({ min: 30, max: 100, fractionDigits: 1 }),
                    playerSoftwareModule: {
                        id: faker.string.uuid(),
                        description: faker.lorem.sentence(),
                        apiUrl: faker.internet.url(),
                        accessToken: faker.string.uuid(),
                        active: faker.datatype.boolean(),
                        integratedWithLmx: faker.datatype.boolean(),
                        allowedPushToContentTypes: getRandomElement(["HTML", "ZIP", "VAST", "URL"]),
                        creativeConfiguration: null
                    },
                    ledPitch: null,
                    videoSupport: null,
                    imageSupport: null,
                    audioSupport: null,
                    audioFormats: null,
                    contentApproval: faker.datatype.boolean(),
                    featureSupport: null,
                    availableHours: null,
                    billboardSize: null,
                    panels: [faker.number.float({ min: 10, max: 15, fractionDigits: 1 }) + ' x ' + faker.number.float({ min: 5, max: 10, fractionDigits: 1 })]
                },
                monthlySummary: {
                    id: faker.string.uuid(),
                    totalVisitors: faker.number.int({ min: 100000, max: 2000000 }),
                    uniqueVisitors: faker.number.int({ min: 10000, max: 500000 }),
                    reach: faker.number.float({ min: 0, max: 100 }),
                    frequency: faker.number.float({ min: 1, max: 10, fractionDigits: 2 })
                },
                price: {
                    screenOnTime: faker.date.recent().toISOString().substring(11, 16),
                    screenOffTime: faker.date.recent().toISOString().substring(11, 16),
                    openAuctionCurrency: null,
                    spotDuration: faker.number.float({ min: 5, max: 30, fractionDigits: 1 }),
                    contentFrequencyPerHour: faker.number.float({ min: 30, max: 120, fractionDigits: 1 }),
                    clients: faker.number.int({ min: 1, max: 10 }),
                    modeOfOperation: getRandomElement(["Loop Based", "Sequential"]),
                    localCurrencies: null,
                    availableDays: getRandomElement(["Weekdays", "Weekends", "All Days"]),
                    maximumSpotDurationPerDay: faker.number.float({ min: 600, max: 1200, fractionDigits: 1 }),
                    minimumSpotDurationPerDay: faker.number.float({ min: 600, max: 1200, fractionDigits: 1 })
                },
                thumbnailPath: faker.image.urlLoremFlickr({ width: 1920, height: 1080, category: 'business'}),
                companyId: null,
                phone: faker.phone.number(),
                timezone: "Australia/Brisbane",
                dataSource: getRandomElement(["Internal", "External"]),
                supportedMediaType: getRandomElement(["Image", "Video", "Audio"])
            }
        }
    }
    return mockData
}

function getBubbleData() {
    const mockData = {
        data: {
            bubbleChartData: [{
                    name: "INTERESTS",
                    firstLevel: [
                        { name: "Property", value: faker.number.float({ min: 0, max: 5 }) },
                        { name: "Fast Food Junkies", value: faker.number.float({ min: 1000, max: 20000 }) },
                        { name: "Shopaholic", value: faker.number.float({ min: 1000, max: 20000 }) },
                        { name: "Food Lovers", value: faker.number.float({ min: 10000, max: 50000 }) },
                        { name: "Gamers", value: faker.number.float({ min: 1000, max: 20000 }) },
                        { name: "Nature Lovers", value: faker.number.float({ min: 1000, max: 20000 }) },
                        { name: "Sports Enthusiasts", value: faker.number.float({ min: 100, max: 5000 }) },
                        { name: "Fitness Fanatic", value: faker.number.float({ min: 100, max: 5000 }) },
                        { name: "Young Families", value: faker.number.float({ min: 10000, max: 50000 }) },
                        { name: "Pet Lovers", value: faker.number.float({ min: 100, max: 5000 }) },
                        { name: "Gadget Enthusiasts", value: faker.number.float({ min: 1000, max: 20000 }) },
                        { name: "Group Entertainment Seekers", value: faker.number.float({ min: 100, max: 5000 }) },
                        { name: "Entertainment Seekers", value: faker.number.float({ min: 10000, max: 50000 }) },
                        { name: "Techie", value: faker.number.float({ min: 1000, max: 20000 }) },
                        { name: "Auto Lovers", value: faker.number.float({ min: 1000, max: 20000 }) },
                        { name: "Healthcare Seekers", value: faker.number.float({ min: 10000, max: 50000 }) },
                        { name: "Young Mothers", value: faker.number.float({ min: 100, max: 5000 }) },
                        { name: "Fashionista", value: faker.number.float({ min: 10000, max: 50000 }) }
                    ]
                },
                {
                    name: "ACTIONS",
                    firstLevel: [
                        { name: "Grocery Shoppers", value: faker.number.float({ min: 10000, max: 20000 }) },
                        { name: "Home Improvement", value: faker.number.float({ min: 20000, max: 50000 }) },
                        { name: "Commuters", value: faker.number.float({ min: 50000, max: 100000 }) },
                        { name: "Worshippers", value: faker.number.float({ min: 0, max: 100 }) },
                        { name: "Travellers", value: faker.number.float({ min: 20000, max: 50000 }) }
                    ]
                },
                {
                    name: "INCOME GROUP",
                    firstLevel: [
                        { name: "Mid Income", value: faker.number.float({ min: 20000, max: 50000 }) },
                        { name: "Low Income", value: faker.number.float({ min: 1000, max: 10000 }) },
                        { name: "Affluent People", value: faker.number.float({ min: 1000, max: 10000 }) }
                    ]
                },
                {
                    name: "OCCUPATION",
                    firstLevel: [
                        { name: "White Collars", value: faker.number.float({ min: 1000, max: 5000 }) },
                        { name: "Biz Owners", value: faker.number.float({ min: 5000, max: 15000 }) },
                        { name: "Blue Collars", value: faker.number.float({ min: 10000, max: 20000 }) },
                        { name: "Students", value: faker.number.float({ min: 0, max: 1000 }) },
                        { name: "Government Workers", value: faker.number.float({ min: 0, max: 500 }) }
                    ]
                }

            ]
        }
    }
    return mockData
}

function getCartDetails() {
    const mockData = {
        data: {
            cartpageItem: Array.from({ length: 2 }, () => ({
                id: faker.string.uuid(),
                userId: faker.string.uuid(),
                campaignName: faker.commerce.productName(),
                startDate: faker.date.soon({ days: 10 }).toISOString().split('T')[0], // random start date within 10 days
                endDate: faker.date.future({years: 0.1}).toISOString().split('T')[0],
                cartItemName: faker.commerce.productName(),
                cartItemId: faker.string.uuid(),
                cartItemReferenceId: faker.string.uuid(),
                cartItemDeviceId: null,
                cartItemType: getRandomElement(['DIGITAL', 'STATIC']),
                cartItemCountry: faker.location.country(),
                cartItemVenueType: getRandomElement(['DIGITAL', 'STATIC']),
                cartItemResolutions: null,
                cartItemThumbnailUrl: faker.image.urlLoremFlickr({ width: 1920, height: 1080, category: 'business' }),
                cartItemLatitude: faker.location.latitude(),
                cartItemLongitude: faker.location.longitude(),
                availableBooking: faker.datatype.boolean(),
                nextAvailableDate: faker.date.soon().toISOString().split('T')[0],
                spotsAvailability: faker.number.float({ min: 0, max: 100 }),
                clientsAvailability: faker.number.float({ min: 0, max: 100 })
               
                
            })),
        },
        errors: null,
    };
    return mockData
}



// Map queries to mock data functions
const mutationMapper: { [key: string]: Function } = {
    "EXPLORE_PROPERTY_BUTTON": getLandingPageData,
    "MY_CAMPAIGN_LIST_QUERY": getCampaignListData,
    "CONTENT_HUB_QUERY": getContentHubData,
    "DELIVERY_REPORTS_QUERY": getDeliveryReportData,
    "INVOICE": getInvoiceData,
    "CART_PAGE_ITEM": getCartItemData,
    "GETPROPERTY_LIST": getPropertyListData,
    "PROPERTY_DETAILS": getPropertyDetailsData,
    "PROPERTY_DETAILS_CHART_QUERY": getBubbleData,
    "CART_INITIAL_QUERY": getCartDetails,
};

// Define a function to get the identifier based on the query structure
const getQueryIdentifier = (query: any): string => {
    if (query === EXPLORE_PROPERTY_BUTTON) return "EXPLORE_PROPERTY_BUTTON";
    if (query === MY_CAMPAIGN_LIST_QUERY) return "MY_CAMPAIGN_LIST_QUERY";
    if (query === CONTENT_HUB_QUERY) return "CONTENT_HUB_QUERY";
    if (query === DELIVERY_REPORTS_QUERY) return "DELIVERY_REPORTS_QUERY";
    if (query === INVOICE) return "INVOICE";
    if (query === CART_PAGE_ITEM) return "CART_PAGE_ITEM";
    if (query === GETPROPERTY_LIST) return "GETPROPERTY_LIST";
    if (query === PROPERTY_DETAILS) return "PROPERTY_DETAILS";
    if (query === PROPERTY_DETAILS_CHART_QUERY) return "PROPERTY_DETAILS_CHART_QUERY";
    if (query === CART_INITIAL_QUERY) return "CART_INITIAL_QUERY";
    return "";
};

export const generateMockData = (query: any) => {
    const queryIdentifier = getQueryIdentifier(query); // Get the identifier


    if (mutationMapper.hasOwnProperty(queryIdentifier)) {
        const mockData = mutationMapper[queryIdentifier](); // Call the corresponding function
        return Promise.resolve(mockData); // Return the resolved mock data
    }
    // Return null if no mock data is found for the query
    return Promise.resolve(null);
};
