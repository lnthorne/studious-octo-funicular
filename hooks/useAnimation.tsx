import { AnimationContext } from "@/contexts/animationContext";
import { useContext } from "react";

const useAnimation = () => {
	const { startAnimation } = useContext(AnimationContext);
	return { startAnimation };
};

export default useAnimation;
