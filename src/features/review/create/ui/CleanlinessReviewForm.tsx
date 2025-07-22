'use client';

interface CleanlinessReviewFormProps {
	onSubmit: (data: { cleanlinessData: string }) => void;
}

const CleanlinessReviewForm = ({ onSubmit }: CleanlinessReviewFormProps) => {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({ cleanlinessData: 'completed' });
	};

	return <form id="step-form" onSubmit={handleSubmit} />;
};

export default CleanlinessReviewForm;
