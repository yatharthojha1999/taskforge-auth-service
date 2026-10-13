async function checkServerHealt() {
    console.log("Usecase Called!");

    return {
        status: "Ok"
    };
}

module.exports = Object.freeze({
    checkServerHealt
});