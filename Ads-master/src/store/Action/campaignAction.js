import * as types from "../Types"
import {API} from "../api"

export const AddCampaignRule = (data) => ({
  type: types.AMAZON_API,
  payload: {
      url: `${API.createRule}${data.id}/createRule`,
      method: 'POST',
      data: data?.values,
      success: (data) => ({
          type: types.CREATE_RULE_SUCCESS,
          payload: data
      }),
      error: (data) => ({
          type: types.CREATE_RULE_ERROR,
          payload: data
      })
  }
})
