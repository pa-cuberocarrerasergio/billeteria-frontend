import billetin from "../assets/billetin.svg";

export default function BilletinAvatar({
    size = 70,
    mood = "normal"
}) {

    return (
        <img
            src={billetin}
            alt="Billetín"
            className="billetin-avatar"
            style={{
                width: size,
                height: size,
            }}
        />
    );
}