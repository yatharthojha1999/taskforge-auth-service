module.exports = function makeGetUserByLinknameAndEmail({ axios, userService }) {
    return async function getUserByLinknameAndEmail({
        linkname,
        email,
    }) {
        console.log("getUserByLinknameAndEmail users Service Api called", {
            linkname,
            email,
        });

        try {
            const userServiceClient = axios.create({
                baseURL: userService,
                timeout: 5000,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const response = await userServiceClient.get(`/internal/v1/tenants/${linkname}/users/by-email/${email}`);

            return response.data;
        } catch (e) {
            console.log("getUserByLinknameAndEmail Internal Api Error: ", e);
        }
    };
};