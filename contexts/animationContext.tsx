import React, { createContext, useState, useCallback, ReactNode } from "react";
import { AVPlaybackSource } from "expo-av";
import LaunchAnimation from "@/components/LaunchAnimation";

interface AnimationContextProps {
	startAnimation: (source: AVPlaybackSource, onDone?: () => void) => void;
}

export const AnimationContext = createContext<AnimationContextProps>({
	startAnimation: () => {},
});

interface AnimationProviderProps {
	children: ReactNode;
}

interface AnimationState {
	source: AVPlaybackSource | null;
	onDone?: () => void;
}

export const AnimationProvider = ({ children }: AnimationProviderProps) => {
	const [animationState, setAnimationState] = useState<AnimationState>({
		source: null,
		onDone: undefined,
	});

	const startAnimation = useCallback((source: AVPlaybackSource, onDone?: () => void) => {
		setAnimationState({ source, onDone });
	}, []);

	const handleAnimationDone = useCallback(() => {
		// Call the callback if provided
		if (animationState.onDone) {
			animationState.onDone();
		}
		// Reset the animation state
		setAnimationState({ source: null, onDone: undefined });
	}, [animationState]);

	return (
		<AnimationContext.Provider value={{ startAnimation }}>
			{children}
			{animationState.source && (
				<LaunchAnimation source={animationState.source} onAnimationDone={handleAnimationDone} />
			)}
		</AnimationContext.Provider>
	);
};
