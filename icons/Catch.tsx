import { IconProps } from "../utils/types";

const Catch: React.FC<IconProps> = ({ width = 200, height = 200, className = "" }) => {
    const imageUrl = "https://i.postimg.cc/7Zm3hjLp/Sn-mka-obrazovky-2025-01-20-215422.png"; // Tvoj odkaz na PNG obrázok

    return (
        <img
            src={imageUrl}
            alt="Catch Icon"
            className={className}
            style={{
                width: `${width}px`,
                height: `${height}px`,
                objectFit: "contain", // Umožňuje správne proporcie
            }}
        />
    );
};

export default Catch;