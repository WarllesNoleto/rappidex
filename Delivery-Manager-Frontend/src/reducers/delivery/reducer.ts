import { produce } from 'immer'
import { ActionTypes } from './actions'

interface DeliveryState {
    token: string | null,
    permission: string | null
}

export function deliveryReducer(state: DeliveryState, action: any) {
    switch (action.type) {
        case ActionTypes.LOGIN:
            return produce(state, (draft) => {
                draft.token = action.payload.token
                draft.permission = action.payload.permission
            })
        case ActionTypes.LOGOUT:
            return produce(state, (draft) => {
                draft.token = null
                draft.permission = null
            })
        default:
            return state
    }
}
