async function SendCode(email: string) {
    const api = import.meta.env.VITE_API_URL;

    console.log(`${api}/Auth/SendCode/${email}`);

    try {
        const response = await fetch(`${api}/Auth/SendCode/${email}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        return data; // ⚠️ Quan trọng: return kết quả
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export default SendCode;
