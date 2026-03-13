
export enum ActionTypes {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT'
}

export function loginAction(token: string, permission: string) {
    return {
        type: ActionTypes.LOGIN,
        payload: {
            token,
            permission
        }
    }
}

export function logoutAction() {
    return {
        type: ActionTypes.LOGOUT
    }
}

