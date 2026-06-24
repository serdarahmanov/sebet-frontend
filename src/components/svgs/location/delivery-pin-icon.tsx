import Svg, { Path, Circle, G } from "react-native-svg";

export default function DeliveryPinIcon({ size = 64 }) {
  return (
    <Svg
      width={size}
      height={(size * 80) / 64}
      viewBox="0 0 64 80"
      fill="none"
    >
      <Path
        d="M32 4C20.954 4 12 12.954 12 24C12 39.2 29.2 56.8 31.2 58.8C31.64 59.24 32.36 59.24 32.8 58.8C34.8 56.8 52 39.2 52 24C52 12.954 43.046 4 32 4Z"
        fill="#000000"
      />

      <G transform="translate(18.4 12.4) scale(0.055)">
        <Path
          fill="#FFFFFF"
          d="M199.725,0v36.025H85.211v421.66l114.514,0.094v36.459l209.085-37.555l0.216-418.867L199.725,0z
             M234.404,230.574c7.022,0,12.715,7.408,12.715,16.545c0,9.139-5.692,16.545-12.715,16.545
             s-12.715-7.406-12.715-16.545C221.688,237.982,227.382,230.574,234.404,230.574z
             M119.211,423.713V70.025h80.514v353.753L119.211,423.713z"
        />
      </G>

      <Circle
        cx={32}
        cy={68}
        r={5}
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth={3}
      />
    </Svg>
  );
}
