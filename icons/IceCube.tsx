import { IconProps } from "../utils/types";

const CustomIcon: React.FC<IconProps> = ({ size = 24, className = "" }) => {
    const imageUrl = "https://i.postimg.cc/gJ6K2hry/coin.png"; // Tvoj odkaz na PNG obrĂˇzok
    const imgSize = `${size}px`;

    return (
        <img
            src={imageUrl}
            alt="Custom Icon"
            className={className}
            style={{ width: imgSize, height: imgSize }}
        />
    );
};

export default CustomIcon;
