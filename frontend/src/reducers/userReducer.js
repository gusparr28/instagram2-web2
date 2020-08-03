export const initialState = null;

export const reducer = (state, action) => {
    if (action.type == "USER") {
        return action.payload;
    } else {
        if (action.type == "CLEAR") {
            return null;
        }
        if (action.type == "UPDATE") {
            return {
                ...state,
                followers: action.payload.followers,
                following: action.payload.following
            }
        }
        if (action.type == "UPDATEPHOTO") {
            return {
                ...state,
                image: action.payload
            }
        }
        return state;
    };
};
