import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Checkbox } from '@rmc/checkbox';

export default { component: Checkbox } as ComponentMeta<typeof Checkbox>;
const Template: ComponentStory<typeof Checkbox> = (args) => (
  <Checkbox {...args} />
);
export const Default = Template.bind({});
Default.args = { checked: false, disabled: false, indeterminate: false };
