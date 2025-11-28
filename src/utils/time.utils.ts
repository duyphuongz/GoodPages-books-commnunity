
const getVietnamTimeISO = () => {
    const now = new Date();

    // thời gian VN dạng string "YYYY-MM-DDTHH:mm:ss+07:00"
    const vn = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );

    const offset = 7 * 60; // GMT+7
    const offsetHours = String(Math.floor(offset / 60)).padStart(2, "0");

    // Format thành ISO nhưng đổi đuôi Z → +07:00
    return vn.toISOString().replace("Z", `+${offsetHours}:00`);
}

const convertToVietnamTimeISO = (time: Date) => {
    const date = new Date(time);

    const vnTime = new Date(
        date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );

    return vnTime.toISOString();
}

export {
    getVietnamTimeISO,
    convertToVietnamTimeISO
}