import type {Meta, StoryObj} from "@storybook/nextjs";
import {useState} from "react";
import SearchBox from "../shared/components/SearchBox";

const meta: Meta<typeof SearchBox> = {
    title : 'Shared/SearchBox',
    component : SearchBox,
    tags : ['autodocs'],
    argTypes : {
        query : {
            control : 'text',
        },
        onChange : {action:'changed'},
        onSearchClick : {action:'search clicked'},
    }
};

export default meta;
type Story = StoryObj<typeof SearchBox>;

const Wrapper = (args: Omit<React.ComponentProps<typeof SearchBox>, 'onChange' | 'onSearchClick'>) => {
    const [query, setQuery] = useState(args.query || '');

    return (
        <SearchBox
        {...args}
        query={query}
        onChange={(value) => {
            setQuery(value);
            console.log('changed:', value);
        }}
        onSearchClick={() => {
            console.log('search clicked');
        }}
        />
    )
}
export const Default: Story = {
    render: (args) => <Wrapper {...args} />,
    args : {
        query : '',
    }
}