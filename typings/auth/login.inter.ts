export interface ILoginData {
	email: string;
	password: string;
}

export interface ISignupData {
	email: string;
	password: string;
	zipcode: string;
	telephone: string;
	profileImage: string;
}

export interface IHomeOwnerSignUp extends ISignupData {
	firstname: string;
	lastname: string;
}

export interface ICompanyOwnerSignUp extends ISignupData {
	companyName: string;
}
