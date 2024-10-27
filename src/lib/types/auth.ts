export interface Auth {
	isLoggedIn: boolean;
	showFavorites: boolean;
	login: () => void;
	logout: () => void;
	username: string;
}
