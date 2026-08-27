import "./index.css";
import { MyComposition } from "./Composition";
import { BtsReelComposition } from "./BtsReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <BtsReelComposition />
    </>
  );
};
