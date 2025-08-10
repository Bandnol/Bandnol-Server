export const sendPushNotification = async (expoPushToken, title, body, data) => {
    const message = {
        to: expoPushToken,
        sound: "default",
        title: title,
        body: body,
        data: data,
    };

    try {
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        });
        const result = await response.json();
        console.log("Push notification sent:", result);
        // result 객체 예시: { data: { status: 'ok', id: '...' } }
        // status가 'error'인 경우 details 객체에 오류 정보 포함
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
};
