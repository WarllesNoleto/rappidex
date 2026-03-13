import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DeliveryContext } from "../../context/DeliveryContext";
import api from "../../services/api";
import { 
    Filter,
    Container,
    Content,
    HeaderFilter,
    UsersContainer,
    UserContainer,
    Username,
    ContainerProfileImage,
    ProfileImage,
    ContainerLoading
} from "./styles";
import { Loader } from "../../components/Loader";
import { User } from "../../shared/interfaces";

export function Users(){
    const { token } = useContext(DeliveryContext)
    api.defaults.headers.Authorization = `Bearer ${token}`

    const navigate = useNavigate()
    const [type, setType] = useState('shopkeeper');
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])

    async function getData(){
        try {
            const usersResponse = await api.get(`/user?type=${type}`)

            setUsers(usersResponse.data.data)
            setLoading(false)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert(error.response.data.message)
        }
    }

    function handleMotoboys(){
        setLoading(true)
        setType('motoboy')
    }

    function handleShopkeeper(){
        setLoading(true)
        setType('shopkeeper')
    }

    function handleUser(user: string) {
        navigate(`/novo-usuario/${user}`)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type])

    return (
        <Container>
            <Content>
                <HeaderFilter>
                    <Filter isSelected={type==='shopkeeper'} onClick={handleShopkeeper}>Lojistas</Filter>
                    <Filter isSelected={type==='motoboy'} onClick={handleMotoboys}>Motoboys</Filter>
                </HeaderFilter>

                <UsersContainer>
                    {loading ? 
                        <ContainerLoading>
                            <Loader size={40} biggestColor="green" smallestColor="gray" />
                        </ContainerLoading> : 
                        <>
                            {users.map((user: User) => 
                            <UserContainer onClick={() => handleUser(user.user)}>
                                <ContainerProfileImage>
                                    <ProfileImage src={user.profileImage}  />
                                </ContainerProfileImage>
                                <Username>{user.name}</Username>
                            </UserContainer>
                            )}
                        </>
                    }
                </UsersContainer>
            </Content>
        </Container>
    )
}