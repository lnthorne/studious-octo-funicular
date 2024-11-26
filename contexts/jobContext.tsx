import { IBidEntity, IPostEntity } from "@/typings/jobs.inter";
import { createContext, ReactNode, useContext, useState } from "react";

interface JobContextType {
	jobs: IPostEntity[];
	setJobs: (jobs: IPostEntity[]) => void;
	selectedJob: IPostEntity | null;
	setSelectedJob: (job: IPostEntity | null) => void;
	bids: IBidEntity[];
	setBids: (bids: IBidEntity[]) => void;
	selectedBid: IBidEntity | null;
	setSelectedBid: (bid: IBidEntity | null) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function useJobContext(): JobContextType {
	const context = useContext(JobContext);
	if (!context) {
		throw new Error("useJobContext must be used within a JobProvider");
	}
	return context;
}

interface JobProviderProps {
	children: ReactNode;
}

export function JobProvider({ children }: JobProviderProps) {
	const [jobs, setJobs] = useState<IPostEntity[]>([]);
	const [bids, setBids] = useState<IBidEntity[]>([]);
	const [selectedJob, setSelectedJob] = useState<IPostEntity | null>(null);
	const [selectedBid, setSelectedBid] = useState<IBidEntity | null>(null);

	return (
		<JobContext.Provider
			value={{
				jobs,
				setJobs,
				selectedJob,
				setSelectedJob,
				selectedBid,
				setSelectedBid,
				bids,
				setBids,
			}}
		>
			{children}
		</JobContext.Provider>
	);
}
