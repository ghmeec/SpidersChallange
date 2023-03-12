import React, { PropsWithChildren, useContext, useReducer } from "react";
import { auth, db } from "../firebase";
import { User } from "firebase/auth";
import { produce } from "immer";
import { doc, Unsubscribe, onSnapshot } from "@firebase/firestore";

type Profile = {
	id: string
	name: string
	displayName: string
}

type AuthState = {
	loading: boolean;
	profile: Profile | null;
	user: User | null;
};

type Action =
	| { type: "set-user"; payload: User }
	| { type: "remove-user" }
	| { type: "set-profile"; payload: Profile }
	| { type: "remove-profile" }
	| { type: "set-loading"; payload: boolean };

const initialState: AuthState = {
	loading: true,
	profile: null,
	user: null,
};

const AuthContext = React.createContext<AuthState>(initialState);

function reducer(state: AuthState, action: Action): AuthState {
	switch (action.type) {
		case "set-loading":
			return produce(state, (draft) => {
				draft.loading = action.payload;
			});
		case "set-user":
			return produce(state, (draft) => {
				draft.user = action.payload;
			});
		case "remove-user":
			return produce(state, (draft) => {
				draft.user = null;
				draft.profile = null;
			});
		case "set-profile":
			return produce(state, (draft) => {
				draft.profile = action.payload;
			});
		case "remove-profile":
			return produce(state, (draft) => {
				draft.profile = null;
			});
		default:
			return state;
	}
}

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
	const [state, dispatch] = useReducer(reducer, initialState);


	const profileListener = async (
		user: User,
		onProfileChange: (profile: Profile | null) => void
	) => {
		// const idTokenResult = await user?.getIdTokenResult();

		const userId = user.uid;

		// console.log("COLLECTION USER : ", collectionName, type)
		const userRef = doc(db, "profiles", userId);

		return onSnapshot(userRef, (snap) => {
			if (snap.exists()) {
				const profile = {
					...snap.data(),
					id: snap.id,
				} as Profile;
				onProfileChange(profile);
			} else {
				onProfileChange(null);
			}
		});
	};

	React.useEffect(() => {
		let profileSubscription: Unsubscribe | null = null;
		const authListener = auth.onAuthStateChanged((user: User | null) => {
			dispatch({ type: "set-loading", payload: true });
			if (user) {
				dispatch({ type: "set-user", payload: user });

				// get the profile
				profileListener(user, (profile) => {
					if (profile) {
						dispatch({ type: "set-profile", payload: profile });
					} else {
						dispatch({ type: "remove-profile" });
					}
					dispatch({ type: "set-loading", payload: false });
				})
					.then((sub) => (profileSubscription = sub))
					.catch((error) => {
						console.warn(error);
						profileSubscription = null;
					});
			} else {
				profileSubscription = null;
				dispatch({ type: "remove-user" });
				dispatch({ type: "set-loading", payload: false });
			}
		});

		return () => {
			authListener();
			profileSubscription && profileSubscription();
		};
	}, []);

	return (
		<AuthContext.Provider value={state} > {children} </AuthContext.Provider>
	);
};

/**
 * Authentication Hook
 */
export function useAuth() {
	if (AuthContext === undefined) {
		throw new Error("Please wrap the component in AuthProvider ");
	}
	return useContext(AuthContext);
}
