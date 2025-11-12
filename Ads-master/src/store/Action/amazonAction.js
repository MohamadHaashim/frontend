import axios from "axios";
import * as types from "../Types";
import { API } from "../api";
export const amazonGetData = () => ({
    type: types.AMAZON_API,
    payload: {
        url: API.amazonGetData,
        method: "GET",
        token: "amazon",
        success: (data) => ({
            type: types.AMAZON_SUCCESS,
            payload: data,
        }),
        error: (data) => ({
            type: types.AMAZON_ERROR,
            payload: data,
        }),
    },
});
export const amazonConnect = (data) => ({
    type: types.AMAZON_API,
    payload: {
        url: API.amazonConnect,
        method: "POST",
        data: data,
        token: "amazon",
        success: (data) => ({
            type: types.CONNECT_SUCCESS,
            payload: data,
        }),
        error: (data) => ({
            type: types.CONNECT_ERROR,
            payload: data,
        }),
    },
});
export const listingProfiles = (req) => ({
    type: types.AMAZON_API,
    payload: {
        url: API.listProfiles,
        method: "POST",
        token: "amazon",
        data: req,
        success: (data) => ({
            type: types.PROFILE_LIST_SUCCESS,
            payload: data,
        }),
        error: (data) => ({
            type: types.PROFILE_LIST_ERROR,
            payload: data,
        }),
    },
});
export const listSPCampaigns = (data) => ({
    type: types.AMAZON_API,
    payload: {
        url: `${API.listCampaigns}${data.id}/listSPCampaigns`,
        method: "POST",
        data: data.params,
        token: "amazon",
        success: (data) => ({
            type: types.LIST_CAMPAIGNS_SUCCESS,
            payload: data,
        }),
        error: (data) => ({
            type: types.LIST_CAMPAIGNS_ERROR,
            payload: data,
        }),
    },
});
export const listSBCampaigns = (data) => ({
    type: types.AMAZON_API,
    payload: {
        url: `${API.listCampaigns}${data.id}/listSBCampaigns`,
        method: "POST",
        token: "amazon",
        success: (data) => ({
            type: types.LIST_CAMPAIGNS_SUCCESS,
            payload: data,
        }),
        error: (data) => ({
            type: types.LIST_CAMPAIGNS_ERROR,
            payload: data,
        }),
    },
});
export const listSDCampaigns = (data) => ({
    type: types.AMAZON_API,
    payload: {
        url: `${API.listCampaigns}${data.id}/listSDCampaigns`,
        method: "POST",

        token: "amazon",
        success: (data) => ({
            type: types.LIST_CAMPAIGNS_SUCCESS,
            payload: data,
        }),
        error: (data) => ({
            type: types.LIST_CAMPAIGNS_ERROR,
            payload: data,
        }),
    },
});
export const changeStatus = (data) => ({
    type: types.AMAZON_API,
    payload: {
        url: API.changeStatus,
        method: "POST",
        data: data,
        token: "amazon",
        success: (data) => ({
            type: types.CHANGE_STATUS_SUCCESS,
            payload: data,
        }),
        error: (data) => ({
            type: types.CHANGE_STATUS_ERROR,
            payload: data,
        }),
    },
})
export const searchProfileIds = (data) => ({
    type: types.AMAZON_API,
    payload: {
        url: API.searchProfile,
        method: "POST",
        data: data,
        token: "amazon",
        success: (data) => ({
            type: types.SEARCH_PROFILE_SUCCESS,
            payload: data,
        }),
        error: (data) => ({
            type: types.SEARCH_PROFILE_ERROR,
            payload: data,
        }),
    },
})
export const DashboardProfileIds = (data) => ({
    type: types.AMAZON_API,
    payload: {
        url: API.listDashboardProfiles,
        method: "POST",
        data: data,
        token: "amazon",
        success: (data) => ({
            type: types.DASHBOARD_PROFILELIST_SUCCESS,
            payload: data,
        }),
        error: (data) => ({
            type: types.DASHBOARD_PROFILELIST_ERROR,
            payload: data,
        }),
    },
})
export const mainAccountsList = () => ({
    type: types.AMAZON_API,
    payload: {
        url: API.mainAccountList,
        method: "GET",
        token: "amazon",
        success: (data) => ({
            type: types.MAIN_ACC_LIST_SUCCESS,
            payload: data,
        }),
        error: (data) => ({
            type: types.MAIN_ACC_LIST_ERROR,
            payload: data,
        }),
    },
});
export const checkConnectAccount = () => ({
    type: types.AMAZON_API,
    payload: {
        url: API.checkConnectAccount,
        method: "POST",
        success: (data) => ({
            type: types.AMAZON_CONNECT_SUCCESS,
            payload: data,
        }),
        error: (data) => ({
            type: types.AMAZON_CONNECT_ERROR,
            payload: data,
        }),
    },
});
export const unlinkConnectAccount = () => ({
    type: types.AMAZON_API,
    payload: {
        url: API.unlinkConnectAccount,
        method: "POST",
        success: (data) => ({
            type: types.AMAZON_UNLINK_SUCCESS,
            payload: data,
        }),
        error: (data) => ({
            type: types.AMAZON_UNLINK_ERROR,
            payload: data,
        }),
    },
});
export const listAllCampaigns = (data) => ({
    type: types.AMAZON_API,
    payload: {
        url: `${API.listCampaigns}${data.id}/listCampaigns`,
        method: "POST",
        data: data.params,
        token: "amazon",
        success: (data) => ({
            type: types.LIST_CAMPAIGNS_SUCCESS,
            payload: data,
        }),
        error: (data) => ({
            type: types.LIST_CAMPAIGNS_ERROR,
            payload: data,
        }),
    },
});

export const getSingleCampaigns = (data) => ({
    type: types.AMAZON_API,
    payload: {
        url: `${API.getSingleCampaigns}`,
    },
});
