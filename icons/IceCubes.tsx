import { IconProps } from "../utils/types";

const IceCubes: React.FC<IconProps> = ({ size = 24, className = "" }) => {
    const imageUrl = "https://i.postimg.cc/gJ6K2hry/coin.png"; // URL obrĂˇzka
    const imgSize = `${size}px`;

    return (
        <img
            src={imageUrl}
            alt="Ice Cubes"
            className={className}
            style={{ width: imgSize, height: imgSize }}
        />
    );
};

export default IceCubes;
