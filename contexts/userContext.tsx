import { IHomeOwnerEntity, ICompanyOwnerEntity } from "@/typings/user.inter";
import { createContext, ReactNode, useContext, useState } from "react";

type UserType = IHomeOwnerEntity | ICompanyOwnerEntity;

interface IUserContext<T extends UserType> {
	user: T | null;
	setUser: (user: T | null) => void;
}

const UserContext = createContext<IUserContext<UserType> | undefined>(undefined);

export function useUser<T extends UserType>(): IUserContext<T> {
	const context = useContext(UserContext as React.Context<IUserContext<T> | undefined>);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}

interface UserProviderProps {
	children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
	const [user, setUser] = useState<IHomeOwnerEntity | ICompanyOwnerEntity | null>(null);

	return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}
