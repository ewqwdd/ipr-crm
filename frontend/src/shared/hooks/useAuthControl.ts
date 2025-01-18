import { useAppDispatch, useAppSelector } from "@/app"
import { userActions } from "@/entities/user"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { $api } from "../lib/$api"

export const useAuthControl = () => {
    const user = useAppSelector((state) => state.user.user)
    const isMounted = useAppSelector((state) => state.user.isMounted)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {
        $api.get('/auth/me').then(({data}) => {
            dispatch(userActions.setUser(data))
        }).catch(() => {
            dispatch(userActions.setMounted(true))
        })
    }, [dispatch])

    useEffect(() => {
        if (isMounted && !user) {
            navigate('/login')
        }
    }, [isMounted, user, navigate])

    return { user, isMounted }
}