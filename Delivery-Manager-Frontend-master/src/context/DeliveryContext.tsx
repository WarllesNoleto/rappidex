import {
    ReactNode,
    createContext,
    useEffect,
    useReducer,
  } from 'react'
  import { deliveryReducer } from '../reducers/delivery/reducer'
  import {
    loginAction,
    logoutAction,
  } from '../reducers/delivery/actions'

interface DeliveryContextType {
    token: string | null
    permission: string | null
    login: (token: string, permission: string) => void
    logout: () => void
}

export const DeliveryContext = createContext({} as DeliveryContextType)

interface DeliveryContextProviderProps {
    children: ReactNode
}

export function DeliveryContextProvider({
    children
}: DeliveryContextProviderProps) {
    const [deliveryState, dispatch] = useReducer(
        deliveryReducer,
        {
            token: null,
            permission: null
        },
        (initialState) => {
            const storedStateAsJSON = localStorage.getItem(
                '@rapidexmanager:delivery-state-1.0.0'
            )
            if (storedStateAsJSON) {
                return JSON.parse(storedStateAsJSON)
            }

            return initialState
        }
    )

    const { token, permission } = deliveryState

    useEffect(() => {
        const stateJSON = JSON.stringify(deliveryState)
        localStorage.setItem('@rapidexmanager:delivery-state-1.0.0', stateJSON)
    }, [deliveryState])

    function login(token: string, permission: string) {
        dispatch(loginAction(token, permission))
    }

    function logout() {
        dispatch(logoutAction())
    }

    return (
        <DeliveryContext.Provider
            value={{
                token,
                permission,
                login,
                logout
            }}
        >
            {children}
        </DeliveryContext.Provider>
    )
}