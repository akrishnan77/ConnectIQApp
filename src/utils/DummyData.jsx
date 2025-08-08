import { UserRole } from "./AppConstants";

// Pratheesh.Devan@htlbeta.onmicrosoft.com
// mayuranil.prasad@htlbeta.onmicrosoft.com
// prakash.salawria@htlbeta.onmicrosoft.com
// praveen.rangaswamy@htlbeta.onmicrosoft.com
const userList = [
    {
        email: "Emily.Johnson@htlbeta.onmicrosoft.com",
        name: 'Emily Johnson',
        role: UserRole.MANAGER,
        profileIcon: require("../assets/images/home/profile_emily.png"),
    },
    {
        email: "John.Smith@htlbeta.onmicrosoft.com",
        name: 'John Smith',
        role: UserRole.ASSOCIATE,
        profileIcon: require("../assets/images/home/profile_john.png"),
    },
    {
        email: "Robert.Williams@htlbeta.onmicrosoft.com",
        name: 'Robert Williams',
        role: UserRole.ASSOCIATE,
        profileIcon: require("../assets/images/home/profile_roger.png"),
    },
    {
        email: "mayuranil.prasad@htlbeta.onmicrosoft.com",
        name: 'Mayur Prasad',
        role: UserRole.MANAGER,
        profileIcon: require("../assets/images/home/profile.png"),
    },
];

export const getUserByEmail = (email) => {
    try {
        const user = userList.filter(user => user.email === email)
        return user.length > 0 ? user[0] : {}
    } catch (error) {
        //throw error;
    }
};

export const getUserNameByEmail = (email) => {
    try {
        const user = userList.filter(user => user.email === email)
        return user.length > 0 ? user[0].name : ''
    } catch (error) {
        //throw error;
    }
};

export const getUserPicByEmail = (email) => {
    try {
        const user = userList.filter(user => user.email === email)
        return user.length > 0 ? user[0].profileIcon : {}
    } catch (error) {
        //throw error;
    }
};