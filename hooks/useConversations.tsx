import { subscribeToConversations } from "@/services/messaging";
import { fetchUserNames } from "@/services/user";
import { ICompanyOwnerEntity, IHomeOwnerEntity, UserType } from "@/typings/user.inter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function useConversations(user: IHomeOwnerEntity | ICompanyOwnerEntity) {
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error>();

	const conversationsQuery = useQuery({
		queryKey: ["conversations", user?.uid],
		queryFn: () => Promise.resolve([]),
		enabled: !!user,
		initialData: [],
		staleTime: Infinity,
	});

	useEffect(() => {
		if (!user) {
			setIsLoading(false);
			return;
		}

		let isMounted = true;

		const unsubscribe = subscribeToConversations(user.uid, async (updatedConversations) => {
			if (!isMounted) return;
			try {
				const otherUserIdsSet = new Set<string>();

				updatedConversations.forEach((conversation) => {
					const memberIds = Object.keys(conversation.members);
					const otherMemberIds = memberIds.filter((memberId) => memberId !== user.uid);
					otherMemberIds.forEach((otherUserId) => otherUserIdsSet.add(otherUserId));
				});

				const otherUserIds = Array.from(otherUserIdsSet);

				const otherUsersData = await fetchUserNames(otherUserIds, UserType.companyowner);

				const userIdToDataMap = otherUsersData.reduce((acc, userData) => {
					acc[userData.uid] = userData;
					return acc;
				}, {} as Record<string, any>);

				const conversationsWithUserData = updatedConversations.map((conversation) => {
					const memberIds = Object.keys(conversation.members);
					const otherMemberId = memberIds.find((memberId) => memberId !== user.uid);
					const otherUserData = userIdToDataMap[otherMemberId!];

					return {
						...conversation,
						otherUser: otherUserData,
					};
				});

				// Update the query data
				queryClient.setQueryData(["conversations", user.uid], conversationsWithUserData);
			} catch (err) {
				console.error("Error fetching conversations:", err);
				setError(new Error("Error fetching conversations"));
			} finally {
				setIsLoading(false);
			}
		});

		return () => {
			isMounted = false;
			unsubscribe();
		};
	}, [user, queryClient]);

	return {
		...conversationsQuery,
		isLoading,
		error,
	};
}
