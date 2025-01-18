export interface User {
    id: number
    email: string
    username: string
    role: string
    firstName: string
    lastName: string
}

export interface UserStoreSchema {
    user: User | null
    isMounted: boolean
}