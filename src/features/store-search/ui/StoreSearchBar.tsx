import clsx from 'clsx';

import SearchBox from '@/shared/components/SearchBox';
import Icon from '@/shared/ui/Icon';

interface StoreSearchBarProps {
	query: string;
	onQueryChange: (query: string) => void;
	onSearch: () => void;
}

export const StoreSearchBar = ({
	query,
	onQueryChange,
	onSearch,
}: StoreSearchBarProps) => {
	return (
		<SearchBox
			query={query}
			onChange={onQueryChange}
			onSearchClick={onSearch}
			className={clsx(
				'rounded-2xl',
				'p-4',
				'bg-grey-10',
				query === '' ? 'border-grey-20' : 'border-primary-30 text-primary-60',
			)}
			placeholderColor=".placeholder-grey-80"
			leftIcon={<Icon name="Search" size="s" className="text-grey-50" />}
			rightIcon={
				query ? <Icon name="Cancel" size="s" className="text-grey-50" /> : null
			}
			rightIconOnClick={query ? () => onQueryChange('') : onSearch}
			placeholder="가게명을 입력해주세요."
		/>
	);
};
