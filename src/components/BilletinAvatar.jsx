import billetin from "../assets/billetin.svg";
import thinking from "../assets/billetin-thinking.svg";
import happy from "../assets/billetin-happy.svg";
import worried from "../assets/billetin-worried.svg";

export default function BilletinAvatar({
    size = 70,
    mood = "normal"
}) {

    const avatars = {
        normal: billetin,
        thinking,
        happy,
        worried,
    };

    return (
        <img
            src={avatars[mood] || billetin}
            alt="Billetín"
            className="billetin-avatar"
            style={{
                width: size,
                height: size,
            }}
        />
    );
}