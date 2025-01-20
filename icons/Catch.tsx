import { IconProps } from "../utils/types";

const Catch: React.FC<IconProps> = ({ size = 300, className = "" }) => {
    const imageUrl = "https://i.postimg.cc/DzSHRX5S/sdad.png"; // Tvoj odkaz na PNG obrázok

    return (
        <img
            src={imageUrl}
            alt="Catch Icon"
            className={className}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                objectFit: "contain", // Umožňuje správne proporcie
            }}
        />
    );
};

export default Catch;
