import { ReactElement } from "react";

export interface RouterItemType {
    path: string;
    element: ReactElement;
    onlyAdmin?: boolean;
    children?: RouterItemType[];
} 