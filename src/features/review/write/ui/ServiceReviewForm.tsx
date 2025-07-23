'use client';

interface ServiceReviewFormProps {
	onSubmit: (data: { serviceData: string }) => void;
}

const ServiceReviewForm = ({ onSubmit }: ServiceReviewFormProps) => {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({ serviceData: 'completed' });
	};

	return <form id="step-form" onSubmit={handleSubmit} />;
};

export default ServiceReviewForm;
