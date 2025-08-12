const chunk = (arr, size) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
};

export async function sendPushNotification(token, title, body, data) {
    const tokens = Array.isArray(token) ? token : [token];
    if (tokens.length === 0) {
        return;
    }
    const payloadData = data && typeof data === "object" && !Array.isArray(data) ? data : {};

    const batches = chunk(tokens, 100);

    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(batch);

        const messages = batch.map((to) => ({
            to,
            sound: "default",
            title,
            body,
            data: payloadData,
        }));

        try {
            const res = await fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                },
                body: JSON.stringify(messages),
            });
            const raw = await res.text();
            const json = JSON.parse(raw);
            console.log(json);
        } catch (err) {
            console.error(err);
        }
    }
}
