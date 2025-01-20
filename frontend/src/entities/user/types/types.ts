
type IdName = {id: number, name: string}
export type Role = IdName
export type Spec = IdName

export interface User {
    id: number
    email: string
    username: string
    role: Role
    avatar?: string
    Spec?: Spec
    firstName: string
    lastName: string
    phone?: string
}

export interface UserStoreSchema {
    user: User | null
    isMounted: boolean
}

export interface UserFormData {
    username?: string
    email?: string
    password?: string
    firstName?: string
    lastName?: string
    phone?: string
    roleId?: number
    specId?: number
    avatar?: File
}